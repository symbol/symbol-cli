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

import { expect } from 'chai';
import { Account, Address, NamespaceId, NetworkType } from 'symbol-sdk';
import { AddressResolver, CosignatoryUnresolvedAddressesResolver, UnresolvedAddressResolver } from '../../src/resolvers/address.resolver';

describe('Address resolver', () => {
    it('should return address', async () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF';
        const options = { address } as any;
        expect((await new AddressResolver().resolve(options)).plain()).to.be.equal(address);
    });

    it('should change key', async () => {
        const key = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF';
        const options = { key } as any;
        expect((await new AddressResolver().resolve(options, undefined, 'altText', 'key')).plain()).to.be.equal(key);
    });
});

describe('Recipient address alias resolver', () => {
    it('should return alias', async () => {
        const address = '@alias';
        const options = { address } as any;
        expect(await new UnresolvedAddressResolver().resolve(options)).to.be.instanceOf(NamespaceId);
    });

    it('should return address', async () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF';
        const options = { address } as any;
        const resolvedAddress = await new UnresolvedAddressResolver().resolve(options);
        expect(resolvedAddress).instanceof(Address);
        expect((resolvedAddress as Address).plain()).to.be.equal(address);
    });

    it('should change key', async () => {
        const key = '@alias';
        const options = { key } as any;
        expect(await new UnresolvedAddressResolver().resolve(options, undefined, 'altText', 'key')).to.be.instanceOf(NamespaceId);
    });
});

describe('Cosignatory address resolver', () => {
    it('should return address', async () => {
        const address1 = Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain();
        const address2 = '@symbol';
        const cosignatoryAddresses = address1 + ',' + address2;
        const options = { cosignatoryAddresses } as any;
        const resolution = await new CosignatoryUnresolvedAddressesResolver().resolve(options);
        expect((resolution[0] as Address).plain()).to.be.equal(address1);
        expect('@' + (resolution[1] as NamespaceId).fullName).to.be.equal(address2);
    });

    it('should change key', async () => {
        const address1 = Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain();
        const address2 = '@symbol';
        const key = address1 + ',' + address2;
        const options = { key } as any;
        const resolution = await new CosignatoryUnresolvedAddressesResolver().resolve(options, undefined, 'altText', 'key');
        expect((resolution[0] as Address).plain()).to.be.equal(address1);
        expect('@' + (resolution[1] as NamespaceId).fullName).to.be.equal(address2);
    });
});
