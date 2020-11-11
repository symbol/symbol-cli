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

import { Cell } from 'cli-table3';
import { NetworkType, Transaction, TransactionType } from 'symbol-sdk';
import { Profile } from '../../../models/profile.model';
import { CellRecord } from './transaction.view';

export interface ITransactionHeaderView extends CellRecord {
    Title: Cell;
    Hash: string | undefined;
    'Max fee': string;
    'Height (Block)': string | undefined;
    Index: number | undefined;
    'Network type': string;
    Deadline: string;
    Signer: string | undefined;
}

export class TransactionHeaderView {
    /**
     * @static
     * @param {Transaction} transaction
     * @param {Profile} profile
     * @returns {ITransactionHeaderView}
     */
    static get(transaction: Transaction, profile: Profile | undefined): ITransactionHeaderView {
        return new TransactionHeaderView(transaction, profile).render();
    }

    /**
     * Creates an instance of TransactionHeaderView.
     * @param {Transaction} tx
     * @param {Profile} profile
     */
    private constructor(private readonly tx: Transaction, private readonly profile: Profile | undefined) {}

    /**
     * @private
     * @returns {ITransactionHeaderView}
     */
    private render(): ITransactionHeaderView {
        return {
            ['Title']: this.title,
            ['Hash']: this.tx.transactionInfo?.hash,
            ['Max fee']: this.tx.maxFee.compact().toLocaleString(),
            ['Height (Block)']: this.tx.transactionInfo?.height.compact().toLocaleString(),
            ['Index']: this.tx.transactionInfo?.index,
            ['Network type']: NetworkType[this.tx.networkType],
            ['Deadline']: this.formattedDeadline,
            ['Signer']: this.tx.signer?.address.pretty(),
        };
    }

    /**
     * Creates a full-width and vertically centered cell with the transaction type
     * @readonly
     * @protected
     * @type {Cell} Table title
     */
    protected get title(): Cell {
        return {
            content: TransactionType[this.tx.type],
            colSpan: 2,
            hAlign: 'center',
        };
    }

    /**
     * Human readable deadline
     * @readonly
     * @protected
     * @type {string}
     */
    protected get formattedDeadline(): string {
        const { deadline } = this.tx;
        const localDate = this.profile ? deadline.toLocalDateTime(this.profile.epochAdjustment).toLocalDate() : deadline.adjustedValue;
        return `${localDate} ${localDate}`;
    }
}
