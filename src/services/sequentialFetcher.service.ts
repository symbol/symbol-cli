/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Address} from 'nem2-sdk';
import {Observable, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';

const SEQUENTIAL_FETCHER_DEFAULT_DELAY = 200;
type Flatten<T> = T extends any[] ? T[number] :
  T extends object ? T[keyof T] :
  T;
export class SequentialFetcher {
  isFetching = false;
  private routineController: Subject<boolean>;
  private networkCallsIterator: AsyncGenerator;
  private transactionsSubject: Subject<any>;

  /**
   * @param  {(address:Address)=>Promise<T>} networkCallFunction
   * @param  {number} minDelay minimum delay in ms between each network call
   * @returns {SequentialFetcher}
   */
  static create(
    networkCallFunction: (address: Address) => Promise<any>,
    minDelay = SEQUENTIAL_FETCHER_DEFAULT_DELAY,
  ): SequentialFetcher {
    return new SequentialFetcher(networkCallFunction, minDelay);
  }

  /**
   * Creates an instance of SequentialFetcher.
   * @param {(address: Address) => Promise<any[]>} networkCallFunction
   * @param {number} minDelay
   */
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
   * @returns {Observable<any>}
   */
  getResults(addresses: Address[]): Observable<any> {
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

  /**
   * Creates an iterator from an array of addresses
   * @private
   * @param {Address[]} addresses
   */
  private setIterators(addresses: Address[]) {
    const addressesIterator = addresses[Symbol.iterator]();
    this.networkCallsIterator = this.createNetworkCallsIterator(addressesIterator);
  }

  /**
   * Iterates network calls sequentially
   * @private
   * @param {IterableIterator<Address>} addresses
   */
  private async * createNetworkCallsIterator(addresses: IterableIterator<Address>) {
    for await (const address of addresses) {
      yield this.networkCall(address);
    }
  }

  /**
   * Handle network calls responses and errors
   * @private
   * @param {Address} address
   * @returns {Promise<{response: any, address: Address}>}
   */
  private async networkCall(address: Address): Promise<{response: any, address: Address}> {
    try {
      const promises = await Promise.all([this.networkCallFunction(address), this.delay()]);
      const [response] = promises;
      return {response, address};
    } catch (error) {
      return {response: null, address};
    }
  }

  /**
   * Promises that resolves after minDelay ms
   * Guarantees a minimum delay between each calls to avoid network ban
   * @private
   * @returns {Promise<void>}
   */
  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.minDelay));
  }

  /**
   * Main routine
   * Manages the iteration process and response routing
   * @private
   * @memberof SequentialFetcher
   */
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
