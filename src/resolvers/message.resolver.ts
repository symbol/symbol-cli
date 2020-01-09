import chalk from 'chalk';
import {NetworkType, PublicAccount} from 'nem2-sdk';
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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
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
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<PublicAccount> {
        const recipientPublicKey = await OptionsResolver(options,
            'recipientPublicKey',
            () => undefined,
            'Enter the recipient public key: ');
        try {
            new PublicKeyValidator().validate(recipientPublicKey);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return PublicAccount
            .createFromPublicKey(recipientPublicKey, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST);
    }
}
