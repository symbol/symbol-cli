import chalk from 'chalk'
import {command, metadata, option, Options} from 'clime'
import {CreateProfileCommand} from '../../interfaces/create.profile.command'
import {ProfileOptions, ProfileCommand} from '../../interfaces/profile.command'
import {OptionsResolver} from '../../options-resolver'
import {DefaultResolver} from '../../resolvers/default.resolver'
import {GenerationHashResolver} from '../../resolvers/generationHash.resolver'
import {NetworkResolver} from '../../resolvers/network.resolver'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {ProfileNameResolver} from '../../resolvers/profile.resolver'
import {URLResolver} from '../../resolvers/url.resolver'
import {UpdateProfileOptionsResolver} from '../../resolvers/updateProfile.resolver'
import {UpdateProfileAction} from '../../interfaces/updateProfile.resolver'
import {UpdateProfileOptions, UpdateProfileCommand} from '../../interfaces/update.profile.command'

export class CommandOptions extends UpdateProfileOptions {}

@command({
    description: 'Update profile data',
})
export default class extends UpdateProfileCommand {
    private updateOptions: UpdateProfileAction[] = []
    constructor() {
        super()
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options)
        const account = await profile.decrypt(options)
        if (options.newName) {
            this.updateOptions.push(UpdateProfileAction.Name)
        }
        if (options.url) {
            this.updateOptions.push(UpdateProfileAction.Url)
        }

        const updateOptions = this.updateOptions.length === 0 ?
            (await new UpdateProfileOptionsResolver().resolve(options, undefined, 'Select the update options: ')) : this.updateOptions

        options.newName = updateOptions.includes(UpdateProfileAction.Name) ?
            (await new ProfileNameResolver().resolve(options)) :
            profile.name
        options.url = updateOptions.includes(UpdateProfileAction.Url) ?
            (await new URLResolver().resolve(options)) :
            profile.url
        console.log(profile.name, options.newName, options.url)
        const result = this.updateProfile(profile.name, options.newName, options.url)

        if (result) {
           return console.log( chalk.green('\nUpdating profile' + profile.name + ' success'))
        }
        console.log(chalk.red('\nUpdating profile ' + profile.name + ' failed'))
    }
}
