import * as core from "@actions/core";
import pluginsAdd from "./index";

const main = async () => {
  try {
    await pluginsAdd();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
};

main();
