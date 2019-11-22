import * as Table from 'cli-table3';
import {HorizontalTable} from 'cli-table3';
import {Address, NetworkType} from 'nem2-sdk';

export class Wallet {
    private readonly table: HorizontalTable;
    constructor(
        public readonly name: string,
        public readonly networkType: NetworkType,
        public readonly url: string,
        public readonly networkGenerationHash: string,
        public readonly address: Address,
    ) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable;
        this.table.push(
            ['Name', this.name],
            ['Network', NetworkType[this.networkType]],
            ['Node URL', this.url],
            ['Generation Hash', this.networkGenerationHash],
            ['Address', this.address.pretty()],
        );
    }

    toJSON() {
        return {
            name: this.name,
            networkType: this.networkType,
            url: this.url,
            networkGenerationHash: this.networkGenerationHash,
            address: this.address,
        };
    }
}
