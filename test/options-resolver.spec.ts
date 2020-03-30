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
import {expect} from 'chai'
import * as proxyquire from 'proxyquire'
import * as sinon from 'sinon'

import {ActionType} from '../src/models/action.enum'
import {ActionValidator} from '../src/validators/action.validator'
import {NumericStringValidator} from '../src/validators/numericString.validator'
import {OptionsChoiceResolver, OptionsConfirmResolver, OptionsResolver} from '../src/options-resolver'

describe('OptionsResolver', () => {
    before(() => { sinon.stub(process, 'exit') })
    after(() => { (process.exit as any).restore() })

    it('should return the value', async () => {
        const value = await OptionsResolver({name: 'nem'}, 'name',
            () => undefined, 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('nem')
    })

    it('should return the value trimmed', async () => {
        const value = await OptionsResolver({name: 'nem '}, 'name',
            () => undefined, 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('nem')
    })

    it('should return the value (int)', async () => {
        const value = await OptionsResolver({name: 0}, 'name',
            () => undefined, 'Insert your name', 'text', undefined)
        expect(value).to.be.equal(0)
    })

    it('should return the secondSource value', async () => {
        const value = await OptionsResolver({}, 'name',
            () => 'nem', 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('nem')
    })

    it('should pass validation', async () => {
        const value = await OptionsResolver({name: '1'}, 'name',
            () => undefined, 'Insert your name', 'text', new NumericStringValidator())
        expect(value).to.be.equal('1')
    })

    it('should not pass validation', async () => {
        const value = await OptionsResolver({name: 'Not a numeric string'}, 'name',
            () => undefined, 'Insert your name', 'text', new NumericStringValidator())
        expect(value).to.be.undefined
        sinon.assert.called(process.exit as any)
    })

    it('should prompt the user when provided a wrong option key', async () => {
        const stub = sinon.stub().returns({name: 'user was prompted'})
        const optionsResolver = proxyquire('../src/options-resolver', {prompts: stub})
        const value = await optionsResolver.OptionsResolver(
            {dummy: 'dummy'},
            'name',
            () => undefined,
            '',
            'text',
            undefined,
        )
        expect(value).equal('user was prompted')
    })
})

describe('OptionsChoiceResolver', () => {
    before(() => { sinon.stub(process, 'exit') })
    after(() => { (process.exit as any).restore() })

    it('should return the value', async () => {
        const choices = [
            {title: 'nem', value: 0},
            {title: 'mijin', value: 1},
        ]
        const value = await OptionsChoiceResolver({name: 'nem'},
            'name', 'Select name:', choices, 'select', undefined)
        expect(value).to.be.equal(0)
    })

    it('should pass validation', async () => {
        const choices = [
            {title: 'Remove', value: ActionType.Remove},
        ]
        const value = await OptionsChoiceResolver({name: 'Remove'},
            'name', 'Select name:', choices, 'select', new ActionValidator())
        expect(value).to.be.equal(ActionType.Remove)
    })

    it('should not pass validation', async () => {
        const choices = [
            {title: 'Remove', value: ActionType.Remove},
        ]
        const value = await OptionsChoiceResolver({name: 'Wrong action'},
            'name', 'Select name:', choices, 'select', new ActionValidator())
        expect(value).to.be.undefined
        sinon.assert.called(process.exit as any)
    })

    it('should prompt the user when provided a wrong option key', async () => {
        const stub = sinon.stub().returns({name: 'user was prompted'})
        const optionsResolver = proxyquire('../src/options-resolver', {prompts: stub})
        const value = await optionsResolver.OptionsChoiceResolver(
            {dummy: 'dummy'},
            'name',
            'test',
            [],
            'select',
            undefined,
        )
        expect(value).equal('user was prompted')
    })

    it('should prompt the user when provided a wrong option key and not pass the validation', async () => {
        const stub = sinon.stub().returns({name: 'user was prompted'})
        const optionsResolver = proxyquire('../src/options-resolver', {prompts: stub})
        const value = await optionsResolver.OptionsChoiceResolver(
            {dummy: 'dummy'},
            'name',
            'test',
            [],
            'select',
            undefined,
        )
        expect(value).equal('user was prompted')
    })
})

describe('OptionsConfirmationResolver', () => {
    it('should return the value', async () => {
        const value = await OptionsConfirmResolver({name: true}, 'name',
            'test', 'confirm', true, 'value')
        expect(value).to.be.equal(true)
    })

    it('should prompt the user when provided a wrong option key', async () => {
        const stub = sinon.stub().returns({value: 'user was prompted'})
        const optionsResolver = proxyquire('../src/options-resolver', {prompts: stub})
        const value = await optionsResolver.OptionsConfirmResolver(
            {dummy: 'dummy'},
            'name',
            'test',
            'confirm',
            true,
        )
        expect(value).equal('user was prompted')
    })
})

