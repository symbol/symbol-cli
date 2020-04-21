import {expect} from 'chai'
import {NetworkType, Password, Account} from 'symbol-sdk'
import * as fs from 'fs'

import {CreateProfileCommand, AccountCredentialsTable} from '../../src/interfaces/create.profile.command'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {ProfileRepository} from '../../src/respositories/profile.repository'
import {mockPrivateKeyProfile1, mockHdProfile1} from '../mocks/profiles/profile.mock'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('Create Profile Command', () => {
    let repositoryFileUrl: string
    let command: CreateProfileCommand

    class StubCommand extends CreateProfileCommand {
        constructor() {
            super(repositoryFileUrl)
        }

        execute(...args: any[]) {
            throw new Error('Method not implemented.')
        }
    }

    const removeAccountsFile = () => {
        const file = (process.env.HOME || process.env.USERPROFILE) + '/' + repositoryFileUrl
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
    }

    before(() => {
        removeAccountsFile()
        repositoryFileUrl = '.symbolrctest.json'
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

    it('should create a new profile', () => {
        const name = 'default'

        const profile = command['createProfile']({
            generationHash: '',
            isDefault: false,
            name,
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        })

        expect(profile.name).to.equal(name)
    })

    it('should set as default when creating new profile', () => {
        const name = 'default'

        const profile = command['createProfile']({
            generationHash: '',
            isDefault: true,
            name,
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        })

        expect(profile.name).to.equal(name)
        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name)
            .to.equal(name)
    })

    it('should set profile as default', () => {
        const name = 'new profile'

        command['createProfile']({
            generationHash: '',
            isDefault: true,
            name,
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        })

        command['setDefaultProfile'](name)

        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name)
            .to.equal(name)
    })

    it('should throw when the profile already exists', () => {
        const name = 'new profile'

        expect(() => { command['createProfile']({
            generationHash: '',
            isDefault: true,
            name,
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        }) }).not.to.throw()

        expect(() => { command['createProfile']({
            generationHash: '',
            isDefault: true,
            name,
            networkCurrency,
            networkType: NetworkType.MAIN_NET,
            password: new Password('password'),
            url: 'http://localhost:3000',
            privateKey: Account.generateNewAccount(NetworkType.MAIN_NET).privateKey,
        }) }).to.throw()
    })

    it('should not set as default if profile does not exist', () => {
        expect(() => command['setDefaultProfile']('random')).to.throws(Error)
    })
})

describe('AccountCredentialsTable', () => {
    it('toString() should not be undefined when creating a table from an account', () => {
        const table = AccountCredentialsTable.createFromAccount(
            Account.generateNewAccount(NetworkType.MAIN_NET),
        )

        const tableAsString = table.toString()
        expect(tableAsString).not.to.be.undefined
        expect(tableAsString.length).greaterThan(0)
    })

    it('toString() should not be undefined when creating a table from a private key profile', () => {
        const table = AccountCredentialsTable.createFromProfile(
            mockPrivateKeyProfile1,
            new Password('password'),
        )

        const tableAsString = table.toString()
        expect(tableAsString).not.to.be.undefined
        expect(tableAsString.length).greaterThan(0)
    })

    it('toString() should not be undefined when creating a table from an HD profile', () => {
        const table = AccountCredentialsTable.createFromProfile(
            mockHdProfile1,
            new Password('password'),
        )

        const tableAsString = table.toString()
        expect(tableAsString).not.to.be.undefined
        expect(tableAsString.length).greaterThan(0)
    })
})
