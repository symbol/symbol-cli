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
import * as crypto from 'crypto-js'
import {Password} from 'symbol-sdk'

export class EncryptionService {
 /**
  * Encrypt data
  * @param {string} data
  * @param {string} salt
  * @param {Password} password
  */
 public static encrypt(
  data: string,
  password: Password,
 ): string {
  const salt = crypto.lib.WordArray.random(16)

  // generate password based key
  const key = crypto.PBKDF2(password.value, salt, {
   keySize: 8,
   iterations: 1024,
  })

  // encrypt using random IV
  const iv = crypto.lib.WordArray.random(16)

  const encrypted = crypto.AES.encrypt(data, key, {
   // @ts-ignore, the type definition is wrong
   iv,
   padding: crypto.pad.Pkcs7,
   mode: crypto.mode.CBC,
  })

  // salt (16 bytes) + iv (16 bytes)
  // prepend them to the ciphertext for use in decryption
  return salt.toString() + iv.toString() + encrypted.toString()
 }

 /**
  * Decrypt data
  * @param {string} data
  * @param {string} salt
  * @param {Password} password
  */
 public static decrypt(
  data: string,
  password: Password,
 ): string {
  const salt = crypto.enc.Hex.parse(data.substr(0, 32))
  const iv = crypto.enc.Hex.parse(data.substr(32, 32))
  const encrypted = data.substring(64)

  // generate password based key
  const key = crypto.PBKDF2(password.value, salt, {
   keySize: 8,
   iterations: 1024,
  })

  // decrypt using custom IV
  const decrypted = crypto.AES.decrypt(encrypted, key, {
   iv,
   padding: crypto.pad.Pkcs7,
   mode: crypto.mode.CBC,
  })

  return decrypted.toString(crypto.enc.Utf8)
 }
}
