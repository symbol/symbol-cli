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
import {ExpectedError} from 'clime';
import {Account, Address, NetworkType, Password, SimpleWallet} from 'nem2-sdk';
import {ISimpleWalletDTO} from 'nem2-sdk/dist/src/infrastructure/wallet/simpleWalletDTO';
import * as readlineSync from 'readline-sync';
import {ProfileOptions} from '../profile.command';
import {PasswordValidator} from '../validators/password.validator';

interface ProfileDTO {
    simpleWallet: ISimpleWalletDTO;
    url: string;
    networkGenerationHash: string;
}

export class Profile {
    private readonly table: HorizontalTable;

    public static createFromDTO(profileDTO: ProfileDTO): Profile {
        return new Profile(
            SimpleWallet.createFromDTO(profileDTO.simpleWallet),
            profileDTO.url,
            profileDTO.networkGenerationHash,
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

    isPasswordValid(password: Password): boolean {
        try {
            this.simpleWallet.open(password);
            return true;
        } catch (error) {
            return false;
        }
    }

    decrypt(options: ProfileOptions): Account {
        const password = options.password || readlineSync.question('Enter your wallet password: ');
        new PasswordValidator().validate(password);
        const passwordObject = new Password(password);

        if (!this.isPasswordValid(passwordObject)) {
            throw new ExpectedError('The password you provided does not match your account password');
        }

        return this.simpleWallet.open(passwordObject);
    }
}
