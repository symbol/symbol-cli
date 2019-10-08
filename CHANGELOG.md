# CHANGELOG

All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

- ``nem2-sdk`` dependency to 0.13.3
- ``account info`` and ``mosaic info`` commands returns mosaic in absolute and relative amounts.
- ``account info`` and ``mosaic info`` commands returns the block expiration height of the returned mosaics.
- Command parameters are now in camelCase.

### Removed

- ``transaction pullfunds`` command.

## [0.13.0] - 05-Jul-2019

### Added

- ``namespace owned`` command.

### Changed

- ``nem2-sdk`` dependency to 0.13.0

## [0.12.1] - 05-Jun-2019

### Changed

- ``nem2-sdk`` dependency to 0.12.1

## [0.12.0] - 04-Jun-2019

### Added

- ``transaction status`` command.
- ``transation.service`` formats AccountLink and AccountProperty transactions.
 
### Changed

- Profile uses the network generation hash to sign transactions.

## [0.11.3] - 03-Jun-2019

### Fixed
- Static nem2-sdk & library version.

## [0.11.2] - 25-Apr-2019

### Added
- ``transaction mosaic`` accepts creating eternal mosaics.
- ``transaction mosaicalias`` command enables assigning namespaces to mosaics.
- ``transaction addressalias`` command enables assigning namespaces to addresses.

## [0.11.0] - 18-Mar-2019

### Changed
- Adapted nem2-sdk 0.11.1 breaking changes.
- The code is now rxjs 6.0 compatible.
- ``transaction mosaic`` command does not require to specify a mosaic name.
- ``mosaic info`` command allows passing mosaics in uint64 and hex format.
- ``transaction transfer`` command enables sending transfer transaction using aliased addresses and mosaics.
- ``transaction pullfunds`` command requires to pass the currency mosaic id.

## [0.9.3] - 3-Apr-2018

### Added
- Initial code release.

[0.13.1]: https://github.com/nemtech/nem2-cli/compare/v0.12.0...v0.13.1
[0.13.0]: https://github.com/nemtech/nem2-cli/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/nemtech/nem2-cli/compare/v0.11.3...v0.12.0
[0.11.3]: https://github.com/nemtech/nem2-cli/compare/v0.11.2...v0.11.3
[0.11.2]: https://github.com/nemtech/nem2-cli/compare/v0.11.0...v0.11.2
[0.11.0]: https://github.com/nemtech/nem2-cli/compare/v0.9.3...v0.11.0
[0.9.3]: https://github.com/nemtech/nem2-cli/releases/v0.9.3
