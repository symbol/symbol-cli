import { MosaicRestrictionType } from 'nem2-sdk';
import { Profile } from '../model/profile';
import { OptionsChoiceResolver } from '../options-resolver';
import { ProfileOptions } from '../profile.command';
import { MosaicRestrictionTypeValidator } from '../validators/restrictionType.validator';
import { Resolver } from './resolver';

export class RestrictionTypeResolver implements Resolver {
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];
        const index = +OptionsChoiceResolver(options,
            'newRestrictionType',
            altText ? altText : 'Select the new restriction type: ',
            choices,
        );
        const restrictionName = choices[index] as any;
        new MosaicRestrictionTypeValidator().validate(restrictionName);
        return MosaicRestrictionType[restrictionName];
    }
}

export class PreviousRestrictionTypeResolver implements Resolver {
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const choices = ['NONE', 'EQ', 'NE', 'LT', 'LE', 'GT', 'GE'];
        const index = +OptionsChoiceResolver(options,
            'previousRestrictionType',
            altText ? altText : 'Select the previous restriction type: ',
            choices,
        );
        const restrictionName = choices[index] as any;
        new MosaicRestrictionTypeValidator().validate(restrictionName);
        return MosaicRestrictionType[restrictionName];
    }
}
