import { Injectable } from '@angular/core';
import autoTable from 'jspdf-autotable';
import { PdfService } from './pdf.service';

/**
 * @author Noe Fernandez
 *
 *  Servicios utilizados para la impresion del body del pdf Reservation-detail-component
 */

@Injectable({
  providedIn: 'root'
})
export class ReservationDetailPrintService extends PdfService {
  buildPostFooter(doc: any, data: any): void {
     // This is intentional
  }

  // Construccion de los titulos, con la data como parametro
  buildTitles(doc: any, data: any) {
    doc.setFontSize(14);
    doc.setTextColor(10, 73, 137);
    doc.text(`${this.translate.instant('details-reserve')}`, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`${data['mask']} ${data['name']}`, doc.internal.pageSize.getWidth() / 2, 57, { align: "center" });

    doc.line(10, 61, 200, 61); // linea divisora
  }


  // Construccion de body, con la data como parametro
  buildBody(doc: any, data: any) {
    const col = [`${this.translate.instant('date')}`, `${this.translate.instant('description-reserve')}`, `${this.translate.instant('amount')}`];
    const rows: any = [];
    const items = data['movement'];

    // Pushamos a rows lo que trae la constante items para poder iterar en las tablas 
    items.forEach(element => {
      const temp = [element.date, element.description, element.amount,];
      rows.push(temp);
    });

    // Construccion de parrafos de informacion del usuario
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`${this.translate.instant('type-reserve')}`, 10, 70,);
    doc.text(`${this.translate.instant('breadcrumb.currency')}`, 10, 80,);

    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(data['type'], 65, 70,);
    doc.text(data['currency'], 65, 80,);


    // Construccion de tabla e iteracion de col y rows
    doc.autoTable(col, rows, {
      startY: 90, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
        fillColor: [155, 155, 155],
        minCellHeight: 13
      },
      bodyStyles: { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], minCellHeight: 13 }
    });

    const final = doc.lastAutoTable.finalY;
    autoTable(doc, {
      theme: 'plain',
      tableLineColor: [231, 76, 60],
      styles: {
        halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [10, 73, 137],
        fillColor: [255, 255, 255], minCellHeight: 13
      },
      startY: final,
      columnStyles: {
        0: { cellWidth: 37 },
        1: { cellWidth: 103 },
        2: { cellWidth: 50 },
      },
      margin: { left: 10, right: 10, bottom: 0, top: 0 },
      body: [
        [`${this.translate.instant('total-print')}`, '', data['total']],
      ],
    });
    doc.setDrawColor(90, 90, 90);
    doc.line(10, final + 10, 200, final + 10);
    doc.setFontSize(18);
  }
}
