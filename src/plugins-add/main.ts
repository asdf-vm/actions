import * as core from '@actions/core';
import {pluginsAdd} from '~/plugins-add/index.ts';

(async function () {
	try {
		await pluginsAdd();
	} catch (error) {
		core.setFailed(`Action failed with error ${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
	}
})();
