# Symbol CLI

[![npm version](https://badge.fury.io/js/symbol-cli.svg)](https://badge.fury.io/js/symbol-cli)
[![Build Status](https://api.travis-ci.com/nemtech/symbol-cli.svg?branch=main)](https://travis-ci.com/nemtech/symbol-cli)
[![Coverage Status](https://coveralls.io/repos/github/nemtech/symbol-cli/badge.svg?branch=main)](https://coveralls.io/github/nemtech/symbol-cli?branch=main)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Command Line Interface (CLI) to interact with Symbol.

**NOTE:** Symbol-CLI is designed to help developers test solutions and interact with Symbol networks quickly from the command line prompt. To hold MAIN NET assets, refer to the [Symbol Desktop Wallet](https://github.com/nemfoundation/symbol-desktop-wallet) project.

## Important Notes

- [0.22.x](CHANGELOG.md#0220-06-Oct-2020) - **0.10.0.x Milestone**
- [0.21.x](CHANGELOG.md#0211-31-Jul-2020) - **0.9.6.3 Milestone**
- [0.20.x](CHANGELOG.md#0201-27-May-2020) - **0.9.5.1 Milestone**

0.21.x breaks compatibility with the ``profiles`` (address format) saved using previous versions of the software.
Before installing ``symbol-cli@0.21.x``, backup and delete the file ``~ \.symbolrc.json``.

Find the complete release notes [here](CHANGELOG.md).

## Requirements

- Node.js 12 LTS

## Installation

The Symbol CLI is distributed using the node package manager ``npm``.

```bash
npm install -g symbol-cli
```

## Usage

Surf the [documentation][docs] to get started into Symbol development.
You will find self-paced guides and useful code snippets using the Symbol CLI.

To get the full list of available commands, check the [CLI reference][ref].

## Getting help

- [Symbol Documentation][docs]
- [Symbol CLI Reference][ref]
- Join the community [slack group (#sig-client)][slack]
- If you found a bug, [open a new issue][issues]

## Contributing

Contributions are welcome and appreciated.
Check [CONTRIBUTING](CONTRIBUTING.md) for information on how to contribute.

## License

Copyright 2018-present NEM

Licensed under the [Apache License 2.0](LICENSE)

[self]: https://github.com/nemtech/symbol-cli
[docs]: http://nemtech.github.io/getting-started/setup-workstation.html
[ref]: https://nemtech.github.io/cli.html
[issues]: https://github.com/nemtech/symbol-cli/issues
[slack]: https://join.slack.com/t/nem2/shared_invite/zt-j0xtyrr8-dJ9p0~Lua4lJx9ZoLbq7mg
