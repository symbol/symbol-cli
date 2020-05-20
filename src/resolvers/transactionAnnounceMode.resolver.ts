/*
 *
 * Copyright 2020-present NEM
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
import {AnnounceTransactionsOptions} from '../interfaces/announceTransactions.options'
import {OptionsChoiceResolver} from '../options-resolver'
import {PublicKeyValidator} from '../validators/publicKey.validator'
import {Resolver} from './resolver'

export enum TransactionAnnounceMode {
   'normal' = 'normal',
   'multisig' = 'multisig',
}

/**
 * Transaction announce mode resolver
 */
export class TransactionAnnounceModeResolver implements Resolver {

   /**
    * Resolves an import type provided by the user.
    * @param {CreateProfileOptions} options - Command options.
    * @returns {Promise<number>}
    */
   async resolve(
      options: AnnounceTransactionsOptions,
   ): Promise<TransactionAnnounceMode> {
      // Enter multisig mode if a valid signer public key was provided as an option
      if (new PublicKeyValidator().validate(options.signer) === true) {
         return TransactionAnnounceMode.multisig
      }

      const choices = Object
         .keys(TransactionAnnounceMode)
         .map((string) => ({
            title: string,
            value: string,
         }))

      return OptionsChoiceResolver(
         options,
         '',
         'Select the transaction announce mode:',
         choices,
         'select',
         undefined,
      )
   }
}
