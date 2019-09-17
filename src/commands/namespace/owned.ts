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
import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {Address, NamespaceHttp, NamespaceInfo, NamespaceService} from 'nem2-sdk';
import {mergeMap, toArray} from 'rxjs/operators';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from '../../validators/address.validator';

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
        const profile = this.getProfile();
        const address: Address = Address.createFromRawAddress(
            OptionsResolver(options,
                'address',
                () => profile.account.address.plain(),
                'Introduce the address: '));
        const namespaceHttp = new NamespaceHttp(profile.url);
        const namespaceService = new NamespaceService(namespaceHttp);
        this.spinner.start();
        namespaceHttp.getNamespacesFromAccount(address)
            .pipe(
                mergeMap((_) => _),
                mergeMap((namespaceInfo: NamespaceInfo) => namespaceService.namespace(namespaceInfo.id)),
                toArray(),
            )
            .subscribe((namespaces) => {
                this.spinner.stop(true);

                if (namespaces.length === 0) {
                    console.log('The address ' + address.plain() + ' does not own any namespaces');
                }

                namespaces.map((namespace) => {

                    let text = '';
                    text += chalk.green('Namespace: ') + chalk.bold(namespace.name) + '\n';
                    text += '-'.repeat('Namespace: '.length + namespace.name.length) + '\n\n';
                    text += 'hexadecimal:\t' + namespace.id.toHex() + '\n';
                    text += 'uint:\t\t[ ' + namespace.id.id.lower + ', ' + namespace.id.id.higher + ' ]\n';

                    if (namespace.isRoot()) {
                        text += 'type:\t\tRoot namespace \n';
                    } else {
                        text += 'type:\t\tSub namespace \n';
                    }

                    text += 'owner:\t\t' + namespace.owner.address.pretty() + '\n';
                    text += 'startHeight:\t' + namespace.startHeight.compact() + '\n';
                    text += 'endHeight:\t' + namespace.endHeight.compact() + '\n\n';

                    if (namespace.isSubnamespace()) {
                        text += 'Parent Id:' + '\n';
                        text += 'hexadecimal:\t' + namespace.parentNamespaceId().toHex() + '\n';
                        text += 'uint:\t\t[ ' + namespace.parentNamespaceId().id.lower + ', ' +
                            '' + namespace.parentNamespaceId().id.higher + ' ]\n\n';
                    }

                    console.log(text);
                });

            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
