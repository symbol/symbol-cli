import {command, metadata, option} from 'clime';
import {
    Account,
    TransactionHttp,
} from 'nem2-sdk';
import {AccountRestriction} from '../../model/accountRestriction';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
// import {AccountRestrictionService} from '../../service/account_restriction.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'f',
        description: 'Transaction type filter',
    })
    filter: string;

    @option({
        flag: 'r',
        description: 'restriction type',
    })
    restrictionType: string;

    @option({
        flag: 't',
        description: 'Remove or Add',
    })
    type: string;

    @option({
        flag: 'v',
        description: 'Restriction value',
    })
    value: string;
}

@command({
    description: 'Fetch Transaction info',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const restrictionType = ['allowaddress', 'allowmosaic', 'allowtransaction', 'sentinel',
                                 'blockaddress', 'blockmosaic', 'blocktransaction'];
        if (undefined === options.filter) {
            options.filter = OptionsResolver(options,
                'filter',
                () => undefined,
                'Fill in the filter(address, mosaic, transactionType): ');

            options.filter = options.filter.toLowerCase();
        }

        if (undefined === options.restrictionType) {
            options.restrictionType = OptionsResolver(options,
                'restrictionType',
                () => undefined,
                'Fill in the restrictionType(' + restrictionType + '): ');
            options.restrictionType = options.restrictionType.toLowerCase();
        }

        if (undefined === options.type) {
            options.type = OptionsResolver(options,
                'type',
                () => undefined,
                'Fill in the type(0: remove, 1: add): ');
        }

        if (undefined === options.value) {
            options.value = OptionsResolver(options,
                'value',
                () => undefined,
                'Fill in the value: ');
        }

        if (!['mosaic', 'address', 'transactiontype'].includes(options.filter)) {
            return console.log('Invalid filter. Filter must be one of address, mosaic, transactionType');
        }

        if (!restrictionType.includes(options.restrictionType)) {
            return console.log('Invalid restrictionType. RestrictionType must be one of ' + restrictionType);
        }

        if (!['0', '1'].includes(options.type)) {
            console.log(options.type + '-----' + typeof options.type);
            return console.log('Invalid type. Type must be one of 1 and 0');
        }

        const profile = this.getProfile(options);

        const accountRestriction = new AccountRestriction(
            options.filter,
            options.restrictionType,
            options.type,
            options.value,
            profile);

        const transaction = accountRestriction.getTransaction();
        const account = Account.createFromPrivateKey(profile.account.privateKey, profile.networkType);
        if  (undefined !== transaction) {
            const signedTransaction = account.sign(transaction, profile.networkGenerationHash);
            const transactionHttp = new TransactionHttp(profile.url);
            transactionHttp
                .announce(signedTransaction)
                .subscribe(
                    (x) => console.log(x),
                    (err) => console.error(err));
        }

    }
}
