import { CosignatoryModificationAction } from 'nem2-sdk';

export class CosignatoryModificationService {
    public getCosignatoryModificationAction(action: number): CosignatoryModificationAction {
        let modificationAction = CosignatoryModificationAction.Remove;
        if (1 === action) {
            modificationAction = CosignatoryModificationAction.Add;
        }
        return modificationAction;
    }
}
