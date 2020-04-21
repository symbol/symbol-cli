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
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {ExpectedError} from 'clime'
import {Account, Address, ISimpleWalletDTO, NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {NetworkCurrency, NetworkCurrencyDTO} from './networkCurrency.model'

export const CURRENT_PROFILE_VERSION = 2

/**
 * Profile data transfer object.
 */
interface ProfileDTO {
    simpleWallet: ISimpleWalletDTO;
    url: string;
    networkGenerationHash: string;
    networkCurrency: NetworkCurrencyDTO;
    version: number;
    default: '0' | '1';
}

/**
 * Profile DTO mapped by profile names
 */
export type ProfileRecord = Record<string, ProfileDTO>

/**
 * Profile model.
 */
export class Profile {
    private readonly table: HorizontalTable

    /**
     * Constructor.
     * @param {SimpleWallet} simpleWallet - Wallet credentials.
     * @param {string} url - Node URL.
     * @param {string} networkGenerationHash - Network generation hash.
     */
    constructor(public readonly simpleWallet: SimpleWallet,
                public readonly url: string,
                public readonly networkGenerationHash: string,
                public readonly networkCurrency: NetworkCurrency,
                public readonly version: number,
    ) {
        const {namespaceId, divisibility} = networkCurrency

        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable

        this.table.push(
            ['Name', this.simpleWallet.name],
            ['Address', this.simpleWallet.address.pretty()],
            ['Network', NetworkType[this.simpleWallet.networkType]],
            ['Node URL', this.url],
            ['Generation Hash', this.networkGenerationHash],
            ['NetworkCurrency', `name: ${namespaceId.fullName}, divisibility: ${divisibility}`],
        )
    }

    /**
     * Gets profile address.
     * @returns {Address}
     */
    get address(): Address {
        return this.simpleWallet.address
    }

    /**
     * Gets profile network type.
     * @returns {NetworkType}
     */
    get networkType(): NetworkType {
        return this.simpleWallet.networkType
    }

    /**
     * Gets profile name.
     * @returns {string}
     */
    get name(): string {
        return this.simpleWallet.name
    }

    /**
     * Creates a profile object.
     * @param {ProfileDTO} profileDTO
     * @returns {Profile}
     */
    public static createFromDTO(profileDTO: ProfileDTO): Profile {
        return new Profile(
            SimpleWallet.createFromDTO(profileDTO.simpleWallet),
            profileDTO.url,
            profileDTO.networkGenerationHash,
            NetworkCurrency.createFromDTO(profileDTO.networkCurrency),
            profileDTO.version,
        )
    }

    /**
     * Formats profile as a string.
     * @returns {string}
     */
    toString(): string {
        return this.table.toString()
    }

    /**
     * Returns true if the password is valid.
     * @param {Password} password.
     * @returns {boolean}
     */
    isPasswordValid(password: Password): boolean {
        try {
            this.simpleWallet.open(password)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Opens a wallet.
     * @param {Password} options - The  attribute "password" should contain the profile's password.
     * @throws {ExpectedError}
     * @returns {Account}
     */
    decrypt(password: Password): Account {
        if (!this.isPasswordValid(password)) {
            throw new ExpectedError('The password provided does not match your account password')
        }
        return this.simpleWallet.open(password)
    }
}
