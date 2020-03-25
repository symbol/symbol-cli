import * as fs from 'fs'
import {NetworkType, Password, SimpleWallet, Account} from 'symbol-sdk'
import {expect} from 'chai'

import {CreateProfileCommand, AccountCredentialsTable} from '../../src/interfaces/create.profile.command'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {ProfileRepository} from '../../src/respositories/profile.repository'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('Create Profile Command', () => {
    let repositoryFileUrl: string
    let command: CreateProfileCommand
    let wallet: SimpleWallet

    class StubCommand extends CreateProfileCommand {
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

    it('should create a new profile', () => {
        const profile = command['createProfile'](wallet, 'http://localhost:3000', false, '1', networkCurrency)
        expect(profile.name).to.equal(wallet.name)
    })

    it('should set as default when creating new profile', () => {
        const profile = command['createProfile'](wallet, 'http://localhost:3000', true, '1', networkCurrency)
        expect(profile.name).to.equal(wallet.name)
        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name).to.equal(wallet.name)
    })

    it('should set profile as default', () => {
        command['createProfile'](wallet, 'http://localhost:3000', false, '1', networkCurrency)
        command['setDefaultProfile'](wallet.name)
        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name).to.equal(wallet.name)
    })

    it('should not set as default if profile does not exist', () => {
        expect(() => command['setDefaultProfile']('random')).to.throws(Error)
    })
})

describe('AccountCredentialsTable', () => {
    it('toString() should not be undefined', () => {
        const table = new AccountCredentialsTable(
            Account.generateNewAccount(NetworkType.MAIN_NET),
        )

        const tableAsString = table.toString()
        expect(tableAsString).not.to.be.undefined
        expect(tableAsString.length).greaterThan(0)
    })
})
