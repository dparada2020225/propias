import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { XlsxService } from "src/app/service/prints/xlsx.service";

/**
 * @author Sebastian Chicoma Sandmann
 *
 *  Servicios utilizados para generar reportes tipo xls y csv para statements
 */
@Injectable({
    providedIn: 'root'
})
export class CheckStatementExcelService extends XlsxService {
    constructor(public translate: TranslateService){
        super();
    }

    buildBody(list: any, object: any, worksheet: any, type: string) {
        if(type === 'csv'){
            list.forEach(data => {
                worksheet.addRow(this.formatData(data));
            });
            
        }else {
            worksheet.getRow(6).value = [];
            worksheet.addRow([`${this.translate.instant('date').toUpperCase()}`, 'TRX', 'REF', `${this.translate.instant('description-reserve')}`, 
            `${this.translate.instant('debit')}`, `${this.translate.instant('credit')}`,  `${this.translate.instant('account-balance')}`]);
            list.forEach(data => {
                worksheet.getColumn(1).values = [`${this.translate.instant('account')}:`, `${this.translate.instant('account-name')}:`, `${this.translate.instant('breadcrumb.currency')}:`, 
                `${this.translate.instant('opening-balance')}:`, `${this.translate.instant('ending-balance')}:`];
                worksheet.getColumn(2).values = this.formatDataheader(object);

                worksheet.addRow(this.formatData(data));
            });
        }
        
    }

    formatDataheader(object: any){
        const array: any[] = [];
        array.push(object['account']);
        array.push(object['accountName']);
        array.push(object['currency']);
        array.push(object['initialBalance']);
        array.push(object['finalBalance']);
        return array
    }

    formatData(data: any) {
        const array: any[] = [];
        array.push(data.operationDate);
        array.push(data.transaction);
        array.push(data.ref);
        array.push(data.descToPrint);

        array.push(Number(data.debit.replace(/,/g, '')));
        array.push(Number(data.credit.replace(/,/g, '')));
        array.push(Number(data.balance.replace(/,/g, '')));

        return array;
    }


}