import {expect} from 'chai';
import {
    HashType,
    NetworkType,
} from 'nem2-sdk';
import {SecretLockService} from '../../src/service/secretlock.service';

describe('SecretLock Service network type', () => {
    it('Valid network type: MAIN_NET', () => {
        const networkType = 'MAIN_NET';
        expect(new SecretLockService().getNetworkType(networkType)).to.be.equal(NetworkType.MAIN_NET);
    })
});
