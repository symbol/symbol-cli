
import chalk from 'chalk';
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

        // render transactionStatements
        txt += chalk.green('transactionStatements:\t') + '\n';
        txt += '-'.repeat('transactionStatements:\t'.length) + '\n\n';
        for (let transactionIdx = 0; transactionIdx < statement.transactionStatements.length; transactionIdx++) {
            txt += 'hight:\t\t' + statement.transactionStatements[transactionIdx].height + '\n';
            for (let receiptIdx = 0; receiptIdx < statement.transactionStatements[transactionIdx].receipts.length; receiptIdx++) {
                txt += '<index: ' + transactionIdx + '-' + receiptIdx + '>\t';
                const receiptItem = statement.transactionStatements[0].receipts[0];
                const typeFlag = parseInt(String(receiptItem.type), 10).toString(16).charAt(0);
                if ('1' === typeFlag) {
                    const receiptOBJ = new BalanceTransferReceipt(
                        receiptItem.account,
                        receiptItem.account.address,
                        receiptItem.mosaicId,
                        receiptItem.amount,
                        receiptItem.version,
                        receiptItem.type);
                    txt += 'version:\t' + receiptOBJ.version + '\n';
                    txt += '\t\ttype:\t\t' + receiptOBJ.type + '\n';
                    txt += '\t\tamount:\t\t' + receiptOBJ.amount.compact() + '\n';
                    txt += '\t\taddress:\t' + receiptOBJ.sender.address.pretty() + '\n';
                    txt += '\t\tpublicKey:\t' + receiptOBJ.sender.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                        + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
                } else if ('2' === typeFlag || '3' === typeFlag) {
                    const receiptOBJ = new BalanceChangeReceipt(
                        receiptItem.account,
                        receiptItem.mosaicId,
                        receiptItem.amount,
                        receiptItem.version,
                        receiptItem.type);
                    txt += 'version:\t' + receiptOBJ.version + '\n';
                    txt += '\t\ttype:\t\t' + receiptOBJ.type + '\n';
                    txt += '\t\tamount:\t\t' + receiptOBJ.amount.compact() + '\n';
                    txt += '\t\taddress:\t' + receiptOBJ.account.address.pretty() + '\n';
                    txt += '\t\tpublicKey:\t' + receiptOBJ.account.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                        + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
                } else if ('4' === typeFlag) {
                    const receiptOBJ = new ArtifactExpiryReceipt(
                        receiptItem.mosaicId,
                        receiptItem.version,
                        receiptItem.type);
                    txt += 'version:\t' + receiptOBJ.version + '\n';
                    txt += '\t\ttype:\t\t' + receiptOBJ.type + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receiptOBJ.artifactId.id.lower + ', '
                        + receiptOBJ.artifactId.id.higher + ' ]\n\n';
                } else if ('5' === typeFlag) {
                    const receiptOBJ = new InflationReceipt(
                        receiptItem.mosaicId,
                        receiptItem.amount,
                        receiptItem.version,
                        receiptItem.type);
                    txt += 'version:\t' + receiptOBJ.version + '\n';
                    txt += '\t\ttype:\t\t' + receiptOBJ.type + '\n';
                    txt += '\t\tamount:\t\t' + receiptOBJ.amount.compact() + '\n';
                    txt += '\t\tmosaicId:\t[ ' + receiptOBJ.mosaicId.id.lower + ', '
                        + receiptOBJ.mosaicId.id.higher + ' ]\n\n';
                }
            }
        }

        // render addressResolutionStatements
        txt += chalk.green('addressResolutionStatements:\t') + '\n';
        txt += '-'.repeat('addressResolutionStatements:\t'.length) + '\n\n';
        for (let addressIdx = 0; addressIdx < statement.addressResolutionStatements.length; addressIdx++) {
            txt += 'hight:\t\t' + statement.addressResolutionStatements[addressIdx].height + '\n';
            txt += 'unresolved:\t' + statement.addressResolutionStatements[addressIdx].unresolved + '\n\n';
            for (let entryIdx = 0; entryIdx < statement.addressResolutionStatements[addressIdx].resolutionEntries.length; entryIdx++) {
                txt += '<index:' + addressIdx + '-' + entryIdx + '>\t';
                txt += 'resolved:\t\t'
                    + statement.addressResolutionStatements[addressIdx].resolutionEntries[entryIdx].resolved
                    + '\n';
                txt += '\t\tprimaryId:\t\t'
                    + statement.addressResolutionStatements[addressIdx].resolutionEntries[entryIdx].source.primaryId
                    + '\n';
                txt += '\t\tsecondaryId:\t\t'
                    + statement.addressResolutionStatements[addressIdx].resolutionEntries[entryIdx].source.secondaryId
                    + '\n\n';
            }
        }

        // render mosaicResolutionStatements
        txt += chalk.green('mosaicResolutionStatements:\t') + '\n';
        txt += '-'.repeat('mosaicResolutionStatements:\t'.length) + '\n\n';
        for (let mosaicIdx = 0; mosaicIdx < statement.mosaicResolutionStatements.length; mosaicIdx++) {
            txt += 'hight:\t\t' + statement.mosaicResolutionStatements[mosaicIdx].height + '\n';
            txt += 'unresolved:\t' + statement.mosaicResolutionStatements[mosaicIdx].unresolved + '\n\n';
            for (let entryIdx = 0; entryIdx < statement.mosaicResolutionStatements[mosaicIdx].resolutionEntries.length; entryIdx++) {
                txt += '<index:' + mosaicIdx + '-' + entryIdx + '>\t';
                txt += 'resolved:\t\t'
                    + statement.mosaicResolutionStatements[mosaicIdx].resolutionEntries[entryIdx].resolved
                    + '\n';
                txt += '\t\tprimaryId:\t\t'
                    + statement.mosaicResolutionStatements[mosaicIdx].resolutionEntries[entryIdx].source.primaryId
                    + '\n';
                txt += '\t\tsecondaryId:\t\t'
                    + statement.mosaicResolutionStatements[mosaicIdx].resolutionEntries[entryIdx].source.secondaryId
                    + '\n\n';
            }
        }

        if ('' === txt) {
            txt = '[]';
        }
        return txt;
    }
}
