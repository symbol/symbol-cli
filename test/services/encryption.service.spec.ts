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
import {Password} from 'symbol-sdk'
import {EncryptionService} from '../../src/services/encryption.service'
import {expect} from 'chai'

const cipher1 = EncryptionService.encrypt('a', new Password('password'))
const cipher2 = EncryptionService.encrypt('a', new Password('password'))
const knownPass = new Password('password')
const knownValue = '987654321'
const knownCipher = '9c3afe1b658403d7522886cda510a3714c389ce697128ab8d3877bbbb53c2ecdY+QgfP/KHmUl+wk7rPwmEQ=='

describe('EncryptionService', () => {
   it('encrypt() should generate distinct values always', () => {
      expect(cipher1 === cipher2).equal(false)
   })

   it('decrypt() should return value given valid ciphertext and password', () => {
      const plain = EncryptionService.decrypt(knownCipher, knownPass)
      expect(plain.length).equal(knownValue.length)
      expect(plain).equal(knownValue)
   })

   it('decrypt() should return empty given invalid ciphertext', () => {
      const cipher = '+QgfP/KHmUl+wk7rPwmEQ==' // invalid ciphertext
      const plain = EncryptionService.decrypt(cipher, knownPass)
      expect(plain.length).equal(0)
      expect(plain).equal('')
   })

   it('decrypt() should return empty given invalid password', () => {
      const plain = EncryptionService.decrypt(knownCipher, new Password('password1')) // invalid password
      expect(plain.length).equal(0)
      expect(plain).equal('')
   })

   it('decrypt() should accept ciphertext given encrypt', () => {
      const data = [
         'encrypt',
         'this',
      ]

      data.forEach((word: string) => {
         const pw = new Password('1234567a')
         const cipher = EncryptionService.encrypt(word, pw)
         const plain = EncryptionService.decrypt(cipher, pw)
         expect(plain).equal(word)
      })
   })
})
