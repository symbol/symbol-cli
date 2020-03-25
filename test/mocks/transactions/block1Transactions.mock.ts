/*
 * Copyright 2019 NEM
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
// @ts-ignore
import {CreateTransactionFromDTO} from 'symbol-sdk/dist/src/infrastructure/transaction/CreateTransactionFromDTO'
import {Transaction} from 'symbol-sdk'

const DTO = [{
 meta: {
  height: '1',
  hash: 'AE20807998CE55A1971D0ACEE79B56F9A60E1A845EEBD29A9DC6243A64556116',
  merkleComponentHash:
   'AE20807998CE55A1971D0ACEE79B56F9A60E1A845EEBD29A9DC6243A64556116',
  index: 0,
  id: '5DDF43755553ED2B86297484',
 },
 transaction: {
  signature:
   'B48F1734E94678B520B0BDB0F1020CBF0BCCF573EA27117A9811EFA65780DDD370D207C856AEA11DD8BA27749AD8AE4F894777B771606EBF1B79B00BE3FC890A',
  signerPublicKey:
   'D33212292076DF6F87CFA8B81887FDA2657BBC37CBA183798F43DC27380F75A7',
  version: 1,
  network: 152,
  type: 16718,
  maxFee: '0',
  deadline: '1',
  registrationType: 0,
  duration: '0',
  id: '84B3552D375FFA4B',
  name: 'symbol',
 },
},
{
 meta: {
  height: '1',
  hash: 'D262BD65BC083A83C152498F722DA4EEB1F3B4836128A75A8EB18D67E36DBAF0',
  merkleComponentHash:
   'D262BD65BC083A83C152498F722DA4EEB1F3B4836128A75A8EB18D67E36DBAF0',
  index: 1,
  id: '5DDF43755553ED2B86297485',
 },
 transaction: {
  signature:
   '10241021C0E062286EDDF78886B8F782D7E1DD94A750226F0EA601795BAADD0675515E17880D8429FEA4507AB1DA7CFE9C606C4DCFA8C234A2B7B64825291A00',
  signerPublicKey:
   'D33212292076DF6F87CFA8B81887FDA2657BBC37CBA183798F43DC27380F75A7',
  version: 1,
  network: 152,
  type: 16718,
  maxFee: '0',
  deadline: '1',
  registrationType: 1,
  parentId: '84B3552D375FFA4B',
  id: 'D525AD41D95FCF29',
  name: 'xym',
 },
},
{
 meta: {
  height: '1',
  hash: 'D87A4A2C2D0696E4A6F337E86BE346D8CE98E45C024A23E6958C04849EB04BFF',
  merkleComponentHash:
   'D87A4A2C2D0696E4A6F337E86BE346D8CE98E45C024A23E6958C04849EB04BFF',
  index: 2,
  id: '5DDF43755553ED2B86297486',
 },
 transaction: {
  signature:
   '768DBBF65CC3A010E0A8DB69C5D3C44E5DA44780E53B34FAD7BC916A123F359993EE5966C6C8181BDA89F86D15DAE294E708DC28277C6D505974E9308E8EAB0D',
  signerPublicKey:
   'D33212292076DF6F87CFA8B81887FDA2657BBC37CBA183798F43DC27380F75A7',
  version: 1,
  network: 152,
  type: 16717,
  maxFee: '0',
  deadline: '1',
  nonce: 0,
  id: '46BE9BC0626F9B1A',
  flags: 2,
  divisibility: 6,
  duration: '0',
 },
}]

export const block1Transactions: Transaction[] = DTO.map((dto) => CreateTransactionFromDTO(dto))
