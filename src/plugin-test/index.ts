import * as process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {setupAsdf} from '~/setup/index.ts';

async function pluginTest(): Promise<void> {
	await setupAsdf();

	const pluginEnvVar = `${process.env.GITHUB_REPOSITORY!}`.split('/')[1];
	const giturlEnvVar = `https://github.com/${process.env.GITHUB_REPOSITORY!}`;
	const gitrefEnvVar = `${process.env.GITHUB_SHA!}`;

	const command = core.getInput('command', {required: true});
	const version = core.getInput('version', {required: true});
	const plugin = (core.getInput('plugin', {required: false}) || pluginEnvVar).replace('asdf-', '');
	const giturl = core.getInput('giturl', {required: false}) || giturlEnvVar;
	const gitref = core.getInput('gitref', {required: false}) || gitrefEnvVar;

	await exec.exec('asdf', [
		'plugin',
		'test',
		plugin,
		giturl,
		'--asdf-tool-version',
		version,
		'--asdf-plugin-gitref',
		gitref,
		command,
	]);
}

async function pluginTestAll(): Promise<void> {
	const githubToken = core.getInput('github_token', {required: false});
	core.exportVariable('GITHUB_API_TOKEN', githubToken);
	core.startGroup('Test plugin');
	await pluginTest();
	core.endGroup();
}

export {pluginTest, pluginTestAll};
