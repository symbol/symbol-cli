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
import {TransactionURIValidator} from '../../src/validators/transactionURI.validator'
import {expect} from 'chai'

describe('TransactionURI validator', () => {

    it('default case', () => {
        const uri = 'web+symbol://transaction?data=data&generationHash=gh'
        expect(new TransactionURIValidator().validate(uri))
            .to.be.equal(true)
    })

    it('should throw error if invalid uri', () => {
        const uri = 'web+symbol://transaction?dat'
        expect(new TransactionURIValidator().validate(uri))
            .to.be.equal('Transaction URI format is not valid. ' +
            'Example: web+symbol://transaction?data=:data&generationHash=:generationHash&nodeUrl=:nodeUrl&webhookUrl=:webhookUrl')
    })

})
