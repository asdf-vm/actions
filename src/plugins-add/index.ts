import * as fs from 'node:fs';
import type * as buffer from 'node:buffer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {setupAsdf} from '~/setup/index.ts';

async function pluginList() {
	let stdout = '';
	let stderr = '';
	const options = {
		listeners: {
			stdout(data: buffer.Buffer) {
				stdout += data.toString();
			},
			stderr(data: buffer.Buffer) {
				stderr += data.toString();
			},
		},
	};

	try {
		await exec.exec('asdf', ['plugin-list'], options);
	} catch (error) {
		if (!stderr.includes('No plugins installed')) {
			throw error;
		}
	}

	return stdout.split('\n');
}

async function pluginsAdd(): Promise<void> {
	await setupAsdf();
	let toolVersions = core.getInput('tool_versions', {required: false});

	if (toolVersions) {
		await fs.promises.writeFile('.tool-versions', toolVersions, {
			encoding: 'utf8',
		});
	} else {
		toolVersions = await fs.promises.readFile('.tool-versions', {
			encoding: 'utf8',
		});
	}

	const pluginNames = toolVersions
		.split('\n')
		.map(x => x.replace(/#.*/, '').trim())
		.filter(x => x.length > 0)
		.map(x => x.split(' ')[0]);

	const installedPluginNames = await pluginList();
	for (const pluginName of pluginNames) {
		if (installedPluginNames.includes(pluginName)) {
			core.info(
				`Skip installing ${pluginName} plugin since it's already installed`,
			);
		} else {
			core.info(`Installing ${pluginName} plugin...`);
			await exec.exec('asdf', ['plugin-add', pluginName]); // eslint-disable-line no-await-in-loop
		}
	}
}

export {pluginsAdd};
