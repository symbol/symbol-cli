import chalk from 'chalk';
import {command, metadata, option} from 'clime';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'd',
        description: 'Profile name.',
    })
    profile: string;
}

@command({
    description: 'Change the default profile',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        options.profile = OptionsResolver(options,
            'profile',
            () => undefined,
            'New default profile: ');
        if (options.profile) {
            this.setDefaultProfile(options);
            console.log(chalk.green('\nDefault profile changed to [' + options.profile + ']'));
        }
    }
}
