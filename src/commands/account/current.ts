import chalk from 'chalk';
import {command, ExpectedError, metadata, option} from 'clime';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'c',
        description: 'Change account',
    })
    profile: string;
}

@command({
    description: 'Change current account',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getCurProfile();
        console.log(`current profile name: ${profile.name}`);

        if (undefined === options.profile || '' === options.profile) {
            options.profile = OptionsResolver(options,
                'profile',
                () => undefined,
                'Change current profile name(blank means do nothing): ');

            if (undefined !== options.profile && '' !== options.profile) {
                const curProfile = this.setCurProfile(options);
                console.log('Current profile changed into [' + curProfile.name + '] successfully');
            }
        }
        this.spinner.stop();

    }
}
