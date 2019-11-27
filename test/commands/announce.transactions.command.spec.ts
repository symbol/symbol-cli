import {expect} from 'chai';
import {AnnounceTransactionsCommand} from '../../src/announce.transactions.command';

describe('Announce Transactions Command', () => {

    class StubCommand extends AnnounceTransactionsCommand {
        constructor() {
            super();
        }

        execute(...args: any[]) {
            throw new Error('Method not implemented.');
        }
    }

    it('format payload with 64 chars', () => {
        const payload = '0'.repeat(64);
        const command = new StubCommand();
        expect(command['formatPayload'](payload).length).to.be.equal(1);
        expect(command['formatPayload'](payload)[0]).to.be.equal(payload);
    });

    it('format payload with less than 64 chars', () => {
        const payload = '0'.repeat(30);
        const command = new StubCommand();
        expect(command['formatPayload'](payload).length).to.be.equal(1);
        expect(command['formatPayload'](payload)[0]).to.be.equal(payload);
    });

    it('format payload with more than 64 chars', () => {
        const payload = '0'.repeat(65);
        const command = new StubCommand();
        expect(command['formatPayload'](payload).length).to.be.equal(2);
        expect(command['formatPayload'](payload)[0]).to.be.equal(payload.substring(0, 64));
        expect(command['formatPayload'](payload)[1]).to.be.equal(payload.substring(64, 65));
    });

    it('format empty payload', () => {
        const payload = '';
        const command = new StubCommand();
        expect(command['formatPayload'](payload).length).to.be.equal(0);
    });
});
