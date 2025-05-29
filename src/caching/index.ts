import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import * as process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';

async function assembleCacheKey() {
	const toolVersions = await fs.promises.readFile('.tool-versions', {
		encoding: 'utf8',
	});
	const toolVersionsHash = crypto.createHash('sha256')
		.update(toolVersions)
		.digest('hex');

	core.debug(`Tool versions hash: ${toolVersionsHash}`);

	const asdfVersionOutput = await exec.getExecOutput('asdf', ['version'], {silent: true});
	const asdfVersion = asdfVersionOutput.stdout.trim().split(' ')[0];
	core.debug(`asdf version: ${asdfVersion}`);

	const cacheKeyPrefix = `asdf-${asdfVersion}-`;
	const cacheKey = `${cacheKeyPrefix}${toolVersionsHash}`;

	core.debug(`cache key: ${cacheKey}`);
	return {cacheKeyPrefix, cacheKey};
}

function assemblePaths() {
	return [
		`${process.env.ASDF_DIR!}/plugins`,
		`${process.env.ASDF_DIR!}/installs`,
	];
}

const cacheHitStateKey = 'asdfCacheHitKey';

function isEnabled() {
	return core.getBooleanInput('enable_cache', {required: false});
}

export async function restoreAsdfCache(): Promise<string | undefined> {
	/* eslint-disable-next-line no-warning-comments */
	// TODO: tools-version wasn't written yet (add-plugins?)
	if (!isEnabled()) {
		return undefined;
	}

	const {cacheKeyPrefix, cacheKey} = await assembleCacheKey();

	const paths = assemblePaths();
	const restoreKeys = [
		cacheKeyPrefix,
	];

	core.debug(`Restoring ${paths.join(', ')} from cache with key "${cacheKey}" using restore keys "${restoreKeys.join(', ')}"`);
	const foundCacheKey = await cache.restoreCache(paths, cacheKey, restoreKeys);
	core.saveState(cacheHitStateKey, foundCacheKey);
	if (!foundCacheKey) {
		core.info(`No cache found with key "${cacheKey}, "${restoreKeys.join(', ')}"`);
	}

	return foundCacheKey;
}

export async function saveAsdfCache(): Promise<number> {
	if (!isEnabled()) {
		return -1;
	}

	try {
		const {cacheKey} = await assembleCacheKey();
		if (core.getState(cacheHitStateKey) === cacheKey) {
			core.info(`Cache with key "${cacheKey}" already exists, skipping save.`);
			return 0;
		}

		const paths = assemblePaths();
		core.info(`Saving ${paths.join(', ')} to cache with key "${cacheKey}"`);
		return await cache.saveCache(paths, cacheKey);
	} catch (error: unknown) {
		core.warning(error as Error);
		return -1;
	}
}
