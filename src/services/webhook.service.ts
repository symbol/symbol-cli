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

import axios, {AxiosResponse} from 'axios'
import {Address, NamespaceId} from 'symbol-sdk'
import {AnnounceTransactionWebhookBuilder} from 'symbol-uri-scheme'

/**
 * Webhook service
 */
export class WebhookService {

    /**
     * Constructor
     */
    constructor() {}

    /**
     * Posts AnnounceTransactionWebhookDTO to webhookUrl.
     * @param {string} webhookUrl - URL to post AnnounceTransactionWebhookDTO.
     * @param {string} hash - Transaction hash.
     * @param {string} signerPublicKey - Transaction signer public key.
     * @returns {Address | NamespaceId}
     */
    static postAnnounceTransactionWebhook <T, R = AxiosResponse<T>>(
        webhookUrl: string, hash: string, signerPublicKey: string): Promise<AxiosResponse<T>>{
        return axios.post(webhookUrl, new AnnounceTransactionWebhookBuilder(hash, signerPublicKey).build())
    }
}
