import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { IPrintData } from '../../../../interface/print-data-interface';
import { PdfService } from '../../../../../../service/prints/pdf.service';

@Injectable({
  providedIn: 'root'
})
export class S368PdfService extends PdfService {
  /**
   * @Return Extended method required by heredity
   */
  buildBody(doc: jsPDF, data: any): void {
    console.log('buildBodyTransfer');
  }

  /**
   *@Return Extended Method  for resets the values of the positions to the specified coordinates
   * to save the generated changes
   */
  buildPostFooter(doc: any, data: any): void {
    this.titleY = 52;
    this.lineY = 0;
    this.dataY = 53;
  }
  /**
   * @Return Extended method required by heredity
   */
  buildTitles(doc: any, data: any) {
    console.log('buildTitlesTransfer');
  }

  /**
   * @Return Overwrite of the document body construction
   * returning it with the desired specifications for the specific document.
   */
  override buildBodyRefactor(doc: jsPDF, data: any, printDataList: IPrintData[]): void {
    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a')

    this.buildTitlesContentForBodyRefactor(doc, printDataList);
    this.buildDescriptionsContentForBodyRefactor(doc, printDataList);

    this.buildTableForBodyRefactor(doc);
  }

  override buildDescriptionsContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {

    let positionDataY = 200;
    this.dataY = 58;
    for (let i = 0; i < printDataList.length; i++) {

      doc.setTextColor('#9b9b9b');
      const value = printDataList[i].value ? printDataList[i].value : '';
      let positionX = 65;

      if (i <= 7) {
        positionDataY = this.dataY += 10;
        doc.text(value, positionX, positionDataY, { maxWidth: 155 });
      } else {
        if (i === 8) this.dataY += 6;
        positionDataY = this.dataY += 10;
        doc.text(value, positionX, positionDataY, { maxWidth: 155 });
      }
    }
  }

  override buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
    for (let i = 0; i < printDataList.length; i++) {

      if (printDataList[i].title) {
        this.lineY = this.titleY += 6;
        if (i >= 1) {
          doc.line(10, this.lineY, 200, this.lineY);
        }

        doc.setFont('Lato-Bold', 'normal');
      } else {
        doc.setFont('Lato-Regular', 'normal');
      }

      this.buildTitlesForTransfer(doc, printDataList, i);
    }
  }

  private buildTitlesForTransfer(doc: any, printDataList: IPrintData[], i: number) {
    if (printDataList[i].label) {
      if (printDataList[i].secondColumn) {
        doc.text(`${this.translate.instant(printDataList[i].label)}`, 115, this.titleY);
      } else {
        this.titleY += 10
        doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, this.titleY);
      }
    }
  }


  /**
   *@Return Overwrite the header construction methods giving
   *customization for the specific document.
   */
  override buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Bold');
    doc.setFontSize(14);
    doc.setTextColor("#6F6F6F");
    doc.text(`${this.translate.instant(title)}`, 10, 50, { align: 'left' });

    if (data.referenceNumber || data.reference) {
      doc.setFontSize(14);
      doc.setTextColor("#11456F");
      doc.text(`No: ${data.referenceNumber}`, 200, 50, { align: 'right' });
    }
    doc.line(10, 53, 200, 53);
  }
}
