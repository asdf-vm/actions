import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as httpClient from '@actions/http-client';

// NOTE: here we list only the fields we need
type GitHubRelease = {
	assets: ReadonlyArray<{
		name: string;
		browser_download_url: string;
	}>;
};

// Map Node.js os.arch() to the expected release architecture names
const archMap: Record<string, string> = {
	x64: 'amd64',
	ia32: '386',
	arm: 'arm',
	arm64: 'arm64',
};

async function installBashAsdf(asdfDir: string, branch: string): Promise<void> {
	if (fs.existsSync(asdfDir)) {
		core.info(`Updating asdf in ASDF_DIR "${asdfDir}" on branch "${branch}"`);
		const options = {cwd: asdfDir};
		await exec.exec('git', ['remote', 'set-branches', 'origin', branch], options);
		await exec.exec('git', ['fetch', '--depth', '1', 'origin', branch], options);
		await exec.exec('git', ['checkout', '-B', branch, 'origin'], options);
	} else {
		core.info(`Cloning asdf into ASDF_DIR "${asdfDir}" on branch "${branch}"`);
		await exec.exec('git', [
			'clone',
			'--depth',
			'1',
			'--branch',
			branch,
			'--single-branch',
			'https://github.com/asdf-vm/asdf.git',
			asdfDir,
		]);
	}
}

async function setupAsdf(): Promise<void> {
	const asdfPath = await io.which('asdf', false);
	if (asdfPath) {
		return;
	}

	const asdfDir = path.join(os.homedir(), '.asdf');
	core.exportVariable('ASDF_DIR', asdfDir);
	core.exportVariable('ASDF_DATA_DIR', asdfDir);
	core.addPath(`${asdfDir}/bin`);
	core.addPath(`${asdfDir}/shims`);

	const skip = core.getBooleanInput('skip_install', {required: true});
	if (skip) {
		return;
	}

	// If branch is provided, handle legacy (bash) asdf installation
	const branch = core.getInput('asdf_branch', {required: false});
	if (branch) {
		await installBashAsdf(asdfDir, branch);
	// Otherwise, handle installation for asdf >= 0.16
	} else {
		const providedVersion = core.getInput('asdf_version', {required: true});
		const versionToFetch = providedVersion === 'latest' ? 'latest' : `tags/v${providedVersion}`;
		const url = `https://api.github.com/repos/asdf-vm/asdf/releases/${versionToFetch}`;
		const client = new httpClient.HttpClient('setup-asdf-action');
		const response = await client.getJson<GitHubRelease>(url);

		if (response.statusCode !== 200 || !response.result) {
			throw new Error(`Failed to fetch asdf release: ${response.statusCode}`);
		}

		const releaseArch = archMap[os.arch()] || os.arch();
		const releaseToDownload = response.result.assets.find(
			// Find the correct release based on the runner platform and architecture
			asset => asset.name.endsWith(`-${os.platform()}-${releaseArch}.tar.gz`),
		);

		if (!releaseToDownload) {
			throw new Error(`No asdf release found for the current platform (${os.platform()}-${releaseArch})`);
		}

		// Download and extract the release
		const downloadPath = path.join(os.tmpdir(), releaseToDownload.name);
		const extractPath = path.join(asdfDir, 'bin');
		await exec.exec('curl', ['-sSL', '-o', downloadPath, releaseToDownload.browser_download_url]);
		await io.mkdirP(extractPath);
		await exec.exec('tar', ['-C', extractPath, '--strip-components=1', '-xzf', downloadPath]);
		await io.rmRF(downloadPath);
	}
}

export {setupAsdf};
