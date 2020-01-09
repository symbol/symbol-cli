import chalk from 'chalk';
import {Password} from 'nem2-sdk';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {PrivateKeyValidator} from '../validators/privateKey.validator';
import {Resolver} from './resolver';

/**
 * Private key resolver
 */
export class PrivateKeyResolver implements Resolver {

    /**
     * Resolves a private key provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Password}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            'privateKey',
            () => undefined,
            'Enter your account private key: ',
            'password');
        try {
            new PrivateKeyValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return resolution;
    }
}
