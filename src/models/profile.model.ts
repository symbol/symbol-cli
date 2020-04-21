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
import {Account, Address, NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {ExpectedError} from 'clime'
import {HorizontalTable} from 'cli-table3'
import * as Table from 'cli-table3'

import {NetworkCurrency} from './networkCurrency.model'
import {ProfileDTO} from './profileDTO.types'

export const CURRENT_PROFILE_VERSION = 3

/**
 * Profile DTO mapped by profile names
 */
export type ProfileRecord = Record<string, ProfileDTO>

/**
 * Profile types.
 */
export type ProfileType = 'PrivateKey' | 'HD'

/**
 * Base implementation of the Profile models
 * @export
 * @abstract
 * @class Profile
 */
export abstract class Profile {
    /**
     * View of the profile properties
     * @protected
     * @type {HorizontalTable}
     */
    protected table: HorizontalTable

    /**
     * Creates an instance of Profile.
     * @param {SimpleWallet} simpleWallet
     * @param {string} url
     * @param {string} networkGenerationHash
     * @param {NetworkCurrency} networkCurrency
     * @param {number} version
     * @param {ProfileType} type
     * @param {('0' | '1')} isDefault
     */
    protected constructor(
        public readonly simpleWallet: SimpleWallet,
        public readonly url: string,
        public readonly networkGenerationHash: string,
        public readonly networkCurrency: NetworkCurrency,
        public readonly version: number,
        public readonly type: ProfileType,
        public readonly isDefault: '0' | '1',
    ) { }

    /**
     * returns a table with the properties common to all profiles
     * @protected
     * @returns {HorizontalTable}
     */
    protected getBaseTable(): HorizontalTable {
        const {namespaceId, divisibility} = this.networkCurrency
        const table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable

        table.push(
            ['Name', this.simpleWallet.name],
            ['Address', this.simpleWallet.address.pretty()],
            ['Network', NetworkType[this.simpleWallet.networkType]],
            ['Node URL', this.url],
            ['Generation Hash', this.networkGenerationHash],
            ['Network Currency', `name: ${namespaceId.fullName}, divisibility: ${divisibility}`],
            ['Profile type', this.type],
        )

        return table
    }

    /**
     * Gets profile address.
     * @returns {Address}
     */
    public get address(): Address {
        return this.simpleWallet.address
    }

    /**
     * Gets profile network type.
     * @returns {NetworkType}
     */
    public get networkType(): NetworkType {
        return this.simpleWallet.networkType
    }

    /**
     * Gets profile name.
     * @returns {string}
     */
    public get name(): string {
        return this.simpleWallet.name
    }

    /**
     * Returns a profile DTO
     * @returns {ProfileDTO}
     */
    public toDTO(): ProfileDTO {
        throw new Error('toDTO should be implemented in extended classes')
    }

    /**
     * Formats profile as a string.
     * @returns {string}
     */
    public toString(): string {
        return this.table.toString()
    }

    /**
     * Returns true if the password is valid.
     * @param {Password} password.
     * @returns {boolean}
     */
    public isPasswordValid(password: Password): boolean {
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
    public decrypt(password: Password): Account {
        if (!this.isPasswordValid(password)) {
            throw new ExpectedError('The password provided does not match your account password')
        }
        return this.simpleWallet.open(password)
    }
}
