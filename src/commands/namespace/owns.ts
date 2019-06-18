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
import {command, ExpectedError, metadata, option} from 'clime';
import {Address, Mosaic, NamespaceHttp, NamespaceService, UInt64} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from "../../address.validator";
import {OptionsResolver} from "../../options-resolver";

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'o',
        description: '(Optional) (0: load default profile address, 1: input address)',
    })
    option: number;

    @option({
        flag: 'a',
        description: 'Address',
        validator: new AddressValidator(),
    })
    address: string;

    optionValidator(str: string) {
        const value = parseInt(str);
        if ([0, 1].some(x => (x === value))) {
            return value;
        }
        throw new ExpectedError('Introduce a valid option value');
    }
}

@command({
    description: 'Get owned namespaces',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        let address: Address;
        const optioned: number = options.optionValidator(
            OptionsResolver(options,
                'option',
                () => undefined,
                'Introduce alias action (0: load default profile address, 1: input address): ')
        );
        address = profile.account.address;
        if( optioned === 1){
            try {
                address = Address.createFromRawAddress(OptionsResolver(options,
                    'address',
                    () => undefined,
                    'Introduce the address: '));
            } catch (err) {
                throw new ExpectedError('Introduce a valid address');
            }
        }
        const namespaceHttp = new NamespaceHttp(profile.url);
        const namespaceService = new NamespaceService(namespaceHttp);
        namespaceHttp.getNamespacesFromAccount(address)
            .subscribe((namespacesInfo) => {
                this.spinner.stop(true);
                if (namespacesInfo.length === 0) {
                    console.log('No namespace exists with profile Address ' + address.plain());
                } else {
                    let text = '';
                    namespacesInfo.map(namespaceInfo => {
                        namespaceService.namespace(namespaceInfo.id).subscribe(namespace => {
                            text += chalk.green('Namespace: ') + '\n';
                            text += '-'.repeat('Namespace: '.length + namespacesInfo.length) + '\n';
                            text += 'Name:\t' + namespace.name + '\n';
                            text += 'ID:\t' + namespace.id.toHex().toUpperCase() + '\n';
                            text += 'Owner:\t\t' + namespaceInfo.owner.address.pretty() + '\n';
                            text += 'StartHeight:\t' + namespaceInfo.startHeight.compact() + '\n';
                            text += 'EndHeight:\t' + namespaceInfo.endHeight.compact() + '\n';
                            text += 'HasAlias:\t' + namespaceInfo.hasAlias() + '\n';
                            console.log(text);
                        });
                    });
                }
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
