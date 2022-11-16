# asdf GitHub Actions

[![Main workflow](https://github.com/asdf-vm/actions/workflows/Main%20workflow/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)
[![CodeQL](https://github.com/asdf-vm/actions/workflows/CodeQL/badge.svg?branch=master)](https://github.com/asdf-vm/actions/actions)

This repo provides a collection of asdf related actions for use in your
workflows.

## Usage

### How to specify the version

There is a point that is particularly easy to misunderstand. It's where you
specify the version of the action _itself_.

```yml
- name: Test plugin
  uses: asdf-vm/actions/plugin-test@v1
  #                                ^^^
  with:
    command: my_tool --version
```

We recommend that you include the version of the action. We adhere to
[semantic versioning](https://semver.org), it's safe to use the major version
(`v1`) in your workflow. If you use the master branch, this could break your
workflow when we publish a breaking update and increase the major version.

```yml
steps:
  # Reference the major version of a release (most recommended)
  - uses: asdf-vm/actions/plugin-test@v1
  # Reference a specific commit (most strict)
  - uses: asdf-vm/actions/plugin-test@a368498
  # Reference a semver version of a release (not recommended)
  - uses: asdf-vm/actions/plugin-test@v1.0.1
  # Reference a branch (most dangerous)
  - uses: asdf-vm/actions/plugin-testmaster
```

### Example workflow

```yml
name: Main workflow

on:
  pull_request:
    paths-ignore:
      - "**.md"
  push:
    paths-ignore:
      - "**.md"
  schedule:
    - cron: 0 0 * * 5

jobs:
  plugin_test:
    strategy:
      fail-fast: false
      matrix:
        os:
          - macos-latest
          - ubuntu-latest

    runs-on: ${{ matrix.os }}

    steps:
      - name: Test plugin
        uses: asdf-vm/actions/plugin-test@v1
        with:
          command: my_tool --version

  lint:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run ShellCheck
        run: shellcheck bin/*

  format:
    runs-on: macos-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install shfmt
        run: brew install shfmt

      - name: Run shfmt
        run: shfmt -d .
```

### Trick to avoid problems

Using the images provided by the Actions team may be difficult to test correctly
due to current asdf implementation constraints. In this case, you can use Docker
containers and avoid them.

```yml
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
      - name: Test plugin
        uses: asdf-vm/actions/plugin-test@v1
        with:
          command: my_tool --version
```

## Actions

### Main actions

These two actions are probably the most useful:

- `asdf-vm/actions/install` - Install your `.tool-versions` plugins and tools.

```yml
steps:
  - name: asdf_install
    uses: asdf-vm/actions/install@v1
```

See [action.yml](install/action.yml) inputs.

- `asdf-vm/actions/plugin-test` - Test your shiny new asdf plugin.

```yml
steps:
  - name: asdf_plugin_test
    uses: asdf-vm/actions/plugin-test@v1
    with:
      command: my_tool --version
```

See [action.yml](plugin-test/action.yml) inputs.

### Lower level actions

These actions are used internally by the above ones. And you won't need to use
them directly, unless you actually want.

- `asdf-vm/actions/plugins-add` - Only install plugins, not tool versions.

  See [action.yml](plugins-add/action.yml) inputs.

- `asdf-vm/actions/setup` - Just installs asdf itself.

  See [action.yml](setup/action.yml) inputs.
