import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Address, EncryptedPrivateKey, NetworkType} from 'nem2-sdk';

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
}
