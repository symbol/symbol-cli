import {expect} from 'chai';
import * as fs from 'fs';
import {NetworkType, Password, SimpleWallet} from 'nem2-sdk';
import {CreateProfileCommand} from '../../src/create.profile.command';
import {ProfileRepository} from '../../src/respository/profile.repository';

describe('Create Profile Command', () => {
    let repositoryFileUrl: string;
    let command: CreateProfileCommand;
    let wallet: SimpleWallet;

    class StubCommand extends CreateProfileCommand {
        constructor() {
            super(repositoryFileUrl);
        }

        execute(...args: any[]) {
            throw new Error('Method not implemented.');
        }
    }

    const removeAccountsFile = () => {
        if (fs.existsSync(process.env.HOME || process.env.USERPROFILE + '/' + repositoryFileUrl)) {
            fs.unlinkSync(process.env.HOME || process.env.USERPROFILE + '/' + repositoryFileUrl);
        }
    };

    before(() => {
        removeAccountsFile();
        repositoryFileUrl = '.nem2rctest.json';
        wallet = SimpleWallet.create('test', new Password('12345678'), NetworkType.MIJIN_TEST);
        command = new StubCommand();
    });

    beforeEach(() => {
        removeAccountsFile();
    });

    after(() => {
        removeAccountsFile();
    });

    it('repository url should be overwritten', () => {
        expect(command['profileService']['profileRepository']['fileUrl']).to.equal(repositoryFileUrl);
    });

    it('should create a new profile', () => {
        const profile = command['createProfile'](wallet, NetworkType.MIJIN_TEST, 'http://localhost:3000', false, '1');
        expect(profile.name).to.equal(wallet.name);
    });

    it('should set as default when creating new profile', () => {
        const profile = command['createProfile'](wallet, NetworkType.MIJIN_TEST, 'http://localhost:3000', true, '1');
        expect(profile.name).to.equal(wallet.name);
        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name).to.equal(wallet.name);
    });

    it('should set profile as default', () => {
        command['createProfile'](wallet, NetworkType.MIJIN_TEST, 'http://localhost:3000', false, '1');
        command['setDefaultProfile'](wallet.name);
        expect(new ProfileRepository(repositoryFileUrl).getDefaultProfile().name).to.equal(wallet.name);
    });

    it('should not set as default if profile does not exist', () => {
        expect(() => command['setDefaultProfile']('random'))
            .to.throws(Error);
    });
});
