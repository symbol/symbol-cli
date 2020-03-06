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
// eslint-disable-next-line @typescript-eslint/no-var-requires
import {SequentialFetcher} from '../../src/services/sequentialFetcher.service'
import {expect} from 'chai'
import {Address} from 'symbol-sdk'
import {toArray} from 'rxjs/operators'
import {capture, mock, spy, verify} from 'ts-mockito'

const addresses = [
    Address.createFromRawAddress('SAY7N2GP6JJBFIRBTUEXY2JJVOLGIZ46KWIMYB5T'),
    Address.createFromRawAddress('SB2FRRM3SYAMQL47RRUKMQSRJXJT3QPVAVWNTXQX'),
    Address.createFromRawAddress('SBIWHDWZMPIXXM2BINCRXAK3H3MGA5VHB3D2PO5W'),
]

describe('Multisig service', () => {
    it('should call the response handler with all the addresses', async () => {
        const networkCall = (address: Address) => Promise.resolve([address])
        const sequentialFetcher = SequentialFetcher.create(networkCall, 1)
        sequentialFetcher
            .getResults(addresses)
            .pipe(toArray())
            .toPromise()
            .then((results) => {
                const returnedAddresses = results.map((result) => result[0])
                expect(returnedAddresses).deep.equal(addresses)
            })
    })

    it('should call the response handler with all the addresses even if it throws', () => {
        const mockBadNetworkCall = {call: (address: Address) => Promise.reject()}
        const spiedMock = spy(mockBadNetworkCall)
        const sequentialFetcher = SequentialFetcher.create(mockBadNetworkCall.call, 1)
        sequentialFetcher
            .getResults(addresses)
            .pipe(toArray())
            .toPromise()
            .then((results) => {
                const returnedAddresses = results.map((result) => result[0])
                expect(returnedAddresses).deep.equal([])
                expect(capture(spiedMock.call).first()).deep.equal([addresses[0]])
                expect(capture(spiedMock.call).second()).deep.equal([addresses[1]])
                expect(capture(spiedMock.call).third()).deep.equal([addresses[2]])
            })
    })
})
