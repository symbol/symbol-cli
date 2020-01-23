import {Address, AggregateTransaction} from 'nem2-sdk';
import {Observable, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';

const SEQUENTIAL_FETCHER_DEFAULT_DELAY = 200;

export class SequentialFetcher {
  isFetching = false;
  private routineController: Subject<boolean>;
  private networkCallsIterator: AsyncGenerator;
  private transactionsSubject: Subject<AggregateTransaction[]>;

  /**
   * @param  {(address:Address)=>Promise<any>} networkCallFunction
   * @param  {number} minDelay minimum delay in ms between each network call
   * @returns {SequentialFetcher}
   */
  static create(
    networkCallFunction: (address: Address) => Promise<any>,
    minDelay = SEQUENTIAL_FETCHER_DEFAULT_DELAY,
  ): SequentialFetcher {
    return new SequentialFetcher(networkCallFunction, minDelay);
  }

  private constructor(
    private networkCallFunction: (address: Address) => Promise<any[]>,
    private minDelay: number,
  ) {
    this.routineController = new Subject();
    this.transactionsSubject = new Subject();
  }

  /**
   * Get partial transactions from a sequential fetching routine
   * @param  {Address[]} addresses
   * @returns {Observable<AggregateTransaction[]>}
   */
  getTransactionsToCosign(addresses: Address[]): Observable<AggregateTransaction[]> {
    if (this.isFetching) {this.kill(); }
    this.setIterators(addresses);
    this.isFetching = true;
    this.startFetchingRoutine();
    return this.transactionsSubject;
  }

  /**
   * Stops the fetching routine
   */
  kill() {
    this.transactionsSubject.complete();
    this.isFetching = false;
    this.routineController.next(false);
  }

  private setIterators(addresses: Address[]) {
    const addressesIterator = addresses[Symbol.iterator]();
    this.networkCallsIterator = this.createNetworkCallsIterator(addressesIterator);
  }

  private async * createNetworkCallsIterator(addresses: IterableIterator<Address>) {
    for await (const address of addresses) {
      yield this.networkCall(address);
    }
  }

  private async networkCall(address: Address): Promise<{response: any, address: Address}> {
    try {
      const promises = await Promise.all([this.networkCallFunction(address), this.delay()]);
      const [response] = promises;
      return {response, address};
    } catch (error) {
      return {response: null, address};
    }
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.minDelay));
  }

  private startFetchingRoutine() {
    this.routineController
      .pipe(startWith(true))
      .subscribe(async (continueRoutine) => {
        if (!continueRoutine) {
          this.networkCallsIterator.return(null);
          return;
        }

        while (continueRoutine) {
          const {value, done} = await this.networkCallsIterator.next();

          if (done) {
            this.kill();
            break;
          }

          const {response} = value;
          if (response && response.length) {this.transactionsSubject.next(response); }
        }
      });
  }
}
