# Change Log

All notable changes to the "mope-client" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.3] - 2021-08-16

### Fixed

* Command name for `sendExpression` function was `SendExpression` but should have been `ExecuteCommand`.

NOTE: This is a hotfix for the presentation version, designed for the same MopeLSP version as version 0.0.2.

## [0.0.2] - 2021-08-16

### Added

* Upon using the `mope-client.connect` action, all current workspace folders are added to the MODELICAPATH as soon as the connection to the server is ready.

NOTE: This version is designed to work with the [`Presentation` branch of MopeLSP](https://github.com/MopeSWTP-SS21/MopeSWTP/tree/Presentation) at commit hash e575be33bc1f4145ea2a04973610f95edd1e038c.

## [0.0.1] - 2021-08-09

This is the initial release of the VS Code client for MopeLSP as a VSIX package.
It is designed to work with MopeLSP version 0.1.0.

[0.0.3]: https://github.com/MopeSWTP-SS21/vs-code-client/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/MopeSWTP-SS21/vs-code-client/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/MopeSWTP-SS21/vs-code-client/releases/tag/v0.0.1
