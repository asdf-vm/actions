import {chdir, cwd} from 'node:process';
import * as path from 'node:path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {pluginsAdd} from '~/plugins-add/index.ts';

async function toolsInstall(): Promise<void> {
	const dir = core.getInput('directory', {required: false});
	if (dir) {
		// Resolve the current working directory and the provided directory to their absolute paths
		// Check if the target directory is a subdirectory of the current directory for security reasons
		const currentDir = cwd();
		const targetDir = path.resolve(currentDir, dir);

		if (!targetDir.startsWith(currentDir + path.sep)) {
			throw new Error(`The specified directory (${dir}) is not a subdirectory of the current working directory.`);
		}

		chdir(targetDir);
	}

	await pluginsAdd();

	const before = core.getInput('before_install', {required: false});
	if (before) {
		await exec.exec('bash', ['-c', before]);
	}

	await exec.exec('asdf', ['install']);
}

export {toolsInstall};
