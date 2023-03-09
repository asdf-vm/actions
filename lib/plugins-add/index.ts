import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import { setupAsdf } from "../setup";

async function pluginList() {
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
}

export async function pluginsAdd(): Promise<void> {
  await setupAsdf();
  let toolVersions = core.getInput("tool_versions", { required: false });
  let directory = core.getInput("directory", { required: false });
  directory = !directory.endsWith("/") ? `${directory}/` : directory

  if (toolVersions) {
    await fs.promises.writeFile(`${directory}.tool-versions`, toolVersions, {
      encoding: "utf8",
    });
  } else {
    toolVersions = await fs.promises.readFile(`${directory}.tool-versions`, {
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
}
