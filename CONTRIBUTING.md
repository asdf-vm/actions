# Contributing

[asdf](https://asdf-vm.com) is used to manage the development tools for these
GitHub Actions. See its documentation to install and setup on your machine.

## Setup

```shell
# add plugins with asdf (plugin source URLs correspond to the defaults provided by the asdf plugin repository)
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add pnpm https://github.com/jonathanmorley/asdf-pnpm.git
asdf plugin add lefthook https://github.com/jtzero/asdf-lefthook.git
# install tools
asdf install
# install nodejs deps & setup lefthook
pnpm install
```

## GitHub Actions

Contributions are welcome. Please raise an issue to discuss changes before
raising a Pull Request.

Source code for the Actions can be found in the `src/` directory.

## Code Quality

[Lefthook](https://github.com/evilmartians/lefthook) is used to run `pre-commit`
and `pre-push` Git Hooks to ensure standard practices are followed
before raising code changes in Pull Requests. It will be installed and
configured by the above steps.
