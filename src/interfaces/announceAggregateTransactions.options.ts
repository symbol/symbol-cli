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
import {option} from 'clime'
import {AnnounceTransactionsOptions} from './announceTransactions.options'

/**
 * Announce aggregate transactions options
 */
export class AnnounceAggregateTransactionsOptions extends AnnounceTransactionsOptions {

 @option({
     flag: 'F',
     description: 'Maximum fee (absolute amount) to announce the hash lock transaction.',
 })
 maxFeeHashLock: string

 @option({
     flag: 'D',
     description: 'Hash lock duration expressed in blocks.',
     default: '480',
 })
 duration: string

 @option({
     flag: 'L',
     description: 'Relative amount of network mosaic to lock.',
     default: '10',
 })
 amount: string
}
