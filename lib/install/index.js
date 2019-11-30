import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as path from "path";
import pluginsAdd from "../plugins-add";


const toolsInstall = async () => {
  await pluginsAdd();

  const before = core.getInput("before_install", {required: false});
  if (before) {
    await exec.exec('bash', ['-c', before]);
  }
  await exec.exec('asdf', ['install']);
};

export default toolsInstall;
