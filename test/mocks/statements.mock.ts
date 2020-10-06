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
    Address,
    AddressResolutionStatement,
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
    ReceiptSource,
    ReceiptType,
    ResolutionEntry,
    ResolutionStatement,
    ResolutionType,
    Statement,
    TransactionStatement,
    UInt64,
    UnresolvedAddress,
} from 'symbol-sdk';

import { account1, account2 } from './accounts.mock';
import { mosaicId1, mosaicId2, mosaicId3 } from './mosaics.mock';
import { namespaceId1 } from './namespaces.mock';

export const mosaicResolutionStatement = new ResolutionStatement(ResolutionType.Mosaic, UInt64.fromNumericString('1'), mosaicId1, [
    new ResolutionEntry(mosaicId2, new ReceiptSource(1, 0)),
    new ResolutionEntry(mosaicId3, new ReceiptSource(3, 5)),
]);

export const addressResolutionStatement = new ResolutionStatement<UnresolvedAddress, Address>(
    ResolutionType.Address,
    UInt64.fromNumericString('2'),
    account1.address,
    [new ResolutionEntry<Address>(account1.address, new ReceiptSource(5, 0))],
) as AddressResolutionStatement;

export const balanceChangeReceipt = new BalanceChangeReceipt(
    account1.address,
    mosaicId1,
    UInt64.fromNumericString('10'),
    1,
    ReceiptType.Harvest_Fee,
);

export const balanceTransferReceipt = new BalanceTransferReceipt(
    account1.address,
    account2.address,
    mosaicId1,
    UInt64.fromNumericString('2'),
    1,
    ReceiptType.Transaction_Group,
);

export const artifactExpiryReceipt = new ArtifactExpiryReceipt(namespaceId1, 1, ReceiptType.Namespace_Expired);

export const inflationReceipt = new InflationReceipt(mosaicId1, UInt64.fromNumericString('100'), 1, ReceiptType.Inflation, 100);

export const transactionStatement1 = new TransactionStatement(UInt64.fromNumericString('1'), new ReceiptSource(1, 2), [
    balanceChangeReceipt,
    balanceTransferReceipt,
]);

export const transactionStatement2 = new TransactionStatement(UInt64.fromNumericString('2'), new ReceiptSource(3, 4), [
    artifactExpiryReceipt,
    inflationReceipt,
]);

export const statement = new Statement(
    [transactionStatement1, transactionStatement2],
    [addressResolutionStatement],
    [mosaicResolutionStatement],
);
