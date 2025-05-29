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

	const asdfVersionOutput = await exec.getExecOutput('asdf', ['version']);
	const asdfVersion = asdfVersionOutput.stdout.trim().split(' ')[0];
	core.debug(`asdf version: ${asdfVersion}`);

	const cacheKeyPrefix = `asdf-${asdfVersion}-`;
	const cacheKey = `${cacheKeyPrefix}${toolVersionsHash}`;

	core.debug(`cache key: ${cacheKey}`);
	return {cacheKeyPrefix, cacheKey};
}

export async function restoreAsdfCache() {
	/* eslint-disable-next-line no-warning-comments */
	// TODO: feature-flag this for now, ony when input is set; also, tools-version wasn't written yet (add-plugins?)

	const {cacheKeyPrefix, cacheKey} = await assembleCacheKey();

	const paths = [
		`${process.env.ASDF_DIR!}/plugins`,
		`${process.env.ASDF_DIR!}/installs`,
	];
	const restoreKeys = [
		cacheKeyPrefix,
	];

	core.debug(`Restoring ${paths.join(', ')} from cache with key "${cacheKey}" using restore keys "${restoreKeys.join(', ')}"`);
	return cache.restoreCache(paths, cacheKey, restoreKeys);
}
