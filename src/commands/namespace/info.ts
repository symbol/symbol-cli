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
import {NamespaceHttp, NamespaceId, NamespaceService} from 'nem2-sdk';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {OptionsResolver} from '../../options-resolver';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'n',
        description: 'Namespace Id in string format',
    })
    name: string;

    @option({
        flag: 'u',
        description: 'Namespace id in uint64 format. [number, number]',
    })
    uint: string;
}

@command({
    description: 'Fetch Namespace info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getProfile(options);

        if (!options.uint) {
        options.name = OptionsResolver(options,
            'name',
            () => undefined,
            'Introduce the namespace name: ');
        }
        if (options.name === '') {
            options.uint = OptionsResolver(options,
                'uint',
                () => undefined,
                'Introduce the namepsace id in uint64 format. [number, number]: ');
        }

        let namespaceId: NamespaceId;
        if (options.name) {
            namespaceId = new NamespaceId(options.name);
        } else if (options.uint) {
            namespaceId = new NamespaceId(JSON.parse(options.uint));
        } else {
            throw new ExpectedError('You need to introduce at least one');
        }

        const namespaceHttp = new NamespaceHttp(profile.url);
        const namespaceService = new NamespaceService(namespaceHttp);
        namespaceService.namespace(namespaceId)
            .subscribe((namespace) => {
                this.spinner.stop(true);
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
                    text += chalk.green('Parent Id: ') + chalk.bold(namespace.name) + '\n';
                    text += '-'.repeat('Parent Id: '.length + namespace.name.length) + '\n\n';
                    text += 'hexadecimal:\t' + namespace.parentNamespaceId().toHex() + '\n';
                    text += 'uint:\t\t[ ' + namespace.parentNamespaceId().id.lower + ', ' +
                        '' + namespace.parentNamespaceId().id.higher + ' ]\n\n';
                }

                console.log(text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
