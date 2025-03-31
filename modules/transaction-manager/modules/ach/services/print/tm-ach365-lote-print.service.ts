import { Injectable } from '@angular/core';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { PdfService } from '../../../../../../service/prints/pdf.service';

@Injectable({
  providedIn: 'root'
})
export class TmAch365LotePrintService extends PdfService {

  buildBody(doc: any, data: any): void {
    const {
      registers,
      lote,
      credits,
      total,
      currency,
      date,
      status,
      sourceAccount,
      accountName,
    } = data ?? {};

    const col = [
      `${this.translate.instant('bank')}`,
      `${this.translate.instant('product')}`,
      `${this.translate.instant('currency')}` ,
      `${this.translate.instant('no_account')}`,
      `${this.translate.instant('accountName')}`,
      `${this.translate.instant('amount')}`,
      `${this.translate.instant('email')}`,
      `${this.translate.instant('comment')}`
    ];

    const rows: any = [];

    registers.forEach(element => {
      let temp = [
        element?.bankName,
        element?.product,
        element?.currency,
        element?.account,
        element?.name,
        element?.amount,
        element?.email,
        element?.comment,
      ];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', '', '', '', ''];
        rows.push(temp);
      }
    });

    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.setFont('Lato-Regular', 'normal');

    doc.text(`${this.translate.instant('date')}`, 10, 65);
    doc.text(`${this.translate.instant('tm:ach:label_lote2')}`, 10, 73);
    doc.text(`${this.translate.instant('status')}`, 10, 81);
    doc.line(10, 89, 200, 89); // divider line

    doc.setFont('Lato-Bold');
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('account_debited_tpl')}`, 10, 100);

    doc.setFontSize(10);
    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('ach_name_account')}`, 10, 108);
    doc.text(`${this.translate.instant('no_account')}`, 10, 116);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(date.standard, 65, 65);
    doc.text(lote, 65, 73);
    doc.text(status, 65, 81);
    doc.text(`${accountName}`, 65, 108);
    doc.text(`${sourceAccount}`, 65, 116);


    doc.autoTable(col, rows, {
      startY: 125, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
      columnStyles: {
        0: { cellWidth: 23 },
        1: { cellWidth: 23 },
        2: { cellWidth: 23 },
        3: { cellWidth: 23 },
        4: { cellWidth: 23 },
        5: { cellWidth: 23 },
        6: { cellWidth: 23 },
        7: { cellWidth: 23 },
        8: { cellWidth: 23 },
      },

    });


    const finalTable = doc.lastAutoTable.finalY;

    doc.setFont('Lato-Bold');
    doc.setTextColor('#5A5A5A');
    doc.text(this.translate.instant('tm:ach:label_total_amount:'), 40, finalTable + 8);

    doc.setTextColor('#2c8b9e');
    doc.text(`${currency} ${total}`, 65, finalTable + 8);

    doc.setTextColor('#5A5A5A');
    doc.text(this.translate.instant('tm:ach:label_quantity_credits:'), 125, finalTable + 8);

    doc.setTextColor('#2c8b9e');
    doc.text(`${credits}`, 158, finalTable + 8);
    doc.line(10, finalTable + 12, 200, finalTable + 12); // divider line
    doc.line(105, finalTable, 105, finalTable + 12);

    doc.setFont('Lato-Regular', 'normal');
    autoTable(doc, {
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 50 : finalTable + 25,
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
    doc.text(`${this.translate.instant('note-message-first-sv')}`, 66, finalTable1 + 10);
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
    doc.setFontSize(14);
    doc.setTextColor("#6F6F6F");
    doc.text(`${this.translate.instant('tm365:label_proof_modal_title')}`, 10, 50, {align: 'left'});

    if (data.lote || data.lote) {
      doc.setFontSize(14);
      doc.setTextColor("#11456F");
      doc.text(`${this.translate.instant('reference:')} ${data.lote}`, 200, 50, {align: 'right'});
    }
    doc.line(10, 53, 200, 53); // divider line
  }
}
