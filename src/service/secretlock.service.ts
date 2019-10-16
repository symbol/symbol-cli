import * as Crypto from 'crypto';
import { sha3_256 } from 'js-sha3';
import {
    HashType,
    NetworkType,
} from 'nem2-sdk';

export class SecretLockService {
    public getNetworkType(type: string): NetworkType {
        let networkType;
        if ('MAIN_NET' === type) {
            networkType = NetworkType.MAIN_NET;
        } else if ('TEST_NET' === type) {
            networkType = NetworkType.TEST_NET;
        } else if ('MIJIN' === type) {
            networkType = NetworkType.MIJIN;
        } else {
            networkType = NetworkType.MIJIN_TEST;
        }
        return networkType;
    }

    public getCryptoType(type: number): HashType {
        let cryptoType;
        switch (type) {
            case 0: cryptoType = HashType.Op_Sha3_256; break;
            case 1: cryptoType = HashType.Op_Keccak_256; break;
            case 2: cryptoType = HashType.Op_Hash_160; break;
            case 3: cryptoType = HashType.Op_Hash_256; break;
            default: cryptoType = HashType.Op_Sha3_256; break;
        }
        return cryptoType;
    }

    public createSecret(): {proof: string, secret: string} {
        const random = Crypto.randomBytes(10);
        const proof = random.toString('hex');
        const hash = sha3_256.create();
        const secret = hash.update(random).hex().toUpperCase();
        return {proof, secret};
    }
}
