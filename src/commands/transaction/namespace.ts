/*
 *
 * Copyright 2018 NEM
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
import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {Deadline, RegisterNamespaceTransaction, TransactionHttp, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Namespace name',
    })
    name: string;

    @option({
        flag: 'r',
        description: 'Root namespace',
        toggle: true,
    })
    rootnamespace: any;

    @option({
        flag: 's',
        description: 'Sub namespace',
        toggle: true,
    })
    subnamespace: any;

    @option({
        flag: 'd',
        description: 'Duration (use it with --rootnamespace)',
    })
    duration: number;

    @option({
        flag: 'p',
        description: 'Parent namespace name (use it with --subnamespace)',
    })
    parentname: string;
}

@command({
    description: 'Register namespace transaction',
})

export default class extends ProfileCommand {

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
            options.parentname = OptionsResolver(options,
                'parentname',
                () => undefined,
                'Introduce the Parent name: ');
        } else {
            options.duration = OptionsResolver(options,
                'duration',
                () => undefined,
                'Introduce namespace rental duration: ');
        }

        let registerNamespaceTransaction: RegisterNamespaceTransaction;
        if (options.rootnamespace) {
            registerNamespaceTransaction = RegisterNamespaceTransaction.createRootNamespace(Deadline.create(),
                options.name, UInt64.fromUint(options.duration), profile.networkType);
        } else {
            registerNamespaceTransaction = RegisterNamespaceTransaction.createSubNamespace(Deadline.create(),
                options.name, options.parentname, profile.networkType);
        }

        const signedTransaction = profile.account.sign(registerNamespaceTransaction, profile.networkGenerationHash);

        const transactionHttp = new TransactionHttp(profile.url);

        transactionHttp.announce(signedTransaction).subscribe(() => {
            console.log(chalk.green('Transaction announced correctly'));
            console.log('Hash:   ', signedTransaction.hash);
            console.log('Signer: ', signedTransaction.signer);
        }, (err) => {
            this.spinner.stop(true);
            let text = '';
            text += chalk.red('Error');
            console.log(text, err.response !== undefined ? err.response.text : err);
        });
    }
}
