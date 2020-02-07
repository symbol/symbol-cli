import chalk from 'chalk'
import {NetworkType, PublicAccount} from 'nem2-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {PublicKeyValidator} from '../validators/publicKey.validator'
import {Resolver} from './resolver'

/**
 * Message resolver
 */
export class MessageResolver implements Resolver {

    /**
     * Resolves a message provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'message',
            () =>  undefined,
            altText ? altText : 'Enter a message: ')
        return resolution
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
     * @param {string} altKey - Alternative key.
     * @returns {PublicAccount}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<PublicAccount> {
        const recipientPublicKey = await OptionsResolver(options,
            altKey ? altKey : 'recipientPublicKey',
            () => undefined,
            altText ? altText : 'Enter the recipient public key: ')
        try {
            new PublicKeyValidator().validate(recipientPublicKey)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return PublicAccount
            .createFromPublicKey(recipientPublicKey, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST)
    }
}
