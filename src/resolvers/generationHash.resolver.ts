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
import { ExpectedError } from 'clime';
import { NodeHttp } from 'symbol-sdk';

import { CreateProfileOptions } from '../interfaces/create.profile.options';
import { Resolver } from './resolver';

/**
 * Generation hash resolver
 */
export class GenerationHashResolver implements Resolver {
    /**
     * Resolves generationHash. If not provided by the user, this is asked to the node.
     * @param {CreateProfileOptions} options - Command options.
     * @throws {ExpectedError}
     * @returns {Promise<string>}
     */
    async resolve(options: CreateProfileOptions): Promise<string> {
        let generationHash = '';
        const nodeHttp = new NodeHttp(options.url);
        try {
            generationHash = options.generationHash
                ? options.generationHash
                : (await nodeHttp.getNodeInfo().toPromise()).networkGenerationHashSeed;
        } catch (ignored) {
            throw new ExpectedError(
                'The CLI cannot reach the node. Please, check if you can reach the Symbol url provided: ' + options.url + '/node/info',
            );
        }
        return generationHash;
    }
}
