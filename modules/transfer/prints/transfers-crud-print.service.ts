import { Injectable } from '@angular/core';
import { EProfile } from 'src/app/enums/profile.enum';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { IPrintData } from '../interface/print-data-interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class TransfersCrudPrintService extends PdfService {

  /**
   * @Return Extended method required by heredity
   */
  buildBody(doc: jsPDF, data: any): void {
    console.log('buildBodyTransferCrud');
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
    console.log('buildTitlesTransferCrud');
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
    let positionDataY = 0;
    for (let i = 0; i < printDataList.length; i++) {
      doc.setTextColor('#9b9b9b');
      const value = printDataList[i].value ? printDataList[i].value : '';

      if (i === 0) {
        positionDataY = this.dataY += 7;
        doc.text(value, 50, positionDataY, { maxWidth: 155 });
      } else {
        positionDataY = this.dataY += 8;
        doc.text(value, 50, positionDataY, { maxWidth: 155 });
      }
    }
  }

  override buildTableForBodyRefactor(doc: any) {
    this.lineY = this.dataY += 12;
    doc.line(10, this.lineY, 200, this.lineY);

    const bodyRefactorTableStartY = this.lineY += 10;
    autoTable(doc, {
      startY: bodyRefactorTableStartY,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        [`${this.translate.instant('document-title')} ${this.authorization}`],
      ],
    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setTextColor(155, 155, 155);
    const noteTitlePositionY = this.lineY += 25;
    doc.text(`${this.translate.instant('note-title')}`, 62.5, noteTitlePositionY);

    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('note-message-first-sv')}`, 74.5, this.lineY);
    this.titleY = 52;
    this.lineY = 0;
    this.dataY = 60;
  }

  override buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
    for (let i = 0; i < printDataList.length; i++) {

      if (printDataList[i].title) {
        this.lineY = this.titleY += 0;
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
      const indexPositionY = this.titleY += 8;
      doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, indexPositionY);
    }
  }

  override buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Bold');
    switch (this.profile) {
      case EProfile.PANAMA:
        doc.setTextColor('#5a5a5a');
        break;
      case EProfile.SALVADOR:
        doc.setFontSize(14);
        doc.setTextColor("#6F6F6F");
        doc.text(`${this.translate.instant(title)}`, 10, 50, { align: 'left' });
        if (data.referenceNumber || data.reference) {
          doc.setFontSize(14);
          doc.setTextColor("#11456F");
          doc.text(`${this.translate.instant('reference')}: ${data.referenceNumber}`, 200, 50, { align: 'right' });
        }
        doc.line(10, 53, 200, 53);
        break;
      default:
        doc.setTextColor(1, 92, 141);
    }
  }
}