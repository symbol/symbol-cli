import {NetworkType, Password, SimpleWallet} from 'nem2-sdk';
import {Profile} from '../../src/models/profile';

const simpleWallet1 = SimpleWallet.create('test', new Password('password'), NetworkType.MIJIN_TEST);
const url1 = 'http://localhost:1234';
const networkGenerationHash1 = 'test';

export const mockProfile1 = new Profile(simpleWallet1, url1, networkGenerationHash1);
