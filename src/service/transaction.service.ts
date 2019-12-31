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
import {
    AccountAddressRestrictionTransaction,
    AccountLinkTransaction,
    AccountMetadataTransaction,
    AccountMosaicRestrictionTransaction,
    AccountOperationRestrictionTransaction,
    AccountRestrictionFlags,
    Address,
    AddressAliasTransaction,
    AggregateTransaction,
    AggregateTransactionCosignature,
    AliasAction,
    InnerTransaction,
    LinkAction,
    LockFundsTransaction,
    Mosaic,
    MosaicAddressRestrictionTransaction,
    MosaicAliasTransaction,
    MosaicDefinitionTransaction,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    MosaicMetadataTransaction,
    MosaicRestrictionType,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    MultisigAccountModificationTransaction,
    NamespaceMetadataTransaction,
    NamespaceRegistrationTransaction,
    NamespaceRegistrationType,
    PublicAccount,
    SecretLockTransaction,
    SecretProofTransaction,
    Transaction,
    TransferTransaction,
} from 'nem2-sdk';

/**
 * Transaction service
 */
export class TransactionService {

    /**
     * Constructor
     */
    constructor() {}

    /**
     * Format a transaction to string.
     * @param {transaction} transaction -  Transaction object to format.
     * @returns {string}
     */
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
                transaction.mosaics.map((mosaic: Mosaic) => {
                    if (mosaic.id instanceof MosaicId) {
                        transactionFormatted += 'MosaicId:';
                    } else {
                        transactionFormatted += 'NamespaceId:';
                    }
                    transactionFormatted += mosaic.id.toHex() + '::' + mosaic.amount.toString() + ',';
                });
                transactionFormatted = transactionFormatted.substr(0, transactionFormatted.length - 1);
            }
        } else if (transaction instanceof NamespaceRegistrationTransaction) {
            transactionFormatted += 'NamespaceRegistrationTransaction: NamespaceName:' + transaction.namespaceName;
            if (transaction.registrationType === NamespaceRegistrationType.RootNamespace && transaction.duration !== undefined) {
                transactionFormatted += ' NamespaceRegistrationType:RootNamespace Duration:' + transaction.duration.toString();
            } else if (transaction.parentId !== undefined) {
                transactionFormatted += ' NamespaceRegistrationType:SubNamespace ParentId:' + transaction.parentId.toHex();
            }
        } else if (transaction instanceof MosaicDefinitionTransaction) {
            transactionFormatted += 'MosaicDefinitionTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex();
            if (transaction.duration) {
                transactionFormatted += ' Duration:' + transaction.duration.toString();
            }
            transactionFormatted += ' Divisibility:' + transaction.divisibility +
                ' SupplyMutable:' + transaction.flags.supplyMutable +
                ' Transferable:' + transaction.flags.transferable +
                ' Restrictable:' + transaction.flags.restrictable;
        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            transactionFormatted += 'MosaicSupplyChangeTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex();
            transactionFormatted += ' Direction:' + (transaction.action === MosaicSupplyChangeAction.Increase ?
                'IncreaseSupply' : 'DecreaseSupply');
            transactionFormatted += ' Delta:' + transaction.delta.toString();

        } else if (transaction instanceof MultisigAccountModificationTransaction) {
            transactionFormatted += 'MultisigAccountModificationTransaction:' +
                ' MinApprovalDelta:' + transaction.minApprovalDelta +
                ' MinRemovalDelta:' + transaction.minRemovalDelta;
            transactionFormatted += ' PublicKeyAdditions:';
            transaction.publicKeyAdditions.map((account: PublicAccount) => {
                transactionFormatted += ' CosignatoryAddress:' + account.address.pretty();
            });
            transactionFormatted += ' PublicKeyDeletions:';
            transaction.publicKeyDeletions.map((account: PublicAccount) => {
                transactionFormatted += ' CosignatoryAddress:' + account.address.pretty();
            });
        } else if (transaction instanceof AggregateTransaction) {
            transactionFormatted += 'AggregateTransaction: ';
            if (transaction.cosignatures.length > 0) {
                transactionFormatted += 'Cosignatures:';
            }
            transaction.cosignatures.map((cosignature: AggregateTransactionCosignature) => {
                transactionFormatted += ' SignerPublicKey:' + cosignature.signer.address.pretty();
            });
            if (transaction.innerTransactions.length > 0) {
                transactionFormatted += ' InnerTransactions: [';
                transaction.innerTransactions.map((innerTransaction: InnerTransaction) => {
                    transactionFormatted += ' ' + this.formatTransactionToFilter(innerTransaction) + '';
                });
                transactionFormatted += ' ]';
            }
        } else if (transaction instanceof LockFundsTransaction) {
            transactionFormatted += 'LockFundsTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.toString() +
                ' Duration:' + transaction.duration.toString() +
                ' Hash:' + transaction.hash;
        } else if (transaction instanceof SecretLockTransaction) {
            transactionFormatted += 'SecretLockTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.toString() +
                ' Duration:' + transaction.duration.toString() +
                ' HashType:' + transaction.hashType +
                ' Secret:' + transaction.secret +
                ' RecipientAddress:' +
                (transaction.recipientAddress instanceof Address ?
                    transaction.recipientAddress.pretty() : transaction.recipientAddress.toHex());
        } else if (transaction instanceof SecretProofTransaction) {
            transactionFormatted += 'SecretProofTransaction: ' +
                'HashType:' + transaction.hashType +
                ' RecipientAddress:' + (transaction.recipientAddress instanceof Address ?
                    transaction.recipientAddress.pretty() : transaction.recipientAddress.toHex()) +
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
                ' Address:' + transaction.address.pretty() +
                ' NamespaceId:' + transaction.namespaceId.toHex();
        } else if (transaction instanceof AccountLinkTransaction) {
            transactionFormatted += 'AccountLinkTransaction: ' +
                'LinkAction:' + LinkAction[transaction.linkAction] +
                ' RemoteAccountKey: ' + transaction.remotePublicKey;
        } else if (transaction instanceof AccountAddressRestrictionTransaction) {
            transactionFormatted += 'AccountAddressRestrictionTransaction:' +
                ' AccountRestrictionFlags:' + AccountRestrictionFlags[transaction.restrictionFlags];
            transactionFormatted += ' RestrictionAdditions:';
            transaction.restrictionAdditions.map((account) => {
                transactionFormatted += ' Address:' + (account instanceof Address ?
                    account.pretty() : account.toHex());
            });
            transactionFormatted += ' RestrictionDeletions:';
            transaction.restrictionDeletions.map((account) => {
                transactionFormatted += ' RestrictionDeletions:' + (account instanceof Address ?
                    account.pretty() : account.toHex());
            });
        } else if (transaction instanceof AccountMosaicRestrictionTransaction) {
            transactionFormatted += 'AccountMosaicRestrictionTransaction:' +
                ' AccountRestrictionFlags:' + AccountRestrictionFlags[transaction.restrictionFlags];
            transactionFormatted += ' RestrictionAdditions:';
            transaction.restrictionAdditions.map((mosaic) => {
                transactionFormatted += ' Mosaic:' + mosaic.toHex();
            });
            transactionFormatted += ' RestrictionDeletions:';
            transaction.restrictionDeletions.map((mosaic) => {
                transactionFormatted += ' Mosaic:' + mosaic.toHex();
            });
        } else if (transaction instanceof AccountOperationRestrictionTransaction) {
            transactionFormatted += 'AccountOperationRestrictionTransaction:' +
                ' AccountRestrictionFlags:' + AccountRestrictionFlags[transaction.restrictionFlags];
            transactionFormatted += ' RestrictionAdditions:';
            transaction.restrictionAdditions.map((transactionType) => {
                transactionFormatted += ' TransactionType:' + transactionType;
            });
            transactionFormatted += ' RestrictionDeletions:';
            transaction.restrictionDeletions.map((transactionType) => {
                transactionFormatted += ' TransactionType:' + transactionType;
            });
        } else if (transaction instanceof MosaicGlobalRestrictionTransaction) {
            transactionFormatted += 'MosaicGlobalRestrictionTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex() +
                ' ReferenceMosaicId:' + transaction.referenceMosaicId.toHex() +
                ' RestrictionKey:' + transaction.restrictionKey.toHex() +
                ' PreviousRestrictionValue:' + transaction.previousRestrictionValue.toString() +
                ' PreviousRestrictionType:' + MosaicRestrictionType[transaction.previousRestrictionType] +
                ' NewRestrictionValue:' + transaction.newRestrictionValue.toString() +
                ' NewRestrictionType:' + MosaicRestrictionType[transaction.newRestrictionType];
        } else if (transaction instanceof MosaicAddressRestrictionTransaction) {
            transactionFormatted += 'MosaicAddressRestrictionTransaction: ' +
                'MosaicId:' + transaction.mosaicId.toHex() +
                ' RestrictionKey:' + transaction.restrictionKey.toHex() +
                ' TargetAddress:' + (transaction.targetAddress instanceof Address ?
                    transaction.targetAddress.pretty() : transaction.targetAddress.toHex()) +
                ' PreviousRestrictionValue:' + transaction.previousRestrictionValue.toString() +
                ' NewRestrictionValue:' + transaction.newRestrictionValue.toString();
        } else if (transaction instanceof AccountMetadataTransaction) {
            transactionFormatted += 'AccountMetadataTransaction: ' +
                'TargetPublicKey:' + transaction.targetPublicKey +
                ' ScopedMetadataKey:' + transaction.scopedMetadataKey.toHex() +
                ' ValueSizeDelta:' + transaction.valueSizeDelta.toString() +
                ' Value:' + transaction.value;
        } else if (transaction instanceof MosaicMetadataTransaction) {
            transactionFormatted += 'MosaicMetadataTransaction: ' +
                'TargetPublicKey:' + transaction.targetPublicKey +
                ' ScopedMetadataKey:' + transaction.scopedMetadataKey.toHex() +
                ' TargetMosaicId:' + transaction.targetMosaicId.toHex() +
                ' ValueSizeDelta:' + transaction.valueSizeDelta.toString() +
                ' Value:' + transaction.value;
        } else if (transaction instanceof NamespaceMetadataTransaction) {
            transactionFormatted += 'NamespaceMetadataTransaction: ' +
                'TargetPublicKey:' + transaction.targetPublicKey +
                ' ScopedMetadataKey:' + transaction.scopedMetadataKey.toHex() +
                ' TargetNamespaceId:' + transaction.targetNamespaceId.toHex() +
                ' ValueSizeDelta:' + transaction.valueSizeDelta.toString() +
                ' Value:' + transaction.value;
        }
        transactionFormatted += (transaction.signer ? ' SignerPublicKey:' + transaction.signer.address.pretty() : '') +
            ' Deadline:' + transaction.deadline.value.toLocalDate().toString() +
            (transaction.transactionInfo && transaction.transactionInfo.hash ? ' Hash:' + transaction.transactionInfo.hash : '');
        return transactionFormatted;
    }

}
