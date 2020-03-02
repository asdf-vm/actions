import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import { setupAsdf } from "../setup";

export const pluginsAdd = async () => {
  await setupAsdf();
  let toolVersions = core.getInput("tool_versions", { required: false });

  if (toolVersions) {
    await fs.promises.writeFile(".tool-versions", toolVersions, {
      encoding: "utf8"
    });
  } else {
    toolVersions = await fs.promises.readFile(".tool-versions", {
      encoding: "utf8"
    });
  }

  const pluginNames = toolVersions
    .split("\n")
    .map(x => x.replace(/#.*/, "").trim())
    .filter(x => x.length > 0)
    .map(x => x.split(" ")[0]);

  for (const pluginName of pluginNames) {
    await exec.exec("asdf", ["plugin-add", pluginName]);
  }
};
