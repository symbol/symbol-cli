import {expect} from 'chai'
import {AccountTransactionsOptions} from '../../src/interfaces/account.transactions.command'

describe('Announce Transactions Command', () => {

    it('should get query params', () => {
        const options = new AccountTransactionsOptions()
        options.numTransactions = 10
        expect(options.getQueryParams().pageSize).to.be.equal(10)
        expect(options.getQueryParams().id).to.be.equal(undefined)
    })
    it('should get query params with id', () => {
        const options = new AccountTransactionsOptions()
        options.numTransactions = 10
        options.id = '1'
        expect(options.getQueryParams().pageSize).to.be.equal(10)
        expect(options.getQueryParams().id).to.be.equal('1')
    })

})
