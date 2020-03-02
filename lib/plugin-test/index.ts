import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { setupAsdf } from "../setup";

const pluginTest = async () => {
  await setupAsdf();
  const command = core.getInput("command", { required: true });
  const version = core.getInput("version", { required: true });
  const plugin = (
    core.getInput("plugin", { required: false }) ||
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.GITHUB_REPOSITORY!.split("/")[1]
  ).replace("asdf-", "");
  const giturl =
    core.getInput("giturl", { required: false }) ||
    `https://github.com/${process.env.GITHUB_REPOSITORY}`;
  const gitref =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    core.getInput("gitref", { required: false }) || process.env.GITHUB_SHA!;
  await exec.exec("asdf", [
    "plugin-test",
    plugin,
    giturl,
    "--asdf-tool-version",
    version,
    "--asdf-plugin-gitref",
    gitref,
    command
  ]);
};

export const pluginTestAll = async () => {
  core.startGroup("Test plugin");
  await pluginTest();
  core.endGroup();
};
