import { Injectable } from '@angular/core';
import { PdfService } from '../../../../../../service/prints/pdf.service';
import jsPDF from 'jspdf';
import { IPrintData } from '../../../../../transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class AmpAchCreateService extends PdfService {
  buildBody(doc: jsPDF, data: any): void {
    console.log('buildBodyTransfer');
  }

  buildPostFooter(doc: any, data: any): void {
    this.titleY = 52;
    this.lineY = 0;
    this.dataY = 53;
  }

  buildTitles(doc: any, data: any) {
    console.log('buildTitlesTransfer');
  }


  override buildBodyRefactor(doc: jsPDF, data: any, printDataList: IPrintData[]): void {
    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a')
    this.buildTitlesContentForBodyRefactor(doc, printDataList);
    this.buildDescriptionsContentForBodyRefactor(doc, printDataList, data);
    this.buildTableForBodyRefactor(doc, false);
  }

  override buildDescriptionsContentForBodyRefactor(doc: any, printDataList: IPrintData[], data?: any) {
    let positionDataY = 200;
    this.dataY = 52;

    for (const element of printDataList) {
      if (element.label) {
        doc.setTextColor('#9b9b9b');
        const value = element.value ? element.value : '';
        let positionX = data?.use365Pdf ? 65 : data?.useS365Pdf ? 80 : 50;
        positionDataY = this.dataY += 10;
        doc.text(value, positionX, positionDataY, { maxWidth: 155 });
      }
    }
  }

  override buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
    doc.setFont('Lato-Regular', 'normal');
    for (const element of printDataList) {
      if (element.label) {
        doc.line(10, this.lineY, 200, this.lineY);
        this.titleY += 10;
        doc.text(`${this.translate.instant(element.label)}`, 10, this.titleY);
      }
    }
  }


  override buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Bold');
    doc.setFontSize(14);
    doc.setTextColor("#6F6F6F");
    doc.text(`${this.translate.instant(title)}`, 10, 50, { align: 'left' });

    if (data.referenceNumber || data.reference) {
      doc.setFontSize(14);
      doc.setTextColor("#11456F");
      doc.text(`${this.translate.instant('reference:')} ${data.referenceNumber}`, 200, 50, { align: 'right' });
    }
    doc.line(10, 53, 200, 53); // divider line

  }
}
