import * as core from "@actions/core";
import { toolsInstall } from "./index";

(async () => {
  try {
    await toolsInstall();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
