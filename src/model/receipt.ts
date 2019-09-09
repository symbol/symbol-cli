import { Address, Id, Receipt, ReceiptType, ReceiptVersion} from 'nem2-sdk';

/**
 * An abstract transaction class that serves as the base class of all receipts.
 */
export class ReceiptModel extends Receipt {
    /**
     * @constructor
     * @param type
     * @param version
     * @param amount
     * @param address
     * @param publicKey
     * @param mosaicId
     */
    constructor(/**
                 * The receipt type.
                 */
                public readonly type: ReceiptType,
                /**
                 * The receipt version number.
                 */
                public readonly version: ReceiptVersion,
                /**
                 * The amount number.
                 */
                public readonly amount: number,
                /**
                 * The account address info.
                 */
                public readonly address: Address,
                /**
                 * The account publicKey  info.
                 */
                public readonly publicKey: string,
                /**
                 * The mosaic id info.(including higer part and lower part)
                 */
                public readonly mosaicId: Id) {
                    super(version, type);
    }
}
