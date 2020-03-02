import * as core from "@actions/core";
import { pluginTestAll } from "./index";

(async () => {
  try {
    await pluginTestAll();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
