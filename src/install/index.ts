import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { pluginsAdd } from "../plugins-add";

export async function toolsInstall(): Promise<void> {
  await pluginsAdd();

  const before = core.getInput("before_install", { required: false });
  if (before) {
    await exec.exec("bash", ["-c", before]);
  }
  await exec.exec("asdf", ["install"]);
}
