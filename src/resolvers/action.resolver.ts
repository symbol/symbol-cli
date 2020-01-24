import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsChoiceResolver} from '../options-resolver';
import {BinaryValidator} from '../validators/binary.validator';
import {Resolver} from './resolver';

/**
 * Link action resolver
 */
export class ActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['Remove', 'Add'];
        const index = +OptionsChoiceResolver(options,
            'action',
            altText ? altText : 'Select an action: ',
            choices,
        );
        new BinaryValidator().validate(index);
        return index;
    }
}

/**
 * Link action resolver
 */
export class LinkActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['Unlink', 'Link'];
        const index = +OptionsChoiceResolver(options,
        'action',
            altText ? altText : 'Select an action: ',
        choices,
        );
        new BinaryValidator().validate(index);
        return index;
    }
}

export class SupplyActionResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): number {
        const choices = ['Decrease', 'Increase'];
        const index = +OptionsChoiceResolver(options,
            'action',
            altText ? altText : 'Select an action: ',
            choices,
        );
        new BinaryValidator().validate(index);
        return index;
    }
}
