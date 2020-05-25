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
import { assert } from 'chai';

import { transactionDetailViewFactory } from '../../../../src/views/transactions/details/transactionDetailView.factory';
import {
    unsignedAccountAddressRestriction1,
    unsignedAccountKeyLink1,
    unsignedAccountMetadata1,
    unsignedAccountMosaicRestriction1,
    unsignedAccountOperationRestriction1,
    unsignedAddressAlias1,
    unsignedAggregateBonded1,
    unsignedAggregateComplete1,
    unsignedLockFunds1,
    unsignedMosaicAddressRestriction1,
    unsignedMosaicAlias1,
    unsignedMosaicDefinition1,
    unsignedMosaicGlobalRestriction1,
    unsignedMosaicMetadata1,
    unsignedMosaicSupplyChange1,
    unsignedMultisigAccountModification1,
    unsignedNamespaceMetadata1,
    unsignedNamespaceRegistration1,
    unsignedNodeKeyLink1,
    unsignedSecretLock1,
    unsignedSecretProof1,
    unsignedTransfer1,
    unsignedVotingKeyLink1,
    unsignedVrfKeyLink1,
} from '../../../mocks/transactions/index';

describe('Transaction detail view factory', () => {
    it('should return an object for each transaction type', () => {
        const allTransactions = [
            unsignedAccountAddressRestriction1,
            unsignedAccountKeyLink1,
            unsignedAccountMetadata1,
            unsignedAccountMosaicRestriction1,
            unsignedAccountOperationRestriction1,
            unsignedAddressAlias1,
            unsignedAggregateBonded1,
            unsignedAggregateComplete1,
            unsignedLockFunds1,
            unsignedMosaicAddressRestriction1,
            unsignedMosaicAlias1,
            unsignedMosaicDefinition1,
            unsignedMosaicGlobalRestriction1,
            unsignedMosaicMetadata1,
            unsignedMosaicSupplyChange1,
            unsignedMultisigAccountModification1,
            unsignedNamespaceMetadata1,
            unsignedNamespaceRegistration1,
            unsignedNodeKeyLink1,
            unsignedSecretLock1,
            unsignedSecretProof1,
            unsignedTransfer1,
            unsignedVotingKeyLink1,
            unsignedVrfKeyLink1,
        ];

        allTransactions.forEach((tx) =>
            assert.typeOf(transactionDetailViewFactory(unsignedAccountAddressRestriction1), 'Object', `${tx?.type}`),
        );
    });
});
