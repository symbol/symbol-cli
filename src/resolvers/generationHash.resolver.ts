import {ExpectedError} from 'clime';
import {BlockHttp} from 'nem2-sdk';
import {CreateProfileOptions} from '../commands/create.profile.command';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {Resolver} from './resolver';

/**
 * Generation hash resolver
 */
export class GenerationHashResolver implements Resolver {

    /**
     * Resolves generationHash. If not provided by the user, this is asked to the node.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Promise<string>}
     */
    async resolve(options: CreateProfileOptions, secondSource?: Profile, altText?: string): Promise<string> {
        let generationHash = '';
        const blockHttp = new BlockHttp(options.url);
        try {
            generationHash = options.generationHash
                ? options.generationHash : (await blockHttp.getBlockByHeight('1').toPromise()).generationHash;
        } catch (ignored) {
            throw new ExpectedError('Check if you can reach the NEM2 url provided: ' + options.url + '/block/1');
        }
        return generationHash;
    }
}
