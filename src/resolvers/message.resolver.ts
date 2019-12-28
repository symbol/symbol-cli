import {Message, NetworkType, PublicAccount} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PublicKeyValidator} from '../validators/publicKey.validator';
import {Resolver} from './resolver';

/**
 * Message resolver
 */
export class MessageResolver implements Resolver {

    /**
     * Resolves a message provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {string}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'message',
        () =>  undefined,
        'Enter a message: ');
        return resolution;
    }
}

/**
 * Recipient public key resolver
 */
export class RecipientPublicKeyResolver implements Resolver {

    /**
     * Resolves an public key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {PublicAccount}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const recipientPublicKey = OptionsResolver(options,
            'recipientPublicKey',
            () => undefined,
            'Enter the recipient public key: ');
        new PublicKeyValidator().validate(recipientPublicKey);
        return PublicAccount
            .createFromPublicKey(recipientPublicKey, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST);
    }
}
