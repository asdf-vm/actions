# GitHub Actions for [asdf](https://github.com/asdf-vm/asdf)

[![GitHub Release](https://img.shields.io/github/release/asdf-vm/actions.svg?color=green)](https://github.com/asdf-vm/actions/releases)
[![lint](https://github.com/asdf-vm/actions/workflows/lint/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![test](https://github.com/asdf-vm/actions/workflows/test/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![build](https://github.com/asdf-vm/actions/workflows/build/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![CodeQL](https://github.com/asdf-vm/actions/workflows/CodeQL/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)

A collection of [asdf](https://github.com/asdf-vm/asdf) GitHub Actions for use in your
workflows.

| Action        | Use                              | Description                                                                                                                          |
| :------------ | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `install`     | `asdf-vm/actions/install@v4`     | Installs `asdf` & tools in `.tool-versions`.<br>Plugins fetched from [asdf-vm/asdf-plugins](https://github.com/asdf-vm/asdf-plugins) |
| `setup`       | `asdf-vm/actions/setup@v4`       | Only install `asdf` CLI.                                                                                                             |
| `plugins-add` | `asdf-vm/actions/plugins-add@v4` | Only install plugins, not tools.                                                                                                     |
| `plugin-test` | `asdf-vm/actions/plugin-test@v4` | Plugin author test automation.                                                                                                       |

<!-- TOC -->
* [Usage](#usage)
  * [Automatic Actions Updating](#automatic-actions-updating)
* [Actions](#actions)
  * [Install](#install)
  * [Plugin Test](#plugin-test)
  * [Setup](#setup)
  * [Plugins Add](#plugins-add)
* [Miscellaneous](#miscellaneous)
  * [Full Example Workflow](#full-example-workflow)
  * [Docker Tricks](#docker-tricks)
<!-- TOC -->

## Usage

```yaml
steps:
  - name: Install asdf & tools
    uses: asdf-vm/actions/install@v4
```

To avoid breaking changes, use the full [Semantic Version](https://semver.org/)
`vX.Y.Z`. Below are the available version pinning options:

```yaml
steps:
  # Reference a specific commit (most strict, for the supply-chain paranoid)
  - uses: asdf-vm/actions/install@f4acd427436df623426c29f7e3e9ea715be28396
  # Reference a semver major version only (GitHub recommended)
  - uses: asdf-vm/actions/install@v4
  # Reference a semver version of a release (recommended)
  - uses: asdf-vm/actions/install@v4.0.2
  # Reference a branch (most dangerous)
  - uses: asdf-vm/actions/install@master
```

### Automatic Actions Updating

GitHub Dependabot has support for tracking GitHub Actions releases and
automatically creating PRs with these updates.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly" # Check for updates to GitHub Actions every week
```

## Actions

### Install

Installs `asdf` & tools in `.tool-versions`. Plugins fetched from
[asdf-vm/asdf-plugins](https://github.com/asdf-vm/asdf-plugins)

```yaml
steps:
  - uses: asdf-vm/actions/install@v4
```

Options are:

| Name           | Required | Default              | Description                                                                                                   |
| -------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| asdf_branch    | false    | master (i.e. latest) | asdf branch to clone                                                                                          |
| skip_install   | false    | false                | setup env without installing asdf                                                                             |
| tool_versions  | false    |                      | If present, this value will be written to the .tool-versions file.                                            |
| before_install | false    |                      | Bash script to run after plugins are installed but before `asdf install`.<br><br>e.g., to install npm keyring |

### Plugin Test

Plugin author test automation

```yaml
steps:
  - uses: asdf-vm/actions/plugin-test@v4
    with:
      command: my_tool --version
```

Options are:

| Name         | Required | Default                       | Description                                                               |
| ------------ | -------- | ----------------------------- | ------------------------------------------------------------------------- |
| asdf_branch  | false    | master (i.e. latest)          | asdf branch to clone                                                      |
| skip_install | false    | false                         | setup env without installing asdf                                         |
| command      | true     |                               | Command used to test your plugin tool. Something with --version or --help |
| plugin       | false    | repository name without asdf- | Plugin name to use                                                        |
| version      | false    | latest                        | Tool version to test                                                      |
| giturl       | false    | current github repository     | Plugin repository                                                         |
| gitref       | false    | current commit                | Branch or commit from repository to test                                  |
| github_token | false    | github.token value            | Token used to avoid rate limit when asdf calls the GitHub API             |

### Setup

Only install `asdf` CLI.

> Note: this Action is used internally by Install & Plugin Test, opt for those
> first.

```yaml
steps:
  - uses: asdf-vm/actions/setup@v4
```

Options are:

| Name         | Default              | Description                       |
| ------------ | -------------------- | --------------------------------- |
| asdf_branch  | master (i.e. latest) | asdf branch to clone              |
| skip_install | false                | setup env without installing asdf |

### Plugins Add

Only install plugins, not tools.

> Note: this Action is used internally by Install & Plugin Test, opt for those
> first.

```yaml
steps:
  - uses: asdf-vm/actions/plugins-add@v4
```

Options are:

| Name           | Required | Default              | Description                                                                                                   |
| -------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| asdf_branch    | false    | master (i.e. latest) | asdf branch to clone                                                                                          |
| skip_install   | false    | false                | setup env without installing asdf                                                                             |
| tool_versions  | false    |                      | If present, this value will be written to the .tool-versions file.                                            |


## Miscellaneous

### Full Example Workflow

This example workflow demonstrates how to use the Install Action:
`asdf-vm/actions/install@v4`. It is taken from the
[asdf-vm/asdf-plugin-template](https://github.com/asdf-vm/asdf-plugin-template)
repository.

```shell
# example .tool-versions
shellcheck 0.9.0
shfmt 3.6.0
```

```yaml
# https://github.com/asdf-vm/asdf-plugin-template/blob/main/template/.github/workflows/lint.yml
name: Lint

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  shellcheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: asdf-vm/actions/install@v4
      - run: scripts/lint.bash
      # script runs Shellcheck, Shfmt etc installed by previous action

  actionlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check workflow files
        uses: docker://rhysd/actionlint:1.6.23
        with:
          args: -color
```

### Docker Tricks

Using the default GitHub Action images may cause problems during plugin testing
due to current asdf implementation constraints. If you experience issues, you
can use Docker containers to reduce the variables of your environment.

```yaml
jobs:
  plugin_test:
    strategy:
      fail-fast: false
      matrix:
        container:
          - alpine:latest
          - centos:latest
          - ubuntu:latest

    runs-on: ubuntu-latest

    container:
      image: ${{ matrix.container }}

    steps:
      - uses: asdf-vm/actions/plugin-test@v4
        with:
          command: my_tool --version
```
