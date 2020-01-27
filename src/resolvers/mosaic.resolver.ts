import {Mosaic, MosaicFlags, MosaicId, NamespaceId} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {CommandOptions} from '../commands/transaction/mosaic';
import {ProfileOptions} from '../interfaces/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {MosaicService} from '../services/mosaic.service';
import {MosaicsValidator} from '../validators/mosaic.validator';
import {MosaicIdAliasValidator, MosaicIdValidator} from '../validators/mosaicId.validator';
import {Resolver} from './resolver';

/**
 * MosaicId resolver
 */
export class MosaicIdResolver implements Resolver {

    /**
     * Resolves a mosaic id provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): MosaicId {
        const resolution = OptionsResolver(options,
        'mosaicId',
        () =>  undefined,
        altText ? altText : 'Enter the mosaic id in hexadecimal format: ').trim();
        new MosaicIdValidator().validate(resolution);
        return new MosaicId(resolution);
    }
}

/**
 * MosaicId alias resolver
 */
export class MosaicIdAliasResolver implements Resolver {

    /**
     * Resolves a mosaic id alias provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicId | NamespaceId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): MosaicId | NamespaceId {
        const resolution = OptionsResolver(options,
            'mosaicId',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic id or alias: ').trim();
        new MosaicIdAliasValidator().validate(resolution);
        return MosaicService.getMosaicId(resolution);
    }

    /**
     * Resolves an optional mosaic id or alias provided by the user.
     * @param {any} options - Command options.
     * @param {string} altKey - Alternative key.
     * @param {string} defaultValue - Default value.
     */
    optionalResolve(options: any, altKey?: string, defaultValue?: string): MosaicId | NamespaceId {
        const key = altKey ? altKey : 'referenceMosaicId';
        if (defaultValue) {
            options[key] = options[key] ? options[key] : defaultValue;
        }
        new MosaicIdAliasValidator().validate(options[key]);
        return MosaicService.getMosaicId(options[key]);
    }
}

/**
 * Mosaics resolver
 */
export class MosaicsResolver implements Resolver {

    /**
     * Resolves a set of mosaics provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Mosaic[]}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Mosaic[] {
        const resolution = OptionsResolver(options,
            'mosaics',
            () =>  undefined,
            altText ? altText : 'Mosaics to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000). Add multiple mosaics with commas: ').trim();
        new MosaicsValidator().validate(resolution);
        return resolution ? MosaicService.getMosaics(resolution) : [];
    }
}

/**
 * Mosaics flags resolver
 */
export class MosaicFlagsResolver implements Resolver {

    /**
     * Resolves mosaic flags by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicFlags}
     */
    resolve(options: CommandOptions, secondSource?: Profile, altText?: string): MosaicFlags {
        return MosaicFlags.create(
            options.supplyMutable ? options.supplyMutable : readlineSync.keyInYN(
                'Do you want mosaic to have supply mutable?'),
            options.transferable ? options.transferable : readlineSync.keyInYN(
                'Do you want mosaic to be transferable?'),
            options.restrictable ? options.restrictable : readlineSync.keyInYN(
                'Do you want mosaic to be restrictable?'));
    }
}
