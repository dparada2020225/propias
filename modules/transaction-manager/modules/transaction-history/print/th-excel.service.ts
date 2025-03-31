import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { XlsxService } from 'src/app/service/prints/xlsx.service';
import { ITransactionHistory } from '../interfaces/transaction-history.interface';

@Injectable({
  providedIn: 'root'
})
export class ThExcelService extends XlsxService {
  labelReference = this.translate.instant('reference');
  labelDateCreated = this.translate.instant('date_created');
  labelTransaction = this.translate.instant('transaction');
  labelCurrency = this.translate.instant('breadcrumb.currency');
  labelAmount = this.translate.instant('amount');
  labelUser = this.translate.instant('user_created');

  constructor(private translate: TranslateService) {
    super();
  }

  buildBody(list: ITransactionHistory[], data: any, worksheet, type: string) {
    if (type === 'csv') {
      list.forEach(transaction => {
        worksheet.addRow(this.formatData(transaction));
      });

      return;
    }

    worksheet.getRow(1).value = [];
    worksheet.addRow([this.labelReference, this.labelDateCreated, this.labelTransaction, this.labelCurrency, this.labelAmount, this.labelUser]);

    list.forEach((transaction) => {
      worksheet.addRow(this.formatData(transaction));
    });
  }

  formatData(data: ITransactionHistory) {
    const array: any[] = [];

    array.push(data?.reference);
    array.push(data?.creationDate);
    array.push(data?.serviceDescription);
    array.push(data?.currency);
    array.push(data?.amount);
    array.push(data?.creator);

    return array;
  }
}
