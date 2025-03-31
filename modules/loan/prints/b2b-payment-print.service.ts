import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PdfService } from '../../../service/prints/pdf.service';
import { IConsultPrintData } from '../../transfer/interface/print-data-interface';

@Injectable({
  providedIn: 'root'
})
export class B2bPaymentPrintService extends PdfService {
  buildBody(doc: jsPDF, data: any): void {
    console.log('buildBody');
  }
  buildTitles(doc: jsPDF, data: any): void {
    console.log('buildTitles');
  }
  buildPostFooter(doc: any, data: any): void {
    console.log('buildPostFooter');
  }

  override buildBodyRefactor(doc: jsPDF, data: any, printDataList: IConsultPrintData[]) {
    const currentLanguage = this.translate.currentLang;

    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a');
    for (const x in printDataList) {
      if (printDataList[x].title) {
        this.lineY = this.titleY += 8;        
        doc.setDrawColor(202, 209, 205);
        doc.line(10, this.lineY, 200, this.lineY);
        doc.setFont('Lato-Bold', 'normal');
      } else {
        doc.setFont('Lato-Regular', 'normal');
      }

      if (printDataList[x].label) {
        this.buildBodyRefactorTitleSection(doc, x, printDataList, currentLanguage);
      }

    }


    this.buildBodyRefactorDetailSection(doc, data, printDataList, currentLanguage);
    this.buildTableForBodyRefactor(doc);
  }

  private buildBodyRefactorTitleSection(doc: jsPDF, x: any, printDataList: IConsultPrintData[], currentLanguage: any) {
      if (printDataList[x].secondColumn) {
        doc.text(`${this.translate.instant(printDataList[x].label)}`, 115, this.titleY);
      } else {
        const langIncrement = currentLanguage === 'en' ? 9 : 8;
        const valueTitleY = this.titleY += langIncrement;
        const positionDeepToShow = printDataList[x]?.customBottom ? valueTitleY + printDataList[x]?.customBottom! : valueTitleY
        const positionYToShow = currentLanguage === 'en' ? positionDeepToShow : valueTitleY;

        const maxWidth = currentLanguage === 'en' ? printDataList[x]?.maxWidth : 0;

        doc.text(`${this.translate.instant(printDataList[x].label)}`, 10, positionYToShow , {
          maxWidth
        });
      }
  }

  private buildBodyRefactorDetailSection(doc: jsPDF, data: any, printDataList: IConsultPrintData[], currentLanguage: any) {
    let positionDataY = 0;
    for (const x in printDataList) {
      doc.setTextColor('#9b9b9b');
      if (printDataList[x].title && x !== '0' && printDataList[x].label) {
        positionDataY = this.dataY += 8;
        doc.text('', 66, positionDataY);
      }
      const value = printDataList[x].value ? printDataList[x].value : '';
      if (printDataList[x].secondColumn) {
        positionDataY = this.dataY;
        doc.text(value, 170, positionDataY);
      } else {
        const valueToIncrement = currentLanguage === 'en' ? 9 : 8;
        positionDataY = (this.dataY += valueToIncrement)
        const positionX = currentLanguage === 'en' ? 100 : 50;
        doc.text(value, positionX, positionDataY);
      }
    }
  }

}
