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
import {ActionResolver, LinkActionResolver, SupplyActionResolver} from '../../src/resolvers/action.resolver'
import {ActionType} from '../../src/interfaces/action.resolver'
import {LinkAction, MosaicSupplyChangeAction} from 'nem2-sdk'

describe('Action resolver', () => {

    it('should return action', () => {
        const profileOptions = {action: ActionType.Remove} as any
        expect(new ActionResolver().resolve(profileOptions))
            .to.be.equal(ActionType.Remove)
    })

    it('should throw error if not 0 or 1', () => {
        const profileOptions = {action: 2} as any
        expect(() => new ActionResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})

describe('Link action resolver', () => {

    it('default case', () => {
        const profileOptions = {action: LinkAction.Unlink} as any
        expect(new LinkActionResolver().resolve(profileOptions))
            .to.be.equal(LinkAction.Unlink)
    })

    it('should throw error if not 0 or 1', () => {
        const profileOptions = {action: 2} as any
        expect(() => new LinkActionResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})

describe('Supply action resolver', () => {

    it('default case', () => {
        const profileOptions = {action: MosaicSupplyChangeAction.Decrease} as any
        expect(new SupplyActionResolver().resolve(profileOptions))
            .to.be.equal(MosaicSupplyChangeAction.Decrease)
    })

    it('should throw error if not 0 or 1', () => {
        const profileOptions = {action: 2} as any
        expect(() => new SupplyActionResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})
