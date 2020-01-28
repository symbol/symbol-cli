import {expect} from 'chai';
import {TransactionType} from 'nem2-sdk';
import {AccountRestrictionOperationView} from '../../../../../src/views/transactions/details/transaction-types';
import {
 operation1, operation2, operation3, unsignedAccountRestrictionOperation1,
} from '../../../../mocks/transactions/accountRestrictionOperation.mock';

describe('Account restriction operation view', () => {
 it('should return a view', () => {
  const view = AccountRestrictionOperationView.get(unsignedAccountRestrictionOperation1);
  expect(view['Account restriction flag']).equal('AllowIncomingTransactionType');
  expect(view['Addition 1 of 2']).equal(TransactionType[operation1]);
  expect(view['Addition 2 of 2']).equal(TransactionType[operation2]);
  expect(view['Deletion 1 of 1']).equal(TransactionType[operation3]);
 });
});
