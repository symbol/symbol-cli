import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import {
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    Listener,
    MultisigAccountModificationTransaction,
    MultisigCosignatoryModification,
    NetworkCurrencyMosaic,
    PublicAccount,
    TransactionHttp,
    UInt64,
} from 'nem2-sdk';
import {filter, mergeMap} from 'rxjs/operators';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { OptionsResolver } from '../../options-resolver';
import {CosignatoryModificationService} from '../../service/cosignatoryModificationService.service';
import {BinaryValidator} from '../../validators/binary.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'R',
        description: '(Optional) Number of signatures needed to remove a cosignatory. ',
        default: 0,
    })
    minRemovalDelta: number;

    @option({
        flag: 'A',
        description: '(Optional) Number of signatures needed to approve a transaction.',
        default: 0,
    })
    minApprovalDelta: number;

    @option({
        flag: 'a',
        description: 'Modification Action (1: Add, 0: Remove).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'p',
        description: 'Cosignatory account public key.',
    })
    cosignatoryPublicKey: string;

    @option({
        flag: 'm',
        description: 'Multisig account public key.',
    })
    multisigAccountPublicKey: string;
}

@command({
    description: 'Create or modify a multisig contract.',
})
export default class extends AnnounceTransactionsCommand {
    private readonly cosignatoryModificationService: CosignatoryModificationService;

    constructor() {
        super();
        this.cosignatoryModificationService = new CosignatoryModificationService();
    }

    @metadata
    execute(options: CommandOptions) {
        options.action = OptionsResolver(options,
            'action',
            () => undefined,
            'Introduce the modification action (1: Add, 0: Remove):');

        options.cosignatoryPublicKey = OptionsResolver(options,
            'cosignatoryPublicKey',
            () => undefined,
            'Introduce the cosignatory account public key:');

        options.multisigAccountPublicKey = OptionsResolver(options,
            'multisigAccountPublicKey',
            () => undefined,
            'Introduce the multisig account public key:');

        const cosignatoryModificationAction = this.cosignatoryModificationService.getCosignatoryModificationAction(options.action);
        const profile = this.getProfile(options);
        const listener = new Listener(profile.url);
        const transactionHttp = new TransactionHttp(profile.url);

        const multisigAccount = PublicAccount.createFromPublicKey(options.multisigAccountPublicKey, profile.networkType);
        const newCosignatoryAccount = PublicAccount.createFromPublicKey(options.cosignatoryPublicKey, profile.networkType);

        const multisigCosignatoryModification = new MultisigCosignatoryModification(
            cosignatoryModificationAction,
            newCosignatoryAccount);

        const multisigAccountModificationTransaction = MultisigAccountModificationTransaction.create(
            Deadline.create(),
            options.minApprovalDelta,
            options.minRemovalDelta,
            [multisigCosignatoryModification],
            profile.networkType,
            UInt64.fromNumericString(options.maxFee));

        const aggregateTransaction = AggregateTransaction.createBonded(
            Deadline.create(),
            [multisigAccountModificationTransaction.toAggregate(multisigAccount)],
            profile.networkType);

        const signedTransaction = profile.account.sign(aggregateTransaction, profile.networkGenerationHash);
        console.log(chalk.green('signedTransactionHash: ') + signedTransaction.hash + '\n');

        const hashLockTransaction = HashLockTransaction.create(
            Deadline.create(),
            NetworkCurrencyMosaic.createRelative(10),
            UInt64.fromUint(480),
            signedTransaction,
            profile.networkType);

        const hashLockTransactionSigned = profile.account.sign(hashLockTransaction, profile.networkGenerationHash);

        listener.open().then(() => {

            transactionHttp
                .announce(hashLockTransactionSigned)
                .subscribe(
                    (x) => console.log(x),
                    (err) => console.error(err),
                );

            listener
                .confirmed(profile.account.address)
                .pipe(
                    filter((transaction) => transaction.transactionInfo !== undefined
                        && transaction.transactionInfo.hash === hashLockTransactionSigned.hash),
                    mergeMap(() => transactionHttp.announceAggregateBonded(signedTransaction)),
                )
                .subscribe((announcedAggregateBonded) => console.log(announcedAggregateBonded),
                    (err) => console.error(err));
        });
    }
}
