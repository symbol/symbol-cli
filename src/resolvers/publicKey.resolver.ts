import chalk from 'chalk';
import {NetworkType, PublicAccount} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PublicKeysValidator, PublicKeyValidator} from '../validators/publicKey.validator';
import {Resolver} from './resolver';
/**
 * Public key resolver
 */
export class PublicKeyResolver implements Resolver {

    /**
     * Resolves a public key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {PublicAccount}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<PublicAccount> {
        const resolution = await OptionsResolver(options,
            'publicKey',
            () => undefined,
            altText ? altText : 'Enter the account public key: ');
        try {
            new PublicKeyValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return PublicAccount.createFromPublicKey(resolution, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST);
    }
}

/**
 * Multisig account public key resolver
 */
export class MultisigAccountPublicKeyResolver implements Resolver {

    /**
     * Resolves a multisig account public key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {PublicAccount}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<PublicAccount> {
        const resolution = await OptionsResolver(options,
            'multisigAccountPublicKey',
            () => undefined,
            altText ? altText : 'Enter the multisig account public key: ');
        try {
            new PublicKeyValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return PublicAccount.createFromPublicKey(resolution, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST);
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
     * @returns {PublicAccount[]}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<PublicAccount[]> {
        const resolution = await OptionsResolver(options,
            'cosignatoryPublicKey',
            () => undefined,
            altText ? altText : 'Enter the cosignatory accounts public keys (separated by a comma):: ');
        try {
            new PublicKeyValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        const cosignatoryPublicKeys = resolution.split(',');
        const cosignatories: PublicAccount[] = [];
        cosignatoryPublicKeys.map((cosignatory: string) => {
            cosignatories.push(PublicAccount
                .createFromPublicKey(cosignatory, secondSource ? secondSource.networkType : NetworkType.MIJIN_TEST));
        });
        return cosignatories;
    }

}
