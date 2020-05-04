# asdf GitHub Actions

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/asdf-vm/actions/test?style=flat-square)](https://github.com/asdf-vm/actions/actions)

This repo provides a collection of asdf related actions for use in your
workflows.

## Main actions

These two actions are probaly the most useful:

- `asdf-vm/actions/install` - Install your `.tool-versions` plugins and tools.

```yml
steps:
  - name: asdf_install
    uses: asdf-vm/actions/install@v1.0.0
```

See [action.yml](install/action.yml) inputs.

- `asdf-vm/actions/plugin-test` - Test your shiny new asdf plugin.

```yml
steps:
  - name: asdf_plugin_test
    uses: asdf-vm/actions/plugin-test@v1.0.0
    with:
      command: "my_tool --version"
    env:
      GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }} # automatically provided
```

See [action.yml](plugin-test/action.yml) inputs.

## Lower level actions

These actions are used internally by the above ones. And you won't need to use
them directly, unless you actually want ;)

- `asdf-vm/actions/plugins-add` - Only install plugins, not tool versions.

  See [action.yml](plugins-add/action.yml) inputs.

- `asdf-vm/actions/setup` - Just installs asdf itself.

  See [action.yml](setup/action.yml) inputs.
