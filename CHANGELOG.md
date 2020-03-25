# CHANGELOG

All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.18.4] - 25-Mar-2020

**Milestone**: Fushicho.5(RC4 0.9.3.1)

### Added

- ``transaction uri`` command supports the transaction uri scheme #210 #177
- Alpha and full-releases from TravisCI
- Commands documentation versioned and generated automatically
- CLI notifies the user when there is a new update #251
- Receipts are shown in tables #192

### Fixed

- Divisibility resolver validation.

## [0.18.3] - 18-Mar-2020

**Milestone**: Fushicho.5(RC4 0.9.3.1)

### Added

- Guide the user when the account is not created #237
- Travis npm releases automated #235

### Changed

- ``transaction multisigmodication`` asks for minApprovalDelta/minRemovalDelta #230
- Enums from SDK are not hardcoded #229

### Fixed

- Maxfee validator does not work #241
- Object.unlinkSync:(): tests breaking on MacOs #236
- ``transaction cosign`` spinner

## [0.18.2] - 06-Mar-2020

**Milestone**: Fushicho.5(RC4 0.9.3.1)

### Changed

- ``readline-sync`` in favor of ``prompts.js`` library.
- ``symbol-sdk`` dependency to 0.17.3.

### Fixed

- Multisig transaction announcement.

## [0.18.1] - 24-Feb-2020

:warning: 0.18.x breaks compatibility with the ``profiles`` (public key derivation) saved using previous versions of the software.
Private keys have now a new public key and address associated.
Before installing ``symbol-cli@0.18.1``, backup and delete the file  ``~ \.nem2rc.json``.

**Milestone**: Fushicho.5(RC4 0.9.3.1)

## Added

- ``node info`` command.
- ``node health`` command.
- Errors are handled using a dedicated service.

### Changed

- ``diagnostic`` commands moved under ``node`` commands.
- ``symbol-sdk`` dependency to 0.17.1.

## [0.17.1] - 31-Jan-2020

**Milestone**: Fushicho.4(RC3 v0.9.2.1)

### Changed

- ``transactions`` responses formatted as a table.
- ``eslint`` deprecated in favor of ``ts-lint``.
- ``persistentharvestdelegation`` command split.
- ``symbol-sdk`` dependency to 0.16.5.

## [0.16.3] - 17-Jan-2020

### Added

- ``transaction mosaicglobalrestriction`` command.
- ``transaction mosaicaddressrestriction`` command.

### Changed

- ``transaction cosign`` aggregate transactions are fetched sequentially.

### Fixed

- ``transaction accountlink`` and ``block`` commands by adding typed resolvers.

## [0.16.2] - 15-Jan-2020

### Added

- ``transaction acountmetadata`` command.
- ``transaction mosaicmetadata`` command.
- ``transaction namespacemetadata`` command.

### Changed

- Resolvers accept alternative keys.

### Fixed

- ``converter publicKeyToAddress`` command network type.

## [0.16.1] - 11-Jan-2020

### Added

- Announce transaction information formatted as a table.
- Converter module.
- Offline profile creation.
- ``monitor all`` command.
- Synchronous transaction announcement with ``--sync`` option.

### Changed

- ``NetworkType`` and ``HashType`` resolvers now accept strings.
- Prevent creating multiple profiles with the same name.
- ``symbol-sdk`` dependency to 0.16.2.

### Removed

- Validators from options.

## [0.16.0] - 30-Dec-2019

:warning: 0.16.x breaks compatibility with the ``profiles`` (private keys) saved using previous versions of the software.
Before installing ``symbol-cli@0.16.0``, backup and delete the file  ``~ \.nem2rc.json``.

### Added

- ``profile create`` encrypts profiles.
- ``transaction`` commands ask for wallet password.
- ``profile import`` command.
- ``profile decrypt`` command.
- Prompts validation.
- Command for dev build.
- Command for windows build.

### Changed

- Command descriptions and prompts texts.
- Resolvers detached from commands.

### Fixed

- ``transaction multisigmodification`` command uses correct max_fee.

## [0.15.1] - 13-Dec-2019

### Added

- ``transaction multisigmodification`` command accepts more than one cosignatory.
- ``transaction`` commands support aliased addresses and mosaics.
- Enable offline signing (two step transaction announcement).

### Changed

- ``symbol-sdk`` dependency to 0.16.0.

## [0.14.0] - 21-Nov-2019

### Added

- ``profile current`` command.
-  Persistent harvesting delegation support.

### Changed

- ``symbol-sdk`` dependency to 0.15.0.

## [0.13.4] - 28-Oct-2019

### Added

- ``transaction multisigmodification`` command.
- ``transaction accountaddressrestriction`` command.
- ``transaction accountmosaicrestriction`` command.
- ``transaction namespacerestriction`` command.
- ``transaction secretproof`` command.
- ``transaction secretlock`` command.
- ``transaction transfer`` encrypted message.

