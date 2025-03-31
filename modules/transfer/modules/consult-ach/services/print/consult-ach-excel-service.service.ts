import { Injectable } from '@angular/core';
import { Worksheet } from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { XlsxService } from '../../../../../../service/prints/xlsx.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultAchExcelServiceService extends XlsxService  {

  labelDate =this.translate.instant('date');
  labelOperation = this.translate.instant('operation');
  labelTransaction = this.translate.instant('transaction');
  labelBeneficiary = this.translate.instant('beneficiary_sender');
  labelBank =this.translate.instant('destination_bank_transmitter');
  labelStatus = this.translate.instant('status_type');
  labelCurrency = this.translate.instant('currency');
  labelAmount = this.translate.instant('amount');

  constructor(
    private translate: TranslateService,
    public utilService: UtilService,
  ){
    super();
}
  buildBody(list: any, data: any, worksheet: Worksheet, type: string): void {
    const currentItems = this.utilService.parseACHOperationsResponseByProof(list, data.movement);

    if(type === 'csv'){
      currentItems.forEach(data => {
          worksheet.addRow(this.formatData(data));
      });

      return;
    }

    worksheet.getRow(1).values = [];
    worksheet.addRow([this.labelDate, this.labelOperation, this.labelTransaction, this.labelBeneficiary, this.labelBank, this.labelStatus, this.labelCurrency, this.labelAmount]);

    currentItems.forEach((transaction) => {
      worksheet.addRow(this.formatData(transaction));
    });

}

  formatData(data: any) {
    const array: any[] = [];
    array.push(data?.dateTime);
    array.push(data.operation);
    array.push(data.transfer);
    array.push(data.senderBeneficiary);
    array.push(data.issuingDestination);
    array.push(data.status);
    array.push(this.utilService.getCurrencySymbolToIso(data?.currency))
    array.push(data.amount);

    return array;
  }
}
