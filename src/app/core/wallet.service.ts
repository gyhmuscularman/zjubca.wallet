import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import Cryptojs from 'crypto-js';
import {Wallet} from '../../classes';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private storage: Storage
  ) {
  }

  ase = Cryptojs.AES;

  async saveKey(pubKey: string, privKey: string, password: string): Promise<any> {
    const encrypted = this.ase.encrypt(privKey, password).toString();
    return await this.storage.set(pubKey, JSON.stringify({
      pubKey: pubKey,
      encrypted_privkey: encrypted
    }));
  }

  async retrieveKey(pubKey: string, password: string): Promise<string> {
    const keypair = await this.storage.get(pubKey);
    if (keypair) {
      const wallet: Wallet = JSON.parse(keypair);
      return this.ase.decrypt(wallet.encrypted_privkey, password).toString(Cryptojs.enc.Utf8);
    } else {
      return '';
    }
  }
}