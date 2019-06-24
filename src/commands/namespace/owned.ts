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
import {Address, NamespaceHttp, NamespaceInfo, NamespaceService} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from "../../address.validator";
import {OptionsResolver} from "../../options-resolver";

export class CommandOptions extends ProfileOptions {

    @option({
        flag: 'a',
        description: 'Address',
        validator: new AddressValidator(),
    })
    address: string;
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
        try {
            address = Address.createFromRawAddress(
                OptionsResolver(options,
                    'address',
                    () => this.getProfile(options).account.address.plain(),
                    'Introduce the address: '));
        } catch (err) {
            console.log(options);
            throw new ExpectedError('Introduce a valid address');
        }
        const namespaceHttp = new NamespaceHttp(profile.url);
        this.spinner.start();
        namespaceHttp.getNamespacesFromAccount(address)
            .subscribe((namespacesListInfo: NamespaceInfo[]) => {
                this.spinner.stop(true);
                if (namespacesListInfo.length === 0) {
                    console.log('The address' + address.plain() + 'does not own any namespaces');
                } else {
                    let text = '';
                    namespacesListInfo.map((namespaceInfo: NamespaceInfo) => {
                        if(namespaceInfo != null){
                            const rst =  namespaceInfo.id.fullName == null ? '' : namespaceInfo.id.fullName;
                            text += chalk.green('Namespace: ') + chalk.bold(rst) + '\n';
                            text += '-'.repeat('Namespace: '.length + rst.length) + '\n\n';
                            text += 'hexadecimal:\t' + namespaceInfo.id.toHex() + '\n';
                            text += 'uint:\t\t[ ' + namespaceInfo.id.id.lower + ', ' + namespaceInfo.id.id.higher + ' ]\n';

                            if(namespaceInfo.hasAlias()) {
                                text += 'alias:\t ' + namespaceInfo.alias + '\n';
                            }
                            if (namespaceInfo.isRoot()) {
                                text += 'type:\t\tRoot namespace \n';
                            } else {
                                text += 'type:\t\tSub namespace \n';
                            }
                            text += 'owner:\t\t' + namespaceInfo.owner.address.pretty() + '\n';
                            text += 'startHeight:\t' + namespaceInfo.startHeight.compact() + '\n';
                            text += 'endHeight:\t' + namespaceInfo.endHeight.compact() + '\n\n';

                            if (namespaceInfo.isSubnamespace()) {
                                text += chalk.green('Parent Id: ') + chalk.bold(rst) + '\n';
                                text += '-'.repeat('Parent Id: '.length + rst.length) + '\n\n';
                                text += 'hexadecimal:\t' + namespaceInfo.parentNamespaceId().toHex() + '\n';
                                text += 'uint:\t\t[ ' + namespaceInfo.parentNamespaceId().id.lower + ', ' +
                                    '' + namespaceInfo.parentNamespaceId().id.higher + ' ]\n\n';
                            }
                            console.log(text);
                        }
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
