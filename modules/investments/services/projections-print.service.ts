import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { PdfService } from '../../../service/prints/pdf.service';
import { ISettingData } from '../../../models/setting-interface';
import { StorageService } from '@adf/security';
import { BusinessNameService } from '../../../service/shared/business-name.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CustomNumberPipe } from '../../../pipes/custom-number.pipe';
import autoTable, { CellHookData } from 'jspdf-autotable';
import { UtilService } from 'src/app/service/common/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EProfile } from 'src/app/enums/profile.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectionsPrintService extends PdfService {
  mapTransactions = {};
  override settings!: ISettingData;
  override businessName = '';
  businessType = '';
  override profile = environment.profile;


  constructor(
    public override storageService: StorageService,
    public override businessNameService: BusinessNameService,
    public override translate: TranslateService,
    public override datePipe: DatePipe,
    public override util: UtilService,
    public override modalService: NgbModal,
  ) {
      super(translate, businessNameService, datePipe, storageService, util, modalService);
    this.businessType = businessNameService.getBusinessType(environment['profile']);
  }

  buildTitles(doc: jsPDF, data: any) {
    doc.setFont('Lato-Bold', 'normal');
    doc.setFontSize(18);

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
    doc.text(this.translate.instant('projections.report.title'), doc.internal.pageSize.getWidth() / 2, 45, { align: 'center' });

    doc.setFont('Lato-Bold', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(90, 90, 90);
    doc.text(this.translate.instant('projections.report.subtitle'), doc.internal.pageSize.getWidth() / 2, 52, { align: 'center' });

    doc.line(10, 61, 200, 61); // linea divisora
  }

  buildBody(doc: jsPDF, data: any) {

    let customNumberPipe = new CustomNumberPipe();

    const cols = [
      this.translate.instant('projections.label.payment-date').toUpperCase(),
      this.translate.instant('projections.label.days').toUpperCase(),
      this.translate.instant('projections.label.interest-amount').toUpperCase(),
      this.translate.instant('projections.label.isr-amount').toUpperCase(),
      this.translate.instant('projections.label.net-amount').toUpperCase(),
      this.translate.instant('projections.label.total-amount').toUpperCase(),
      this.translate.instant('projections.label.status').toUpperCase()
    ];

    const rows: any[] = [];

    data.movements.forEach(element => {
      rows.push([
        element.date,
        customNumberPipe.transform(element.days, '1.0'),
        `${element.currency} ${customNumberPipe.transform(element.interest)}`,
        `${element.currency} ${customNumberPipe.transform(element.isr)}`,
        `${element.currency} ${customNumberPipe.transform(element.netInterest)}`,
        `${element.currency} ${customNumberPipe.transform(element.accumulated)}`,
        this.tranlatePay(element.status)]);
    });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(this.translate.instant('projections.label.accountAlias'), 10, 70);
    doc.text(this.translate.instant('projections.label.accountName'), 10, 78);
    doc.text(this.translate.instant('projections.label.account'), 10, 86);
    doc.text(this.translate.instant('projections.label.currency'), 10, 94);
    doc.text(this.translate.instant('projections.label.status'), 10, 102);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(data.accountDetail.accountAlias || '', 65, 70);
    doc.text(data.accountDetail.accountName || '', 65, 78);
    doc.text(data.accountDetail.account || '', 65, 86);
    doc.text(data.accountDetail.currency || '', 65, 94);
    doc.text(this.translate.instant(data.accountDetail.status) || '', 65, 102);

    doc.line(10, 112, 200, 112); // linea divisora

    doc.setFont('Lato-Bold', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(90, 90, 90);
    doc.text(`${this.translate.instant('projections.label.projections-detail')}`, 10, 125);
    (doc as any).autoTable(cols, rows, {
      startY: 130, margin: { left: 10, right: 10, bottom: 15 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'normal', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 10, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
      createdCell: (a: any) => {
        if (1 < a.column.index && a.column.index < 6 && a.section === 'body') {
          switch(this.profile){
            case EProfile.HONDURAS:
            case EProfile.SALVADOR:
              a.cell.styles.textColor = '#0A4989';
              a.cell.styles.halign = 'right'
              break;
            case EProfile.PANAMA:
              a.cell.styles.textColor = '#2C8B9E';
              a.cell.styles.halign = 'right'
              break;
             default:
            break;
          }
        }
      }
    });

    let final = (doc as any).lastAutoTable.finalY;

    doc.setDrawColor(90, 90, 90);
    doc.line(10, final + 10, 200, final + 10);

    doc.setFont('Lato-Bold', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(90, 90, 90);
    this.buildTableForProjections(doc, data, final);
  }

  private buildTableForProjections(doc: any, data: any, final: number) {
    let startYtemp;
    const customNumberPipe = new CustomNumberPipe();

    if ((doc).lastAutoTable.finalY > 200){
      doc.addPage();
      doc.setPage(doc.getCurrentPageInfo().pageNumber);
      doc.text(this.translate.instant('projections.label.total-summary'), 10,   20);
      startYtemp = 30;
    } else {
      doc.text(this.translate.instant('projections.label.total-summary'), 10, final + 20);
      startYtemp = (doc).autoTableEndPosY() + 30;
    }

    autoTable(doc, {
      startY: startYtemp,
      margin: { left: 10, right: 10, bottom: 0 },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'normal', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], minCellHeight: 10, cellWidth: 'auto', font: 'Lato-Regular' },

      head: [[
        this.translate.instant('projections.label.days').toUpperCase(),
        this.translate.instant('projections.label.interest-amount').toUpperCase(),
        this.translate.instant('projections.label.isr-amount').toUpperCase(),
        this.translate.instant('projections.label.net-amount').toUpperCase()
      ]],
      body: [[
        `${customNumberPipe.transform(data.total.days, '1.0')}`,
        `${data.total.currency} ${customNumberPipe.transform(data.total.interest)}`,
        `${data.total.currency} ${customNumberPipe.transform(data.total.isr)}`,
        `${data.total.currency} ${customNumberPipe.transform(data.total.netInterest)}`
      ]],
      didParseCell: (a: CellHookData) => {
        if (a.column.index != 0 && a.section === 'body') {
          switch(this.profile){
            case EProfile.HONDURAS:
            case EProfile.SALVADOR:
              a.cell.styles.textColor = '#0A4989';
              a.cell.styles.halign = 'right'
              break;
            case EProfile.PANAMA:
              a.cell.styles.textColor = '#2C8B9E';
              a.cell.styles.halign = 'right'
              break;
            default:
              break;
          }
        }
      }
    });
  }

  buildPostFooter(doc: any, data: any) {
    if (this.storageService.getItem('securityParameters')) {
      this.settings = JSON.parse(this.storageService.getItem('securityParameters'));
    }
    const lines = doc.splitTextToSize(`${this.translate.instant('postfooter-description')}`, 330);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(155, 155, 155);
    doc.text(lines, 10, 268);
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(10);
    const phone = this.settings?.contactsInfo.phone;
    if (environment['profile'] === 'bipa') {
      const address = this.settings?.contactsInfo.address;
      doc.text(`${this.businessType} ${address} ${this.translate.instant('postfooter-description-client')} ${phone}`, 10, 279);
    } else{
      doc.text(`${this.businessType} ${this.translate.instant('postfooter-description-client')} ${this.formatPhone(phone)}`, 10, 276);
    }
  }


  tranlatePay(pay: string) {
    return pay === 'pagado' ? this.translate.instant('status-pay') : this.translate.instant('status-not-pay');
  }
}
