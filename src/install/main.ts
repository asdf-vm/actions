import * as core from "@actions/core";
import { toolsInstall } from "~/install/index.ts";

(async () => {
  try {
    const workingDirectory = core.getInput("working_directory", {
      required: false,
    });
    await toolsInstall(workingDirectory || undefined);
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
})();
