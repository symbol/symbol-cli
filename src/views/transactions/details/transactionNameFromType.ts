/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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

import {TransactionType} from 'nem2-sdk'

export const transactionNameFromType = (type: TransactionType): string => {
 try {
  const bridge: Record<TransactionType, string> = {
   [TransactionType.RESERVED]: 'Reserved',
   [TransactionType.TRANSFER]: 'Transfer',
   [TransactionType.NAMESPACE_REGISTRATION]: 'Namespace registration',
   [TransactionType.ADDRESS_ALIAS]: 'Address alias',
   [TransactionType.MOSAIC_ALIAS]: 'Mosaic alias',
   [TransactionType.MOSAIC_DEFINITION]: 'Mosaic definition',
   [TransactionType.MOSAIC_SUPPLY_CHANGE]: 'Mosaic supply change',
   [TransactionType.MULTISIG_ACCOUNT_MODIFICATION]: 'Multisig account modification',
   [TransactionType.AGGREGATE_COMPLETE]: 'Aggregate complete',
   [TransactionType.AGGREGATE_BONDED]: 'Aggregate bonded',
   [TransactionType.HASH_LOCK]: 'Lock funds',
   [TransactionType.SECRET_LOCK]: 'Secret lock',
   [TransactionType.SECRET_PROOF]: 'Secret proof',
   [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]: 'Account address restriction',
   [TransactionType.ACCOUNT_MOSAIC_RESTRICTION]: 'Account mosaic restriction',
   [TransactionType.ACCOUNT_OPERATION_RESTRICTION]: 'Account operation restriction',
   [TransactionType.ACCOUNT_LINK]: 'Account link',
   [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: 'Mosaic address restriction',
   [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: 'Mosaic global restriction',
   [TransactionType.ACCOUNT_METADATA]: 'Account metadata transaction',
   [TransactionType.MOSAIC_METADATA]: 'Mosaic metadata transaction',
   [TransactionType.NAMESPACE_METADATA]: 'Namespace metadata transaction',
  }

  return bridge[type]
 } catch {
  throw new Error(`Transaction type not found: ${type}`)
 }
}
