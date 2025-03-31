import { Injectable } from '@angular/core';
import { PdfService } from '../../../../../service/prints/pdf.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})

export class BulkTransferPrintService extends PdfService {



  buildBody(doc: any, data: any): void {
    const { sourceAccount, amountRegister, totalAmount, typeAccount, operationDate, currencyDescription } = data ?? {};

    const col = [
      `${this.translate.instant('account')}`,
      `${this.translate.instant('ach-name')}`,
      `${this.translate.instant('ach-format')}` ,
      `${this.translate.instant('amount')}`,
      `${this.translate.instant('financial-institution')}`
    ];

    const rows: any = [];
    const items: any[] = data.data;


    items.forEach(element => {
      let temp = [element?.account,  element?.name, element?.product, element?.parsedAmount, element?.bankName];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', ''];
        rows.push(temp);
      }
    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.setFont('Lato-Bold', 'normal');

    doc.text(`${this.translate.instant('root-account')}`, 10, 65);
    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('operation-date')}`, 10, 73);
    doc.text(`${this.translate.instant('root-account-type')}`, 10, 81);
    doc.text(`${this.translate.instant('debit_account')}`, 10, 89);
    doc.text(`${this.translate.instant('amount-debited')}`, 10, 97);
    doc.text(`${this.translate.instant('number-of-credits')}`, 10, 105);
    doc.text(`${this.translate.instant('currency')}`, 10, 113);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(operationDate, 65, 73);
    doc.text(typeAccount, 65, 81);
    doc.text(`${sourceAccount?.account} ${sourceAccount?.name}`, 65, 89);
    doc.text(`${totalAmount}`, 65, 97);
    doc.text(`${amountRegister}`, 65, 105);
    doc.text(currencyDescription, 65, 113);

    doc.line(10, 120, 200, 120);

    doc.setFontSize(14);
    doc.setFont('Lato-Bold', 'normal');
    doc.setTextColor('#9B9B9B');
    doc.text(`${this.translate.instant('detail-destionation-account')}`, 15, 130);

    doc.autoTable(col, rows, {
      startY: 135, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
    });

    const finalTable = doc.lastAutoTable.finalY;

    autoTable(doc, {
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 10 : finalTable + 10,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        [`${this.translate.instant('document-title')} ${this.authorization}`],
      ],
    });

    const finalTable1 = doc.lastAutoTable.finalY;


    doc.setFont('Lato-Regular', 'bold');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('note-title')}`, 52, finalTable1 + 10);

    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('note-message-first')}`, 66, finalTable1 + 10);
    doc.text(`${this.translate.instant('note-message-second')}`, doc.internal.pageSize.getWidth() / 2 , finalTable1 + 15, { align: 'center' });

    const finalTable2 = doc.lastAutoTable.finalY;

    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 15 : finalTable2 + 50,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
    });
  }


  buildPostFooter(doc: any, data: any): void {
    console.log('buildPoster BTE');
  }

  buildTitles(doc: jsPDF, data: any): void {
    doc.setFont('Lato-Bold');
    switch (this.profile) {
      case 'bipa':
        doc.setTextColor('#5a5a5a');
        break;
      case 'banpais':
        doc.setFontSize(14);

        doc.setTextColor('#1366A8');
        doc.text(`${this.translate.instant('transfers_other_banks')}`, 10, 50, { align: 'left' });

        if (data?.referenceNumber) {
          doc.setFontSize(14);
          doc.setTextColor('#1366A8');
          doc.text(`No. 1366A8`, 200, 50, { align: 'right' });
          doc.text(`No. 1366A8`, 200, 50, { align: 'right' });

        } else if (data?.reference) {
          doc.setFontSize(14);
          doc.setTextColor('#1366A8');
          doc.text(`${this.authorization}`, 200, 50, { align: 'right' });
        }

        doc.line(10, 53, 200, 53); // divider line
        break;
      case 'bisv':
        doc.setTextColor(12, 63, 120);
        break;
      default:
        doc.setTextColor(1, 92, 141);
    }
  }

}
