import {expect} from 'chai';
import {TransactionType} from 'nem2-sdk';
import {transactionNameFromType} from '../../../../../src/views/transactions/details/transactionNameFromType';

describe('Transaction name from type', () => {
 it('should return a string for each transaction type', () => {
  const numericTypes = Object.keys(TransactionType)
   .map((key) => parseInt(key, 10))
   .filter((x) => x);

  const namesFromTypes = numericTypes.map((key) => transactionNameFromType(key));

  expect(numericTypes.length).equal(namesFromTypes.length);
 });
});
