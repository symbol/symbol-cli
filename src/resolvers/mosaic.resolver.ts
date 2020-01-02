import {Mosaic, MosaicId, NamespaceId} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {MosaicService} from '../service/mosaic.service';
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'mosaics',
            () =>  undefined,
            altText ? altText : 'Mosaics to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000). Add multiple mosaics with commas: ').trim();
        new MosaicsValidator().validate(resolution);
        return resolution ? MosaicService.getMosaics(resolution) : [];
    }
}
