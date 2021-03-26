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
import { Options } from 'clime';
import { CosignatureSignedTransaction, UInt64 } from 'symbol-sdk';
import { OptionsResolver } from '../options-resolver';
import { Resolver } from './resolver';

/**
 * Cosignature resolver
 */
export class CosignatureResolver implements Resolver {
    /**
     * Resolves an cosignature json array provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<CosignatureSignedTransaction[] | null>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<CosignatureSignedTransaction[] | null> {
        const resolution = await OptionsResolver(
            options,
            altKey ? altKey : 'cosignatures',
            () => undefined,
            altText ? altText : 'Cosignature JSON array in square brackets (Enter to skip):',
            'text',
            undefined, // TODO validation
        );
        if (!resolution) {
            return null;
        }

        try {
            const cosignaturesParsed = JSON.parse(resolution) as CosignatureSignedTransaction[];
            const cosignatures = cosignaturesParsed.map(
                (p) =>
                    new CosignatureSignedTransaction(
                        p.parentHash,
                        p.signature,
                        p.signerPublicKey,
                        new UInt64([p.version.higher, p.version.lower]),
                    ),
            );
            return cosignatures;
        } catch (err) {
            console.log('Unexpected format! Please make sure the input is a valid JSON array. It must be wrapped in square brackets [].');
            process.exit();
        }
    }
}
