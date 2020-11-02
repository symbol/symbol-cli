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

import { Transaction, TransactionType } from 'symbol-sdk';

import {
    AccountAddressRestrictionView,
    AccountKeyLinkView,
    AccountMetadataView,
    AccountMosaicRestrictionView,
    AccountOperationRestrictionView,
    AddressAliasView,
    AggregateBondedView,
    AggregateCompleteView,
    HashLockView,
    MosaicAddressRestrictionView,
    MosaicAliasView,
    MosaicDefinitionView,
    MosaicGlobalRestrictionView,
    MosaicMetadataView,
    MosaicSupplyChangeView,
    MultisigAccountModificationView,
    NamespaceMetadataView,
    NamespaceRegistrationView,
    NodeKeyLinkView,
    SecretLockView,
    SecretProofView,
    TransferView,
    VotingKeyLinkView,
    VrfKeyLinkView,
} from './transaction-types';
import { CellRecord } from './transaction.view';

/**
 * @param  {Transaction} transaction
 * @returns {CellRecord}
 */
export const transactionDetailViewFactory = (tx: Transaction): CellRecord => {
    try {
        const type: TransactionType = tx.type;

        if (type === TransactionType.RESERVED) {
            throw new Error('The transaction type can not be reserved');
        }
        // @ts-ignore
        const formatters: Record<TransactionType, any> = {
            [TransactionType.RESERVED]: {},
            [TransactionType.ACCOUNT_METADATA]: AccountMetadataView,
            [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]: AccountAddressRestrictionView,
            [TransactionType.ACCOUNT_MOSAIC_RESTRICTION]: AccountMosaicRestrictionView,
            [TransactionType.ACCOUNT_OPERATION_RESTRICTION]: AccountOperationRestrictionView,
            [TransactionType.ADDRESS_ALIAS]: AddressAliasView,
            [TransactionType.AGGREGATE_BONDED]: AggregateBondedView,
            [TransactionType.AGGREGATE_COMPLETE]: AggregateCompleteView,
            [TransactionType.ACCOUNT_KEY_LINK]: AccountKeyLinkView,
            [TransactionType.HASH_LOCK]: HashLockView,
            [TransactionType.MULTISIG_ACCOUNT_MODIFICATION]: MultisigAccountModificationView,
            [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: MosaicAddressRestrictionView,
            [TransactionType.MOSAIC_ALIAS]: MosaicAliasView,
            [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: MosaicGlobalRestrictionView,
            [TransactionType.NAMESPACE_METADATA]: NamespaceMetadataView,
            [TransactionType.MOSAIC_SUPPLY_CHANGE]: MosaicSupplyChangeView,
            [TransactionType.MOSAIC_DEFINITION]: MosaicDefinitionView,
            [TransactionType.MOSAIC_METADATA]: MosaicMetadataView,
            [TransactionType.NAMESPACE_REGISTRATION]: NamespaceRegistrationView,
            [TransactionType.NODE_KEY_LINK]: NodeKeyLinkView,
            [TransactionType.SECRET_LOCK]: SecretLockView,
            [TransactionType.SECRET_PROOF]: SecretProofView,
            [TransactionType.TRANSFER]: TransferView,
            [TransactionType.VRF_KEY_LINK]: VrfKeyLinkView,
            [TransactionType.VOTING_KEY_LINK]: VotingKeyLinkView,
        };
        const formatter = formatters[type];
        return formatter.get(tx);
    } catch (error) {
        throw new Error(`Transaction type not found: ${tx.type}`);
    }
};
