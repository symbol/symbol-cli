import chalk from 'chalk'
import {command, metadata, ExpectedError} from 'clime'
import {NetworkResolver} from '../../resolvers/network.resolver'
import {PasswordResolver} from '../../resolvers/password.resolver'
import {ProfileNameResolver} from '../../resolvers/profile.resolver'
import {URLResolver} from '../../resolvers/url.resolver'
import {UpdateProfileOptionsResolver} from '../../resolvers/updateProfile.resolver'
import {UpdateProfileAction} from '../../interfaces/updateProfile.resolver'
import {UpdateProfileOptions, UpdateProfileCommand} from '../../interfaces/update.profile.command'
import { SimpleWallet, Password, BlockHttp, UInt64 } from 'nem2-sdk'
import { Profile } from '../../models/profile'

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
        const password = await new PasswordResolver().resolve(options)
        const isValidPassword = new Profile(profile.simpleWallet, profile.url, profile.networkGenerationHash).isPasswordValid(password)
        if (!isValidPassword) {
            throw new ExpectedError('The password provided does not match your account password')
        }
        const account = profile.simpleWallet.open(password)
        if (options.newName) {
            this.updateOptions.push(UpdateProfileAction.Name)
        }
        if (options.url) {
            this.updateOptions.push(UpdateProfileAction.Url)
        }
        if (options.newPassword) {
            this.updateOptions.push(UpdateProfileAction.Password)
        }
        if (options.newNetworkType) {
            this.updateOptions.push(UpdateProfileAction.NetworkType)
        }

        const updateOptions = this.updateOptions.length === 0 ?
            (await new UpdateProfileOptionsResolver().resolve(options, undefined, 'Select the update options: ')) : this.updateOptions

        options.newName = updateOptions.includes(UpdateProfileAction.Name) ?
            (await new ProfileNameResolver().resolve(options)) :
            profile.name
        options.url = updateOptions.includes(UpdateProfileAction.Url) ?
            (await new URLResolver().resolve(options)) :
            profile.url
        options.newNetworkType = updateOptions.includes(UpdateProfileAction.Url) ?
            (await new NetworkResolver().resolve(options, undefined, 'Select the network type: ', 'newNetworkType')) :
            profile.networkType
        options.newPassword = updateOptions.includes(UpdateProfileAction.Password) ?
            (await new PasswordResolver().resolve(options, undefined, 'Enter new profile password: ', 'newPassword')).value :
            password.value
        const simpleWallet = SimpleWallet.createFromPrivateKey(options.newName,
            new Password(options.newPassword),
            account.privateKey,
            options.newNetworkType)
        const blockHttp = new BlockHttp(options.url)
        const generationHash = (await blockHttp.getBlockByHeight(UInt64.fromUint(1)).toPromise()).generationHash
        const result = this.updateProfile(profile.name, options, simpleWallet, generationHash)

        if (result) {
           return console.log( chalk.green('\nUpdating profile' + profile.name + ' success'))
        }
        console.log(chalk.red('\nUpdating profile ' + profile.name + ' failed'))
    }
}
