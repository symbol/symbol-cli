import {expect} from 'chai';
import {LinkAction} from 'nem2-sdk';
import {LinkAccountView} from '../../../../../src/views/transactions/details/transaction-types';
import {account1} from '../../../../mocks/accounts.mock';
import {unsignedLinkAccount1} from '../../../../mocks/transactions/linkAccount.mock';

describe('Account link view', () => {
 it('should return a view', () => {
  const view = LinkAccountView.get(unsignedLinkAccount1);
  expect(view['Action']).equal(LinkAction[LinkAction.Link]);
  expect(view['Remote public key']).equal(account1.publicKey);
 });
});
