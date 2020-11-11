/*
 * Copyright 2020 NEM
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
 */
import { ExpectedError } from 'clime';
import { RepositoryFactoryHttp } from 'symbol-sdk';
import { CreateProfileOptions } from '../interfaces/create.profile.options';
import { Resolver } from './resolver';

/**
 * Epoch Adjustment resolver
 */
export class EpochAdjustmentResolver implements Resolver {
    /**
     * Resolves epochAdjustment. If not provided by the user, this is asked to the node.
     * @param {CreateProfileOptions} options - Command options.
     * @throws {ExpectedError}
     * @returns {Promise<number>}
     */
    async resolve(options: CreateProfileOptions): Promise<number> {
        let epochAdjustment = 0;
        const repositoryFactory = new RepositoryFactoryHttp(options.url);
        try {
            epochAdjustment = options.epochAdjustment ? options.epochAdjustment : await repositoryFactory.getEpochAdjustment().toPromise();
        } catch (ignored) {
            throw new ExpectedError(
                'The CLI cannot reach the node. Please, pass the epochAdjustment seed from ' +
                    options.url +
                    '/network/properties with the option `--epoch-adjustment`',
            );
        }
        return epochAdjustment;
    }
}
