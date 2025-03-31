import {Injectable} from '@angular/core';
import jsPDF from 'jspdf';
import {EProfile} from 'src/app/enums/profile.enum';
import {PdfService} from 'src/app/service/prints/pdf.service';
import {IPrintData} from '../interface/print-data-interface';
import { AchUniPdfCustom } from '../modules/transfer-ach-uni/enums/ach-uni-pdf-custom.enum';


@Injectable({
  providedIn: 'root'
})
export class TransfersPrintService extends PdfService {

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
  override buildBodyRefactor(doc: jsPDF, data: any, printDataList: IPrintData[], buildDescriptionsContentForBodyRefactor?: string): void {
    doc.setFontSize(10);
    doc.setTextColor('#5a5a5a')

    this.buildTitlesContentForBodyRefactor(doc, printDataList, buildDescriptionsContentForBodyRefactor);
    this.buildDescriptionsContentForBodyRefactor(doc, printDataList, buildDescriptionsContentForBodyRefactor);

    this.buildTableForBodyRefactor(doc);
  }

  override buildDescriptionsContentForBodyRefactor(doc: any, printDataList: IPrintData[], transactionPdfCustom?: string) {
    /**
     * In the next loop it generates the values of the corresponding fields
     */
    const debitAccount = (printDataList[3].value ?? "").length >= 90;
    const acreditAccount = (printDataList[6].value ?? "").length >= 90;

    let positionDataY = 0;
    for (let i = 0; i < printDataList.length; i++) {
      doc.setTextColor('#9b9b9b');
      const value = printDataList[i].value ? printDataList[i].value : '';
      let positionX = this.profile === EProfile.PANAMA ? 60 : 50

      if (i === 0) {
        positionDataY = this.dataY += 13;
        doc.text(value, positionX, positionDataY, {maxWidth: 155});

      } else if(i === 5 && transactionPdfCustom === AchUniPdfCustom.UNI){
        positionDataY = this.dataY += 8;
        doc.text(value, positionX, positionDataY);
      } else if (i === 5) {
        positionDataY = this.dataY += 18;
        doc.text(value, positionX, positionDataY);
      } else if(i === 6 && transactionPdfCustom === AchUniPdfCustom.UNI){
        positionDataY = this.dataY += 14;
        doc.text(value, positionX, positionDataY);
      }
      else if (i === 4 && debitAccount || positionDataY === 7 && acreditAccount) {
        positionDataY = this.dataY += 10;
        doc.text(value, positionX, positionDataY, {maxWidth: 155});
      } else {
        positionDataY = this.dataY += 8;
        doc.text(value, positionX, positionDataY, {maxWidth: 155});
      }
    }
  }

  override buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[], transactionPdfCustom?: string) {
    /**
     *The constants evaluate the number of characters of the values of the user information
     *fields and are used in case the condition is true, a line break is done.
     */
    const debitAccount = (printDataList[3].value ?? "").length >= 90;
    const acreditAccount = (printDataList[6].value ?? "").length >= 90;


    /**
     *This cycle returns the titles and subtitles of the segments along with their styles.
     */
    for (let i = 0; i < printDataList.length; i++) {

      if (printDataList[i].title) {
        this.lineY = this.titleY += 6;

        /**
         * This conditional generates a dividing line between the segments
         */
        if (i >= 1) {
          const y = this.profile !== EProfile.SALVADOR ? this.lineY : this.lineY + 2;
          doc.line(10, y, 200, y); // divider line
        }

        doc.setFont('Lato-Bold', 'normal');
      } else {
        doc.setFont('Lato-Regular', 'normal');
      }

      /**
       * The following conditionals are activated according to the value of I was generating spacings for the specified values
       */
      this.buildTitlesForTransfer(doc, printDataList, i, debitAccount, acreditAccount, transactionPdfCustom);
    }
  }

  private buildTitlesForTransfer(doc: any, printDataList: IPrintData[], i: number, debitAccount: boolean, acreditAccount: boolean, transactionPdfCustom?: string) {
    if (printDataList[i].label) {
      if (printDataList[i].secondColumn) {
        doc.text(`${this.translate.instant(printDataList[i].label)}`, 115, this.titleY);
      } else {
        if(i === 5 && transactionPdfCustom === AchUniPdfCustom.UNI){
          const index5PositionY = this.titleY += 8;
          doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, index5PositionY);
        } else if (i === 5) {
          const index5PositionY = this.titleY += 12;
          doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, index5PositionY);
        } else if (i === 4 && debitAccount) {
          const index4PositionY = this.titleY += 10;
          doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, index4PositionY);
        } else if (i === 7 && acreditAccount) {
          const index7PositionY = this.titleY += 10;
          doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, index7PositionY);
        } else {
          const indexPositionY = this.titleY += 8;
          doc.text(`${this.translate.instant(printDataList[i].label)}`, 10, indexPositionY);
        }
      }
    }
  }


  /**
   *@Return Overwrite the header construction methods giving
   *customization for the specific document.
   */
  override buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Bold');
    switch (this.profile) {
      case EProfile.PANAMA:
        doc.setFontSize(14);
        doc.setTextColor("#5A5A5A");
        doc.text(`${this.translate.instant(title)}`, 10, 50, {align: 'left'});
        if (data.referenceNumber || data.reference) {
          doc.setFontSize(14);
          doc.setTextColor("#2C8B9E");
          doc.text(`No: ${data.referenceNumber}`, 200, 50, {align: 'right'});
        }
        doc.line(10, 53, 200, 53); // divider line

        break;
      case EProfile.HONDURAS:
        doc.setFontSize(14);

        doc.setTextColor("#1366A8");
        doc.text(`${this.translate.instant(title)}`, 10, 50, {align: 'left'});

        if (data.referenceNumber || data.reference) {
          doc.setFontSize(14);
          doc.setTextColor("#1366A8");
          doc.text(`No. ${data.referenceNumber}`, 200, 50, {align: 'right'});
        }

        doc.line(10, 53, 200, 53); // divider line
        break;
      case EProfile.SALVADOR:
        doc.setFontSize(14);
        doc.setTextColor("#6F6F6F");
        doc.text(`${this.translate.instant(title)}`, 10, 50, {align: 'left'});
        if (data.referenceNumber || data.reference) {
          doc.setFontSize(14);
          doc.setTextColor("#11456F");
          doc.text(`${this.translate.instant('reference:')} ${data.referenceNumber}`, 200, 50, {align: 'right'});
        }
        doc.line(10, 53, 200, 53); // divider line

        break;
      default:
        doc.setTextColor(1, 92, 141);
    }

  }

}
