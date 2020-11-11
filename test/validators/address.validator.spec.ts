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
import { Account, NetworkType } from 'symbol-sdk';
import { AddressValidator, UnresolvedAddressesValidator, UnresolvedAddressValidator } from '../../src/validators/address.validator';

describe('Address validator', () => {
    it('default case', () => {
        const uppercaseAddress = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF';
        const lowercaseAddress = 'sb3kubhatfcpv7uzqlwaq2eur6sihbsbeoedddf';
        const dashedAddress = 'SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF';
        expect(new AddressValidator().validate(uppercaseAddress)).to.be.equal(true);
        expect(new AddressValidator().validate(lowercaseAddress)).to.be.equal(true);
        expect(new AddressValidator().validate(dashedAddress)).to.be.equal(true);
    });

    it('should throw an error if the address is invalid', () => {
        const address = 'TEST';
        expect(typeof new AddressValidator().validate(address)).to.be.equal('string');
    });
});

describe('Address alias validator', () => {
    it('default case', () => {
        const uppercaseAddress = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF';
        const lowercaseAddress = 'sb3kubhatfcpv7uzqlwaq2eur6sihbsbeoedddf';
        const dashedAddress = 'SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF';
        expect(new UnresolvedAddressValidator().validate(uppercaseAddress)).to.be.equal(true);
        expect(new UnresolvedAddressValidator().validate(lowercaseAddress)).to.be.equal(true);
        expect(new UnresolvedAddressValidator().validate(dashedAddress)).to.be.equal(true);
    });

    it('default case alias', () => {
        const alias = '@nem';
        expect(new UnresolvedAddressValidator().validate(alias)).to.be.equal(true);
    });

    it('should throw an error if the address is invalid', () => {
        const address = 'TEST';
        expect(typeof new UnresolvedAddressValidator().validate(address)).to.be.equal('string');
    });

    it('should throw an error if the alias is invalid', () => {
        const alias = '@myOwnAlias';
        expect(typeof new UnresolvedAddressValidator().validate(alias)).to.be.equal('string');
    });
});

describe('Unresolved addresses validator', () => {
    it('should be possible to validate multiple addresses at the same time', () => {
        const address1 = Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain();
        const address2 = '@symbol';
        const cosignatoryAddresses = address1 + ',' + address2;

        expect(new UnresolvedAddressesValidator().validate(cosignatoryAddresses)).to.be.equal(true);
    });

    it('should throw error if one address is invalid', () => {
        const address1 = Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain();
        const address2 = 'test';
        const cosignatoryAddresses = address1 + ',' + address2;
        expect(typeof new UnresolvedAddressValidator().validate(cosignatoryAddresses)).to.be.equal('string');
    });
});
