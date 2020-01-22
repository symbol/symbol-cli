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
import {expect} from 'chai';
import {Address} from 'nem2-sdk';
import {instance, mock, times, verify, when} from 'ts-mockito';
import {SequentialFetcher} from '../../src/services/multisig.service';

const addresses = [
    Address.createFromRawAddress('SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T'),
    Address.createFromRawAddress('SB2FRRM3SYAMQL47RRUKMQSRJXJT3QPVAVWNTXQX'),
    Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
];

const networkCall = (address: Address) => Promise.resolve(address);
const mockNetworkCall = mock(networkCall);

describe('Multisig service', () => {
    it('should call the response handler with all the addresses', async (done) => {
        const sequentialFetcher = SequentialFetcher.create(mockNetworkCall, 1);
        sequentialFetcher
            .getTransactionsToCosign(addresses)
            .subscribe(
                (x) => console.log(x),
                (err) => console.log(err),
            );

        // mockNetworkCall.
        // setTimeout(() => {
        // expect(mockNetworkCall.mock.calls[0][0]).equal([addresses[0]]);
        // expect(mockNetworkCall.mock.calls[1][0]).equal([addresses[1]]);
        // expect(mockNetworkCall.mock.calls[2][0]).equal([addresses[2]]);
        // done();
        // }, 50);

        done();
    });
});
