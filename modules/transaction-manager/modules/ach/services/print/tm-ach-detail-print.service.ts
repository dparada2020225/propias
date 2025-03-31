import { Injectable } from '@angular/core';
import { PdfService } from '../../../../../../service/prints/pdf.service';
import jsPDF from 'jspdf';
import { IPrintData } from '../../../../../transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class TmAchDetailPrintService extends PdfService {


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
    doc.setTextColor('#5a5a5a');
    this.titleY += 5;
    this.dataY += 5;

    this.buildTitlesContentForBodyRefactor(doc, printDataList);
    this.buildDescriptionsContentForBodyRefactor(doc, printDataList);

    this.buildTableForBodyRefactor(doc);
  }

  override buildDescriptionsContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
    let positionDataY = 0;

    for (let i = 0; i < printDataList.length; i++) {
      doc.setTextColor('#9b9b9b');
      const value = printDataList[i].value ? printDataList[i].value : '';

      if (printDataList[i].title && printDataList[i].label) {
        positionDataY = this.dataY += 8;
      }

      positionDataY = this.dataY += 8;
      doc.text(value, 50, positionDataY, {maxWidth: 155});
    }
  }

  override buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
    for (let i = 0; i < printDataList.length; i++) {

      if (printDataList[i].title && printDataList[i].label) {
        this.lineY = this.titleY += 6;

        const y = this.lineY + 2;
        doc.line(10, y, 200, y);
        doc.setFont('Lato-Bold', 'normal');
      } else {
        doc.setFont('Lato-Regular', 'normal');
      }

      this.buildTitlesForTransfer(doc, printDataList, i);
    }
  }

  private buildTitlesForTransfer(doc: any, printDataList: IPrintData[], i: number) {
    if (!printDataList[i].label) return;

    if (printDataList[i].title && printDataList[i].label) {
      this.titleY += 3;
    }

    const indexPositionY = this.titleY += 8;
    doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, indexPositionY);
  }


  override buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Bold');
    doc.setFontSize(14);
    doc.setTextColor("#6F6F6F");
    doc.text(`${this.translate.instant(title)}`, 10, 50, {align: 'left'});

    if (data.referenceNumber || data.reference) {
      doc.setFontSize(14);
      doc.setTextColor("#11456F");
      doc.text(`${this.translate.instant('reference:')} ${data.referenceNumber}`, 200, 50, {align: 'right'});
    }
    doc.line(10, 53, 200, 53); // divider line
  }
}
