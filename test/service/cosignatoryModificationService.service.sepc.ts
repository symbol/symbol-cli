import {expect} from 'chai';
import {CosignatoryModificationAction} from 'nem2-sdk';
import {CosignatoryModificationService} from '../../src/service/cosignatoryModificationService.service';

describe('CosignatoryModification service', () => {
    it('Input 1 should return CosignatoryModificationAction.Add', () => {
        const action = 1;
        const cosignatoryModificationService = new CosignatoryModificationService();
        expect(cosignatoryModificationService.getCosignatoryModificationAction(action)).to.be.equal(CosignatoryModificationAction.Add);
    });

    it('Input 0 should return CosignatoryModificationAction.Remove', () => {
        const action = 0;
        const cosignatoryModificationService = new CosignatoryModificationService();
        expect(cosignatoryModificationService.getCosignatoryModificationAction(action)).to.be.equal(CosignatoryModificationAction.Remove);
    });

    it('Input 3 should return CosignatoryModificationAction.Remove', () => {
        const action = 3;
        const cosignatoryModificationService = new CosignatoryModificationService();
        expect(cosignatoryModificationService.getCosignatoryModificationAction(action)).to.be.equal(CosignatoryModificationAction.Remove);
    });
});
