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
import {OptionsChoiceResolver, OptionsResolver} from '../src/options-resolver';

describe('OptionsResolver', () => {
    it('should return the value if contains the commands option is passed', async () => {
        const value = await OptionsResolver({name: 'nem'}, 'name', () => undefined, 'Insert your name');
        expect(value).to.be.equal('nem');
    });

    it('should return the value 0 if contains the commands option is passed', async () => {
        const value = await OptionsResolver({name: 0}, 'name', () => undefined, 'Insert your name');
        expect(value).to.be.equal(0);
    });

    // TODO: To be finish
    // it('should return the value inserted via console if it is not in the command options object', async () => {
    //     const promptText = 'Insert your name';
    //     const readlineSyncMock = {
    //         question : (text: string) => text === promptText ? 'nem' : undefined,
    //     };
    //     const value = await OptionsResolver({}, 'name', () => undefined, promptText, readlineSyncMock);
    //     expect(value).to.be.equal('nem');
    // });

    it('should return the secondSource value if command options object have not it and secondValue is not undefined', async () => {
        const value = await OptionsResolver({}, 'name', () => 'nem', 'Insert your name');
        expect(value).to.be.equal('nem');
    });
});

describe('OptionsChoicesResolver', () => {
    it('should return the value if contains the commands option is passed', () => {
        const choices = [
            {title: 'nem', value: 0},
            {title: 'mijin', value: 1},
        ];
        const value = OptionsChoiceResolver({name: 'nem'}, 'name', 'Select name: ', choices);
        expect(value).to.be.equal('nem');
    });

    // TODO: finish this test
    // it('should return the value inserted via console if it is not in the command options object', () => {
    //     const choices = [
    //         {title: 'nem', value: 0},
    //         {title: 'mijin', value: 1},
    //     ];
    //     const readlineSyncMock = {
    //         keyInSelect : (ignored: number) => 0,
    //     };
    //     const index = OptionsChoiceResolver({}, 'name', 'Select name: ', choices, readlineSyncMock);
    //     expect(choices[index]).to.be.equal('nem');
    // });
});
