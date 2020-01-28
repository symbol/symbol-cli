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

import {AccountRestrictionFlags, AccountRestrictionTransaction, Deadline, NetworkType, TransactionType} from 'nem2-sdk';

export const operation1 = TransactionType.ADDRESS_ALIAS;
export const operation2 = TransactionType.LINK_ACCOUNT;
export const operation3 = TransactionType.TRANSFER;

export const unsignedAccountOperationRestriction1 = AccountRestrictionTransaction
    .createOperationRestrictionModificationTransaction(
        Deadline.create(),
        AccountRestrictionFlags.AllowIncomingTransactionType,
        [operation1, operation2],
        [operation3],
        NetworkType.MIJIN_TEST,
    );
