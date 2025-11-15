import * as core from "@actions/core";
import { setupAsdf } from "~/setup/index.ts";

(async () => {
  try {
    await setupAsdf();
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
})();
