import * as core from "@actions/core";
import setupAsdf from "./index";

const main = async () => {
  try {
    await setupAsdf();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
};

main();
