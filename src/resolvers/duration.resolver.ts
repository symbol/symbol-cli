import {MosaicId, NamespaceId, UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {MosaicIdValidator} from '../validators/mosaicId.validator';
import {Resolver} from './resolver';
import {MosaicService} from '../service/mosaic.service';
import {NumericStringValidator} from '../validators/numericString.validator';

/**
 * Duration resolver
 */
export class DurationResolver implements Resolver {

    /**
     * Resolves an absolute duration by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {UInt64}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'duration',
        () =>  undefined,
        altText ? altText : 'Enter an duration: ').trim();
        new NumericStringValidator().validate(resolution, {name: 'duration', source: resolution});
        return UInt64.fromNumericString(resolution);
    }
}
