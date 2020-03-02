import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as os from "os";
import * as path from "path";

export const setupAsdf = async () => {
  const asdfPath = await io.which("asdf", false);
  if (asdfPath) {
    return;
  }
  const asdfDir = path.join(os.homedir(), ".asdf");
  core.exportVariable("ASDF_DIR", asdfDir);
  core.exportVariable("ASDF_DATA_DIR", asdfDir);
  core.addPath(`${asdfDir}/bin`);
  core.addPath(`${asdfDir}/shims`);
  core.info(`Clonning asdf into ASDF_DIR: ${asdfDir}`);
  const branch = core.getInput("asdf_branch", { required: true });
  await exec.exec("git", [
    "clone",
    "--depth",
    "1",
    "--branch",
    branch,
    "https://github.com/asdf-vm/asdf.git",
    asdfDir
  ]);
};
