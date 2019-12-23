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
import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Address, EncryptedPrivateKey, NetworkType, Password, SimpleWallet} from 'nem2-sdk';

export interface AddressDTO {
    address: string;
    networkType: number;
}

export interface EncryptedPrivateKeyDTO {
    encryptedKey: string;
    iv: string;
}

export interface SimpleWalletDTO {
    name: string;
    network: number;
    address: AddressDTO;
    creationDate: string;
    schema: string;
    encryptedPrivateKey: EncryptedPrivateKeyDTO;
}

export interface AccountDTO {
    simpleWallet: SimpleWalletDTO;
    url: string;
    networkGenerationHash: string;
}

export class Profile {
    private readonly table: HorizontalTable;

    public static createFromDTO(DTO: AccountDTO): Profile {
        const simpleWallet = new SimpleWallet(
            DTO.simpleWallet.name,
            DTO.simpleWallet.network,
            Address.createFromRawAddress(DTO.simpleWallet.address.address),
            // @ts-ignore
            DTO.simpleWallet.creationDate,
            new EncryptedPrivateKey(
                DTO.simpleWallet.encryptedPrivateKey.encryptedKey,
                DTO.simpleWallet.encryptedPrivateKey.iv,
            ),
        );

        return new Profile(
            simpleWallet,
            DTO.url,
            DTO.networkGenerationHash,
        );
    }

    constructor(public readonly simpleWallet: SimpleWallet,
                public readonly url: string,
                public readonly networkGenerationHash: string) {

        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Name', this.simpleWallet.name],
            ['Network', NetworkType[this.simpleWallet.network]],
            ['Node URL', this.url],
            ['Generation Hash', this.networkGenerationHash],
            ['Address', this.simpleWallet.address.pretty()],
        );
    }

    get address(): Address {
        return this.simpleWallet.address;
    }

    get networkType(): NetworkType {
        return this.simpleWallet.network;
    }

    get name(): string {
        return this.simpleWallet.name;
    }

    toString(): string {
        return this.table.toString();
    }

    public isPasswordValid(password: Password): boolean {
        try {
            this.simpleWallet.open(password);
            return true;
        } catch (error) {
            return false;
        }
    }
}
