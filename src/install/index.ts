import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { pluginsAdd } from "~/plugins-add/index.ts";

async function toolsInstall(workingDirectory?: string): Promise<void> {
  await pluginsAdd(workingDirectory);

  const execOptions = workingDirectory ? { cwd: workingDirectory } : undefined;
  const before = core.getInput("before_install", { required: false });
  if (before) {
    await exec.exec("bash", ["-c", before], execOptions);
  }

  await exec.exec("asdf", ["install"], execOptions);
}

export { toolsInstall };
