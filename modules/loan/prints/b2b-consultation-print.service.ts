import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { IConsultPrintData } from '../../transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class B2bConsultationPrintService extends PdfService {
  override buildBodyRefactor(doc: jsPDF, data: any, printDataList: IConsultPrintData[]): void {
    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a')

    this.buildTitleSectionForConsultation(doc, printDataList);
    this.buildDetailSectionForConsultation(doc, printDataList);
    this.buildTableForBodyRefactor(doc);
  }

  private buildTitleSectionForConsultation(doc: jsPDF, printDataList: IConsultPrintData[]) {
    for (const x in printDataList) {
      if (printDataList[x].title) {
        this.lineY = this.titleY += 8;
        doc.line(10, this.lineY, 200, this.lineY);
        doc.setFont('Lato-Bold', 'normal');
      } else {
        doc.setFont('Lato-Regular', 'normal');
      }

      if (printDataList[x].label) {
        if (printDataList[x].secondColumn) {
          doc.text(`${this.translate.instant(printDataList[x].label)}`, 115, this.titleY);
        } else {
          const valueToTitleY = this.titleY += 8;
          doc.text(`${this.translate.instant(printDataList[x].label)}`, 10, valueToTitleY);
        }
      }
    }
  }

  private buildDetailSectionForConsultation(doc: jsPDF, printDataList: IConsultPrintData[]) {
    let positionDataY = 0;
    for (const x in printDataList) {
      doc.setTextColor('#9b9b9b');
      if (printDataList[x].label && x !== '0' && printDataList[x].title) {
        positionDataY = this.dataY += 8;
        doc.text('', 65, positionDataY);
      }
      const value = printDataList[x].value ? printDataList[x].value : '';
      if (printDataList[x].secondColumn) {
        positionDataY = this.dataY;
        doc.text(value, 170, positionDataY);
      } else {
        positionDataY = this.dataY += 8;
        doc.text(value, 50, positionDataY);
      }
    }
  }


  buildBody(doc: jsPDF, data: any): void {
    console.log('buildBody Consultation');
  }

  buildPostFooter(doc: any, data: any): void {
    console.log('buildPostFooter Consultation');
  }

  buildTitles(doc: jsPDF, data: any): void {
    console.log('buildTitles Consultation');
  }
}
