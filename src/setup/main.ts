import * as core from "@actions/core";
import { setupAsdf } from "./index";

(async () => {
  try {
    await setupAsdf();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
