# Contributing

[asdf](https://asdf-vm.com) is used to manage the development tools for these
GitHub Actions. See it's documentation to install and setup on your machine.

## Setup

```shell
# add plugins with asdf
asdf plugin add nodejs
asdf plugin add yarn
asdf plugin add lefthook
# install tools
asdf install
# install nodejs deps & setup lefthook
yarn install
```

## GitHub Actions

Contributions are welcome. Please raise an issue to discuss changes before
raising a Pull Request.

Source code for the Actions can be found in the `src/` directory.

## Code Quality

[Lefthook](https://github.com/evilmartians/lefthook) is used to run `pre-commit`
and `pre-push` git hooks to ensure standardised best practices are followed
before raising code changes in Pull Requests. It will be installed and
configured by the above steps.
