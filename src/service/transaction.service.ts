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
    AggregateTransaction,
    LockFundsTransaction,
    ModifyMultisigAccountTransaction,
    MosaicDefinitionTransaction,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    MultisigCosignatoryModificationType,
    NamespaceType,
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
            transactionFormatted += 'TransferTransaction: recipient:' + transaction.recipient.pretty();
            transactionFormatted += transaction.message.payload.length > 0 ? ' message:\"' + transaction.message.payload + '\"' : '';
            if (transaction.mosaics.length > 0) {
                transactionFormatted += ' Mosaics: ';
                transaction.mosaics.map((mosaic) => {
                    transactionFormatted += mosaic.id.toHex() + ':' + mosaic.amount.compact() + ',';
                });
                transactionFormatted = transactionFormatted.substr(0, transactionFormatted.length - 1);
            }


        } else if (transaction instanceof RegisterNamespaceTransaction) {
            transactionFormatted += 'RegisterNamespaceTransaction: namespaceName:' + transaction.namespaceName;

            if (transaction.namespaceType === NamespaceType.RootNamespace && transaction.duration !== undefined) {
                transactionFormatted += ' namespaceType:RootNamespace duration:' + transaction.duration.compact();
            } else if (transaction.parentId !== undefined) {
                transactionFormatted += ' namespaceType:SubNamespace parentId:' + transaction.parentId.toHex();
            }

        } else if (transaction instanceof MosaicDefinitionTransaction) {
            transactionFormatted += 'MosaicDefinitionTransaction: ' +
            'mosaicName:' + transaction.mosaicName +
            ' duration:' + transaction.mosaicProperties.duration.compact() +
            ' divisibility:' + transaction.mosaicProperties.divisibility +
            ' supplyMutable:' + transaction.mosaicProperties.supplyMutable +
            ' transferable:' + transaction.mosaicProperties.transferable +
            ' levyMutable:' + transaction.mosaicProperties.levyMutable;

        } else if (transaction instanceof MosaicSupplyChangeTransaction) {
            transactionFormatted += 'MosaicSupplyChangeTransaction: ' +
            'mosaicId:' + transaction.mosaicId.toHex();
            transactionFormatted += ' direction:' + (transaction.direction === MosaicSupplyType.Increase ?
                    'IncreaseSupply' : 'DecreaseSupply');
            transactionFormatted += ' delta:' + transaction.delta.compact();

        } else if (transaction instanceof ModifyMultisigAccountTransaction) {
            transactionFormatted += 'ModifyMultisigAccountTransaction:' +
            ' minApprovalDelta:' + transaction.minApprovalDelta +
            ' minRemovalDelta:' + transaction.minRemovalDelta;

            transaction.modifications.map((modification) => {
                transactionFormatted += ' type:' +
                    (modification.type === MultisigCosignatoryModificationType.Add ? 'Add' : 'Remove');
                transactionFormatted += ' cosignatoryPublicAccount:' + modification.cosignatoryPublicAccount.address.pretty();
            });

        } else if (transaction instanceof AggregateTransaction) {
            transactionFormatted += 'AggregateTransaction: ';

            if (transaction.cosignatures.length > 0) {
                transactionFormatted += 'Cosignatures:';
            }

            transaction.cosignatures.map((cosignature) => {
                transactionFormatted += ' signer:' + cosignature.signer.address.pretty();
            });

            transaction.innerTransactions.map((innerTransaction) => {
                transactionFormatted += ' ' + this.formatTransactionToFilter(innerTransaction) + ' |';
            });
        } else if (transaction instanceof LockFundsTransaction) {
            transactionFormatted += 'LockFundsTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' Hash:' + transaction.hash;
        } else if (transaction instanceof SecretLockTransaction) {
            transactionFormatted += 'SecretLockTransaction: ' +
                'Mosaic:' + transaction.mosaic.id.toHex() + ':' + transaction.mosaic.amount.compact() +
                ' Duration:' + transaction.duration.compact() +
                ' HashType:' + (transaction.hashType === 0 ? 'SHA3_512' : ' unknown') +
                ' Secret:' + transaction.secret +
                ' Recipient:' + transaction.recipient.pretty();

        } else if (transaction instanceof SecretProofTransaction) {
            transactionFormatted += 'SecretProofTransaction: ' +
                'HashType:' + (transaction.hashType === 0 ? 'SHA3_512' : ' unknown') +
                ' Secret:' + transaction.secret +
                ' Proof:' + transaction.proof;
        }

        transactionFormatted += transaction.signer ? ' signer:' + transaction.signer.address.pretty() : '' +
            ' deadline:' + transaction.deadline.value.toLocalDate().toString();

        return transactionFormatted;
    }

}
