import {transactionDetailViewFactory} from '../../../../../src/views/transactions/details/transactionDetailViewFactory'
import {
 unsignedAccountAddressRestriction1,
 unsignedAccountLink1,
 unsignedAccountMetadata1,
 unsignedAccountMosaicRestriction1,
 unsignedAccountOperationRestriction1,
 unsignedAddressAlias1,
 unsignedAggregateBonded1,
 unsignedAggregateComplete1,
 unsignedLockFunds1,
 unsignedMosaicAddressRestriction1,
 unsignedMosaicAlias1,
 unsignedMosaicDefinition1,
 unsignedMosaicGlobalRestriction1,
 unsignedMosaicMetadata1,
 unsignedMosaicSupplyChange1,
 unsignedMultisigAccountModification1,
 unsignedNamespaceMetadata1,
 unsignedNamespaceRegistration1,
 unsignedSecretLock1,
 unsignedSecretProof1,
 unsignedTransfer1,
} from '../../../../mocks/transactions/index'
import {assert} from 'chai'

describe('Transaction detail view factory', () => {
 it('should return an object for each transaction type', () => {
  const allTransactions = [
   unsignedAccountAddressRestriction1, ,
   unsignedAccountLink1,
   unsignedAccountMetadata1,
   unsignedAccountMosaicRestriction1,
   unsignedAccountOperationRestriction1,
   unsignedAddressAlias1,
   unsignedAggregateBonded1,
   unsignedAggregateComplete1,
   unsignedLockFunds1,
   unsignedMosaicAddressRestriction1,
   unsignedMosaicAlias1,
   unsignedMosaicDefinition1,
   unsignedMosaicGlobalRestriction1,
   unsignedMosaicMetadata1,
   unsignedMosaicSupplyChange1,
   unsignedMultisigAccountModification1,
   unsignedNamespaceMetadata1,
   unsignedNamespaceRegistration1,
   unsignedSecretLock1,
   unsignedSecretProof1,
   unsignedTransfer1,
  ]

  allTransactions.forEach((tx) => assert.typeOf(
   transactionDetailViewFactory(unsignedAccountAddressRestriction1),
   'Object', `${tx?.type}`,
  ))
 })
})
