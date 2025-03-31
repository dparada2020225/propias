import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * @author Hernan Uriarte
 *
 *  Servicios utilizados para la impresion de pdf
 */

@Injectable({
    providedIn: 'root'
})
export class NoteStatementPrintService extends PdfService {
    override businessName = '';
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

    }

    buildTitles(doc: any, data: any) {
        this.currentLanguage = this.translate.currentLang;

        doc.setFontSize(14);
        doc.setTextColor(10, 73, 137);
        if (this.currentLanguage === 'en') {
            if (data['type'] === 'CREDITO') {
                doc.text(`CREDIT NOTE`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
            } else if (data['type'] === 'DEBITO') {
                doc.text(`DEBIT NOTE`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
            }
        } else if (this.currentLanguage === 'es' || !this.currentLanguage) {
            doc.text(`${this.translate.instant('label.statements.detail-title')}` + data['type'], doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
        }

        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        doc.text(data['name'], doc.internal.pageSize.getWidth() / 2, 47, { align: 'center' });

        doc.line(10, 51, 200, 51); // linea divisora
    }

    buildBody(doc: any, data: any) {

        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        doc.text(`${this.translate.instant('label.statements.concept')}`, 10, 60);
        doc.text(`${this.translate.instant('label.statements.date-modal')}`, 10, 68);
        doc.text(`${this.translate.instant('label.statements.account-type')}`, 10, 76);
        doc.text(`${this.translate.instant('label.statements.account-number')}`, 10, 84);
        doc.text(`${this.translate.instant('label.statements.account')}`, 10, 92);
        doc.text(`${this.translate.instant('label.statements.agency')}`, 10, 100);
        doc.text(`${this.translate.instant('label.statements.address')}`, 10, 108);
        doc.text(`${this.translate.instant('label.statements.reason')}`, 10, 116);
        doc.text(`${this.translate.instant('label.statements.observations')}`, 10, 124);
        doc.text(`${this.translate.instant('label.statements.document')}`, 10, 132);

        doc.setFontSize(10);
        doc.setTextColor(155, 155, 155);
        doc.text((data['concept'] || ''), 65, 60);
        doc.text((data['date'] || ''), 65, 68);
        doc.text((data['typeAccount'] || ''), 65, 76);
        doc.text((data['account'] || ''), 65, 84);
        doc.text((data['alias'] || ''), 65, 92);
        doc.text((data['agency'] || ''), 65, 100);
        const splitTitle = doc.splitTextToSize((data['address'] || ''), 120);
        doc.text(splitTitle, 65, 108);
        doc.text((data['reasonCode'] || '') + ' - ' + (data['reason'] || ''), 65, 116);
        doc.text((data['observation'] || ''), 65, 124);
        doc.text("No. " + data['reference'], 65, 132);

        doc.line(10, 141, 200, 141);

        doc.setFontSize(10);
        doc.setTextColor(90, 90, 90);
        doc.text(`${this.translate.instant('label.statements.description')}`, 70, 149);
        doc.text(`${this.translate.instant('label.statements.value')}`, 70, 157);

        doc.setFontSize(10);
        doc.setTextColor(155, 155, 155);
        doc.text((data['description'] || ''), 95, 149);
        doc.text(data['currency'] + ' ' + data['amount'], 95, 157);

        doc.line(10, 165, 200, 165);

    }

    buildPostFooter(doc: any, data: any) {
      this.buildPosterFooterForStatementModule(doc, data);
    }
}
