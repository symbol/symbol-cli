import {expect} from 'chai';
import {RegisterNamespaceView} from '../../../../../src/views/transactions/details/transaction-types';
import {namespaceId1} from '../../../../mocks/namespaces.mock';
import {unsignedRegisterNamespace1, unsignedRegisterSubNamespace1} from '../../../../mocks/transactions/registerNamespace.mock';

describe('Register namespace view', () => {
 it('should return a view of a root namespace registration', () => {
  const view = RegisterNamespaceView.get(unsignedRegisterNamespace1);
  expect(view['Namespace name']).equal('root-test-namespace');
  expect(view['Type']).equal('Root namespace');
  expect(view['Duration']).equal('1000 blocks');
  // tslint:disable-next-line:no-unused-expression
  expect(view['Parent Id']).to.be.undefined;
 });

 it('should return a view of a sub namespace registration', () => {
  const view = RegisterNamespaceView.get(unsignedRegisterSubNamespace1);
  expect(view['Namespace name']).equal('sub-test-namespace');
  expect(view['Type']).equal('Sub namespace');
  expect(view['Parent Id']).equal(namespaceId1.toHex());
  // tslint:disable-next-line:no-unused-expression
  expect(view['Duration']).to.be.undefined;
 });
});
