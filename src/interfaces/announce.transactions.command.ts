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
import { AccountHttp, MultisigAccountInfo, PublicAccount, SignedTransaction } from 'symbol-sdk';

import { MultisigAccount } from '../models/multisig.types';
import { AddressChoiceResolver } from '../resolvers/address.resolver';
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
    protected async getsignerMultisig(options: AnnounceTransactionsOptions): Promise<MultisigAccount | null> {
        const transactionAnnounceMode = await new TransactionAnnounceModeResolver().resolve(options);

        if (transactionAnnounceMode === TransactionAnnounceMode.normal) {
            return null;
        }

        // Get the profile's multisig accounts info
        const profile = this.getProfile(options);
        const childMultisigAccountsInfo = await new MultisigService(profile).getChildrenMultisigAccountInfo();

        if (!childMultisigAccountsInfo) {
            throw new ExpectedError('The selected profile does not have multisig accounts');
        }

        // A signer public key was provided as an option
        if (options.signer) {
            const signerPublicAccount = PublicAccount.createFromPublicKey(options.signer, profile.networkType);
            const multisigInfo = childMultisigAccountsInfo.find(({ accountAddress }) => accountAddress.equals(signerPublicAccount.address));

            if (!multisigInfo) {
                throw new ExpectedError(`
                    ${options.signer} is not a multisig account of the profile ${profile.name}
                `);
            }

            return { info: multisigInfo, publicAccount: signerPublicAccount };
        }

        const availableAddresses = childMultisigAccountsInfo.map(({ accountAddress }) => accountAddress.plain());

        const chosenSigner = await new AddressChoiceResolver().resolve(availableAddresses);

        const chosensignerMultisig = childMultisigAccountsInfo.find(({ accountAddress }) => accountAddress.equals(chosenSigner));
        const chosenSignerPublicAccount = await (await new AccountHttp(profile.url).getAccountInfo(chosenSigner).toPromise()).publicAccount;

        if (!chosensignerMultisig || !chosenSignerPublicAccount) {
            throw new ExpectedError('Could not retrieve the multisig account information from the node.');
        }

        return { info: chosensignerMultisig, publicAccount: chosenSignerPublicAccount };
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
