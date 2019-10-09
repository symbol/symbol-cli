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
import * as Table from 'cli-table3';
import { HorizontalTable } from 'cli-table3';
import {
    AccountAddressRestrictionTransaction,
    AccountLinkTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    AccountRestrictionModificationAction,
    AccountRestrictionType,
    Address,
    AddressAliasTransaction,
    AggregateTransaction,
    AliasAction,
    CosignatoryModificationAction,
    LinkAction,
    LockFundsTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicId,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    MultisigAccountModificationTransaction,
    NamespaceRegistrationTransaction,
    NamespaceRegistrationType,
    SecretLockTransaction,
    SecretProofTransaction,
    Transaction,
    TransactionStatus,
    TransferTransaction,
} from 'nem2-sdk';

export class TransactionService {
    private table: HorizontalTable;
    constructor() {

    }

    public formatTransactionToFilter(transaction: Transaction): string {
        let transactionFormatted = '';
        const propertyList: any[] = [];
        if (transaction instanceof TransferTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['RecipientAddress', 'Message', 'Mosaics', 'SignerPublicKey', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'TransferTransaction:\n';
            if (transaction.recipientAddress instanceof Address) {
                propertyList[0] = transaction.recipientAddress.pretty();
            } else {
                propertyList[0] = transaction.recipientAddress.toHex();
            }
            propertyList[1] = transaction.message.payload.length > 0 ? ' Message:\"' + transaction.message.payload + '\"' : '';
            if (transaction.mosaics.length > 0) {
                let mosaicText = '';
                transaction.mosaics.map((mosaic) => {
                    if (mosaic.id instanceof MosaicId) {
                        mosaicText += 'MosaicId:';
                    } else {
                        mosaicText += 'NamespaceId:';
                    }
                    mosaicText += mosaic.id.toHex() + '::' + mosaic.amount.compact() + ',';
                });
                mosaicText = mosaicText.substr(0, mosaicText.length - 1);
                propertyList[2] = mosaicText;
            }
        } else if (transaction instanceof NamespaceRegistrationTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['NamespaceName', 'NamespaceRegistrationType', 'Duration', 'ParentId', 'Deadline', 'Hash'],
            }) as HorizontalTable;
            transactionFormatted += 'NamespaceRegistrationTransaction:\n';
            propertyList[0] = transaction.namespaceName;

            if (transaction.registrationType === NamespaceRegistrationType.RootNamespace && transaction.duration !== undefined) {
                propertyList[1] = 'RootNamespace';
                propertyList[2] = transaction.duration.compact();
            } else if (transaction.parentId !== undefined) {
                propertyList[1] = 'SubNamespace';
                propertyList[3] = transaction.parentId.toHex();
            }

        } else if (transaction instanceof MosaicDefinitionTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['MosaicId', 'Duration', 'Divisibility', 'SupplyMutable', 'Transferable', 'Restrictable', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'MosaicDefinitionTransaction:\n';
            propertyList[0] = transaction.mosaicId.toHex();
            if (transaction.duration) {
                propertyList[1] = transaction.duration.compact();
            }
            propertyList[2] = transaction.divisibility;
            propertyList[3] = transaction.flags.supplyMutable;
            propertyList[4] = transaction.flags.transferable;
            propertyList[5] = transaction.flags.restrictable;
        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['MosaicId', 'Direction', 'Delta', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'MosaicSupplyChangeTransaction:\n';
            propertyList[0] = transaction.mosaicId.toHex();
            propertyList[1] = transaction.direction === MosaicSupplyChangeAction.Increase ?
                'IncreaseSupply' : 'DecreaseSupply';
            propertyList[2] = transaction.delta.compact();
        } else if (transaction instanceof MultisigAccountModificationTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['MinApprovalDelta', 'MinRemovalDelta', 'Type', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'MultisigAccountModificationTransaction:\n';
            propertyList[0] = transaction.minApprovalDelta;
            propertyList[1] = transaction.minRemovalDelta;
            propertyList[2] = '';
            transaction.modifications.map((modification) => {
                propertyList[2] += 'Type: ' +
                    (modification.modificiationType === CosignatoryModificationAction.Add ? 'Add' : 'Remove');
                propertyList[2] += 'CosignatoryPublicAccount: ' + modification.cosignatoryPublicAccount.address.pretty() + '\n';
            });

        } else if (transaction instanceof AggregateTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['Cosignatures', 'InnerTransactions', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AggregateTransaction:\n';
            propertyList[0] = '';
            transaction.cosignatures.map((cosignature) => {
                propertyList[0] += 'SignerPublicKey:' + cosignature.signer.address.pretty();
            });

            propertyList[1] = '[ ';
            transaction.innerTransactions.map((innerTransaction) => {
                propertyList[1] += ' ' + this.formatTransactionToFilter(innerTransaction);
            });
            propertyList[1] += ' ]';
        } else if (transaction instanceof LockFundsTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['Mosaic', 'Duration', 'Hash', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'LockFundsTransaction:\n';
            propertyList[0] = transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact();
            propertyList[1] = transaction.duration.compact();
            propertyList[2] = transaction.hash;
        } else if (transaction instanceof SecretLockTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['Mosaic', 'Duration', 'HashType', 'Secret', 'RecipientAddress', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'SecretLockTransaction:\n';
            propertyList[0] = transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact();
            propertyList[1] = transaction.duration.compact();
            propertyList[2] = transaction.hashType;
            propertyList[3] = transaction.secret;
            propertyList[4] = transaction.recipientAddress.pretty();
        } else if (transaction instanceof SecretProofTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['HashType', 'RecipientAddress', 'Secret', 'Proof', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'SecretProofTransaction: ';
            propertyList[0] = transaction.hashType;
            propertyList[1] = transaction.recipientAddress.pretty();
            propertyList[2] = transaction.secret;
            propertyList[3] = transaction.proof;
        } else if (transaction instanceof MosaicAliasTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['AliasAction', 'MosaicId', 'NamespaceId', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'MosaicAliasTransaction:\n';
            propertyList[0] = AliasAction[transaction.aliasAction];
            propertyList[1] = transaction.mosaicId.toHex();
            propertyList[2] = transaction.namespaceId.toHex();
        } else if (transaction instanceof AddressAliasTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['AliasAction', 'Address', 'NamespaceId', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AddressAliasTransaction: \n';
            propertyList[0] = AliasAction[transaction.aliasAction];
            propertyList[1] = transaction.address.pretty();
            propertyList[2] = transaction.namespaceId.toHex();
        } else if (transaction instanceof AccountLinkTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['LinkAction', 'RemoteAccountKey', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AccountLinkTransaction:\n';
            propertyList[0] = LinkAction[transaction.linkAction];
            propertyList[1] = transaction.remotePublicKey;
        } else if (transaction instanceof AccountAddressRestrictionTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['AccountRestrictionType', 'modifications', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AccountAddressRestrictionTransaction:\n';
            propertyList[0] = AccountRestrictionType[transaction.restrictionType];
            propertyList[1] = '';
            transaction.modifications.map((modification) => {
                propertyList[1] += ' modificationAction:' +
                    (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                propertyList[1] += 'value:' + modification.value + ' ';
            });
        } else if (transaction instanceof AccountMosaicRestrictionTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['AccountRestrictionType', 'modifications', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AccountMosaicRestrictionTransaction:\n';
            propertyList[0] = AccountRestrictionType[transaction.restrictionType];
            propertyList[1] = '';
            transaction.modifications.map((modification) => {
                propertyList[1] += ' modificationAction:' +
                    (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                propertyList[1] += 'value:' + modification.value;
            });
        } else if (transaction instanceof AccountOperationRestrictionTransaction) {
            this.table = new Table({
                style: { head: ['cyan'] },
                head: ['AccountRestrictionType', 'modifications', 'Deadline', 'Hash'],
            }) as HorizontalTable;

            transactionFormatted += 'AccountOperationRestrictionTransaction:\n';
            propertyList[0] = AccountRestrictionType[transaction.restrictionType];
            propertyList[1] = '';
            transaction.modifications.map((modification) => {
                propertyList[1] += ' modificationAction:' +
                    (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                propertyList[1] += 'value:' + modification.value;
            });
        }
        propertyList.push(transaction.signer ? transaction.signer.address.pretty() : '');
        propertyList.push(transaction.deadline.value.toLocalDate().toString());
        propertyList.push(transaction.transactionInfo && transaction.transactionInfo.hash ? transaction.transactionInfo.hash : '');
        // this.table.push(propertyList);
        console.log(propertyList);
        transactionFormatted += this.table.toString();
        return transactionFormatted;
    }

    public formatTransactionStatus(status: TransactionStatus) {

        const table = new Table({
            style: { head: ['cyan'] },
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        let text = '';
        text += '\n\n' + chalk.green('Transaction Status') + '\n';
        table.push(
            ['Group', status.group],
            ['Status', status.status],
            ['Hash', status.hash],
        );
        if (status.deadline) {
            table.push(
                ['Deadline', status.deadline.value.toString()],
            );
        }
        if (status.height && status.height.compact() > 0) {
            table.push(
                ['Height', status.height.compact().toString()],
            );
        }
        text += table.toString();
        return text;
    }
}
