import { Profile } from '../model/profile';
import { OptionsChoiceResolver } from '../options-resolver';
import { ProfileOptions } from '../profile.command';
import { MosaicRestrictionTypeValidator } from '../validators/mosaic.validator';
import { Resolver } from './resolver';

export class RestrictionTypeResolver implements Resolver {
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): string {
        const choices = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];
        const index = +OptionsChoiceResolver(options,
            'newRestrictionType',
            altText ? altText : 'Select the restriction type: ',
            choices,
        );
        const restrictionName = choices[index] as any;
        new MosaicRestrictionTypeValidator().validate(restrictionName);
        return restrictionName;
    }
}
