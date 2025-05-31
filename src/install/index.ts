import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {pluginsAdd} from '~/plugins-add/index.ts';
import {setupAsdf} from '~/setup/index.ts';
import {cacheEnabled, restoreAsdfCache, saveAsdfCache} from '~/caching/index.ts';

async function toolsInstall(): Promise<void> {
	await setupAsdf();

	if (cacheEnabled()) {
		await restoreAsdfCache();
	}

	await pluginsAdd();

	const before = core.getInput('before_install', {required: false});
	if (before) {
		await exec.exec('bash', ['-c', before]);
	}

	await exec.exec('asdf', ['install']);
	if (cacheEnabled()) {
		await exec.exec('asdf', ['reshim']);
	}
}

async function toolsPost(): Promise<void> {
	if (cacheEnabled()) {
		await saveAsdfCache();
	}
}

export {toolsInstall, toolsPost};

