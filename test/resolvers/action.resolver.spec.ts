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
import {LinkAction, MosaicSupplyChangeAction} from 'symbol-sdk'
import {ActionType} from '../../src/models/action.enum'
import {ActionResolver, LinkActionResolver, SupplyActionResolver} from '../../src/resolvers/action.resolver'

describe('Action resolver', () => {

    it('should return action', async () => {
        const profileOptions = {action: 'Remove'} as any
        expect(await new ActionResolver().resolve(profileOptions))
            .to.be.equal(ActionType.Remove)
    })

    it('should change key', async () => {
        const profileOptions = {key: 'Remove'} as any
        expect(await new ActionResolver()
            .resolve(profileOptions, undefined, 'altText', 'key'))
            .to.be.equal(ActionType.Remove)
    })

})

describe('Link action resolver', () => {

    it('default case', async () => {
        const profileOptions = {action: 'Unlink'} as any
        expect(await new LinkActionResolver().resolve(profileOptions))
            .to.be.equal(LinkAction.Unlink)
    })

    it('should change key', async () => {
        const profileOptions = {key: 'Unlink'} as any
        expect(await new LinkActionResolver()
            .resolve(profileOptions, undefined, 'altText', 'key'))
            .to.be.equal(LinkAction.Unlink)
    })

})

describe('Supply action resolver', () => {

    it('default case', async () => {
        const profileOptions = {action: 'Decrease'} as any
        expect(await new SupplyActionResolver().resolve(profileOptions))
            .to.be.equal(MosaicSupplyChangeAction.Decrease)
    })

    it('should change key', async () => {
        const profileOptions = {key: 'Decrease'} as any
        expect(await new SupplyActionResolver()
            .resolve(profileOptions, undefined, 'altText', 'key'))
            .to.be.equal(MosaicSupplyChangeAction.Decrease)
    })

})
