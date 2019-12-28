/*
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
import {command, metadata, option} from 'clime';
import {Deadline, MosaicAliasTransaction} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {LinkActionResolver} from '../../resolvers/action.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver';
import {NamespaceNameResolver} from '../../resolvers/namespace.resolver';
import {MosaicIdValidator} from '../../validators/mosaicId.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'k',
        description: 'Alias action (1: Link, 0: Unlink).',
    })
    action: string;

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
        validator: new MosaicIdValidator(),
    })
    mosaicId: string;

    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    namespaceName: string;
}

@command({
    description: 'Set an alias to a mosaic',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const namespaceId = new NamespaceNameResolver().resolve(options);
        const mosaicId = new MosaicIdResolver().resolve(options);
        const action = new LinkActionResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            action,
            namespaceId,
            mosaicId,
            profile.networkType,
            maxFee);

        const signedTransaction = account.sign(mosaicAliasTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
