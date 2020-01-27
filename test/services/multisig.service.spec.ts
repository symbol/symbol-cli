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
import {MultisigService} from '../../src/services/multisig.service';
import {mockProfile1, multisigGraphInfo1, multisigGraphInfoPublicAccounts} from '../mocks';

describe('Multisig service', () => {
 it('should create a multisig service service', () => {
  const multisigService = new MultisigService(mockProfile1);
  expect(multisigService).to.be.an.instanceOf(MultisigService);
 });

 it('should return all addresses from a MultisigGraphInfo', () => {
  const multisigService = new MultisigService(mockProfile1);
  const expectedAddresses = multisigGraphInfoPublicAccounts.map(({address}) => address);

  multisigService
   // @ts-ignore
   .getAddressesFromGraphInfo(multisigGraphInfo1)
   .toPromise()
   .then((results) => expect(results).deep.equal(expectedAddresses));
 });
});
