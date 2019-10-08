import {ExpectedError} from 'clime';
import {Address, Mosaic, MosaicId, MosaicRestrictionType, NamespaceId, UInt64} from 'nem2-sdk';

export class MosaicService {
    constructor() {

    }

    public static getMosaicRestrictionType(type: string): MosaicRestrictionType {
        let restrictionType;
        switch (type) {
            case 'NONE': restrictionType = MosaicRestrictionType.NONE; break;
            case 'EQ': restrictionType = MosaicRestrictionType.EQ; break;
            case 'NE': restrictionType = MosaicRestrictionType.NE; break;
            case 'LT': restrictionType = MosaicRestrictionType.LT; break;
            case 'LE': restrictionType = MosaicRestrictionType.LE; break;
            case 'GT': restrictionType = MosaicRestrictionType.GT; break;
            case 'GE': restrictionType = MosaicRestrictionType.GE; break;
            default: throw new Error('invalid restriction type');
        }
        return restrictionType;
    }
}
