import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import { pluginsAdd } from "../plugins-add";

export async function toolsCurrent(): Promise<void> {
  await pluginsAdd();

  const directory = core.getInput("directory", { required: false });
  let saveTo = core.getInput("save_to", { required: false });
  const save = core.getInput("save", { required: false });
  const options = {};
  let stdOut = "";

  options.listeners = {
    stdout: (data: Buffer) => {
      stdOut += data.toString();
    },
    stderr: (data: Buffer) => {
      stdOut += data.toString();
    },
  };
  options.cwd = directory;
  await exec.exec("asdf", ["current"], options);
  core.setOutput("_raw", stdOut);
  const toolsVersMap = new Map<string, string>();
  for (const line of stdOut.split(/\r?\n/)) {
    if (line.includes("No version set") || line.length == 0) {
      continue;
    }
    const key = line.split(/\s+/)[0];
    toolsVersMap.set(key, line.split(/\s+/)[1].trim());
  }

  let rawOut = "";
  for (const [tool, version] of toolsVersMap) {
    core.setOutput(tool, version);
    rawOut += `${tool} ${version}\n`;
  }
  core.setOutput("_parsed", rawOut);
  if (save === "no") {
    return;
  }
  if (directory !== saveTo) {
    saveTo = !saveTo.endsWith("/") ? `${saveTo}/` : saveTo;
    await fs.promises.writeFile(`${saveTo}.tool-versions`, rawOut, {
      encoding: "utf8",
    });
  }
}
