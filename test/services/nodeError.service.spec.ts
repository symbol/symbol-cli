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
import {NodeErrorService} from '../../src/services/nodeError.service'

describe('Account service', () => {
    it('should return false when the error is about connect ECONNREFUSED', () => {
        const mockError = {
            message: 'Error: connect ECONNREFUSED 127.0.0.1:3000',
        }
        expect(NodeErrorService.connectErrorHandler(mockError)).to.be.false
    })

    it('should return true when the error is not about connect ECONNREFUSED', () => {
        const mockError = {
            message: JSON.stringify({code: -1, msg: 'other error'}),
        }
        expect(NodeErrorService.connectErrorHandler(mockError)).to.be.true
    })
})
