import {transactionNameFromType} from '../../../../../src/views/transactions/details/transactionNameFromType'
import {expect} from 'chai'
import {TransactionType} from 'symbol-sdk'

describe('Transaction name from type', () => {
 it('should return a string for each transaction type', () => {
  const numericTypes = Object.keys(TransactionType)
   .map((key) => parseInt(key, 10))
   .filter((x) => x)

  const namesFromTypes = numericTypes.map((key) => transactionNameFromType(key))

  expect(numericTypes.length).equal(namesFromTypes.length)
 })
})
