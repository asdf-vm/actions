import * as core from "@actions/core";
import { pluginsAdd } from "~/plugins-add/index.ts";

(async () => {
  try {
    const workingDirectory = core.getInput("working_directory", {
      required: false,
    });
    await pluginsAdd(workingDirectory || undefined);
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
})();