### Fixed

- ``transfer transaction`` account alias.

## [0.13.2] - 07-Oct-2019

### Added

- ``metadata account`` command.
- ``metadata mosaic`` command.
- ``metadata namespace`` command.
- ``restriction mosaicglobal`` command.
- ``restriction mosaicaddress`` command.
- ``block header`` command.

### Fixed

- ``namespace info`` command.

## [0.13.1] - 30-Sep-2019

### Added

- ``account info`` command returns multisig account related information.
- ``block transactions`` command.
- ``block receipts`` command.
- ``diagnostic serverInfo`` command.
- ``diagnostic storage`` command.
- ``namespace alias`` command.
- ``namespace info`` command returns alias information.
- ``restriction account`` command.
- ``maxFee`` parameter to transactions commands.
- ``cli3-table`` extension to render results as tables.
- ``NamespaceIdValidator``, ``MosaicIdValidator``, ``BinaryValidator`` validators.

### Changed

- ``symbol-sdk`` dependency to 0.13.3.
- ``account info`` and ``mosaic info`` commands returns mosaic in absolute and relative amounts.
- ``account info`` and ``mosaic info`` commands returns the block expiration height of the returned mosaics.
- Command parameters are now in camelCase.

### Removed

- ``transaction pullfunds`` command.

## [0.13.0] - 05-Jul-2019

### Added

- ``namespace owned`` command.

### Changed

- ``symbol-sdk`` dependency to 0.13.0.

## [0.12.1] - 05-Jun-2019

### Changed

- ``symbol-sdk`` dependency to 0.12.1.

## [0.12.0] - 04-Jun-2019

### Added

- ``transaction status`` command.
- ``transation.service`` formats AccountLink and AccountProperty transactions.
 
### Changed

- Profile uses the network generation hash to sign transactions.

## [0.11.3] - 03-Jun-2019

### Fixed

- Static symbol-sdk & library version.

## [0.11.2] - 25-Apr-2019

### Added

- ``transaction mosaic`` accepts creating eternal mosaics.
- ``transaction mosaicalias`` command enables assigning namespaces to mosaics.
- ``transaction addressalias`` command enables assigning namespaces to addresses.

## [0.11.0] - 18-Mar-2019

### Changed

- Adapted symbol-sdk 0.11.1 breaking changes.
- The code is now rxjs 6.0 compatible.
- ``transaction mosaic`` command does not require to specify a mosaic name.
- ``mosaic info`` command allows passing mosaics in uint64 and hex format.
- ``transaction transfer`` command enables sending transfer transaction using aliased addresses and mosaics.
- ``transaction pullfunds`` command requires to pass the currency mosaic id.

## [0.9.3] - 3-Apr-2018

### Added
- Initial code release.

[0.18.4]: https://github.com/nemtech/symbol-cli/compare/v0.18.3...v0.18.4
[0.18.3]: https://github.com/nemtech/symbol-cli/compare/v0.18.2...v0.18.3
[0.18.2]: https://github.com/nemtech/symbol-cli/compare/v0.18.1...v0.18.2
[0.18.1]: https://github.com/nemtech/symbol-cli/compare/v0.17.1...v0.18.1
[0.17.1]: https://github.com/nemtech/symbol-cli/compare/v0.16.3...v0.17.1
[0.16.3]: https://github.com/nemtech/symbol-cli/compare/v0.16.2...v0.16.3
[0.16.2]: https://github.com/nemtech/symbol-cli/compare/v0.16.1...v0.16.2
[0.16.1]: https://github.com/nemtech/symbol-cli/compare/v0.16.0...v0.16.1
[0.16.0]: https://github.com/nemtech/symbol-cli/compare/v0.15.1...v0.16.0
[0.15.1]: https://github.com/nemtech/symbol-cli/compare/v0.14.0...v0.15.1
[0.14.0]: https://github.com/nemtech/symbol-cli/compare/v0.13.4...v0.14.0
[0.13.4]: https://github.com/nemtech/symbol-cli/compare/v0.13.2...v0.13.4
[0.13.2]: https://github.com/nemtech/symbol-cli/compare/v0.13.1...v0.13.2
[0.13.1]: https://github.com/nemtech/symbol-cli/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/nemtech/symbol-cli/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/nemtech/symbol-cli/compare/v0.11.3...v0.12.0
[0.11.3]: https://github.com/nemtech/symbol-cli/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/nemtech/symbol-cli/compare/v0.11.0...v0.11.2
[0.11.0]: https://github.com/nemtech/symbol-cli/compare/v0.9.3...v0.11.0
[0.9.3]: https://github.com/nemtech/symbol-cli/releases/v0.9.3
