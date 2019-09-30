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
import {command, metadata, option} from 'clime';
import {Deadline, NamespaceRegistrationTransaction, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    name: string;

    @option({
        flag: 'r',
        description: 'Root namespace.',
        toggle: true,
    })
    rootnamespace: any;

    @option({
        flag: 's',
        description: 'Sub namespace.',
        toggle: true,
    })
    subnamespace: any;

    @option({
        flag: 'd',
        description: 'Duration (use it with --rootnamespace).',
    })
    duration: string;

    @option({
        flag: 'p',
        description: 'Parent namespace name (use it with --subnamespace).',
    })
    parentName: string;
}

@command({
    description: 'Register namespace transaction',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        options.name = OptionsResolver(options,
            'name',
            () => undefined,
            'Introduce namespace name: ');

        if (!options.rootnamespace && readlineSync.keyInYN('Do you want to create a root namespace?')) {
            options.rootnamespace = true;
        }

        if (!options.rootnamespace) {
            options.subnamespace = true;
            options.parentName = OptionsResolver(options,
                'parentName',
                () => undefined,
                'Introduce the parent namespace name: ');
        } else {
            options.duration = OptionsResolver(options,
                'duration',
                () => undefined,
                'Introduce namespace rental duration: ');
        }
        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        let namespaceRegistrationTransaction: NamespaceRegistrationTransaction;
        if (options.rootnamespace) {
            namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createRootNamespace(Deadline.create(),
                options.name, UInt64.fromNumericString(options.duration), profile.networkType, UInt64.fromUint(options.maxFee));
        } else {
            namespaceRegistrationTransaction = NamespaceRegistrationTransaction.createSubNamespace(Deadline.create(),
                options.name, options.parentName, profile.networkType, UInt64.fromUint(options.maxFee));
        }

        const signedTransaction = profile.account.sign(namespaceRegistrationTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
