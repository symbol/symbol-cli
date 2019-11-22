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

import {AccountRestrictionFlags} from 'nem2-sdk';

export class RestrictionService {

    constructor() {}

    public getAccountAddressRestrictionFlags(restrictionType: string, restrictionDirection: string): AccountRestrictionFlags {
        const lowerRestrictionFlags = restrictionType.toLowerCase();
        const lowerRestrictionDirection = restrictionDirection.toLowerCase();
        let accountRestrictionFlags;
        if ('allow' === lowerRestrictionFlags && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionFlags = AccountRestrictionFlags.AllowOutgoingAddress;
        } else if ('allow' === lowerRestrictionFlags && 'incoming' === lowerRestrictionDirection) {
            accountRestrictionFlags = AccountRestrictionFlags.AllowIncomingAddress;
        } else if ('block' === lowerRestrictionFlags && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionFlags = AccountRestrictionFlags.BlockOutgoingAddress;
        } else {
            accountRestrictionFlags = AccountRestrictionFlags.BlockIncomingAddress;
        }
        return accountRestrictionFlags;
    }

    public getAccountMosaicRestrictionFlags(restrictionType: string): AccountRestrictionFlags {
        let accountRestrictionFlags;
        if ('allow' === restrictionType.toLowerCase()) {
            accountRestrictionFlags = AccountRestrictionFlags.AllowMosaic;
        } else {
            accountRestrictionFlags = AccountRestrictionFlags.BlockMosaic;
        }
        return accountRestrictionFlags;
    }

    public getAccountOperationRestrictionFlags(restrictionType: string) {
        const lowerRestrictionFlags = restrictionType.toLowerCase();
        let accountRestrictionFlags;
        if ('allow' === lowerRestrictionFlags) {
            accountRestrictionFlags = AccountRestrictionFlags.AllowOutgoingTransactionType;
        } else if ('allow' === lowerRestrictionFlags) {
            accountRestrictionFlags = AccountRestrictionFlags.AllowIncomingTransactionType;
        } else if ('block' === lowerRestrictionFlags) {
            accountRestrictionFlags = AccountRestrictionFlags.BlockOutgoingTransactionType;
        } else {
            accountRestrictionFlags = AccountRestrictionFlags.BlockIncomingTransactionType;
        }
        return accountRestrictionFlags;
    }
}
