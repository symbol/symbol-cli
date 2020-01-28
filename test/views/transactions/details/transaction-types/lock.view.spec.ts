import {expect} from 'chai';
import {LockView} from '../../../../../src/views/transactions/details/transaction-types';
import {unsignedLock1} from '../../../../mocks/transactions/lock.mock';

describe('Lock view', () => {
 it('should return a view', () => {
  const view = LockView.get(unsignedLock1);
  expect(view['Duration']).equal('10 blocks');
  expect(view['Mosaic (1/1)']).equal('1,234,567,890 symbol.xym (E74B99BA41F4AFEE)');
 });
});
