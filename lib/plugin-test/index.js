import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as path from "path";
import setupAsdf from "../setup";


const pluginTest = async () => {
  await setupAsdf();
  const command = core.getInput("command", {required: true});
  const version = core.getInput("version", {required: true});
  const plugin = (core.getInput("plugin", {required: false})   || process.env.GITHUB_REPOSITORY.split('/')[1]).replace('asdf-', '');
  const giturl = (core.getInput("giturl", {required: false})   || `https://github.com/${process.env.GITHUB_REPOSITORY}`);
  const gitref = (core.getInput("gitref", {required: false})   || process.env.GITHUB_SHA);
  await exec.exec('asdf', [
    'plugin-test',
    plugin, giturl, '--asdf-tool-version', version, '--asdf-plugin-gitref', gitref, command
  ]);
};

const pluginTestAll = async () => {
  core.startGroup('Test plugin');
  await pluginTest();
  core.endGroup();
};

export default pluginTestAll;
