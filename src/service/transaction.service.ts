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
import {
    AccountLinkTransaction,
    Address,
    AddressAliasTransaction,
    AggregateTransaction,
    AliasActionType,
    LinkAction,
    LockFundsTransaction,
    ModifyAccountPropertyAddressTransaction,
    ModifyAccountPropertyEntityTypeTransaction,
    ModifyAccountPropertyMosaicTransaction,
    ModifyMultisigAccountTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicId,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    MultisigCosignatoryModificationType,
    NamespaceType,
    PropertyModificationType,
    PropertyType,
    RegisterNamespaceTransaction,
    SecretLockTransaction,
    SecretProofTransaction,
    Transaction,
    TransferTransaction,
} from 'nem2-sdk';

export class TransactionService {

    constructor() {

    }

    public formatTransactionToFilter(transaction: Transaction): string {
        let transactionFormatted = '';
        if (transaction instanceof TransferTransaction) {
            transactionFormatted += 'TransferTransaction: Recipient:';
            if (transaction.recipient instanceof Address) {
                transactionFormatted += transaction.recipient.pretty();
            } else {
                transactionFormatted += transaction.recipient.toHex();
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
        } else if (transaction instanceof RegisterNamespaceTransaction) {
            transactionFormatted += 'RegisterNamespaceTransaction: NamespaceName:' + transaction.namespaceName;

            if (transaction.namespaceType === NamespaceType.RootNamespace && transaction.duration !== undefined) {
                transactionFormatted += ' NamespaceType:RootNamespace Duration:' + transaction.duration.compact();
            } else if (transaction.parentId !== undefined) {
                transactionFormatted += ' NamespaceType:SubNamespace ParentId:' + transaction.parentId.toHex();
            }

        } else if (transaction instanceof MosaicDefinitionTransaction) {
            transactionFormatted += 'MosaicDefinitionTransaction: ' +
                'MosaicName:' + transaction.mosaicId.toHex();
            if (transaction.mosaicProperties.duration) {
                transactionFormatted += ' Duration:' + transaction.mosaicProperties.duration.compact();
            }
            transactionFormatted += ' Divisibility:' + transaction.mosaicProperties.divisibility +
                ' SupplyMutable:' + transaction.mosaicProperties.supplyMutable +
                ' Transferable:' + transaction.mosaicProperties.transferable;
        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            transactionFormatted += 'MosaicSupplyChangeTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex();
            transactionFormatted += ' Direction:' + (transaction.direction === MosaicSupplyType.Increase ?
                'IncreaseSupply' : 'DecreaseSupply');
            transactionFormatted += ' Delta:' + transaction.delta.compact();

        } else if (transaction instanceof ModifyMultisigAccountTransaction) {
            transactionFormatted += 'ModifyMultisigAccountTransaction:' +
                ' MinApprovalDelta:' + transaction.minApprovalDelta +
                ' MinRemovalDelta:' + transaction.minRemovalDelta;

            transaction.modifications.map((modification) => {
                transactionFormatted += ' Type:' +
                    (modification.type === MultisigCosignatoryModificationType.Add ? 'Add' : 'Remove');
                transactionFormatted += ' CosignatoryPublicAccount:' + modification.cosignatoryPublicAccount.address.pretty();
            });

        } else if (transaction instanceof AggregateTransaction) {
            transactionFormatted += 'AggregateTransaction: ';

            if (transaction.cosignatures.length > 0) {
                transactionFormatted += 'Cosignatures:';
            }

            transaction.cosignatures.map((cosignature) => {
                transactionFormatted += ' Signer:' + cosignature.signer.address.pretty();
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
                ' Recipient:' + transaction.recipient.pretty();

        } else if (transaction instanceof SecretProofTransaction) {
            transactionFormatted += 'SecretProofTransaction: ' +
                'HashType:' + transaction.hashType +
                ' Recipient:' + transaction.recipient.pretty() +
                ' Secret:' + transaction.secret +
                ' Proof:' + transaction.proof;
        } else if (transaction instanceof MosaicAliasTransaction) {
            transactionFormatted += 'MosaicAliasTransaction: ' +
                'AliasAction:' + AliasActionType[transaction.actionType] +
                ' MosaicId:' + transaction.mosaicId.toHex() +
                ' NamespaceId:' + transaction.namespaceId.toHex();
        } else if (transaction instanceof AddressAliasTransaction) {
            transactionFormatted += 'AddressAliasTransaction: ' +
                'AliasAction:' + AliasActionType[transaction.actionType] +
                ' Address:' + transaction.address.plain() +
                ' NamespaceId:' + transaction.namespaceId.toHex();
        } else if (transaction instanceof AccountLinkTransaction) {
            transactionFormatted += 'AccountLinkTransaction: ' +
                'LinkAction:' + LinkAction[transaction.linkAction] +
                ' RemoteAccountKey: ' + transaction.remoteAccountKey;
        } else if (transaction instanceof ModifyAccountPropertyAddressTransaction) {
            transactionFormatted += 'AccountPropertyAddressTransaction: ' +
                'PropertyType:' + PropertyType[transaction.propertyType] +
                ' Modifications: ';
            transaction.modifications.map((modification) => {
                transactionFormatted += ' [ModificationType:' + PropertyModificationType[modification.modificationType];
                transactionFormatted += ' Value: ' + modification.value;
                transactionFormatted += ' ]';
            });
        } else if (transaction instanceof ModifyAccountPropertyMosaicTransaction) {
            transactionFormatted += 'AccountPropertyMosaicTransaction: ' +
                'PropertyType:' + PropertyType[transaction.propertyType] +
                ' Modifications: ';
            transaction.modifications.map((modification) => {
                transactionFormatted += ' [ModificationType:' + PropertyModificationType[modification.modificationType];
                transactionFormatted += ' Value: ' + modification.value;
                transactionFormatted += ' ]';
            });
        } else if (transaction instanceof ModifyAccountPropertyEntityTypeTransaction) {
            transactionFormatted += 'AccountPropertyEntityTypeTransaction: ' +
                'PropertyType:' + PropertyType[transaction.propertyType] +
                ' Modifications: ';
            transaction.modifications.map((modification) => {
                transactionFormatted += ' [ModificationType:' + PropertyModificationType[modification.modificationType];
                transactionFormatted += ' Value: ' + modification.value;
                transactionFormatted += ' ]';
            });
        }
        transactionFormatted += (transaction.signer ? ' Signer:' + transaction.signer.address.pretty() : '') +
            ' Deadline:' + transaction.deadline.value.toLocalDate().toString() +
            (transaction.transactionInfo && transaction.transactionInfo.hash ? ' Hash:' + transaction.transactionInfo.hash : '');
        return transactionFormatted;
    }
}
