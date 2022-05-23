import * as core from "@actions/core";
import { toolsCurrent } from "./index";

(async () => {
  try {
    await toolsCurrent();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
