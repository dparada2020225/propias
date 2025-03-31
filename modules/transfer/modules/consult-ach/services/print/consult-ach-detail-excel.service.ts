import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdfFormatService } from '@adf/components';
import { Worksheet } from 'exceljs';
import { UtilService } from '../../../../../../service/common/util.service';
import { XlsxService } from '../../../../../../service/prints/xlsx.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultAchDetailExcelService extends XlsxService {
  labelDate = this.translate.instant('date');
  labelBeneficiary = this.translate.instant('beneficiary_sender');
  labelOperation = this.translate.instant('operation')
  labelTypeOperation = this.translate.instant('operation_type');
  labelDestinationBank = this.translate.instant('destination_bank_transmitter');
  labelStatus = this.translate.instant('status_type');
  labelCurrency = this.translate.instant('currency');
  labelAmount = this.translate.instant('amount');

  constructor(private translate: TranslateService, public utilService: UtilService, private formatService: AdfFormatService) {
    super();
  }

  buildBody(list: any, data: any, worksheet: Worksheet, type: string): void {
    if (type === 'csv') {
      list.forEach((data) => {
        worksheet.addRow(this.formatData(data));
      });
    }

    worksheet.getRow(1).values = [];
    worksheet.addRow([
      this.labelDate,
      this.labelBeneficiary,
      this.labelOperation,
      this.labelTypeOperation,
      this.labelDestinationBank,
      this.labelStatus,
      this.labelCurrency,
      this.labelAmount,
    ]);

    list.forEach((transaction) => {
      worksheet.addRow(this.formatData(transaction));
    });
  }

  formatData(data: any) {
    const array: any[] = [];
    const dateTime = this.formatService.getFormatDateTime(data?.creationDate)
    array.push(dateTime.standard);
    array.push(data.senderBeneficiary);
    array.push(data.operation);
    array.push(data.transfer);
    array.push(data.issuingDestination);
    array.push(data.status);
    array.push(this.utilService.getCurrencySymbolToIso(data?.currency))
    array.push(data.amount);

    return array;
  }
}
