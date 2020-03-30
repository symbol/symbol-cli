import {expect} from 'chai'
import {block1Transactions} from '../../../mocks/transactions/block1Transactions.mock'
import {TransactionHeaderView} from '../../../../src/views/transactions/details/transaction.header.view'
import {unsignedTransfer1} from '../../../mocks/transactions/transfer.mock'

describe('Transaction header view', () => {
    it('should return a view of an unsigned transaction', () => {
        const headerView = TransactionHeaderView.get(unsignedTransfer1)
        expect(headerView['Title']).deep.equal({
            content: 'Transfer', colSpan: 2, hAlign: 'center',
        })
        expect(headerView['Hash']).to.be.undefined
        expect(headerView['Height (Block)']).to.be.undefined
        expect(headerView['Index']).to.be.undefined
        expect(headerView['Network type']).equal('MAIN_NET')
        expect(headerView['Deadline'].length > 0).to.be.ok
        expect(headerView['Max fee']).equal('1,000')
        expect(headerView['Signer']).to.be.undefined
        })

    it('should return a view of a signed transaction', () => {
        const [signedNamespaceRegistration] = block1Transactions
        const headerView = TransactionHeaderView.get(signedNamespaceRegistration)
        expect(headerView['Title']).deep.equal({
            content: 'Namespace registration', colSpan: 2, hAlign: 'center',
        })
        expect(headerView['Hash']).equal('AE20807998CE55A1971D0ACEE79B56F9A60E1A845EEBD29A9DC6243A64556116')
        expect(headerView['Max fee']).equal('0')
        expect(headerView['Index']).equal(0)
        expect(headerView['Network type']).equal('TEST_NET')
        expect(headerView['Deadline'].length > 0).to.be.ok
        expect(headerView['Signer']).equal('TAL4UF-RKGFXZ-WMLH73-KEC54T-TUD3N5-XSNR2J-4VRG')
    })
})
