import { Injectable } from '@angular/core';
import { TLookUpACHRegisterAtomicMapped } from '../../interfaces/tm-ach-register.interface';

@Injectable({
  providedIn: 'root'
})
export class TmAchStorageService {
  private atomicACHTransactionList: TLookUpACHRegisterAtomicMapped = [];

  setAtomicTransactionList(value: TLookUpACHRegisterAtomicMapped) {
    this.atomicACHTransactionList = value;
  }

  get atomicTransactionList() {
    return this.atomicACHTransactionList;
  }

  constructor() { }
}
