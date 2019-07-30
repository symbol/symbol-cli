/*
 *
 * Copyright 2018 NEM
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
import {MaxFeeValidator} from '../../src/validators/maxfee.validator';

describe('Maximum fee validator', () => {

    it('Maximum fee should be greater than or equal to 0 ', () => {

        const maxFee  = 123 ;
        expect(new MaxFeeValidator().validate(maxFee,
            { name: 'maxFee', source: maxFee.toString()})).to.be.equal(undefined);
    });

});
