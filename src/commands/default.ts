/*
 *
 * Copyright 2018 NEM
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

const pkg = require('../../../package.json');
export const description = `
                      ____            _ _
 _ __   ___ _ __ ___ |___ \\       ___| (_)
| \'_ \\ / _ \\ \'_ \` _ \\  __) |____ / __| | |
| | | |  __/ | | | | |/ __/_____| (__| | |
|_| |_|\\___|_| |_| |_|_____|     \\___|_|_|

                                   v${pkg.version}
`;

export const subcommands = [
    {
        name: 'account',
        brief: 'Fetch account information',
    },
    {
        name: 'blockchain',
        brief: 'Fetch blockchain information',
    },
    {
        name: 'mosaic',
        brief: 'Fetch mosaic information',
    },
    {
        name: 'namespace',
        brief: 'Fetch namespace information',
    },
    {
        name: 'transaction',
        brief: 'Send transactions',
    },
    {
        name: 'monitor',
        brief: 'Monitor blocks, transactions and errors',
    },
    {
        name: 'profile',
        brief: 'Profile management',
    },
];
