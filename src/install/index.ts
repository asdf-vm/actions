import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';
import {pluginsAdd} from '~/plugins-add/index.ts';

async function restoreAsdfCache() {
	/* eslint-disable-next-line no-warning-comments */
	// TODO: feature-flag this for now, ony when input is set

	const toolVersions = await fs.promises.readFile('.tool-versions', {
		encoding: 'utf8',
	});
	const toolVersionsHash = crypto.createHash('sha256')
		.update(toolVersions)
		.digest('hex');

	core.debug(`Tool versions hash: ${toolVersionsHash}`);

	const asdfVersionOutput = await exec.getExecOutput('asdf', ['--version']);
	const asdfVersion = asdfVersionOutput.stdout.trim().replace('asdf version', '');

	core.debug(`asdf version: ${asdfVersion}`);
	const cacheKey = `asdf-${asdfVersion}-${toolVersionsHash}`;

	core.debug(`cache key: ${cacheKey}`);

	const paths = [
		`${process.env.ASDF_DIR!}/plugins`,
		`${process.env.ASDF_DIR!}/installs`,
	];
	const restoreKeys = [
		`asdf-tools-${asdfVersion}-`,
	];

	core.debug(`Restoring ${paths.join(', ')} from cache with key "${cacheKey}" using restore keys "${restoreKeys.join(', ')}"`);
	return cache.restoreCache(paths, cacheKey, restoreKeys);
}

async function toolsInstall(): Promise<void> {
	await pluginsAdd();

	if (await restoreAsdfCache()) {
		core.info('Cache restored, skipping asdf install');
		return;
	}

	const before = core.getInput('before_install', {required: false});
	if (before) {
		await exec.exec('bash', ['-c', before]);
	}

	await exec.exec('asdf', ['install']);
}

export {toolsInstall};

