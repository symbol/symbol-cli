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
import {HorizontalTable} from 'cli-table3';
import * as Table from 'cli-table3';
import {
    Address,
    AddressAlias,
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
    ReceiptType,
    ResolutionEntry,
    ResolutionStatement,
    TransactionStatement,
} from 'nem2-sdk';

export class ReceiptService {
    private transactionStatementsTable: HorizontalTable;
    private addressResolutionStatementsTable: HorizontalTable;
    private mosaicResolutionStatementsTable: HorizontalTable;
    constructor() {
        this.transactionStatementsTable = new Table({
            style: {head: ['cyan']},
            head: ['Version', 'Type', 'RecipientAddress', 'SenderPublickey', 'TargetPublicKey', 'MosaicId', 'Amount'],
        }) as HorizontalTable;

        this.addressResolutionStatementsTable = new Table({
            style: {head: ['cyan']},
            head: ['Resolved', 'PrimaryId', 'SecondaryId'],
        }) as HorizontalTable;

        this.mosaicResolutionStatementsTable = new Table({
            style: {head: ['cyan']},
            head: ['Resolved', 'PrimaryId', 'SecondaryId'],
        }) as HorizontalTable;
    }

    /**
     * @description The logic of formatting transactionStatements
     * @param statement
     * @returns {string}
     */
    public formatTransactionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('transactionStatements:\t') + '\n';
        statement.transactionStatements.map((transaction: TransactionStatement, transactionIndex: number) => {
            transaction.receipts.map((receipt: any, receiptIndex: number) => {
                if (receipt instanceof BalanceTransferReceipt) {
                    this.transactionStatementsTable.push([
                        receipt.version as Table.CellOptions,
                        ReceiptType[receipt.type],
                        (receipt.recipientAddress instanceof Address ?
                            receipt.recipientAddress.pretty() : receipt.recipientAddress.toHex()),
                        receipt.sender.publicKey,
                        '',
                        '[ ' + receipt.mosaicId.id.lower + ', ' + receipt.mosaicId.id.higher + ' ]',
                        receipt.amount.compact(),
                    ]);
                } else if (receipt instanceof BalanceChangeReceipt) {
                    this.transactionStatementsTable.push([
                        receipt.version as Table.CellOptions,
                        ReceiptType[receipt.type],
                        '',
                        '',
                        receipt.targetPublicAccount.publicKey,
                        '[ ' + receipt.mosaicId.id.lower + ', ' + receipt.mosaicId.id.higher + ' ]',
                        receipt.amount.compact(),
                    ]);
                }  else if (receipt instanceof ArtifactExpiryReceipt) {
                    this.transactionStatementsTable.push([
                        receipt.version as Table.CellOptions,
                        ReceiptType[receipt.type],
                        '',
                        '',
                        '',
                        '[ ' + receipt.artifactId.id.lower + ', ' + receipt.artifactId.id.higher + ' ]',
                        '',
                    ]);
                }  else if (receipt instanceof InflationReceipt) {
                    this.transactionStatementsTable.push([
                        receipt.version as Table.CellOptions,
                        ReceiptType[receipt.type],
                        '',
                        '',
                        '',
                        '[ ' + receipt.mosaicId.id.lower + ', ' + receipt.mosaicId.id.higher + ' ]',
                        receipt.amount.compact(),
                    ]);
                }
            });
        });
        txt += this.transactionStatementsTable.toString() + '\n\n';
        return txt;
    }

    /**
     * @description The logic of formatting addressResolutionStatements
     * @param statement
     * @returns {string}
     */
    public formatAddressResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('addressResolutionStatements:\t') + '\n';
        statement.addressResolutionStatements.map((addressResolution: ResolutionStatement, addressResolutionIndex: number) => {
            addressResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                this.addressResolutionStatementsTable.push([
                    resolutionEntry.resolved instanceof AddressAlias ?
                        resolutionEntry.resolved.address.pretty() : resolutionEntry.resolved.mosaicId.toHex(),
                    resolutionEntry.source.primaryId,
                    resolutionEntry.source.secondaryId,
                ]);
            });
        });
        txt += this.addressResolutionStatementsTable.toString() + '\n\n';
        return txt;
    }

    /**
     * @description The logic of formatting mosaicResolutionStatements
     * @param statement
     * @return {string}
     */
    public formatMosaicResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('mosaicResolutionStatements:\t') + '\n';
        statement.mosaicResolutionStatements.map((mosaicResolution: ResolutionStatement, mosaicResolutionIndex: number) => {
            mosaicResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                this.mosaicResolutionStatementsTable.push([
                    resolutionEntry.resolved instanceof AddressAlias ?
                        resolutionEntry.resolved.address.pretty() : resolutionEntry.resolved.mosaicId.toHex(),
                    resolutionEntry.source.primaryId,
                    resolutionEntry.source.secondaryId,
                ]);
            });
        });
        txt += this.mosaicResolutionStatementsTable.toString() + '\n\n';
        return txt;
    }
}
