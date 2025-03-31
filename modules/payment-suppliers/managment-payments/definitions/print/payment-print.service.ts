import { Injectable } from '@angular/core';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentPrintService extends PdfService{
  buildBody(doc: any, data: any): void {
    const { account, registers, labels, detail, credits, fecha, amount } = data ?? {};

    const col = [
      labels.labelAccount,
      labels.labelAccountName,
      labels.labelStatus,
      labels.labelEmail,
      labels.labelDetail,
      labels.labelAmount,
    ];

    const rows: any = [];
    const items: any[] = registers;


    items.forEach(element => {
      let temp = [
        element.cuentaDestino,
        element.nombreCuenta,
        element.estadoCuenta,
        element.correo,
        element.detalle,
        element.montoDestino,
      ];

      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', ''];
        rows.push(temp);
      }
    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#5A5A5A');
    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('ps:root-account')}`, 10, 65);
    doc.text(`${this.translate.instant('ps:total_amount_label')}`, 10, 73);
    doc.text(`${this.translate.instant('ps:currency')}`, 10, 81);
    doc.text(`${this.translate.instant('ps:label_credits_payments')}`, 10, 89);
    doc.text(`${this.translate.instant('ps:label_date_file_payment')}`, 10, 97);
    doc.setFontSize(8);
    doc.setTextColor(155, 155, 155);

    doc.text(`${account.account}`, 70, 65);
    doc.text(`${amount}`, 70, 73);
    doc.text(`${environment.currency}`, 70, 81);
    doc.text(`${credits}`, 70, 89);
    doc.text(`${fecha ?? ''}`, 70, 97);
    doc.line(10, 105, 200, 105); // divider line

    doc.autoTable({
      head: [col],
      body: rows,
      startY: 110,
      margin: { left: 10, right: 10, bottom: 0 },
      headStyles: {
        halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold'
      },
      bodyStyles: {
        halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular'
      },
      columnStyles: {
        0: { cellWidth: 30 } ,
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 20 } 
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {  
            let status = data.cell.raw;
    
            data.cell.text = status.toUpperCase(); 
    
            if (status === 'Activa' || status === 'Active') {
                data.cell.styles.textColor = [39, 198, 113];  
            } else {
              data.cell.styles.textColor = [242, 55, 82];
            }
        }
    }
    });

    let finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.setTextColor('#00c1d4');

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


    doc.setFont('Lato-Bold');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('note-title')}`, 52, finalTable1 + 10);

    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('note-message-first-sv')}`, 66, finalTable1 + 10);
    doc.text(`${this.translate.instant('note-message-second')}`, doc.internal.pageSize.getWidth() / 2 , finalTable1 + 15, { align: 'center' });

    const finalTable2 = doc.lastAutoTable.finalY;

    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 20 : finalTable2 + 60,
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
    doc.text(`${this.translate.instant(data.title)}`, 10, 50, { align: 'left' });
    doc.setFontSize(14);
    doc.setTextColor('#003158');
    doc.text(`${this.translate.instant('reference')}: ${this.authorization ?? ''}`, 200, 50, { align: 'right' });
    doc.line(10, 53, 200, 53); // divider line
  }


}