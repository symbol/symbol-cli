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
import {AddressAliasValidator, AddressValidator} from '../../src/validators/address.validator'
import {expect} from 'chai'

describe('Address validator', () => {

    it('default case', () => {
        const uppercaseAddress = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const lowercaseAddress = 'sb3kubhatfcpv7uzqlwaq2eur6sihbsbeoedddf3'
        const dashedAddress = 'SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3'
        expect(new AddressValidator().validate(uppercaseAddress))
            .to.be.equal(true)
        expect(new AddressValidator().validate(lowercaseAddress))
            .to.be.equal(true)
        expect(new AddressValidator().validate(dashedAddress))
            .to.be.equal(true)
    })

    it('should throw an error if the address is invalid', () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF'
        expect(
            new AddressValidator().validate(address)
        ).to.be.equal('Enter a valid address. Example: SBI774-YMFDZI-FPEPC5-4EKRC2-5DKDZJ-H2QVRW-4HBP')
    })

})

describe('Address alias validator', () => {
    it('default case', () => {
        const uppercaseAddres = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3'
        const lowercaseAddress = 'sb3kubhatfcpv7uzqlwaq2eur6sihbsbeoedddf3'
        const dashedAddress = 'SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3'
        expect(new AddressAliasValidator().validate(uppercaseAddres))
            .to.be.equal(true)
        expect(new AddressAliasValidator().validate(lowercaseAddress))
            .to.be.equal(true)
        expect(new AddressAliasValidator().validate(dashedAddress))
            .to.be.equal(true)
    })

    it('default case alias', () => {
        const alias = '@nem'
        expect(new AddressAliasValidator().validate(alias))
            .to.be.equal(true)
    })

    it('should throw an error if the address is invalid', () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF'
        expect(
            new AddressAliasValidator().validate(address)
        ).to.be.equal('Enter a valid address. Example: SBI774-YMFDZI-FPEPC5-4EKRC2-5DKDZJ-H2QVRW-4HBP')
    })

    it('should throw an error if the alias is invalid', () => {
        const alias = '@myOwnAlias'
        expect(
            new AddressAliasValidator().validate(alias)
        ).to.be.equal('Enter a valid address. Example: SBI774-YMFDZI-FPEPC5-4EKRC2-5DKDZJ-H2QVRW-4HBP')
    })

})
