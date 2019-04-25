# CHANGELOG

All notable changes to this project will be documented in this file.

The changelog format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

[0.11.0]: https://github.com/nemtech/nem2-cli/compare/v0.9.3...v0.11.0
[0.9.3]: https://github.com/nemtech/nem2-cli/releases/v0.9.3
