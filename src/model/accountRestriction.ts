import {
    AccountPropertyModification,
    AccountPropertyTransaction,
    Address,
    Deadline,
    MosaicId,
    PropertyModificationType,
    PropertyType,
    Transaction,
} from 'nem2-sdk';

import {Profile} from './profile';

export class AccountRestriction {
    public readonly filter: string;
    public readonly propertyType: number;
    public readonly propertyModificationType: number;
    public readonly value: string;
    public readonly profile: Profile;

    constructor(filter: string,
                propertyType: string,
                type: string,
                value: string,
                profile: Profile) {
        if ('1' === type) {
            this.propertyModificationType = PropertyModificationType.Add;
        } else {
            this.propertyModificationType = PropertyModificationType.Remove;
        }

        switch (propertyType) {
            case 'allowaddress': this.propertyType = PropertyType.AllowAddress; break;
            case 'allowmosaic': this.propertyType = PropertyType.AllowMosaic; break;
            case 'allowtransaction': this.propertyType = PropertyType.AllowTransaction; break;
            case 'sentinel': this.propertyType = PropertyType.Sentinel; break;
            case 'blockaddress': this.propertyType = PropertyType.BlockAddress; break;
            case 'blockmosaic': this.propertyType = PropertyType.BlockMosaic; break;
            case 'blocktransaction': this.propertyType = PropertyType.BlockTransaction; break;
        }

        this.value = value;
        this.filter = filter;
        this.profile = profile;
    }

    public getTransaction(): Transaction | undefined {
        let transaction;
        if ('address' === this.filter) {
            const address = Address.createFromRawAddress(this.value);
            const addressRestriction = AccountPropertyModification.createForAddress(this.propertyModificationType, address);

            transaction = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
                Deadline.create(),
                this.propertyType,
                [addressRestriction],
                this.profile.networkType,
            );
        } else if ('mosaic' === this.filter) {
            const mosaic = new MosaicId(this.value);
            const mosaicRestriction = AccountPropertyModification.createForMosaic(this.propertyModificationType, mosaic);

            transaction = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
                Deadline.create(),
                this.propertyType,
                [mosaicRestriction],
                this.profile.networkType);
        } else if ('transactionType' === this.filter) {
            const entityRestriction = AccountPropertyModification.createForEntityType(this.propertyModificationType, Number(this.value));

            transaction = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
                Deadline.create(),
                this.propertyType,
                [entityRestriction],
                this.profile.networkType);
        }
        return transaction;
    }
}