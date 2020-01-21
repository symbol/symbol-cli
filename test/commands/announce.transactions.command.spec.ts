import {expect} from 'chai';
import {AnnounceTransactionFieldsTable} from '../../src/commands/announce.transactions.command';

describe('Announce Transactions Command', () => {

    it('should format payload with 64 chars', () => {
        const payload = '0'.repeat(64);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload).length).to.be.equal(1);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload)[0]).to.be.equal(payload);
    });

    it('should format payload with less than 64 chars', () => {
        const payload = '0'.repeat(30);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload).length).to.be.equal(1);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload)[0]).to.be.equal(payload);
    });

    it('should format payload with more than 64 chars', () => {
        const payload = '0'.repeat(65);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload).length).to.be.equal(2);
        expect(AnnounceTransactionFieldsTable.formatPayload(payload)[0]).to.be.equal(payload.substring(0, 64));
        expect(AnnounceTransactionFieldsTable.formatPayload(payload)[1]).to.be.equal(payload.substring(64, 65));
    });

    it('should format empty payload', () => {
        const payload = '';
        expect(AnnounceTransactionFieldsTable.formatPayload(payload).length).to.be.equal(0);
    });
});
