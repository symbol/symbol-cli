import chalk from 'chalk'
import {NetworkType, PublicAccount} from 'nem2-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {PublicKeyValidator} from '../validators/publicKey.validator'
import {Resolver} from './resolver'
/**
 * Public key resolver
 */
export class PublicKeyResolver implements Resolver {

    /**
     * Resolves a public key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {NetworkType} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {PublicAccount}
     */
    async resolve(options: ProfileOptions, secondSource?: NetworkType, altText?: string, altKey?: string): Promise<PublicAccount> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'publicKey',
            () => undefined,
            altText ? altText : 'Enter the account public key: ')
        try {
            new PublicKeyValidator().validate(resolution)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return PublicAccount.createFromPublicKey(resolution, secondSource ? secondSource : NetworkType.MIJIN_TEST)
    }
}

/**
 * Cosignatory public key resolver
 */

export class CosignatoryPublicKeyResolver implements Resolver {
    /**
     * Resolves a set of cosignatory public keys provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {PublicAccount[]}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<PublicAccount[]> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'cosignatoryPublicKey',
            () => undefined,
            altText ? altText : 'Enter the cosignatory accounts public keys (separated by a comma):: ')
        try {
            new PublicKeyValidator().validate(resolution)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        const cosignatoryPublicKeys = resolution.split(',')
        const cosignatories: PublicAccount[] = []
        cosignatoryPublicKeys.map((cosignatory: string) => {
            cosignatories.push(PublicAccount
                .createFromPublicKey(cosignatory, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST))
        })
        return cosignatories
    }

}
