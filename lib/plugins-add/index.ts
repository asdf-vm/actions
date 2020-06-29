import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import { setupAsdf } from "../setup";

const pluginList = async (): Promise<Array<string>> => {
  let stdout = "";
  let stderr = "";
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
      stderr: (data: Buffer) => {
        stderr += data.toString();
      },
    },
  };

  try {
    await exec.exec("asdf", ["plugin-list"], options);
  } catch (err) {
    if (!/No plugins installed/.test(stderr)) {
      throw err;
    }
  }

  return stdout.split("\n");
};

export const pluginsAdd = async () => {
  await setupAsdf();
  let toolVersions = core.getInput("tool_versions", { required: false });

  if (toolVersions) {
    await fs.promises.writeFile(".tool-versions", toolVersions, {
      encoding: "utf8",
    });
  } else {
    toolVersions = await fs.promises.readFile(".tool-versions", {
      encoding: "utf8",
    });
  }

  const pluginNames = toolVersions
    .split("\n")
    .map((x) => x.replace(/#.*/, "").trim())
    .filter((x) => x.length > 0)
    .map((x) => x.split(" ")[0]);

  const installedPluginNames = await pluginList();

  for (const pluginName of pluginNames) {
    if (installedPluginNames.includes(pluginName)) {
      core.info(
        `Skip installing ${pluginName} plugin since it's already installed`
      );
    } else {
      core.info(`Installing ${pluginName} plugin...`);
      await exec.exec("asdf", ["plugin-add", pluginName]);
    }
  }
};
