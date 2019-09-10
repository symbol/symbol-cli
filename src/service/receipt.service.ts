
import {
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
} from 'nem2-sdk';

export class ReceiptService {
    constructor() {

    }

    /**
     * @description The logic of formatting Receipt info
     * @param receipt
     * @returns {string}
     */
    public formatReceiptToFilter(statement: any): string {
        let txt = '';
        if (statement.transactionStatements[0]) {
            const receiptItem = statement.transactionStatements[0].receipts[0];
            const typeFlag = parseInt(receiptItem.type, 10).toString(16).charAt(0);
            if ('1' === typeFlag) {
                const receiptOBJ = new BalanceTransferReceipt(
                    receiptItem.account,
                    receiptItem.account.address,
                    receiptItem.mosaicId,
                    receiptItem.amount,
                    receiptItem.version,
                    receiptItem.type);
                txt += 'version:\t' + receiptOBJ.version + '\n';
                txt += 'type:\t\t' + receiptOBJ.type + '\n';
                txt += 'amount:\t\t' + receiptOBJ.amount.compact() + '\n';
                txt += 'address:\t' + receiptOBJ.sender.address.pretty() + '\n';
                txt += 'publicKey:\t' + receiptOBJ.sender.publicKey + '\n';
                txt += 'mosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                    + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
            } else if ('2' === typeFlag || '3' === typeFlag) {
                const receiptOBJ = new BalanceChangeReceipt(
                    receiptItem.account,
                    receiptItem.mosaicId,
                    receiptItem.amount,
                    receiptItem.version,
                    receiptItem.type);
                txt += 'version:\t' + receiptOBJ.version + '\n';
                txt += 'type:\t\t' + receiptOBJ.type + '\n';
                txt += 'amount:\t\t' + receiptOBJ.amount.compact() + '\n';
                txt += 'address:\t' + receiptOBJ.account.address.pretty() + '\n';
                txt += 'publicKey:\t' + receiptOBJ.account.publicKey + '\n';
                txt += 'mosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                    + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
            } else if ('4' === typeFlag) {
                const receiptOBJ = new ArtifactExpiryReceipt(
                    receiptItem.mosaicId,
                    receiptItem.version,
                    receiptItem.type);
                txt += 'version:\t' + receiptOBJ.version + '\n';
                txt += 'type:\t\t' + receiptOBJ.type + '\n';
                txt += 'mosaicId:\t[ ' + receiptOBJ.artifactId.id.lower + ', '
                    + receiptOBJ.artifactId.id.higher + ' ]\n\n';
            } else if ('5' === typeFlag) {
                const receiptOBJ = new InflationReceipt(
                    receiptItem.mosaicId,
                    receiptItem.amount,
                    receiptItem.version,
                    receiptItem.type);
                txt += 'version:\t' + receiptOBJ.version + '\n';
                txt += 'type:\t\t' + receiptOBJ.type + '\n';
                txt += 'amount:\t\t' + receiptOBJ.amount.compact() + '\n';
                txt += 'mosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                    + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
            }
        } else {
            txt = '[]';
        }
        return txt;
    }
}
