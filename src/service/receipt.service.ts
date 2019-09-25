
import chalk from 'chalk';
import {
    ArtifactExpiryReceipt,
    BalanceChangeReceipt,
    BalanceTransferReceipt,
    InflationReceipt,
    ResolutionEntry,
    ResolutionStatement,
    TransactionStatement,
} from 'nem2-sdk';

export class ReceiptService {
    constructor() {

    }

    /**
     * @description The logic of formatting transactionStatements
     * @param statement
     * @returns {string}
     */
    public formatTransactionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('transactionStatements:\t') + '\n';
        txt += '-'.repeat('transactionStatements:\t'.length) + '\n\n';
        statement.transactionStatements.map((transaction: TransactionStatement, transactionIndex: number) => {
            txt += 'height:\t\t' + transaction.height + '\n';
            transaction.receipts.map((receipt: any, receiptIndex: number) => {
                txt += '<index: ' + transactionIndex + '-' + receiptIndex + '>\t';
                const typeFlag = parseInt(String(receipt.type), 10).toString(16).charAt(0);
                if ('1' === typeFlag) {
                    const balanceTransferReceipt = new BalanceTransferReceipt(
                        receipt.account,
                        receipt.account.address,
                        receipt.mosaicId,
                        receipt.amount,
                        receipt.version,
                        receipt.type);
                    txt += 'version:\t' + balanceTransferReceipt.version + '\n';
                    txt += '\t\ttype:\t\t' + balanceTransferReceipt.type + '\n';
                    txt += '\t\tamount:\t\t' + balanceTransferReceipt.amount.compact() + '\n';
                    txt += '\t\taddress:\t' + balanceTransferReceipt.sender.address.pretty() + '\n';
                    txt += '\t\tpublicKey:\t' + balanceTransferReceipt.sender.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + balanceTransferReceipt.mosaicId.id.lower + ', '
                        + balanceTransferReceipt.mosaicId.id.higher + ' ]\n\n';
                } else if ('2' === typeFlag || '3' === typeFlag) {
                    const balanceChangeReceipt = new BalanceChangeReceipt(
                        receipt.account,
                        receipt.mosaicId,
                        receipt.amount,
                        receipt.version,
                        receipt.type);
                    txt += 'version:\t' + balanceChangeReceipt.version + '\n';
                    txt += '\t\ttype:\t\t' + balanceChangeReceipt.type + '\n';
                    txt += '\t\tamount:\t\t' + balanceChangeReceipt.amount.compact() + '\n';
                    txt += '\t\taddress:\t' + balanceChangeReceipt.targetPublicAccount.address.pretty() + '\n';
                    txt += '\t\tpublicKey:\t' + balanceChangeReceipt.targetPublicAccount.publicKey + '\n';
                    txt += '\t\tmosaicId:\t[ ' + balanceChangeReceipt.mosaicId.id.lower + ', '
                        + balanceChangeReceipt.mosaicId.id.higher + ' ]\n\n';
                } else if ('4' === typeFlag) {
                    const artifactExpiryReceipt = new ArtifactExpiryReceipt(
                        receipt.mosaicId,
                        receipt.version,
                        receipt.type);
                    txt += 'version:\t' + artifactExpiryReceipt.version + '\n';
                    txt += '\t\ttype:\t\t' + artifactExpiryReceipt.type + '\n';
                    txt += '\t\tmosaicId:\t[ ' + artifactExpiryReceipt.artifactId.id.lower + ', '
                        + artifactExpiryReceipt.artifactId.id.higher + ' ]\n\n';
                } else if ('5' === typeFlag) {
                    const inflationReceipt = new InflationReceipt(
                        receipt.mosaicId,
                        receipt.amount,
                        receipt.version,
                        receipt.type);
                    txt += 'version:\t' + inflationReceipt.version + '\n';
                    txt += '\t\ttype:\t\t' + inflationReceipt.type + '\n';
                    txt += '\t\tamount:\t\t' + inflationReceipt.amount.compact() + '\n';
                    txt += '\t\tmosaicId:\t[ ' + inflationReceipt.mosaicId.id.lower + ', '
                        + inflationReceipt.mosaicId.id.higher + ' ]\n\n';
                }
            });
        });
        return txt;
    }

    /**
     * @description The logic of formatting addressResolutionStatements
     * @param statement
     * @returns {string}
     */
    public formatAddressResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('addressResolutionStatements:\t') + '\n';
        txt += '-'.repeat('addressResolutionStatements:\t'.length) + '\n\n';
        statement.addressResolutionStatements.map((addressResolution: ResolutionStatement, addressResolutionIndex: number) => {
            txt += 'height:\t\t' + addressResolution.height + '\n';
            txt += 'unresolved:\t' + addressResolution.unresolved + '\n\n';
            addressResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + addressResolutionIndex + '-' + resolutionEntryIndex + '>\t';
                txt += 'resolved:\t\t' + resolutionEntry.resolved + '\n';
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n';
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n';
            });
        });
        return txt;
    }

    /**
     * @description The logic of formatting mosaicResolutionStatements
     * @param statement
     * @return {string}
     */
    public formatMosaicResolutionStatements(statement: any): string {
        let txt = '';
        txt += chalk.green('mosaicResolutionStatements:\t') + '\n';
        txt += '-'.repeat('mosaicResolutionStatements:\t'.length) + '\n\n';
        statement.mosaicResolutionStatements.map((mosaicResolution: ResolutionStatement, mosaicResolutionIndex: number) => {
            txt += 'height:\t\t' + mosaicResolution.height + '\n';
            txt += 'unresolved:\t' + mosaicResolution.unresolved + '\n\n';
            mosaicResolution.resolutionEntries.map((resolutionEntry: ResolutionEntry, resolutionEntryIndex: number) => {
                txt += '<index:' + mosaicResolutionIndex + '-' + resolutionEntryIndex + '>\t';
                txt += 'resolved:\t\t' + resolutionEntry.resolved + '\n';
                txt += '\t\tprimaryId:\t\t' + resolutionEntry.source.primaryId + '\n';
                txt += '\t\tsecondaryId:\t\t' + resolutionEntry.source.secondaryId + '\n\n';
            });
        });
        return txt;
    }
}
