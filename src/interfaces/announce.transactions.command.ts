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

import { ExpectedError } from 'clime';
import { MultisigAccountInfo, SignedTransaction } from 'symbol-sdk';

import { Profile } from '../models/profile.model';
import { PublicKeyChoiceResolver } from '../resolvers/publicKey.resolver';
import { TransactionAnnounceMode, TransactionAnnounceModeResolver } from '../resolvers/transactionAnnounceMode.resolver';
import { MultisigService } from '../services/multisig.service';
import { TransactionAnnounceService } from '../services/transaction.announce.service';
import { TransactionSignatureOptions, TransactionSignatureService } from '../services/transaction.signature.service';
import { AnnounceTransactionsOptions } from './announceTransactions.options';
import { ProfileCommand } from './profile.command';

/**
 * Base command class to announce transactions.
 */
export abstract class AnnounceTransactionsCommand extends ProfileCommand {
    protected constructor() {
        super();
    }

    /**
     * Gets the signer multisig info if the transaction is multisig
     * @protected
     * @param {AnnounceTransactionsOptions} options
     * @throws {ExpectedError}
     * @returns {(Promise<MultisigAccountInfo | null>)}
     */
    protected async getSignerMultisigInfo(options: AnnounceTransactionsOptions): Promise<MultisigAccountInfo | null> {
        const transactionAnnounceMode = await new TransactionAnnounceModeResolver().resolve(options);

        if (transactionAnnounceMode === TransactionAnnounceMode.normal) {
            return null;
        }

        // Get the profile's multisig accounts multisig account info
        const profile: Profile = this.getProfile(options);
        const childMultisigAccountsInfo = await new MultisigService(profile).getChildrenMultisigAccountInfo();

        if (!childMultisigAccountsInfo) {
            throw new ExpectedError('The selected profile does not have multisig accounts');
        }

        // A signer public key was provided as an option,
        if (options.signer) {
            const multisigInfo = childMultisigAccountsInfo.find(({ account }) => account.publicKey === options.signer);

            if (!multisigInfo) {
                throw new ExpectedError(`
                    ${options.signer} is not a multisig account of the profile ${profile.name}
                `);
            }

            return multisigInfo;
        }

        const availablePublicKeys = childMultisigAccountsInfo.map(({ account }) => account.publicKey);

        const chosenSigner = await new PublicKeyChoiceResolver().resolve(availablePublicKeys);

        const chosenSignerMultisigInfo = childMultisigAccountsInfo.find(({ account }) => account.publicKey === chosenSigner);

        if (!chosenSignerMultisigInfo) {
            throw new ExpectedError('Something went wrong when selecting a signer');
        }

        return chosenSignerMultisigInfo;
    }

    protected async signTransactions(
        signatureOptions: TransactionSignatureOptions,
        options: AnnounceTransactionsOptions,
    ): Promise<SignedTransaction[]> {
        const profile = this.getProfile(options);
        return TransactionSignatureService.create(profile, options).signTransactions(signatureOptions);
    }

    protected async announceTransactions(options: AnnounceTransactionsOptions, signedTransactions: SignedTransaction[]): Promise<void> {
        const profile = this.getProfile(options);
        TransactionAnnounceService.create(profile, options).announce(signedTransactions);
    }
}
