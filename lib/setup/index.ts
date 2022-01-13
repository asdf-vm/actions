import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export async function setupAsdf(): Promise<void> {
  const asdfPath = await io.which("asdf", false);
  if (asdfPath) {
    return;
  }
  const asdfDir = path.join(os.homedir(), ".asdf");
  core.exportVariable("ASDF_DIR", asdfDir);
  core.exportVariable("ASDF_DATA_DIR", asdfDir);
  core.addPath(`${asdfDir}/bin`);
  core.addPath(`${asdfDir}/shims`);
  const branch = core.getInput("asdf_branch", { required: true });
  if (fs.existsSync(asdfDir)) {
    core.info(`Updating asdf on ASDF_DIR: ${asdfDir}`);
    const opts = {
      cwd: asdfDir,
    };
    await exec.exec("git", ["remote", "set-branches", "origin", branch], opts);
    await exec.exec("git", ["fetch", "--depth", "1", "origin", branch], opts);
    await exec.exec("git", ["checkout", "-B", branch, "origin"], opts);
  } else {
    core.info(`Cloning asdf into ASDF_DIR: ${asdfDir}`);
    await exec.exec("git", [
      "clone",
      "--depth",
      "1",
      "--branch",
      branch,
      "--single-branch",
      "https://github.com/asdf-vm/asdf.git",
      asdfDir,
    ]);
  }
}
