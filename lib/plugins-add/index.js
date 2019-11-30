import * as core from "@actions/core";
import * as io from "@actions/io";
import * as exec from "@actions/exec";
import * as path from "path";
import {promises as fs} from 'fs';
import setupAsdf from "../setup";

const pluginsAdd = async () => {
  await setupAsdf();
  let tool_versions = core.getInput("tool_versions", {required: false});

  if (tool_versions) {
    await fs.writeFile(".tool-versions", tool_versions, {encoding: 'utf8'});
  } else {
    tool_versions = await fs.readFile(".tool-versions", {encoding: 'utf8'});
  }

  const pluginNames =
        tool_versions.split("\n")
        .map(x => x.replace(/#.*/, '').trim())
        .filter(x => x.length > 0)
        .map(x => x.split(' ')[0]);

  await pluginNames.reduce(async (promise, pluginName) => {
    await promise;
    return exec.exec('asdf', ["plugin-add", pluginName]);
  }, Promise.resolve());
};

export default pluginsAdd;
