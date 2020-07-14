/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { command, metadata, option } from 'clime';
import { TransactionSearchCriteria } from 'symbol-sdk';

import { SearchCommand } from '../../interfaces/search.command';
import { SearchOptions } from '../../interfaces/search.options';
import { AddressResolver } from '../../resolvers/address.resolver';
import { HeightResolver } from '../../resolvers/height.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { TransactionGroupResolver } from '../../resolvers/transactionGroup.resolver';
import { TransactionTypeResolver } from '../../resolvers/transactionType.resolver';
import { FormatterService } from '../../services/formatter.service';
import { TransactionView } from '../../views/transactions/details/transaction.view';

/**
 * Search options
 */
export class TransactionSearchOptions extends SearchOptions {
    @option({
        description: '(Optional) Filter by transaction group. (Confirmed, Unconfirmed, Partial)',
        default: 'Confirmed',
    })
    group: string;

    @option({
        description: '(Optional) Filter by address involved in the transaction.',
    })
    address: string;

    @option({
        description: '(Optional) Filter by address of an account receiving the transaction.',
    })
    recipientAddress: string;

    @option({
        description: '(Optional) Public key of the account signing the entity.',
    })
    signerPublicKey: string;

    @option({
        description: '(Optional) Filter by block height.',
    })
    height: string;

    @option({
        description: '(Optional) Filter by transaction type. (E.g. TRANSFER)',
    })
    type: string;

    async buildSearchCriteria(): Promise<TransactionSearchCriteria> {
        const criteria: TransactionSearchCriteria = {
            ...(await this.buildBaseSearchCriteria()),
            group: await new TransactionGroupResolver().resolve(this),
        };
        if (this.address) {
            criteria.address = await new AddressResolver().resolve(this);
        }
        if (this.recipientAddress) {
            criteria.recipientAddress = await new AddressResolver().resolve(this, undefined, undefined, 'recipientAddress');
        }
        if (this.signerPublicKey) {
            criteria.signerPublicKey = (await new PublicKeyResolver().resolve(this, undefined, undefined, 'signerPublicKey')).publicKey;
        }
        if (this.height) {
            criteria.height = await new HeightResolver().resolve(this);
        }
        if (this.type) {
            criteria.type = [await new TransactionTypeResolver().resolve(this, undefined, 'type')];
        }
        return criteria;
    }
}

@command({
    description: 'Search transactions',
})
export default class extends SearchCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: TransactionSearchOptions) {
        const profile = this.getProfile(options);

        this.spinner.start();
        const transactionHttp = profile.repositoryFactory.createTransactionRepository();
        transactionHttp.search(await options.buildSearchCriteria()).subscribe(
            (page) => {
                this.spinner.stop();

                if (!page.data.length) {
                    console.log(FormatterService.error('No data found; try changing the selection criteria'));
                }

                page.data.forEach((transaction) => {
                    new TransactionView(transaction).print();
                });
            },
            (err) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
