import {CreateProfileCommand} from '../../interfaces/create.profile.command'
import {ProfileOptions} from '../../interfaces/profile.options'
import {ProfileNameResolver} from '../../resolvers/profile.resolver'
import {command, metadata} from 'clime'
import chalk from 'chalk'

export class CommandOptions extends ProfileOptions {
}

@command({
    description: 'Change the default profile',
})
export default class extends CreateProfileCommand {
    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profileName = await new ProfileNameResolver().resolve(
            options,
            undefined,
            'New default profile:')
        if (profileName) {
            this.setDefaultProfile(profileName)
            console.log(chalk.green('\nDefault profile changed to [' + profileName + ']'))
        }
    }
}
