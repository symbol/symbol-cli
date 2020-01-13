import chalk from 'chalk';
import {command, metadata} from 'clime';
import {CreateProfileCommand} from '../../create.profile.command';
import {OptionsResolver} from '../../options-resolver';
import {ProfileOptions} from '../../profile.command';

export class CommandOptions extends ProfileOptions {
}

@command({
    description: 'Change the default profile',
})
export default class extends CreateProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        options.profile = await OptionsResolver(options,
            'profile',
            () => undefined,
            'New default profile: ');
        if (options.profile) {
            this.setDefaultProfile(options.profile);
            console.log(chalk.green('\nDefault profile changed to [' + options.profile + ']'));
        }
    }
}
