import chalk from 'chalk';
import {Mosaic, MosaicFlags, MosaicId, NamespaceId} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {CommandOptions} from '../commands/transaction/mosaic';
import {Profile} from '../model/profile';
import {OptionsResolver} from '../options-resolver';
import {ProfileOptions} from '../profile.command';
import {MosaicService} from '../service/mosaic.service';
import {MosaicsValidator} from '../validators/mosaic.validator';
import {MosaicIdAliasValidator, MosaicIdValidator} from '../validators/mosaicId.validator';
import {Resolver} from './resolver';

/**
 * MosaicId resolver
 */
export class MosaicIdResolver implements Resolver {

    /**
     * Resolves a mosaic id provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicId}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<MosaicId> {
        const resolution = await OptionsResolver(options,
        'mosaicId',
        () =>  undefined,
        altText ? altText : 'Enter the mosaic id in hexadecimal format: ');
        try {
            new MosaicIdValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return new MosaicId(resolution);
    }
}

/**
 * MosaicId alias resolver
 */
export class MosaicIdAliasResolver implements Resolver {

    /**
     * Resolves a mosaic id alias provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicId | NamespaceId}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<MosaicId | NamespaceId> {
        const resolution = await OptionsResolver(options,
            'mosaicId',
            () =>  undefined,
            altText ? altText : 'Enter the mosaic id or alias: ');
        try {
            new MosaicIdAliasValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return MosaicService.getMosaicId(resolution);
    }
}

/**
 * Mosaics resolver
 */
export class MosaicsResolver implements Resolver {

    /**
     * Resolves a set of mosaics provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {Mosaic[]}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): Promise<Mosaic[]> {
        const resolution = await OptionsResolver(options,
            'mosaics',
            () =>  undefined,
            altText ? altText : 'Mosaics to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
                ' (Ex: sending 1 cat.currency, @cat.currency::1000000). Add multiple mosaics with commas: ');
        try {
            new MosaicsValidator().validate(resolution);
        } catch (err) {
            console.log(chalk.red('ERR'), err);
            return process.exit();
        }
        return resolution ? MosaicService.getMosaics(resolution) : [];
    }
}

/**
 * Mosaics flags resolver
 */
export class MosaicFlagsResolver implements Resolver {

    /**
     * Resolves mosaic flags by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {MosaicFlags}
     */
    resolve(options: CommandOptions, secondSource?: Profile, altText?: string): any {
        return MosaicFlags.create(
            options.supplyMutable ? options.supplyMutable : readlineSync.keyInYN(
                'Do you want mosaic to have supply mutable?'),
            options.transferable ? options.transferable : readlineSync.keyInYN(
                'Do you want mosaic to be transferable?'),
            options.restrictable ? options.restrictable : readlineSync.keyInYN(
                'Do you want mosaic to be restrictable?'));
    }
}
