import {MosaicId, NamespaceId} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {MosaicIdAliasValidator, MosaicIdValidator} from '../validators/mosaicId.validator';
import {Resolver} from './resolver';
import {MosaicService} from '../service/mosaic.service';

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
        new MosaicIdValidator().validate(resolution, {name: 'mosaicId', source: resolution});
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'mosaicId',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic id or alias: ').trim();
        new MosaicIdAliasValidator().validate(resolution, {name: 'mosaicIdAlias', source: resolution});
        return MosaicService.getMosaicId(resolution);
    }
}
