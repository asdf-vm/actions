# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0](https://github.com/asdf-vm/actions/compare/v2.0.1...v2.1.0) (2023-03-15)


### Features

* skip_install option to skip asdf install on setup ([#536](https://github.com/asdf-vm/actions/issues/536)) ([c926367](https://github.com/asdf-vm/actions/commit/c926367c74d7ac64e42946f54849dfd9165e2b6f))

## [2.0.1](https://github.com/asdf-vm/actions/compare/v2.0.0...v2.0.1) (2023-03-15)


### Bug Fixes

* bump `@actions/*` SDKs & rebuild plugins ([#535](https://github.com/asdf-vm/actions/issues/535)) ([f2e8edb](https://github.com/asdf-vm/actions/commit/f2e8edb0852a0cc7e0de8e7f30c2b660be13e4e9))
* bump esbuild & rebuild plugins ([#532](https://github.com/asdf-vm/actions/issues/532)) ([1c86dd7](https://github.com/asdf-vm/actions/commit/1c86dd77827c32947af570f209c90092ddfcc873))

## [2.0.0](https://github.com/asdf-vm/actions/compare/v1.1.0...v2.0.0) (2023-03-09)

### ⚠ BREAKING CHANGES

- Update actions to use node16
  ([#488](https://github.com/asdf-vm/actions/issues/488))
  ([6844d09](https://github.com/asdf-vm/actions/commit/6844d09b13209e7d2ce3b63d2b089a2acef581ec))
  - released by
    ([2f61da5](https://github.com/asdf-vm/actions/commit/2f61da5af7da0a1216219da51d0718c25e159a77))

### Bug Fixes

- update codeql for dependabot compat
  ([3f6d713](https://github.com/asdf-vm/actions/commit/3f6d71382fe4c7807936733d72aef7ee6e56e7a9))
- use correct trigger type
  ([d464031](https://github.com/asdf-vm/actions/commit/d4640312f060abdd98823bf6bd9a2758851133c2))

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
