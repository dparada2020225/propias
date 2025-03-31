import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { IPrintData } from '../../../../../transfer/interface/print-data-interface';
import { PdfService } from '../../../../../../service/prints/pdf.service';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class TmAchSignaturesPrintService extends PdfService {

  buildBody(doc: any, data: any): void {
    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a');
    doc.setFont('Lato-Regular', 'normal');
    doc.setTextColor('#9b9b9b');

    const col = [
      `${this.translate.instant('user')}`,
      `${this.translate.instant('tm:ach:label_type_signature')}`,
      `${this.translate.instant('date')}` ,
      `${this.translate.instant('hour')}`,
    ];

    const rows: any = [];
    const items: any[] = data.signatures;


    items.forEach(element => {
      let temp = [element?.username,  element?.signatureType, element?.dateFormatted, element?.hour];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', ''];
        rows.push(temp);
      }
    });


    doc.autoTable(col, rows, {
      startY: 65, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
    });

    const finalTable = doc.lastAutoTable.finalY;

    autoTable(doc, {
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 60 : finalTable + 60,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        [`${this.translate.instant('document-title')} ${this.authorization}`],
      ],
    });

    const finalTable11 = doc.lastAutoTable.finalY;
    doc.setFont('Lato-Bold');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('note-title')}`, 52, finalTable11 + 10);

    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('note-message-first-sv')}`, 66, finalTable11 + 10);
    doc.text(`${this.translate.instant('note-message-second')}`, doc.internal.pageSize.getWidth() / 2 , finalTable11 + 15, { align: 'center' });
  }

  buildPostFooter(doc: any, data: any): void {
    this.titleY = 52;
    this.lineY = 0;
    this.dataY = 53;
  }

  buildTitles(doc: any, data: any) {
    doc.setFont('Lato-Bold');
    doc.setFontSize(14);
    doc.setTextColor("#6F6F6F");
    doc.text(`${this.translate.instant('tm:ach:subtitle_signatory')}`, 10, 50, {align: 'left'});
    doc.line(10, 53, 200, 53); // divider line
  }

}
