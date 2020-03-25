import * as fs from 'fs'
import {ProfileCommand} from '../../src/interfaces/profile.command'
import {ProfileRepository} from '../../src/respositories/profile.repository'
import {NetworkType, Password, SimpleWallet} from 'symbol-sdk'
import {expect} from 'chai'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('Profile Command', () => {
    let repositoryFileUrl: string
    let command: ProfileCommand
    let wallet: SimpleWallet

    class StubCommand extends ProfileCommand {
        constructor() {
            super(repositoryFileUrl)
        }

        execute(...args: any[]) {
            throw new Error('Method not implemented.')
        }
    }

    const removeAccountsFile = () => {
        const file = (process.env.HOME  || process.env.USERPROFILE) + '/' + repositoryFileUrl
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
    }

    before(() => {
        removeAccountsFile()
        repositoryFileUrl = '.symbolrctest.json'
        wallet = SimpleWallet.create('test', new Password('12345678'), NetworkType.MIJIN_TEST)
        command = new StubCommand()
    })

    beforeEach(() => {
        removeAccountsFile()
    })

    after(() => {
        removeAccountsFile()
    })

    it('repository url should be overwritten', () => {
        expect(command['profileService']['profileRepository']['fileUrl']).to.equal(repositoryFileUrl)
    })

    it('should get a new profile', () => {
        new ProfileRepository(repositoryFileUrl).save(wallet, 'http://localhost:3000', '1', networkCurrency)
        const options = {profile: wallet.name}
        const profile = command['getProfile'](options)
        expect(profile.name).to.equal(wallet.name)
    })

    it('should not get a profile that does not exist', () => {
        const options = {profile: 'random'}
        expect(() => command['getProfile'](options))
            .to.throws(Error)
    })

    it('should get a profile saved as default', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1', networkCurrency)
        profileRepository.setDefault(wallet.name)
        const profile = command['getDefaultProfile']()
        expect(profile.name).to.be.equal(wallet.name)
    })

    it('should throw error if trying to retrieve a default profile that does not exist', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1', networkCurrency)
        expect(() => command['getDefaultProfile']()).to.be.throws(Error)
    })

    it('should get all  saved profiles', () => {
        const profileRepository = new ProfileRepository(repositoryFileUrl)
        profileRepository.save(wallet, 'http://localhost:3000', '1', networkCurrency)
        const profile = command['findAllProfiles']()[0]
        expect(profile.name).to.be.equal(wallet.name)
    })
})
