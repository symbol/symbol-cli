
import { Receipt } from '../model/receipt';

export class ReceiptService {
    constructor() {

    }

    /**
     * @description The logic of formatting Receipt info
     * @param receipt 
     * @returns {string}
     */
    public formatReceiptToFilter(receipt: Receipt): string {
        let txt: string = '';
        txt += 'version:\t' + receipt.version + '\n';
        txt += 'type:\t\t' + receipt.type + '\n';
        txt += 'amount:\t\t' + receipt.amount + '\n';
        txt += 'address:\t' + receipt.address + '\n';
        txt += 'publicKey:\t' + receipt.publicKey + '\n';
        txt += 'mosaicId:\t[ ' + receipt.mosaicId.lower + ', '
            + receipt.mosaicId.higher + ' ]\n\n';
        return txt;
    }
}