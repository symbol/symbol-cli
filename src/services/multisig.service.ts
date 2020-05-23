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

import { Observable, from, of } from 'rxjs';
import { catchError, filter, flatMap, map, switchMap, toArray } from 'rxjs/operators';
import { Address, MultisigAccountGraphInfo, MultisigAccountInfo, MultisigHttp } from 'symbol-sdk';

import { Profile } from '../models/profile.model';

export class MultisigService {
    /**
     * Creates an instance of MultisigService.
     * @param {Profile} profile
     */
    constructor(private readonly profile: Profile) {}

    /**
     * Gets self and children multisig accounts addresses from the network
     * @public
     * @returns {Observable<Address[]>}
     */
    public getSelfAndChildrenAddresses(): Observable<Address[]> {
        return new MultisigHttp(this.profile.url).getMultisigAccountGraphInfo(this.profile.address).pipe(
            switchMap((graphInfo) => this.getAddressesFromGraphInfo(graphInfo)),
            catchError((ignored) => of([this.profile.address])),
        );
    }

    /**
     * Gets children multisig accounts nultisig info from the network
     * @returns {Promise<MultisigAccountInfo[]>}
     */
    public getChildrenMultisigAccountInfo(): Promise<MultisigAccountInfo[] | null> {
        return new MultisigHttp(this.profile.url)
            .getMultisigAccountGraphInfo(this.profile.address)
            .pipe(
                switchMap((graphInfo) => this.multisigInfoFromGraphInfo(graphInfo)),
                toArray(),
                catchError((ignored) => of(null)),
            )
            .toPromise();
    }

    /**
     * Gets self and children multisig accounts addresses from a MultisigAccountGraphInfo
     * @private
     * @param {MultisigAccountGraphInfo} graphInfo
     * @returns {Observable<Address[]>}
     */
    private getAddressesFromGraphInfo(graphInfo: MultisigAccountGraphInfo): Observable<Address[]> {
        return this.multisigInfoFromGraphInfo(graphInfo).pipe(
            map(({ account }) => account.address),
            toArray(),
        );
    }

    private multisigInfoFromGraphInfo(graphInfo: MultisigAccountGraphInfo): Observable<MultisigAccountInfo> {
        const { multisigAccounts } = graphInfo;
        return from(
            [...multisigAccounts.keys()].sort((a, b) => b - a), // Get addresses from top to bottom
        ).pipe(
            map((key) => multisigAccounts.get(key) || []),
            filter((x) => x.length > 0),
            flatMap((multisigAccountInfo) => multisigAccountInfo),
        );
    }
}
