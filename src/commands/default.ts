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

import chalk from 'chalk';
const o = chalk.hex('#f7a800');
const b = chalk.hex('#67b2e7');
const g = chalk.hex('#00c4b3');
export const description = `
                      ____            _ _
${o(' _ __')}   ${b('___')} ${g('_ __ ___')} |___ \\       ___| (_)
${o('| \'_ \\')} ${b('/ _ \\')} ${g('\'_ \` _ \\')}  __) |____ / __| | |
${o('| | | |')}  ${b('__/')} ${g('| | | | |')}/ __/_____| (__| | |
${o('|_| |_|')}${b('\\___|')}${g('_| |_| |_|')}_____|     \\___|_|_|

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
