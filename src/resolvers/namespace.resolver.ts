import {NamespaceId, UInt64} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {ProfileOptions} from '../commands/profile.command';
import {CommandOptions} from '../commands/transaction/namespace';
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
     * @param {string} altKey - Alternative key.
     * @returns {NamespaceId}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): NamespaceId {
        const resolution = OptionsResolver(options,
        altKey ? altKey : 'namespaceName',
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
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): NamespaceId {
        const resolution = OptionsResolver(options,
            'namespaceId',
            () =>  undefined,
            altText ? altText : 'Enter the namespace id in hexadecimal: ').trim();
        new NamespaceIdValidator().validate(resolution);
        const namespaceIdUInt64 = UInt64.fromHex(resolution);
        return new NamespaceId([namespaceIdUInt64.lower, namespaceIdUInt64.higher]);
    }
}

/**
 * Root namespace resolver
 */
export class RootNamespaceResolver implements Resolver {

    /**
     * Resolves if the namespace is root.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {boolean}
     */
    resolve(options: CommandOptions, secondSource?: Profile, altText?: string): boolean {
        if (!options.subnamespace && !options.rootnamespace && readlineSync.keyInYN('Do you want to create a root namespace?')) {
            options.rootnamespace = true;
        }
        return options.rootnamespace;
    }
}
