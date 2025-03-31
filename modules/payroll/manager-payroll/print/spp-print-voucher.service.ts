import {Injectable} from '@angular/core';
import {PdfService} from '../../../../service/prints/pdf.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {environment} from '../../../../../environments/environment';
import {EProfile} from '../../../../enums/profile.enum';
import {StorageService} from "@adf/security";
import {BusinessNameService} from "../../../../service/shared/business-name.service";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {UtilService} from "../../../../service/common/util.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AdfFormatService} from "@adf/components";

@Injectable({
  providedIn: 'root'
})
export class SppPrintVoucherService extends PdfService {

  constructor(
    public override storageService: StorageService,
    public override businessNameService: BusinessNameService,
    public override translate: TranslateService,
    public override datePipe: DatePipe,
    public override util: UtilService,
    public override modalService: NgbModal,
    private formatService: AdfFormatService
  ) {
    super(translate, businessNameService, datePipe, storageService, util, modalService);
  }

  buildBody(doc: any, data: any): void {
    const { registers, sourceAccount, date, credits, amount } = data ?? {};

    const col = [
      `${this.translate.instant('account').toUpperCase()}`,
      `${this.translate.instant('ach_name_account').toUpperCase()}`,
      `${this.translate.instant('label.statements.amount').toUpperCase()}` ,
    ];

    const rows: any = [];
    const items: any[] = registers;


    items.forEach(element => {
      let temp = [element?.targetAccount, element?.accountName, `${environment.currency} ${this.formatService.formatAmount(element?.targetAmount || '0')}`];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', ''];
        rows.push(temp);
      }
    });

    doc.line(10, 55, 200, 55);
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('label.statements.operation-date')}`, 10, 65);
    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('label.statements.account-type')}`, 10, 73);
    doc.text(`${this.translate.instant('ach_name_account')}`, 10, 81);
    doc.text(`${this.translate.instant('no_account')}`, 10, 89);
    doc.text(`${this.translate.instant('currency')}`, 10, 97);
    doc.text(`${this.translate.instant('payroll:label_credits')}`, 10, 105);
    doc.text(`${this.translate.instant('total_amount')}`, 10, 113);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(`${date?.numberFormat}`, 75, 65);
    doc.text(`${this.util.getLabelProduct(sourceAccount?.product)}`, 75, 73);
    doc.text(`${sourceAccount.name}`, 75, 81);
    doc.text(`${sourceAccount.account}`, 75, 89);
    doc.text(`${environment.currency}`, 75, 97);
    doc.text(`${credits}`, 75, 105);
    doc.text(`${environment.currency} ${this.formatService.formatAmount(amount || '0')}`, 75, 113);

    doc.autoTable(col, rows, {
      startY: 120, margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 0) {
          data.cell.styles.textColor = [0, 56, 101];
        }
      },
    });


    const finalTable = doc.lastAutoTable.finalY;

    autoTable(doc, {
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 10 : finalTable + 10,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        [`${this.translate.instant('document-title')} ${this.authorization}`],
      ],
    });

    const finalTable1 = doc.lastAutoTable.finalY;


    doc.setFont('Lato-Bold');
    doc.setFontSize(10);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('note-title')}`, 52, finalTable1 + 10);

    doc.setFont('Lato-Regular', 'normal');
    doc.text(`${this.translate.instant('note-message-first-sv')}`, 66, finalTable1 + 10);
    doc.text(`${this.translate.instant('note-message-second')}`, doc.internal.pageSize.getWidth() / 2 , finalTable1 + 15, { align: 'center' });

    const finalTable2 = doc.lastAutoTable.finalY;

    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 15 : finalTable2 + 50,
      margin: { left: 50, right: 50, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
    });
  }

  buildPostFooter(doc: any, data: any): void {
  }

  buildTitles(doc: jsPDF, data: any): void {
    doc.setFont('Lato-Bold');

    const titleMap = {
      [EProfile.SALVADOR]: () => this.buildTitleForBisv(doc, data),
      [EProfile.HONDURAS]: () => {},
      [EProfile.PANAMA]: () => {},
    }

    const profile = this.util.getProfile();

    titleMap[profile]();
  }

  private buildTitleForBisv(doc: jsPDF, data: any): void {
    doc.setFontSize(14);
    doc.setTextColor('#5A5A5A');
    doc.text(`${this.translate.instant('payroll:label_voucher_modal')}`, 10, 50, { align: 'left' });
    if (data?.reference) {
      doc.setFontSize(14);
      doc.setTextColor('#003865');
      doc.text(`${this.translate.instant('payroll:label_no_reference')} ${this.authorization}`, 200, 50, { align: 'right' });
    }
  }

}
