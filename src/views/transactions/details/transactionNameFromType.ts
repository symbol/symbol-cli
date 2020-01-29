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

import {TransactionType} from 'nem2-sdk';

export const transactionNameFromType = (type: TransactionType): string => {
 try {
  const bridge: Record<TransactionType, string> = {
   [TransactionType.RESERVED]: 'Reserved',
   [TransactionType.TRANSFER]: 'Transfer',
   [TransactionType.REGISTER_NAMESPACE]: 'Namespace registration',
   [TransactionType.ADDRESS_ALIAS]: 'Address alias',
   [TransactionType.MOSAIC_ALIAS]: 'Mosaic alias',
   [TransactionType.MOSAIC_DEFINITION]: 'Mosaic definition',
   [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'Mosaic supply change',
   [TransactionType.MODIFY_MULTISIG_ACCOUNT]: 'Multisig account modification',
   [TransactionType.AGGREGATE_COMPLETE]: 'Aggregate complete',
   [TransactionType.AGGREGATE_BONDED]: 'Aggregate bonded',
   [TransactionType.LOCK]: 'Lock funds',
   [TransactionType.SECRET_LOCK]: 'Secret lock',
   [TransactionType.SECRET_PROOF]: 'Secret proof',
   [TransactionType.ACCOUNT_RESTRICTION_ADDRESS]: 'Account address restriction',
   [TransactionType.ACCOUNT_RESTRICTION_MOSAIC]: 'Account mosaic restriction',
   [TransactionType.ACCOUNT_RESTRICTION_OPERATION]: 'Account operation restriction',
   [TransactionType.LINK_ACCOUNT]: 'Account link',
   [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: 'Mosaic address restriction',
   [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: 'Mosaic global restriction',
   [TransactionType.ACCOUNT_METADATA_TRANSACTION]: 'Account metadata transaction',
   [TransactionType.MOSAIC_METADATA_TRANSACTION]: 'Mosaic metadata transaction',
   [TransactionType.NAMESPACE_METADATA_TRANSACTION]: 'Namespace metadata transaction',
  };

  return bridge[type];
 } catch {
  throw new Error(`Transaction type not found: ${type}`);
 }
};
