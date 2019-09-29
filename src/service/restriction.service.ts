import {ExpectedError} from 'clime';
import {Address, Mosaic, MosaicId, MosaicRestrictionType, NamespaceId, UInt64} from 'nem2-sdk';

export class MosaicService {
    constructor() {

    }

    public static getMosaicRestrictionType(type: number): MosaicRestrictionType{
        let restrictionType;
        switch (type) {
            case 0: restrictionType = MosaicRestrictionType.NONE; break;
            case 1: restrictionType = MosaicRestrictionType.EQ; break;
            case 2: restrictionType = MosaicRestrictionType.NE; break;
            case 3: restrictionType = MosaicRestrictionType.LT; break;
            case 4: restrictionType = MosaicRestrictionType.LE; break;
            case 5: restrictionType = MosaicRestrictionType.GT; break;
            case 6: restrictionType = MosaicRestrictionType.GE; break;
            default: throw new Error('invalid restriction type');
        }
        return restrictionType;
    }
}