import { Injectable } from '@angular/core';
import { XlsxService } from '../../../service/prints/xlsx.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectionsExcelService extends XlsxService {
  constructor(public translate: TranslateService){
    super();
  }

  buildBody(list: any, object: any, worksheet: any, type: string) {
    if(type === 'csv'){
      list.forEach((data: any) => {
        worksheet.addRow(this.formatData(data));
      });
    }else {
      worksheet.getRow(5).value = ['asdas'];
      worksheet.addRow([`${this.translate.instant('payment-date')}`, `${this.translate.instant('days')}`, `${this.translate.instant('interest')}`,
        'I.S.R.', `${this.translate.instant('net')}`, `${this.translate.instant('accumulated')}`, `${this.translate.instant('status')}`]);
      list.forEach((data: any) => {
        worksheet.getColumn(1).values = [`${this.translate.instant('account-aliases')}`, `${this.translate.instant('account-name')}`, 'No. de cuenta', `${this.translate.instant('breadcrumb.currency')}`];
        worksheet.getColumn(2).values = this.formatDataheader(object);
        worksheet.addRow(this.formatData(data));
      });
    }

  }

  formatDataheader(object: any){
    const array: any[] = [];
    array.push(object['accountDetail']['accountAlias']);
    array.push(object['accountDetail']['accountName']);
    array.push(object['accountDetail']['account']);
    array.push(object['accountDetail']['currency']);
    return array
  }

  formatData(data: any) {
    const array: any[] = [];

    array.push(data.date);
    array.push(data.days);

    if (typeof data.interest === 'string') {
      array.push(Number(data.interest.replace(/,/g, '')));
    } else {
      array.push(data.interest);
    }

    if (typeof data.isr === 'string') {
      array.push(Number(data.isr.replace(/,/g, '')));
    } else {
      array.push(data.isr);
    }

    if (typeof data.netInterest === 'string') {
      array.push(Number(data.netInterest.replace(/,/g, '')));
    } else {
      array.push(data.netInterest);
    }

    if (typeof data.accumulated === 'string') {
      array.push(Number(data.accumulated.replace(/,/g, '')));
    } else {
      array.push(data.accumulated);
    }

    array.push(data.status);

    return array;
  }

}
