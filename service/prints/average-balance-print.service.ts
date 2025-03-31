import { Injectable } from '@angular/core';
import 'jspdf-autotable';
import { PdfService } from './pdf.service';
import { environment } from 'src/environments/environment';
import { EProfile } from 'src/app/enums/profile.enum';

/**
 * @author Noe Fernandez
 *
 *  Servicios utilizados para la impresion del body del pdf Reservation-detail-component
 */


@Injectable({
  providedIn: 'root'
})
export class AverageBalancePrintService extends PdfService {
  override profile = environment.profile;

  buildPostFooter(doc: any, data: any): void {
     // This is intentional
  }

  // Construccion de los titulos, con la data como parametro
  buildTitles(doc: any, data: any) {
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(14);

    switch(this.profile){
      case EProfile.HONDURAS:
        doc.setTextColor(10, 73, 137);
        break;
      case EProfile.SALVADOR:
        doc.setTextColor(10, 73, 137);
        break;
      case EProfile.PANAMA:
        doc.setTextColor(44, 139, 158);
      break;
      default: 
      doc.setTextColor(10, 73, 137);
      break;
    }
    doc.text(`${this.translate.instant('averageBalances')}`, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`${data['accountDetail']['accountName']} ${data['subProduct']}`, doc.internal.pageSize.getWidth() / 2, 57, { align: "center" });

    doc.line(10, 61, 200, 61); // linea divisora
  }

  // Construccion de body, con la data como parametro
  buildBody(doc: any, data: any) {

    const col = [`${this.translate.instant('mounth')}`, `${this.translate.instant('balance2')}`];
    const rows: any[] = [];
    const items = data['averageBalances'];

    // Pushamos a rows lo que trae la constante items para poder iterar en las tablas 
    items.forEach(element => {
      const temp = [`${this.translate.instant('month-' + element.month)} ${element.year}`, element.amount];
      rows.push(temp);
    });


    // Construccion de parrafos de informacion del usuario
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);

    doc.text(`${this.translate.instant('accountName')}`, 10, 70);
    doc.text(`${this.translate.instant('coin')}`, 10, 80);
    doc.text(`${this.translate.instant('state')}`, 10, 90);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(`${data['accountDetail']['accountName']}`, 65, 70);
    doc.text(`${data['currencySymbol']}`, 65, 80);
    doc.text(`${data['accountDetail']['state']}`, 65, 90);


    // Construccion de tabla e iteracion de col y rows
    doc.autoTable(col, rows, {
      startY: 100, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fontStyle: 'bold',
        fillColor: [155, 155, 155],
        minCellHeight: 13,
        font: 'Lato-Bold'
      },
      bodyStyles: { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], minCellHeight: 13, font: 'Lato-Regular' }
    });
  }


}
