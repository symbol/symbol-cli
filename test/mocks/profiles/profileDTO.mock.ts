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

export const profileDTOv1 = {
    dummy: {
        networkType: 152,
        simpleWallet: {
            name: 'dummy',
            network: 152,
            address: {
                address: 'TCUAG2N5XWOADHCAJ22IJQILVGON37UIZGUDIG3K',
                networkType: 152,
            },
            creationDate: '2020-03-25T14:15:34.126',
            schema: 'simple_v1',
            encryptedPrivateKey: {
                encryptedKey: 'fb5a1533a1e8363885c9dbc70450ddc0e75c9176c232bb7bee9099ffcfcafaa67197f316708071a409ba2f124271bb0f',
                iv: '2FA21279566F587030BFA64AE2D96DDE',
            },
        },
        url: 'http://api-01.ap-northeast-1.symboldev.network:3000',
        networkGenerationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
        default: '0',
    },
};

export const profileDTOv2 = {
    dummy: {
        networkType: 152,
        simpleWallet: {
            name: 'dummy',
            network: 152,
            address: {
                address: 'TCUAG2N5XWOADHCAJ22IJQILVGON37UIZGUDIG3K',
                networkType: 152,
            },
            creationDate: '2020-03-25T14:15:34.126',
            schema: 'simple_v1',
            encryptedPrivateKey: {
                encryptedKey: 'fb5a1533a1e8363885c9dbc70450ddc0e75c9176c232bb7bee9099ffcfcafaa67197f316708071a409ba2f124271bb0f',
                iv: '2FA21279566F587030BFA64AE2D96DDE',
            },
        },
        url: 'http://api-01.ap-northeast-1.symboldev.network:3000',
        networkGenerationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
        default: '0',
        networkCurrency: {
            namespaceId: 'symbol.xym',
            divisibility: 6,
        },
        version: 2,
    },
};

export const profileDTO2v2 = {
    anotherDummyProfile: {
        networkType: 152,
        simpleWallet: {
            name: 'dummy',
            network: 152,
            address: {
                address: 'TCUAG2N5XWOADHCAJ22IJQILVGON37UIZGUDIG3K',
                networkType: 152,
            },
            creationDate: '2020-03-25T14:15:34.126',
            schema: 'simple_v1',
            encryptedPrivateKey: {
                encryptedKey: 'fb5a1533a1e8363885c9dbc70450ddc0e75c9176c232bb7bee9099ffcfcafaa67197f316708071a409ba2f124271bb0f',
                iv: '2FA21279566F587030BFA64AE2D96DDE',
            },
        },
        url: 'http://api-01.ap-northeast-1.symboldev.network:3000',
        networkGenerationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
        default: '0',
        networkCurrency: {
            namespaceId: 'symbol.xym',
            divisibility: 6,
        },
        version: 2,
    },
};

export const profileDTO2v3 = {
    anotherDummyProfile: {
        networkType: 152,
        simpleWallet: {
            name: 'dummy',
            network: 152,
            address: {
                address: 'TCUAG2N5XWOADHCAJ22IJQILVGON37UIZGUDIG3K',
                networkType: 152,
            },
            creationDate: '2020-03-25T14:15:34.126',
            schema: 'simple_v1',
            encryptedPrivateKey: {
                encryptedKey: 'fb5a1533a1e8363885c9dbc70450ddc0e75c9176c232bb7bee9099ffcfcafaa67197f316708071a409ba2f124271bb0f',
                iv: '2FA21279566F587030BFA64AE2D96DDE',
            },
        },
        url: 'http://api-01.ap-northeast-1.symboldev.network:3000',
        networkGenerationHash: '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C',
        default: '0',
        networkCurrency: {
            namespaceId: 'symbol.xym',
            divisibility: 6,
        },
        version: 3,
        type: 'PrivateKey',
    },
};
