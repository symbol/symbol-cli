import {ExpectedError} from 'clime'
import {BlockHttp, UInt64, QueryParams} from 'symbol-sdk'

import {CreateProfileOptions} from '../interfaces/create.profile.command'
import {NetworkCurrency} from '../models/networkCurrency.model'
import {Resolver} from './resolver'

/**
 * Generation hash resolver
 */
export class NetworkCurrencyResolver implements Resolver {

    /**
     * Resolves generationHash. If not provided by the user, this is asked to the node.
     * @param {CreateProfileOptions} options - Command options.
     * @returns {Promise<string>}
     */
    async resolve(options: CreateProfileOptions): Promise<NetworkCurrency> {
        try {
            const {namespaceId, divisibility} = options
            if (namespaceId && divisibility) {
                return NetworkCurrency.createFromDTO({namespaceId, divisibility})
            }

            const firstBlockTransactions = await new BlockHttp(options.url)
                .getBlockTransactions(UInt64.fromUint(1), new QueryParams({pageSize: 100}))
                .toPromise()

            return NetworkCurrency.createFromFirstBlockTransactions(firstBlockTransactions)
        } catch (ignored) {
            throw new ExpectedError('Check if you can reach the Symbol url provided: ' + options.url + '/block/1')
        }
    }
}
