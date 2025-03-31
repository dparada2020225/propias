import { Injectable } from '@angular/core';
import { IACHSettings } from '../../../transfer-ach/interfaces/settings.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import { IM365BeneficiaryRegisteredList } from '../../interfaces/transaction.interface';
import { IAchAccount, V3IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';

@Injectable({
  providedIn: 'root'
})
export class M365StorageService {
  private settings: Array<IACHSettings> = [];
  private achAccounts: Array<V3IAchAccount> = [];
  private sourceAccountList: Array<IAccount> = [];
  private beneficiaryRegisteredList: IM365BeneficiaryRegisteredList = [];

  setSettings(value: Array<IACHSettings>) {
    this.settings = value;
  }

  get getSettings() {
    return this.settings;
  }

  setBeneficiaryRegisteredList(value: IM365BeneficiaryRegisteredList) {
    this.beneficiaryRegisteredList = value;
  }

  get getBeneficiaryRegisteredList() {
    return this.beneficiaryRegisteredList;
  }

  setSourceAccountList(value: Array<IAccount>) {
    this.sourceAccountList = value;
  }

  get getSourceAccountList() {
    return this.sourceAccountList;
  }

  setAchAccountList(value: Array<V3IAchAccount>) {
    this.achAccounts = value;
  }

  get getAchAccountList() {
    return this.achAccounts;
  }
}
