import {command, metadata, option} from 'clime';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'd',
        description: 'Default profile name',
    })
    profile: string;
}

@command({
    description: 'Get/Set default profile name',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        if (undefined === options.profile || '' === options.profile) {
            console.log('default profile name: ' + profile.name);
            options.profile = OptionsResolver(options,
                'profile',
                () => undefined,
                'Set default profile name(blank means do nothing): ');
        }

        if (undefined !== options.profile && '' !== options.profile) {
            const currentProfile = this.setCurrentProfile(options);
            console.log('Default profile changed into [' + currentProfile.name + '] successfully');
        }
    }
}
