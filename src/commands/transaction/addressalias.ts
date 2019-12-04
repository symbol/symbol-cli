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
import { command, ExpectedError, metadata, option } from 'clime';
import { Address, AddressAliasTransaction, Deadline, NamespaceId, UInt64 } from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import { AddressValidator } from '../../validators/address.validator';
import { BinaryValidator } from '../../validators/binary.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Alias action (1: Link, 0: Unlink).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'a',
        description: 'Account address.',
        validator: new AddressValidator(),
    })
    address: string;

    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    namespace: string;

    @option({
        description: 'Wallet password.',
    })
    password: string;
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
        const wallet = this.getDefaultWallet(options);

        options.namespace = OptionsResolver(options,
            'namespace',
            () => undefined,
            'Introduce namespace name: ');
        const namespaceId = new NamespaceId(options.namespace);

        options.address = OptionsResolver(options,
            'address',
            () => undefined,
            'Introduce the address: ');

        const address = Address.createFromRawAddress(options.address);
        if (address.networkType !== wallet.networkType) {
            throw new ExpectedError('The address network doesn\'t match network option.');
        }

        options.action = +OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce alias action (1: Link, 0: Unlink): ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee (absolute amount): ');

        options.password = OptionsResolver(options,
            'password',
            () => undefined,
            'Introduce the wallet password: ');
        const addressAliasTransaction = AddressAliasTransaction.create(
            Deadline.create(),
            options.action,
            namespaceId,
            address,
            wallet.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const account = wallet.getAccount(options.password.trim());
        const signedTransaction = account.sign(addressAliasTransaction, wallet.networkGenerationHash);
        this.announceTransaction(signedTransaction, wallet.url);
    }
}
