# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2020-12-22

### Added

- Add the `github_token` input and set by default a token with only the
  necessary and sufficient privileges available only to the running job. In
  other words, users do not need to set this themselves except in exceptional
  cases. It's automatically exported in the runners as `GITHUB_API_TOKEN`.

## [1.0.1] - 2020-10-10

### Changed

- Port entire action to TypeScript from a runner plugin so it's easier to
  collaborate and accept contributions

## [1.0.0] - 2020-05-16

- Initial version

[unreleased]: https://github.com//asdf-vm/actions/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/asdf-vm/actions/compare/v1.0.0...v1.1.0
[1.0.1]: https://github.com/asdf-vm/actions/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/asdf-vm/actions/releases/tag/v1.0.0
