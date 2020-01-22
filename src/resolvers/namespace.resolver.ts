import {NamespaceId, UInt64} from 'nem2-sdk';
import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {NamespaceIdValidator} from '../validators/namespaceId.validator';
import {Resolver} from './resolver';

/**
 * Namespace name resolver
 */
export class NamespaceNameResolver {

    /**
     * Resolves a namespace name provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {NamespaceId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
        'namespaceName',
        () =>  undefined,
        altText ? altText : 'Enter the namespace name: ').trim();
        return new NamespaceId(resolution);
    }
}

/**
 * Namespace id resolver
 */
export class NamespaceIdResolver implements Resolver {

    /**
     * Resolves a namespace id provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {NamespaceId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = OptionsResolver(options,
            'namespaceId',
            () =>  undefined,
            altText ? altText : 'Enter the namespace id in hexadecimal: ').trim();
        new NamespaceIdValidator().validate(resolution);
        const namespaceIdUInt64 = UInt64.fromHex(resolution);
        return new NamespaceId([namespaceIdUInt64.lower, namespaceIdUInt64.higher]);
    }
}
