import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { setupAsdf } from "../setup";

const stdoutLines: string[] = [];
const stderrLines: string[] = [];
const debugLines: string[] = [];

export async function pluginTest(): Promise<void> {
  await setupAsdf();
  const command = core.getInput("command", { required: true });
  const version = core.getInput("version", { required: true });
  const plugin = (
    core.getInput("plugin", { required: false }) ||
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.GITHUB_REPOSITORY!.split("/")[1]
  ).replace("asdf-", "");
  const options: exec.ExecOptions = {};
  options.listeners = {
    stdline: (line: string) => {
      stdoutLines.push(line.replace(/(?:\r\n|\r|\n)/g, ""));
    },
    errline: (line: string) => {
      stderrLines.push(line.replace(/(?:\r\n|\r|\n)/g, ""));
    },
    debug: (line: string) => {
      debugLines.push(line.replace(/(?:\r\n|\r|\n)/g, ""));
    },
  };
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
    command,
  ],
    options);
}

export async function pluginTestAll(): Promise<void> {
  const githubToken = core.getInput("github_token", { required: false });
  core.exportVariable("GITHUB_API_TOKEN", githubToken);
  core.startGroup("Test plugin");
  await pluginTest();
  core.setOutput("stdout", { lines: stdoutLines });
  core.setOutput("stderr", { lines: stderrLines });
  core.setOutput("debug", { lines: debugLines });
  core.endGroup();
}
