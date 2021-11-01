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

import { Account, MultisigAccountGraphInfo, MultisigAccountInfo, NetworkType } from 'symbol-sdk';

export const multisigGraphInfoAccount1 = Account.generateNewAccount(NetworkType.TEST_NET).address;
export const multisigGraphInfoAccount2 = Account.generateNewAccount(NetworkType.TEST_NET).address;
export const multisigGraphInfoAccount3 = Account.generateNewAccount(NetworkType.TEST_NET).address;
export const multisigGraphInfoAccount4 = Account.generateNewAccount(NetworkType.TEST_NET).address;
export const multisigGraphInfoAccount5 = Account.generateNewAccount(NetworkType.TEST_NET).address;

export const multisigGraphInfoAccounts = [
    multisigGraphInfoAccount1,
    multisigGraphInfoAccount2,
    multisigGraphInfoAccount3,
    multisigGraphInfoAccount4,
    multisigGraphInfoAccount5,
];

const multisigAccountGraphInfoDTO = {
    level: -1,
    multisigEntries: [
        {
            multisig: {
                accountAddress: multisigGraphInfoAccount1,
                cosignatoryAddresses: [multisigGraphInfoAccount2, multisigGraphInfoAccount3, multisigGraphInfoAccount4],
                minApproval: 3,
                minRemoval: 3,
                multisigAccounts: [multisigGraphInfoAccount5],
            },
        },
    ],
};

const multisigAccountGraphInfoDTO2 = {
    level: -2,
    multisigEntries: [
        {
            multisig: {
                accountAddress: multisigGraphInfoAccount5,
                cosignatoryAddresses: [multisigGraphInfoAccount1],
                minApproval: 1,
                minRemoval: 1,
                multisigAccounts: [],
            },
        },
    ],
};

const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
multisigAccounts.set(
    multisigAccountGraphInfoDTO.level,
    multisigAccountGraphInfoDTO.multisigEntries.map(
        (multisigAccountInfoDTO) =>
            new MultisigAccountInfo(
                1,
                multisigAccountInfoDTO.multisig.accountAddress,
                multisigAccountInfoDTO.multisig.minApproval,
                multisigAccountInfoDTO.multisig.minRemoval,
                multisigAccountInfoDTO.multisig.cosignatoryAddresses,
                multisigAccountInfoDTO.multisig.multisigAccounts,
            ),
    ),
);
multisigAccounts.set(
    multisigAccountGraphInfoDTO2.level,
    multisigAccountGraphInfoDTO2.multisigEntries.map(
        (multisigAccountInfoDTO) =>
            new MultisigAccountInfo(
                1,
                multisigAccountInfoDTO.multisig.accountAddress,
                multisigAccountInfoDTO.multisig.minApproval,
                multisigAccountInfoDTO.multisig.minRemoval,
                multisigAccountInfoDTO.multisig.cosignatoryAddresses,
                multisigAccountInfoDTO.multisig.multisigAccounts,
            ),
    ),
);

export const multisigGraphInfo1 = new MultisigAccountGraphInfo(multisigAccounts);
