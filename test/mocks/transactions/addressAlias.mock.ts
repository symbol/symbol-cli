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

import { AddressAliasTransaction, AliasAction, NetworkType, UInt64 } from 'symbol-sdk';
import { account1 } from '../accounts.mock';
import { namespaceId1 } from '../namespaces.mock';
import { createDeadline } from './deadline.mock';

export const unsignedAddressAlias1 = AddressAliasTransaction.create(
    createDeadline(),
    AliasAction.Link,
    namespaceId1,
    account1.address,
    NetworkType.TEST_NET,
    new UInt64([1, 0]),
);
