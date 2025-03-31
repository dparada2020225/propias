import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { ITransactionHistory } from '../interfaces/transaction-history.interface';

@Injectable({
  providedIn: 'root'
})
export class ThPrintService extends PdfService {


  labelReference = this.translate.instant('reference');
  labelDateCreated = this.translate.instant('date_created');
  labelTransaction = this.translate.instant('transaction');
  labelCurrency = this.translate.instant('breadcrumb.currency');
  labelAmount = this.translate.instant('amount');
  labelUser = this.translate.instant('user_created');


  buildPostFooter(doc: any, data: any) {
    console.log('buildPoster');
  }

  buildTitles(doc: jsPDF, data: any) {
    doc.setFont('Lato-Bold');
    switch (this.profile) {
      case 'bipa':
        doc.setTextColor('#5a5a5a');
        break;
      case 'banpais':
        doc.setFontSize(14);
        doc.setTextColor('#1366A8');
        break;
      case 'bisv':
        doc.setTextColor(12, 63, 120);
        break;
      default:
        doc.setTextColor(1, 92, 141);
    }

    doc.text(`${this.translate.instant('label:history_transaction')}`, 10, 50, { align: 'left' });
    doc.line(10, 55, 200, 55);
  }

  buildBody(doc: any, data: any): void {
    const rows: string[][] = [];
    const items: ITransactionHistory[] = data?.transactions;
    const col = [this.labelReference, this.labelDateCreated, this.labelTransaction, this.labelCurrency, this.labelAmount, this.labelUser];

    items.forEach(element => {
      let temp = [element?.reference, element?.creationDate, element?.serviceDescription, element?.currency, element?.amount, element?.creator];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', '', ''];
        rows.push(temp);
      }

    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`${this.translate.instant('beginning-date')}`, 10, 70);
    doc.text(`${this.translate.instant('ending-date')}`, 10, 78);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(data?.date?.initial, 40, 70);
    doc.text(data?.date?.final, 40, 78);


    doc.line(10, 90, 200, 90);



    doc.autoTable(col, rows, {
      startY: 100, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
      createdCell: (a: any) => {
        if (3 < a.column.index && a.column.index < 7 && a.section === 'body') {
          if (6 === a.column.index) {
            a.cell.styles.textColor = '#1366A8';
          }
        }
      }
    });

    const final = doc.lastAutoTable.finalY;


    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 15 : final + 100,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
    });
  }

  override buildFooter(doc: any, data: any, startY: number) {
    this.buildPosterForConsultWithoutReference(doc, data, startY);
  }
}
