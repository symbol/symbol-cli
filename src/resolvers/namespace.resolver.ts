import {CommandOptions} from '../commands/transaction/namespace'
import {OptionsConfirmResolver, OptionsResolver} from '../options-resolver'
import {NamespaceIdValidator} from '../validators/namespaceId.validator'
import {Resolver} from './resolver'
import {NamespaceId, NamespaceRegistrationType, UInt64} from 'symbol-sdk'
import {Options} from 'clime'

/**
 * Namespace name resolver
 */
export class NamespaceNameResolver {

    /**
     * Resolves a namespace name provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<NamespaceId>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<NamespaceId> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'namespaceName',
            () =>  undefined,
            altText ? altText : 'Enter the namespace name:',
            'text',
            undefined)
        return new NamespaceId(resolution)
    }
}

/**
 * Namespace name string resolver
 */
export class NamespaceNameStringResolver {
    /**
     * Resolves a namespace name provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<string>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<string> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'namespaceName',
            () =>  undefined,
            altText ? altText : 'Enter the namespace name:',
            'text',
            undefined)
        return resolution
    }
}

/**
 * Namespace id resolver
 */
export class NamespaceIdResolver implements Resolver {

    /**
     * Resolves a namespace id provided by the user.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<NamespaceId>}
     */
    async resolve(options: Options, altText?: string, altKey?: string): Promise<NamespaceId> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'namespaceId',
            () =>  undefined,
            altText ? altText : 'Enter the namespace id in hexadecimal:',
            'text',
            new NamespaceIdValidator())
        const namespaceIdUInt64 = UInt64.fromHex(resolution)
        return new NamespaceId([namespaceIdUInt64.lower, namespaceIdUInt64.higher])
    }
}

/**
 * Namespace type resolver
 */
export class NamespaceTypeResolver  implements Resolver {

    /**
     * Resolves the namespace type.
     * @param {Options} options - Command options.
     * @param {string} altText - Alternative text.
     * @returns {Promise<NamespaceRegistrationType>}
     */
    async resolve(options: CommandOptions, altText?: string): Promise<NamespaceRegistrationType> {
        if (!options.subnamespace) {
            const resolution = await OptionsConfirmResolver(options, 'rootnamespace',
                altText ? altText : 'Do you want to create a root namespace?')
            if (resolution) {
                options.rootnamespace = true
            }
        }
        let namespaceType = NamespaceRegistrationType.SubNamespace
        if (options.rootnamespace) {
            namespaceType = NamespaceRegistrationType.RootNamespace
        }
        return namespaceType
    }
}
