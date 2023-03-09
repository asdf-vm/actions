# GitHub Actions for [asdf](github.com/asdf-vm/asdf)

[![GitHub Release](https://img.shields.io/github/release/asdf-vm/actions.svg?color=green)](https://github.com/asdf-vm/actions/releases)
[![lint](https://github.com/asdf-vm/actions/workflows/lint/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![test](https://github.com/asdf-vm/actions/workflows/test/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![build](https://github.com/asdf-vm/actions/workflows/build/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![CodeQL](https://github.com/asdf-vm/actions/workflows/CodeQL/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)

A collection of [asdf](github.com/asdf-vm/asdf) GitHub Actions for use in your
workflows.

| Action        | Use                                  | Description                                                                                                                          |
| :------------ | :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `install`     | `asdf-vm/actions/install@v2.0.0`     | Installs `asdf` & tools in `.tool-versions`.<br>Plugins fetched from [asdf-vm/asdf-plugins](https://github.com/asdf-vm/asdf-plugins) |
| `setup`       | `asdf-vm/actions/setup@v2.0.0`       | Only install `asdf` CLI.                                                                                                             |
| `plugins-add` | `asdf-vm/actions/plugins-add@v2.0.0` | Only install plugins, not tools.                                                                                                     |
| `plugin-test` | `asdf-vm/actions/plugin-test@v2.0.0` | Plugin author test automation.                                                                                                       |

<!-- TOC -->

- [Usage](#usage)
  - [Automatic Actions Updating](#automatic-actions-updating)
- [Actions](#actions)
  - [Install](#install)
  - [Plugin Test](#plugin-test)
  - [Setup](#setup)
  - [Plugins Add](#plugins-add)
- [Miscellaneous](#miscellaneous)
  - [Full Example Workflow](#full-example-workflow)
  - [Docker Tricks](#docker-tricks)

<!-- TOC -->

## Usage

```yaml
steps:
  - name: Install asdf & tools
    uses: asdf-vm/actions/install@v2.0.0
```

Prefer using the full [Semantic Version](https://semver.org/) `vX.Y.Z` to avoid
breaking changes. Below are the available version pinning options:

```yaml
steps:
  # Reference a specific commit (most strict, for the supply-chain paranoid)
  - uses: asdf-vm/actions/install@2368b9d
  # Reference a semver version of a release (recommended)
  - uses: asdf-vm/actions/install@v2.0.0
  # Reference a branch (most dangerous)
  - uses: asdf-vm/actions/install@master
```

<!-- TODO(jthegedus): update release-please workflow to delete the old major and tag a new major on each release. -->

asdf Actions do not currently support referencing by Semantic Version major
only. Eg: `- uses: asdf-vm/actions/install@v2` is not supported. Work is being
done to rectify this.

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
  - uses: asdf-vm/actions/install@v2.0.0
```

<!-- TODO(jthegedus): capture action.yml options in a markdown table here. Show usage examples for each option. -->

See [action.yml](install/action.yml) inputs.

### Plugin Test

Plugin author test automation

```yaml
steps:
  - uses: asdf-vm/actions/plugin-test@v2.0.0
    with:
      command: my_tool --version
```

<!-- TODO(jthegedus): capture action.yml options in a markdown table here. Show usage examples for each option. -->

See [action.yml](plugin-test/action.yml) inputs.

### Setup

Only install `asdf` CLI.

> Note: this Action is used internally by Install & Plugin Test, opt for those
> first.

```yaml
steps:
  - uses: asdf-vm/actions/setup@v2.0.0
```

<!-- TODO(jthegedus): capture action.yml options in a markdown table here. Show usage examples for each option. -->

See [action.yml](setup/action.yml) inputs.

### Plugins Add

Only install plugins, not tools.

> Note: this Action is used internally by Install & Plugin Test, opt for those
> first.

```yaml
steps:
  - uses: asdf-vm/actions/plugins-add@v2.0.0
```

<!-- TODO(jthegedus): capture action.yml options in a markdown table here. Show usage examples for each option. -->

See [action.yml](plugins-add/action.yml) inputs.

## Miscellaneous

### Full Example Workflow

This example workflow demonstrates how to use the Install Action:
`asdf-vm/actions/install@v2.0.0`. It is taken from the
[asdf-vm/asdf-plugin-template](https://github.com/asdf-vm/asdf-plugin-template)
repository.

```shell
# example .tool-versions
shellcheck 0.7.2
shfmt 3.3.0
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
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install asdf dependencies
        uses: asdf-vm/actions/install@v2.0.0

      - name: Run ShellCheck
        run: scripts/shellcheck.bash
        # script runs Shellcheck installed by previous action

  shellfmt:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Install asdf dependencies
        uses: asdf-vm/actions/install@v2.0.0

      - name: Run shfmt
        run: scripts/shfmt.bash
        # script runs Shellcheck installed by previous action
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
      - uses: asdf-vm/actions/plugin-test@v2.0.0
        with:
          command: my_tool --version
```
