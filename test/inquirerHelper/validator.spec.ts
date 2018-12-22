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
import {Account, NetworkType} from 'nem2-sdk';
import {
  address,
  key,
  message,
  mosaic,
  mosaicFqn,
  namespace,
  transactionHash,
  transferSchema,
  uint64,
  url,
} from '../../src/inquirerHelper/validator';

describe('Validation', () => {
    describe('address', () => {
        it('should be valid.',
          () => expect(address()('SB7DSW33YXAUQWNNBG6TRC652UDF7W7ESTMIDPJZ')).to.be.true);
        it('should be valid.',
          () => expect(address()('MACK4XZ3CCCPXWCC5FXIR4GQ4I5WCV6HPY6UV66D')).to.be.true);
    });
    describe('address with hyphen', () => {
        it('should be valid.',
          () => expect(address()('NBF23D-AOERAM-4TTI3U-MQ5VTR-CLBQ6X-YIJWRB-GQN6')).to.be.true);
        it('should be valid.',
          () => expect(address()('TCP3F4-OHPI64-CMBKUP-YEB3JW-5CNNIK-GIAZF6-RO5L')).to.be.true);
    });

    describe('key', () => {
        it('should be valid.',
          () => expect(key()('706B22AF6E95541A2AEE209DD635FABB06AD2D6D4FB6ECFB59AD1AA4E9C2F1DB')).to.be.true);
    });

    describe('message', () => {
        it('should be valid.',
          () => expect(message()('GOOD LUCK!')).to.be.true);
        it('should be valid.',
          () => expect(message()('A'.repeat(1023))).to.be.true);
        it('should be invalid.',
          () => expect(message()('A'.repeat(1024))).not.to.be.true);
    });

    describe('mosaic', () => {
        it('should be valid.', () => expect(mosaic()('foobar')).to.be.true);
    });

    describe('mosaicFqn', () => {
        it('should be valid.', () => expect(mosaicFqn()('nem:xem')).to.be.true);
    });

    describe('namespace', () => {
        it('should be valid.', () => expect(namespace()('foobar')).to.be.true);
    });

    describe('transactionHash', () => {
        it('should be valid.',
          () => expect(transactionHash()('FED1744F47E5E7DC5908505661E3A39BCB133E929CFF0E14434C7380CEFF63F5')).to.be.true);
    });

    describe('transferSchema', () => {
        it('should be valid.',
          () => expect(transferSchema()('nem:xem::1000000')).to.be.true);
    });

    describe('uint64', () => {
        it('should be valid.',
          () => expect(uint64()('[  929036875, 2226345261 ]')).to.be.true);
        it('should be valid.',
          () => expect(uint64()('[ 3646934825, 3576016193 ]')).to.be.true);
    });

    describe('url', () => {
        it('should be valid.',
          () => expect(url()('http://localhost:3000')).to.be.true);
        it('should be valid.',
          () => expect(url()('https://example.com:3000')).to.be.true);
    });
});
