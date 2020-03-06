import {AccountTransactionsOptions} from '../../src/interfaces/account.transactions.command'
import {expect} from 'chai'
import {Order} from 'symbol-sdk'

describe('Announce Transactions Command', () => {

    it('should get query params', () => {
        const options = new AccountTransactionsOptions()
        expect(options.getQueryParams().pageSize).to.be.equal(10)
        expect(options.getQueryParams().order).to.be.equal(Order.DESC)
        expect(options.getQueryParams().id).to.be.equal(undefined)
    })

    it('should get query params with pageSize', () => {
        const options = new AccountTransactionsOptions()
        options.pageSize = 100
        expect(options.getQueryParams().pageSize).to.be.equal(100)
    })

    it('should get query params with id', () => {
        const options = new AccountTransactionsOptions()
        options.id = '1'
        expect(options.getQueryParams().id).to.be.equal('1')
    })

    it('should get query params with order', () => {
        const options = new AccountTransactionsOptions()
        options.order = 'ASC'
        expect(options.getQueryParams().order).to.be.equal(Order.ASC)
    })

})
