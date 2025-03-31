import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { StorageService } from '@adf/security';
import { PdfService } from '../../../../../../service/prints/pdf.service';
import { BusinessNameService } from '../../../../../../service/shared/business-name.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ConsultAchPrintService extends PdfService {
  constructor(
    public override translate: TranslateService,
    public override businessNameService: BusinessNameService,
    public override datePipe: DatePipe,
    public override storageService: StorageService,
    public override modalService: NgbModal,
    public utilService: UtilService,
  ) {
    super( translate, businessNameService, datePipe, storageService, utilService, modalService);
  }

  buildPostFooter(doc: any, data: any): void {
    console.log('buildPostFooter consult detail');
  }


  buildBody(doc: any, data: any): void {
    const { initialDate, finalDate } = data ?? {};

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);

    doc.text(`${this.translate.instant('initial_date')}`, 10, 63);
    doc.text(`${this.translate.instant('final_date')}`, 10, 70);
    doc.line(10, 78, 200, 78); // divider line

    doc.text(`${initialDate}`, 65, 63);
    doc.text(`${finalDate}`, 65, 70);

    const col = [
      `${this.translate.instant('date')}`,
      `${this.translate.instant('operation')}`,
      `${this.translate.instant('transaction')}`,
      `${this.translate.instant('beneficiary_sender_pdf')}`,
      `${this.translate.instant('destination_bank_transmitter')}`,
      `${this.translate.instant('status_type')}`,
      `${this.translate.instant('currency')}`,
      `${this.translate.instant('amount')}`,
    ];

    const rows: any[] = [];
    const items: any[] = this.utilService.parseACHOperationsResponseByProof(data?.data, data?.movement);

    items.forEach((element) => {
      let temp = [
        element?.dateTime,
        element?.operation,
        element?.transfer,
        element?.senderBeneficiary,
        element?.issuingDestination,
        element?.status,
        this.util.getCurrencySymbolToIso(element?.currency),
        element?.amount,
      ];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', '', '', '', ''];
        rows.push(temp);
      }
    });



    doc.autoTable(col, rows, {
      startY: 85, margin: { left: 10, right: 10, bottom: 10 },
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
        fillColor: [155, 155, 155],
        font: 'Lato-Bold',

      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor: [234, 234, 234],
        font: 'Lato-Regular'
      },
    });
  }

  buildTitles(doc: jsPDF, data: any): void {
    doc.setFont('Lato-Bold');
    switch (this.profile) {
      case 'bipa':
        doc.setTextColor('#5a5a5a');
        break;
      case 'banpais':
        doc.setFontSize(14);

        doc.setTextColor('#5A5A5A');
        doc.text(`${this.translate.instant('ach-conope')}`, 10, 50, { align: 'left' });

        doc.line(10, 53, 200, 53); // divider line
        break;
      case 'bisv':
        doc.setTextColor(12, 63, 120);
        break;
      default:
        doc.setTextColor(1, 92, 141);
    }
  }

  override buildFooter(doc: any, data: any, startY: number) {
    this.buildPosterForConsultWithoutReference(doc, data, startY);
  }



}
