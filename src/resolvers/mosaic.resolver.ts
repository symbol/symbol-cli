import {OptionsConfirmResolver, OptionsResolver} from '../options-resolver'
import {MosaicService} from '../services/mosaic.service'
import {MosaicsValidator} from '../validators/mosaic.validator'
import {MosaicIdAliasValidator, MosaicIdValidator} from '../validators/mosaicId.validator'
import {Resolver} from './resolver'
import {Mosaic, MosaicFlags, MosaicId, NamespaceId} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * MosaicId resolver
 */
export class MosaicIdResolver implements Resolver {

    /**
     * Resolves a mosaic id provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<MosaicId>}
     */
    async resolve(options: Options, altText?: string, altKey?: string):
        Promise<MosaicId> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'mosaicId',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic id in hexadecimal format:',
            'text',
            new MosaicIdValidator())
        return new MosaicId(resolution)
    }
}

/**
 * MosaicId alias resolver
 */
export class MosaicIdAliasResolver implements Resolver {

    /**
     * Resolves a mosaic id alias provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<MosaicId | NamespaceId>}
     */
    async resolve(options: Options, altText?: string, altKey?: string):
        Promise<MosaicId | NamespaceId> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'mosaicId',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic id or alias:',
            'text',
            new MosaicIdAliasValidator())
        return MosaicService.getMosaicId(resolution)
    }

    /**
     * Resolves an optional mosaic id or alias provided by the user.
     * @param {any} options - Command options.
     * @param {string} altKey - Alternative key.
     * @param {MosaicId | NamespaceId} defaultValue - Default value.
     */
    optionalResolve(options: any, altKey?: string, defaultValue?: string): MosaicId | NamespaceId {
        const key = altKey ? altKey : 'referenceMosaicId'
        if (defaultValue) {
            options[key] = options[key] ? options[key] : defaultValue
        }
        new MosaicIdAliasValidator().validate(options[key])
        return MosaicService.getMosaicId(options[key])
    }
}

/**
 * Mosaics resolver
 */
export class MosaicsResolver implements Resolver {

    /**
     * Resolves a set of mosaics provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<Mosaic[]>}
     */
    async resolve(options: Options, altText?: string, altKey?: string):
        Promise<Mosaic[]> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'mosaics',
            () =>  undefined,
            altText ? altText : 'Mosaics to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 symbol.xym, @symbol.xym::1000000). Add multiple mosaics separated by commas:',
            'text',
            new MosaicsValidator())
        return resolution ? MosaicService.getMosaics(resolution) : []
    }
}

/**
 * Mosaics flags resolver
 */
export class MosaicFlagsResolver implements Resolver {

    /**
     * Resolves mosaic flags by the user.
     * @param {Options} options - Command options.
     * @returns {Promise<MosaicFlags>}
     */
    async resolve(options: Options): Promise<MosaicFlags> {

        return MosaicFlags.create(
                await OptionsConfirmResolver(options, 'supplyMutable', 'Do you want this mosaic to have supply mutable?'),
                await OptionsConfirmResolver(options, 'transferable','Do you want this mosaic to be transferable?'),
                await OptionsConfirmResolver(options, 'restrictable','Do you want this mosaic to be restrictable?'))
    }
}
