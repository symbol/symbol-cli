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
    description: 'Default profile name',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();
        const profile = this.getCurProfile();
        console.log(`\ndefault profile name: ${profile.name}`);

        if (undefined === options.profile || '' === options.profile) {
            options.profile = OptionsResolver(options,
                'profile',
                () => undefined,
                'Set default profile name(blank means do nothing): ');

            if (undefined !== options.profile && '' !== options.profile) {
                const curProfile = this.setCurProfile(options);
                console.log('Default profile name changed into [' + curProfile.name + '] successfully');
            }
        }
        this.spinner.stop();
    }
}
