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
import {ProfileOptions} from './profile.options'

/**
 * Announce transactions options
 */
export class AnnounceTransactionsOptions extends ProfileOptions {
 @option({
     flag: 'p',
     description: 'Profile password.',
 })
 password: string

 @option({
     flag: 'f',
     description: 'Maximum fee (absolute amount).',
 })
 maxFee: string

 @option({
     description: '(Optional) Wait until the server confirms or rejects the transaction.',
     toggle: true,
 })
 sync: any

 @option({
     description: '(Optional) Announce the transaction without double confirmation.',
     toggle: true,
 })
 announce: any
}
