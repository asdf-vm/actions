# asdf actions

Collection of asdf GitHub Actions.

<!-- x-release-please-start-version -->

| Name                 | Version  | Status | Description                                   |
| :------------------- | :------- | :----- | :-------------------------------------------- |
| [`asdf`](./asdf)     | `v2.0.0` |        | Install your `.tool-versions` plugins & tools |
| [`plugin`](./plugin) | `v2.0.0` |        | Test & validate your asdf plugins             |

<!-- x-release-please-end -->

## Quickstart

Install dependencies with the `asdf-vm/actions/asdf` action:

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: asdf-vm/actions/asdf@v2
```

Test & validate your asdf plugin with the `asdf-vm/actions/plugin` action:

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: asdf-vm/actions/plugin@v2
```

## Contents

- [Quickstart](#quickstart)
- [Contents](#contents)
- [`actions/asdf`](#actionsasdf)
  - [Inputs](#inputs)
  - [Only Install the Tools Needed](#only-install-the-tools-needed)
  - [Pin Plugin Versions](#pin-plugin-versions)
- [`actions/plugin`](#actionsplugin)
- [Contributing](#contributing)
- [Todo](#todo)

## `actions/asdf`

Manage your workflow dependencies with `asdf-vm/asdf`.

```bash
# asdf-vm/asdf .tool-versions
bats 1.8.2
shellcheck 0.9.0
shfmt 3.6.0
```

```yaml
# asdf-vm/asdf .github/workflows/lint.yml
name: lint
on:
  push:
   branches: ["master"]
jobs:
  shellcheck:
    steps:
      - uses: actions/checkout@v3
      - uses: asdf-vm/actions/asdf@v2
        with:
          asdf_version: v0.11.1
          cache: everything
          only_listed_plugins: true
          plugins: |
            shellcheck https://github.com/luizm/asdf-shellcheck.git#9d462743a7e64670ec60cc13893f97e9a70f72a3
      - name: Run ShellCheck
        run: scripts/shellcheck.bash
```

### Inputs

#### `asdf_version`

The version of asdf to use in the action.

|          |                                                                                                               |
| :------- | :------------------------------------------------------------------------------------------------------------ |
| required | `false`                                                                                                       |
| type     | `string`                                                                                                      |
| default  | Latest stable release, from [`asdf-vm/asdf/releases/latest`](https://github.com/asdf-vm/asdf/releases/latest) |

Can be a version, branch or Git ref:
- `asdf_version: v0.11.1`
- `asdf_version: master`
- `asdf_version: e0fd7a7be8bbbbf0f3cb6dc38cea3b62963eb0c9`

#### `cache`

Configure whether the action should cache the Plugins, the Tools or everything or nothing.

|          |           |
| :------- | :-------- |
| required | `false`   |
| type     | `string`  |
| default  | `nothing` |

Can be one of:
- `cache: nothing`
- `cache: everything`
- `cache: plugins`
- `cache: tools`

A cache key is created using the `runner.os` and a hash of `.tool-versions`. If the `plugins` configuration is used, then the contents of that variable is also hashed and included in the cache key.

#### `only_listed_plugins`

Configure if _only_ the `plugins` listed should be installed, or if all listed plugins **and** those in `.tool-versions` should be installed.

|          |           |
| :------- | :-------- |
| required | `false`   |
| type     | `boolean` |
| default  | `false`   |

From the example `.tool-versions` and Workflow file defined above:
- `only_listed_plugins: true`: Only installs `shellcheck@0.9.0` with the plugin from the listed URL.
- `only_listed_plugins: false` (default): Installs `shellcheck@0.9.0`,`bats@1.8.2` & `shfmt@3.6.0`. Shellcheck uses the plugin from the listed URL, the others plugins come from the [shortname repository (`asdf-plugins`)](https://github.com/asdf-vm/asdf-plugins) repo.

Note: `true` requires `plugins` to be defined with 1 tool that overlaps with a tool in `.tool-versions`

#### `plugins`

Configure plugin install URLs other than shortname repo. Allows using custom plugins and specific Git refs of those plugins.

|          |                                                                                                                                                |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| required | `false`                                                                                                                                        |
| type     | `list` of `<shortname> [<url>[#sha]]`"                                                                                                         |
| default  | Populated from [shortname repository (`asdf-plugins`)](https://github.com/asdf-vm/asdf-plugins) by lookup of `shortname` from `.tool-versions` |

Can be just the tool shortname with an optional plugin URL source and optional Git Ref. Can also be a mixed list:
- `plugins: shellcheck`
- `plugins: shellcheck https://github.com/luizm/asdf-shellcheck.git`
- `plugins: shellcheck https://github.com/luizm/asdf-shellcheck.git#9d462743a7e64670ec60cc13893f97e9a70f72a3`
-
  ```yaml
  plugins: |
    shellcheck
    shfmt https://github.com/luizm/asdf-shfmt.git
    bats https://github.com/timgluz/asdf-bats.git#b2bd907f0df728c3398375ed0d60af80a4ad981d
  ```

Note: Plugins listed here must also appear in the `.tool-versions` file, you cannot (and should not) manage ad-hoc dependencies with asdf.

#### `skip_asdf_clone`

<!-- TODO(jthegedus): skip repo clone if already exists. See these:
 - https://github.com/asdf-vm/actions/pull/467
-->

#### `tool-versions-path`

<!-- TODO(jthegedus): path to .tool-versions file. See these:
 - https://github.com/asdf-vm/actions/pull/446/files
 - https://github.com/asdf-vm/actions/pull/437/files
-->


### Only Install the Tools Needed

GitHub Actions does not cache data installed by Actions across Jobs, only Steps within Jobs. So a Workflow with multiple Jobs running `uses: asdf-vm/actions/asdf@v2` would re-install all tools from `.tool-versions`. This is wasteful.

The below configuration is an example for how to avoid this and only install what you need in the Job:

```bash
# asdf-vm/asdf .tool-versions
bats 1.8.2
shellcheck 0.9.0
shfmt 3.6.0
```

```yaml
jobs:
  shellcheck:
    steps:
      - uses: actions/checkout@v3
      - uses: asdf-vm/actions/asdf@v2
        with:
          only_listed_plugins: true
          plugins: |
            shellcheck
      - name: Run ShellCheck
        run: scripts/shellcheck.bash
  shfmt:
    steps:
      - uses: actions/checkout@v3
      - uses: asdf-vm/actions/asdf@v2
        with:
          only_listed_plugins: true
          plugins: |
            shfmt
      - name: Run Shfmt
        run: scripts/shfmt.bash
```

This configuration means:
- only `shellcheck@0.9.0` is installed in `jobs.shellcheck` as we don't need the other deps in this Job.
- only `shfmt@3.6.0` is installed in `jobs.shfmt` as we don't need the other deps in this Job.
- The plugin to install each tool is the default from the `asdf-vm/asdf-plugins` repo using the latest SHA on that plugin repositories default branch.

### Pin Plugin Versions

GitHub Actions does not cache data installed by Actions across Jobs, only Steps within Jobs. So each `uses: asdf-vm/actions/asdf@v2` would re-install all tools from `.tool-versions`. This is wasteful.

The below configuration is an example for how to avoid this:

```bash
# asdf-vm/asdf .tool-versions
bats 1.8.2
shellcheck 0.9.0
shfmt 3.6.0
```

```yaml
jobs:
  shellcheck:
    steps:
      - uses: actions/checkout@v3
      - uses: asdf-vm/actions/asdf@v2
        with:
          asdf_version: v0.11.1
          only_listed_plugins: true
          plugins: |
            shellcheck https://github.com/luizm/asdf-shellcheck.git#9d462743a7e64670ec60cc13893f97e9a70f72a3
      - name: Run ShellCheck
        run: scripts/shellcheck.bash
```

This configuration means:
- only `shellcheck@0.9.0` is installed in `jobs.shellcheck`
- the plugin to manage Shellcheck was installed from `https://github.com/luizm/asdf-shellcheck.git`
- the plugin was pinned to SHA `9d462743a7e64670ec60cc13893f97e9a70f72a3`

## `actions/plugin`
<!-- TODO(jthegedus): write docs -->

## Contributing
<!-- TODO(jthegedus): write contribution guide -->

## Todo

- [ ] update the CI workflows to use the automation from the other asdf repos
- [ ] see how release-please handles monorepos.
- [ ] release each action as it's own versioned action
- [ ] rewrite the actions in raw JS with JSDoc instead of committing compiled TS code to the repo
  - see how others do this
- [ ] update codeQL usage to be the automatic thing
