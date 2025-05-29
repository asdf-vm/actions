import * as core from '@actions/core';
import {toolsPost} from '~/install/index.ts';

(async function () {
	try {
		await toolsPost();
	} catch (error) {
		core.setFailed(`Action failed with error ${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
	}
})();
