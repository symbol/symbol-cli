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
import {Account, NetworkType} from 'nem2-sdk';

export class Profile {

    constructor(public readonly account: Account,
                public readonly networkType: NetworkType,
                public readonly url: string,
                public readonly name: string,
                public readonly networkGenerationHash: string) {

    }

    toString(): string {
        return this.name + '-> \n\tNetwork:\t' + NetworkType[this.networkType] +
        ' \n\tUrl:\t\t' + this.url + ' \n\tGenerationHash:\t' + this.networkGenerationHash +
            ' \n\tAddress:\t' + this.account.address.plain() + ' \n\tPublicKey:\t' + this.account.publicKey +
            ' \n\tPrivateKey:\t' + this.account.privateKey + '\n';
    }
}
