import * as core from "@actions/core";
import pluginTest from "./index";

const main = async () => {
  try {
    await pluginTest();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
};

main();
