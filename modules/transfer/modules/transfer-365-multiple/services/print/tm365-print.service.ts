import { Injectable } from '@angular/core';
import { PdfService } from '../../../../../../service/prints/pdf.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class Tm365PrintService extends PdfService {
  buildBody(doc: any, data: any): void {
    const { sourceAccount, registers, labels } = data ?? {};

    const col = [
      labels.labelBankName,
      labels.labelProduct,
      labels.labelCurrency,
      labels.labelAccount,
      labels.clientType,
      labels.labelAmount,
      labels.labelEmail,
      labels.labelComment,
    ];

    const rows: any = [];
    const items: any[] = registers;


    items.forEach(element => {
      let temp = [
        element.bankName,
        element.productName,
        element.currency,
        element.account,
        element.clientType,
        element.amountFormatted,
        element.email,
        element.comment,
      ];

      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', ''];
        rows.push(temp);
      }
    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('root-account')}`, 10, 65);
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(`${sourceAccount?.account} / ${sourceAccount?.name}`, 40, 65);

    doc.autoTable(col, rows, {
      startY: 75, margin: { left: 10, right: 10, bottom: 0 },
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
    doc.setFontSize(14);

    doc.setTextColor('#505050');
    doc.text(`${this.translate.instant('tm365:label_proof_modal_title')}`, 10, 50, { align: 'left' });
    doc.setFontSize(14);
    doc.setTextColor('#003158');
    doc.text(`${this.translate.instant('reference')}: ${this.authorization}`, 200, 50, { align: 'right' });
    doc.line(10, 53, 200, 53); // divider line
  }
}
