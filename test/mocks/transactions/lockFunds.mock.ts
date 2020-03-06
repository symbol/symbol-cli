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

import {account1} from '../accounts.mock'
import {mosaic2} from '../mosaics.mock'
import {unsignedAggregateBonded1} from './aggregateBonded.mock'
import {Deadline, LockFundsTransaction, NetworkType, UInt64} from 'symbol-sdk'
const generationHash = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'

const signedTransaction = account1.sign(unsignedAggregateBonded1, generationHash)
export const unsignedLockFunds1 = LockFundsTransaction.create(
 Deadline.create(),
 mosaic2,
 UInt64.fromUint(10),
 signedTransaction,
 NetworkType.MIJIN_TEST,
)
