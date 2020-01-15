import {UInt64} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {KeyValidator} from '../validators/key.validator';
import {Resolver} from './resolver';

export class KeyResolver implements Resolver {
    /**
     * Resolves a string key provided by user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'key',
            () => undefined,
            altText ?
            altText : 'Enter a UInt64 string key (You could convert it using command \'nem2-cli converter stringtokey\'): ').trim();
        new KeyValidator().validate(resolution);
        return UInt64.fromNumericString(resolution);
    }
}
