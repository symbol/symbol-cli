/*
 * Copyright 2019 NEM
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
import {command, ExpectedError, metadata, option} from 'clime';
import {
    Deadline,
    MosaicAliasTransaction,
    MosaicId,
    NamespaceId,
    TransactionHttp,
} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Alias action (0: Link, 1: Unlink)',
    })
    action: number;

    @option({
        flag: 'm',
        description: 'Mosaic Id in in hexadecimal format',
    })
    mosaic: string;

    @option({
        flag: 'n',
        description: 'Namespace name',
    })
    namespace: string;
}

@command({
    description: 'Set an alias to a mosaic',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {

        const profile = this.getProfile(options);

        options.namespace = OptionsResolver(options,
            'namespace',
            () => undefined,
            'Introduce namespace name: ');
        options.mosaic = OptionsResolver(options,
                'mosaic',
                () => undefined,
                'Introduce mosaic in hexadecimal format: ');

        let mosaicId: MosaicId;
        if (options.mosaic) {
            mosaicId = new MosaicId(options.mosaic);
        } else {
            throw new ExpectedError('You need to introduce mosaic id.');
        }

        let namespaceId: NamespaceId;
        if (options.namespace) {
            namespaceId = new NamespaceId(options.namespace);
        } else {
            throw new ExpectedError('You need to introduce namespace id.');
        }

        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            OptionsResolver(options,
                'action',
                () => undefined,
                'Introduce alias action (0: Link, 1: Unlink): '),
            namespaceId,
            mosaicId,
            profile.networkType,
        );

        const signedTransaction = profile.account.sign(mosaicAliasTransaction, profile.networkGenerationHash);

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
