import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { environment } from '../../../../environments/environment';
import { CustomNumberPipe } from '../../../pipes/custom-number.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * @author Hernan Uriarte
 *
 *  Servicios utilizados para la impresion de pdf depositos
 */

@Injectable({
    providedIn: 'root'
})
export class DepositStatementPrintService extends PdfService {
    override businessName = '';
    businessType = '';
    currentLanguage!: string;

    constructor(
        public override businessNameService: BusinessNameService,
        public override datePipe: DatePipe,
        public override translate: TranslateService,
        public override storageService: StorageService,
        public override util: UtilService,
        public override modalService: NgbModal,
    ) {
        super(translate, businessNameService, datePipe, storageService, util, modalService);
        this.businessType = businessNameService.getBusinessType(environment['profile']);

    }

    buildTitles(doc: any, data: any) {
        this.currentLanguage = this.translate.currentLang;

        doc.setFontSize(14);
        doc.setTextColor(10, 73, 137);
        doc.text(`${this.translate.instant('label.statements.deposit-detail')}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

        doc.line(10, 43, 200, 43); // linea divisora
    }

    buildBody(doc: any, data: any) {

        let customNumberPipe = new CustomNumberPipe();

        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);

        doc.text(`${this.translate.instant('label.statements.agency')}`, 10, 52);
        doc.text(`${this.translate.instant('label.statements.date-modal')}`, 10, 60);
        doc.text(`${this.translate.instant('label.statements.value')}`, 10, 68);
        doc.text(`${this.translate.instant('label.statements.account')}`, 10, 76);
        doc.text(`${this.translate.instant('title:document_number')}`, 10, 84);

        let conta = 1;
        let contf;
        for (let index in data['information']['detail']) {
            contf = 84 + conta * 8
            let detail = data['information']['detail'][index];
            doc.text(`${this.translate.instant(detail['description'])}`, 10, (84 + conta * 8));
            conta++;
        }

        if (environment['profile'] === 'banpais') {
            doc.text(`${this.translate.instant('label.statements.deposit')}`, 10, 140);
        }

        doc.setFontSize(10);
        doc.setTextColor(155, 155, 155);
        doc.text((data['information']['agency'] || ''), 65, 52);
        doc.text((data['operation']['operationDate'] || '') + ' ' + (data['operation']['operationTime'] || ''), 65, 60);
        let value;
        if (data['operation']['value']) {
            value = customNumberPipe.transform(data['operation']['value'])
        } else {
            value = '0.00'
        }


        this.handlePrintInformationDetail(doc, data, contf, value);
    }


    private handlePrintInformationDetail(doc: any, data: any, contf: any, value: any) {
      const customNumberPipe = new CustomNumberPipe();
      doc.text((data['general']['currency'] || '') + ' ' + value, 65, 68);
      doc.text((data['general']['account'] || ''), 65, 76);
      doc.text(this.util.removeLeftPadZeros(data?.information?.documentNumber), 65, 84);

      let contb = 1;

      for (let index in data['information']['detail']) {
        let detail = data['information']['detail'][index];
        doc.text(customNumberPipe.transform(detail['amount']), 65, (84 + contb * 8));
        contb++;
      }

      if (environment['profile'] === 'banpais') {
        doc.text((data['information']['deposit'] || ''), 65, 140);
        doc.line(10, contf + 17, 200, contf + 17);
      } else {
        doc.line(10, contf + 8, 200, contf + 8);
      }
    }

    buildPostFooter(doc: any, data: any) {
      this.buildPosterFooterForStatementModule(doc, data);
    }
}
