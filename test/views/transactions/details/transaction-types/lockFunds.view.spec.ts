import {expect} from 'chai';
import {LockFundsView} from '../../../../../src/views/transactions/details/transaction-types';
import {unsignedLockFunds1} from '../../../../mocks/transactions/lockFunds.mock';

describe('LockFundsView', () => {
 it('should return a view', () => {
  const view = LockFundsView.get(unsignedLockFunds1);
  expect(view['Duration']).equal('10 blocks');
  expect(view['Mosaic (1/1)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)');
 });
});
