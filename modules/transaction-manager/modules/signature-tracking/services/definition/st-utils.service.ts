import { Injectable } from '@angular/core';
import { ITMTransaction } from '../../../../interfaces/tm-transaction.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { AdfFormatService } from '@adf/components';
import { EProfile } from '../../../../../../enums/profile.enum';

@Injectable({
  providedIn: 'root'
})
export class StUtilsService {

  constructor(
    private util: UtilService,
    private adfFormatService: AdfFormatService
  ) { }


  get isFormattedCurrency() {
    return this.util.profile === EProfile.HONDURAS
  }

  parseAccounts(accountList: ITMTransaction[]) {
    return accountList.map((account) => ({
      ...account,
      creationDate: this.adfFormatService.getFormatDateTime(account.creationDate).standard,
      currency: this.isFormattedCurrency ? this.util.getCurrencySymbolToIso(account?.currency) : account?.currency,
      isChecked: false,
    }));
  }
}
