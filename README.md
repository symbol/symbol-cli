# nem2-cli

[![npm version](https://badge.fury.io/js/nem2-cli.svg)](https://badge.fury.io/js/nem2-cli)
[![Build Status](https://api.travis-ci.org/nemtech/nem2-cli.svg?branch=master)](https://travis-ci.org/nemtech/nem2-cli)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/nem2-cli/badge.svg?branch=master)](https://coveralls.io/github/nemtech/nem2-cli?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Command Line Interface (CLI) to interact with Catapult.

:information_source: Use the software for testing/development purposes.

## Important Notes

- [0.18.1](CHANGELOG.md#0181-19-Feb-2020) - **Fushicho5 Network Compatibility (catapult-server@0.9.3.1)**

:warning: 0.18.x breaks compatibility with the ``profiles`` (public key derivation) saved using previous versions of the software.
Private keys have now a new public key and address associated.
Before installing ``nem2-cli@0.18.1``, backup and delete the file  ``~ \.nem2rc.json``.

- [0.17.1](CHANGELOG.md#0171-31-Jan-2020) - **Fushicho4 Network Compatibility (catapult-server@0.9.2.1)**

- [0.16.3](CHANGELOG.md#0163-17-Jan-2020) - **Fushicho3 Network Compatibility (catapult-server@0.9.1.1)**

:warning: 0.16.x breaks compatibility with the ``profiles`` (private keys) saved using previous versions of the software.
Before installing ``nem2-cli@0.16.0``, backup and delete the file  ``~ \.nem2rc.json``.

- [0.15.2](CHANGELOG.md#0151-13-Dec-2019) - **Fushicho3 Network Compatibility (catapult-server@0.9.1.1)**

The release notes for the nem2-cli can be found [here](CHANGELOG.md).

## Requirements

- Node v12.13.0 (LTS)

## Installation

The nem2-cli is distributed using the node package manager npm.

```
npm install nem2-cli -g
```


## Usage

Surf the [NEM Developer Center][docs] to get started into NEM development. You will find self-paced guides and useful code snippets using the nem2-cli.

To get the full list of available commands, check the [CLI reference][docs].

## Contributing

This project is developed and maintained by NEM Foundation. Contributions are welcome and appreciated. You can find [nem2-cli on GitHub][self];
Feel free to start an issue or create a pull request. Check [CONTRIBUTING](CONTRIBUTING.md) before start.

## Getting help

- [nem2-cli documentation][docs]
- Join the community [slack group (#sig-client)][slack] 
- If you found a bug, [open a new issue][issues]

## License

Copyright 2018-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/nem2-cli
[docs]: https://nemtech.github.io/cli.html
[issues]: https://github.com/nemtech/nem2-cli/issues
[slack]: https://join.slack.com/t/nem2/shared_invite/enQtMzY4MDc2NTg0ODgyLWZmZWRiMjViYTVhZjEzOTA0MzUyMTA1NTA5OWQ0MWUzNTA4NjM5OTJhOGViOTBhNjkxYWVhMWRiZDRkOTE0YmU
