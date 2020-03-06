import {Profile} from '../models/profile.model'
import {OptionsResolver} from '../options-resolver'
import {PublicKeysValidator, PublicKeyValidator} from '../validators/publicKey.validator'
import {Resolver} from './resolver'
import {NetworkType, PublicAccount} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Public key resolver
 */
export class PublicKeyResolver implements Resolver {

    /**
     * Resolves a public key provided by the user.
     * @param {Options} options - Command options.
     * @param {NetworkType} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<PublicAccount>}
     */
    async resolve(options: Options, secondSource?: NetworkType, altText?: string, altKey?: string): Promise<PublicAccount> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'publicKey',
            () => undefined,
            altText ? altText : 'Enter the account public key:',
            'text',
            new PublicKeyValidator())
        return PublicAccount.createFromPublicKey(resolution, secondSource ? secondSource : NetworkType.MIJIN_TEST)
    }
}

/**
 * Cosignatory public key resolver
 */

export class CosignatoryPublicKeyResolver implements Resolver {
    /**
     * Resolves a set of cosignatory public keys provided by the user.
     * @param {Options} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<PublicAccount[]>}
     */
    async resolve(options: Options, secondSource?: Profile, altText?: string, altKey?: string): Promise<PublicAccount[]> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'cosignatoryPublicKey',
            () => undefined,
            altText ? altText : 'Enter the cosignatory accounts public keys (separated by a comma):',
            'text',
            new PublicKeysValidator())
        const cosignatoryPublicKeys = resolution.split(',')
        const cosignatories: PublicAccount[] = []
        cosignatoryPublicKeys.map((cosignatory: string) => {
            cosignatories.push(PublicAccount
                .createFromPublicKey(cosignatory, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST))
        })
        return cosignatories
    }

}
