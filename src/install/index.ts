import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {pluginsAdd} from '~/plugins-add/index.ts';
import {setupAsdf} from '~/setup/index.ts';
import {restoreAsdfCache, saveAsdfCache} from '~/caching/index.ts';

async function toolsInstall(): Promise<void> {
	await setupAsdf();

	if (await restoreAsdfCache()) {
		core.info('Cache restored, skipping asdf install');
		return;
	}

	await pluginsAdd();

	const before = core.getInput('before_install', {required: false});
	if (before) {
		await exec.exec('bash', ['-c', before]);
	}

	await exec.exec('asdf', ['install']);
}

async function toolsPost(): Promise<void> {
	await saveAsdfCache();
}

export {toolsInstall, toolsPost};

