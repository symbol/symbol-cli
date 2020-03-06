import {TransactionHeaderView} from '../../../../src/views/transactions/details/transaction.header.view'
import {unsignedTransfer1} from '../../../mocks/transactions/transfer.mock'
import {expect} from 'chai'

describe('Transaction header view', () => {
    it('should return a view of an unsigned transaction', () => {
        const headerView = TransactionHeaderView.get(unsignedTransfer1)
        expect(headerView['Title']).deep.equal({
            content: 'Transfer', colSpan: 2, hAlign: 'center',
        })
        // tslint:disable-next-line:no-unused-expression
        expect(headerView['Hash']).to.be.null
        expect(headerView['Network type']).equal('MAIN_NET')
        // tslint:disable-next-line:no-unused-expression
        expect(headerView['Deadline'].length > 0).to.be.ok
        expect(headerView['Max fee']).equal('1,000')
        expect(headerView['Signer']).equal(null)
    })
})
