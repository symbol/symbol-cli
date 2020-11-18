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
import { ImportType } from '../../src/models/importType.enum';
import { ImportTypeResolver } from '../../src/resolvers/importType.resolver';

describe('Import type resolver', () => {
    it('default case', async () => {
        const importType = 'PrivateKey';
        const options = { importType } as any;
        expect(await new ImportTypeResolver().resolve(options)).to.be.equal(ImportType.PrivateKey);
    });

    it('should change key', async () => {
        const key = 'Mnemonic';
        const options = { key } as any;
        expect(await new ImportTypeResolver().resolve(options, 'altText', 'key')).to.be.equal(ImportType.Mnemonic);
    });

    it('should return import type private key', async () => {
        const privateKey = 'test';
        const options = { privateKey } as any;
        expect(await new ImportTypeResolver().resolve(options)).to.be.equal(ImportType.PrivateKey);
    });

    it('should return import type mnemonic', async () => {
        const mnemonic = 'test';
        const options = { mnemonic } as any;
        expect(await new ImportTypeResolver().resolve(options)).to.be.equal(ImportType.Mnemonic);
    });

    it('should return import type mnemonic', async () => {
        const hd = true;
        const options = { hd } as any;
        expect(await new ImportTypeResolver().resolve(options)).to.be.equal(ImportType.Mnemonic);
    });
});
