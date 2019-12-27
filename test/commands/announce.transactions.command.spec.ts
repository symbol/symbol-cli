import {expect} from 'chai';
import {AnnounceTransactionsCommand} from '../../src/announce.transactions.command';

describe('Announce Transactions Command', () => {

    it('format payload with 64 chars', () => {
        const payload = '0'.repeat(64);
        expect(AnnounceTransactionsCommand.formatPayload(payload).length).to.be.equal(1);
        expect(AnnounceTransactionsCommand.formatPayload(payload)[0]).to.be.equal(payload);
    });

    it('format payload with less than 64 chars', () => {
        const payload = '0'.repeat(30);
        expect(AnnounceTransactionsCommand.formatPayload(payload).length).to.be.equal(1);
        expect(AnnounceTransactionsCommand.formatPayload(payload)[0]).to.be.equal(payload);
    });

    it('format payload with more than 64 chars', () => {
        const payload = '0'.repeat(65);
        expect(AnnounceTransactionsCommand.formatPayload(payload).length).to.be.equal(2);
        expect(AnnounceTransactionsCommand.formatPayload(payload)[0]).to.be.equal(payload.substring(0, 64));
        expect(AnnounceTransactionsCommand.formatPayload(payload)[1]).to.be.equal(payload.substring(64, 65));
    });

    it('format empty payload', () => {
        const payload = '';
        expect(AnnounceTransactionsCommand.formatPayload(payload).length).to.be.equal(0);
    });
});
