import {ExpectedError, ValidationContext, Validator} from 'clime';
import {Mosaic, UInt64} from 'nem2-sdk';
import {AliasService} from '../service/alias.service';

export class MosaicValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const mosaicParts = value.split('::');
        try {
            if (isNaN(+mosaicParts[1])) {
                throw new ExpectedError('');
            }
            new Mosaic(AliasService.getMosaicId(mosaicParts[0]),
                UInt64.fromUint(+mosaicParts[1]));
        } catch (err) {
            throw new ExpectedError('Mosaic should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000)');
        }
    }
}
