import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Account, Address, Crypto, EncryptedPrivateKey, NetworkType, WalletAlgorithm} from 'nem2-sdk';

export class Wallet {
    private readonly table: HorizontalTable;
    constructor(
        public readonly name: string,
        public readonly networkType: NetworkType,
        public readonly url: string,
        public readonly networkGenerationHash: string,
        public readonly address: Address,
        public readonly encryptedPrivateKey: EncryptedPrivateKey,
    ) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Name', this.name],
            ['networkType', this.networkType],
            ['Node URL', this.url],
            ['Generation Hash', this.networkGenerationHash],
            ['Address', this.address.pretty()],
            ['Encrypted PrivateKey', this.encryptedPrivateKey.encryptedKey],
            ['iv', this.encryptedPrivateKey.iv],
        );
    }

    toString() {
        return this.table.toString();
    }

    getAccount(password: string): Account {
        const { encryptedKey, iv } = this.encryptedPrivateKey;
        const common = { password, privateKey: '' };
        const walletInfo = { encrypted: encryptedKey, iv };
        Crypto.passwordToPrivateKey(common, walletInfo, WalletAlgorithm.Pass_bip32);
        const privateKey = common.privateKey;
        const account = Account.createFromPrivateKey(privateKey, this.networkType);
        return account;
    }
}
