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
import {HorizontalTable} from 'cli-table3';
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

    constructor() {

    }

    public formatTransactionToFilter(transaction: Transaction): string {
        let transactionFormatted = '';
        if (transaction instanceof TransferTransaction) {
            transactionFormatted += 'TransferTransaction: RecipientAddress:';
            if (transaction.recipientAddress instanceof Address) {
                transactionFormatted += transaction.recipientAddress.pretty();
            } else {
                transactionFormatted += transaction.recipientAddress.toHex();
            }
            transactionFormatted += transaction.message.payload.length > 0 ? ' Message:\"' + transaction.message.payload + '\"' : '';
            if (transaction.mosaics.length > 0) {
                transactionFormatted += ' Mosaics: ';
                transaction.mosaics.map((mosaic) => {
                    if (mosaic.id instanceof MosaicId) {
                        transactionFormatted += 'MosaicId:';
                    } else {
                        transactionFormatted += 'NamespaceId:';
                    }
                    transactionFormatted += mosaic.id.toHex() + '::' + mosaic.amount.compact() + ',';
                });
                transactionFormatted = transactionFormatted.substr(0, transactionFormatted.length - 1);
            }
        } else if (transaction instanceof NamespaceRegistrationTransaction) {
            transactionFormatted += 'NamespaceRegistrationTransaction: NamespaceName:' + transaction.namespaceName;

            if (transaction.namespaceType === NamespaceRegistrationType.RootNamespace && transaction.duration !== undefined) {
                transactionFormatted += ' NamespaceRegistrationType:RootNamespace Duration:' + transaction.duration.compact();
            } else if (transaction.parentId !== undefined) {
                transactionFormatted += ' NamespaceRegistrationType:SubNamespace ParentId:' + transaction.parentId.toHex();
            }

        } else if (transaction instanceof MosaicDefinitionTransaction) {
            transactionFormatted += 'MosaicDefinitionTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex();
            if (transaction.duration) {
                transactionFormatted += ' Duration:' + transaction.duration.compact();
            }
            transactionFormatted += ' Divisibility:' + transaction.divisibility +
                ' SupplyMutable:' + transaction.flags.supplyMutable +
                ' Transferable:' + transaction.flags.transferable +
                ' Restrictable:' + transaction.flags.restrictable;
        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            transactionFormatted += 'MosaicSupplyChangeTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex();
            transactionFormatted += ' Direction:' + (transaction.direction === MosaicSupplyChangeAction.Increase ?
                'IncreaseSupply' : 'DecreaseSupply');
            transactionFormatted += ' Delta:' + transaction.delta.compact();

        } else if (transaction instanceof MultisigAccountModificationTransaction) {
            transactionFormatted += 'MultisigAccountModificationTransaction:' +
                ' MinApprovalDelta:' + transaction.minApprovalDelta +
                ' MinRemovalDelta:' + transaction.minRemovalDelta;

            transaction.modifications.map((modification) => {
                transactionFormatted += ' Type:' +
                    (modification.modificiationType === CosignatoryModificationAction.Add ? 'Add' : 'Remove');
                transactionFormatted += ' CosignatoryPublicAccount:' + modification.cosignatoryPublicAccount.address.pretty();
            });

        } else if (transaction instanceof AggregateTransaction) {
            transactionFormatted += 'AggregateTransaction: ';

            if (transaction.cosignatures.length > 0) {
                transactionFormatted += 'Cosignatures:';
            }

            transaction.cosignatures.map((cosignature) => {
                transactionFormatted += ' SignerPublicKey:' + cosignature.signer.address.pretty();
            });

            if (transaction.innerTransactions.length > 0) {
                transactionFormatted += ' InnerTransactions: [';
                transaction.innerTransactions.map((innerTransaction) => {
                    transactionFormatted += ' ' + this.formatTransactionToFilter(innerTransaction) + '';
                });
                transactionFormatted += ' ]';

            }
        } else if (transaction instanceof LockFundsTransaction) {
            transactionFormatted += 'LockFundsTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' Hash:' + transaction.hash;
        } else if (transaction instanceof SecretLockTransaction) {
            transactionFormatted += 'SecretLockTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' HashType:' + transaction.hashType +
                ' Secret:' + transaction.secret +
                ' RecipientAddress:' + transaction.recipientAddress.pretty();

        } else if (transaction instanceof SecretProofTransaction) {
            transactionFormatted += 'SecretProofTransaction: ' +
                'HashType:' + transaction.hashType +
                ' RecipientAddress:' + transaction.recipientAddress.pretty() +
                ' Secret:' + transaction.secret +
                ' Proof:' + transaction.proof;
        } else if (transaction instanceof MosaicAliasTransaction) {
            transactionFormatted += 'MosaicAliasTransaction: ' +
                'AliasAction:' + AliasAction[transaction.aliasAction] +
                ' MosaicId:' + transaction.mosaicId.toHex() +
                ' NamespaceId:' + transaction.namespaceId.toHex();
        } else if (transaction instanceof AddressAliasTransaction) {
            transactionFormatted += 'AddressAliasTransaction: ' +
                'AliasAction:' + AliasAction[transaction.aliasAction] +
                ' Address:' + transaction.address.plain() +
                ' NamespaceId:' + transaction.namespaceId.toHex();
        } else if (transaction instanceof AccountLinkTransaction) {
            transactionFormatted += 'AccountLinkTransaction: ' +
                'LinkAction:' + LinkAction[transaction.linkAction] +
                ' RemoteAccountKey: ' + transaction.remotePublicKey;
        } else if (transaction instanceof AccountAddressRestrictionTransaction) {
            transactionFormatted += 'AccountAddressRestrictionTransaction:' +
                ' AccountRestrictionType:' + AccountRestrictionType[transaction.restrictionType] +
                transaction.modifications.map((modification) => {
                    transactionFormatted += ' modificationAction:' +
                        (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                    transactionFormatted += 'value:' + modification.value;
                });
        } else if (transaction instanceof AccountMosaicRestrictionTransaction) {
            transactionFormatted += 'AccountMosaicRestrictionTransaction:' +
                ' AccountRestrictionType:' + AccountRestrictionType[transaction.restrictionType] +
                transaction.modifications.map((modification) => {
                    transactionFormatted += ' modificationAction:' +
                        (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                    transactionFormatted += 'value:' + modification.value;
                });
        } else if (transaction instanceof AccountOperationRestrictionTransaction) {
            transactionFormatted += 'AccountOperationRestrictionTransaction:' +
                ' AccountRestrictionType:' + AccountRestrictionType[transaction.restrictionType] +
                transaction.modifications.map((modification) => {
                    transactionFormatted += ' modificationAction:' +
                        (modification.modificationType === AccountRestrictionModificationAction.Add ? 'Add' : 'Remove');
                    transactionFormatted += 'value:' + modification.value;
                });
        }
        transactionFormatted += (transaction.signer ? ' SignerPublicKey:' + transaction.signer.address.pretty() : '') +
            ' Deadline:' + transaction.deadline.value.toLocalDate().toString() +
            (transaction.transactionInfo && transaction.transactionInfo.hash ? ' Hash:' + transaction.transactionInfo.hash : '');
        return transactionFormatted;
    }

    public formatTransactionStatus(status: TransactionStatus) {

        const table = new Table({
            style: {head: ['cyan']},
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
        if (status.height && status.height.compact() > 0 ) {
            table.push(
                ['Height', status.height.compact().toString()],
            );
        }
        text += table.toString();
        return text;
    }
}
