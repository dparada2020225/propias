import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PdfService } from 'src/app/service/prints/pdf.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { environment } from '../../../../environments/environment';
import { ISettingData } from '../../../models/setting-interface';
import { UtilService } from 'src/app/service/common/util.service';
import { EProfile } from '../../../enums/profile.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * @author Noe Fernandez
 *
 *  Servicios utilizados para la impresion de pdf
 */

@Injectable({
  providedIn: 'root'
})
export class CheckStatementPrintService extends PdfService {
  mapTransactions = {};
  override settings!: ISettingData;
  override businessName = '';
  businessType = '';
  override profile = environment.profile;
  totalColor: number[] = [];
  columnColor: number[] = [];

  constructor(
    public override businessNameService: BusinessNameService,
    public override datePipe: DatePipe,
    public override translate: TranslateService,
    public override storageService: StorageService,
    public override util: UtilService,
    public override modalService: NgbModal,
  ) {
      super(translate, businessNameService, datePipe, storageService, util, modalService);
    this.businessType = businessNameService.getBusinessType(environment['profile']);
    if (this.profile === 'bipa') {
      this.totalColor = [44, 139, 158];
      this.columnColor = [44, 139, 158]
    } else if (this.profile === 'banpais') {
      this.totalColor = [10, 73, 137];
      this.columnColor = [90, 90, 90];
    } else if (this.profile === 'bisv') {
      this.totalColor = [12, 63, 120]
      this.columnColor = [90, 90, 90];
    } else {
      this.totalColor = [1, 92, 141];
      this.columnColor = [90, 90, 90];
    }
  }


  // Construccion de los titulos
  buildTitles(doc: any, data: any) {
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(14);
    if (this.profile === 'bipa') {
      doc.setTextColor(44, 139, 158);
    } else if (this.profile === 'banpais') {
      doc.setTextColor(10, 73, 137);
    } else if (this.profile === 'bisv') {
      doc.setTextColor(12, 63, 120);
    } else {
      this.totalColor = [1, 92, 141]
      doc.setTextColor(1, 92, 141);
    }
    doc.text(`${this.translate.instant('account-statements')}`, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(data['accountName'], doc.internal.pageSize.getWidth() / 2, 47, { align: 'center' });

    doc.line(10, 51, 200, 51); // linea divisora
  }


  // Construccion del body
  buildBody(doc: any, data: any) {

    // Titulos de las columnas
    const col = [`${this.translate.instant('date').toUpperCase()}`, 'TRX', 'REF', `${this.translate.instant('description-reserve')}`,
    `${this.translate.instant('debit')}`, `${this.translate.instant('credit')}`, `${this.translate.instant('account-balance')}`];
    const rows: any[] = [];
    const items = data['operations'];


    const resBalance = items.reduce((sum, value) => (sum + parseFloat(value.balance.replace(/[^\d\.\-]/g, ''))), 0);

    // Pushamos a la constante rows para iterar en la tabla correspondiente
    items.forEach(element => {
      let temp = [element.operationDate, element.transaction, element.ref, element.descToPrint, element.debit,
      element.credit, element.balance];
      rows.push(temp);
      if (!temp) {
        temp = ['', '', '', '', '',
          '', ''];
        rows.push(temp);
      }

    });


    // PARRAFOS DONDE SE MUESTRA LOS DATOS DEL CLIENTE
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`${this.translate.instant('account')}`, 10, 60);
    doc.text(`${this.translate.instant('product')}`, 10, 68);
    doc.text(`${this.translate.instant('opening-balance')}`, 10, 76);
    doc.text(`${this.translate.instant('ending-balance')}`, 10, 84);
    doc.text(`${this.translate.instant('breadcrumb.currency')}`, 10, 92);
    doc.text(`${this.translate.instant('beginning-date')}`, 10, 100);
    doc.text(`${this.translate.instant('ending-date')}`, 10, 108);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(155, 155, 155);
    doc.text(data['account'], 65, 60);
    doc.text(data['product'], 65, 68);
    doc.text(data['initialBalance'], 65, 76);
    doc.text(data['finalBalance'], 65, 84);
    doc.text(data['currency'], 65, 92);
    doc.text(data['initialDate'], 65, 100);
    doc.text(data['finalDate'], 65, 108);

    doc.line(10, 117, 200, 117);


    // Tabla, en este se itera las columnas y filas
    doc.autoTable(col, rows, {
      startY: 127, margin: { left: 10, right: 10, bottom: 0 },
      columnStyles: { 4: { textColor: this.columnColor }, 5: { textColor: this.columnColor }, 6: { textColor: this.columnColor } },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fontSize: 9, fillColor: [234, 234, 234], minCellHeight: 12, font: 'Lato-Regular' },
      createdCell: (a: any) => {
        if (3 < a.column.index && a.column.index < 7 && a.section === 'body') {
          a.cell.styles.halign = 'right';
          if (6 == a.column.index) {
            a.cell.styles.textColor = this.totalColor
          }
        }
      }
    });


    // Tabla que se mostrara si este esta vacío y si es de bipa
    if (items.length === 0 && this.profile === 'bipa') {
      doc.autoTable({
        startY: 127, margin: { left: 10, right: 10, bottom: 0 },
        headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
        bodyStyles: { halign: 'center', valign: 'right', fillColor: [234, 234, 234], minCellHeight: 12, cellWidth: 'auto', font: 'Lato-Regular' },
        head: [[`${this.translate.instant('date').toUpperCase()}`, `TRX`, `REF`, `${this.translate.instant('description-reserve')}`,
        `${this.translate.instant('debit')}`, `${this.translate.instant('credit')}`, `${this.translate.instant('account-balance')}`]],
        body: [
          [`${data['initialDate']}`, '1', '', `${this.translate.instant('initial-account-balance')}`, '', '', `${data['initialBalance']}`],
        ]
      });
    }

    const final = doc.lastAutoTable.finalY;
    this.buildTableToGetData(doc, resBalance, final);



    doc.setDrawColor(90, 90, 90);
    doc.line(10, final + 10, 200, final + 10);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(90, 90, 90);


    // Tabla que se mostrara cuando no hayan datos
    if (!rows.length) {
      this.buildTableEmptyData(doc, final);
    }
    // Tabla que se mostrara cuando SI hayan datos
    else {
      this.buildTableIfHasData(doc, data, final);
    }

    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 50 : final + 110,
      margin: { left: 10, right: 10, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [255, 255, 255], lineWidth: 0.1,
        fillColor: [255, 255, 255], minCellHeight: 13, font: 'Lato-Regular'
      },
      head: [
        [''],
      ]
    });

  }

  private buildTableToGetData(doc: any, resBalance: any, final: number) {
    // Tabla que se mostrara cuando no tenga ningun dato (vacía)
    if (resBalance === 0 && this.profile === EProfile.PANAMA) {
      doc.autoTable({
        theme: 'plain',
        tableLineColor: [231, 76, 60],
        styles: {
          halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: this.totalColor, font: 'Lato-Bold', fontSize: 10,
          fillColor: [255, 255, 255], minCellHeight: 13
        },
        startY: final,
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 32 },
          4: { cellWidth: 33 },
          5: { cellWidth: 33 },
          6: { cellWidth: 33 },

        },
        margin: { left: 10, right: 10, bottom: 0, top: 0 },
        createdCell: this.moveTextToRight
      });
    }
    // Tabla que se mostrara cuando lleguen los datos
    else {
      doc.autoTable({
        theme: 'plain',
        tableLineColor: [231, 76, 60],
        styles: {
          halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: this.totalColor, font: 'Lato-Bold', fontSize: 10,
          fillColor: [255, 255, 255], minCellHeight: 13
        },
        startY: final,
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 32 },
          4: { cellWidth: 33, textColor: this.columnColor },
          5: { cellWidth: 33, textColor: this.columnColor },
          6: { cellWidth: 33, textColor: this.columnColor },

        },
        margin: { left: 10, right: 10, bottom: 0, top: 0 },
        createdCell: this.moveTextToRight
      });
    }
  }

  private buildTableEmptyData(doc: any, final: number) {
    if (this.profile === EProfile.PANAMA) {
      doc.text(`---- ${this.translate.instant('no-movements')} ----`, doc.internal.pageSize.getWidth() / 2, final + 25, { align: 'center' });
    }
    doc.text(`${this.translate.instant('summary-monthly')}`, 10, final + 35);
    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 20 : final + 40,
      margin: { left: 10, right: 10, bottom: 0 },
      columnStyles: { 2: { textColor: this.columnColor } },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'right', fillColor: [234, 234, 234], minCellHeight: 12, cellWidth: 'auto', font: 'Lato-Regular' },
      head: [[`${this.translate.instant('description-reserve')}`, `${this.translate.instant('label.statements.transactions-amount.short').toUpperCase()}`, `${this.translate.instant('amount').toUpperCase()}`]],
      body: [
        [`${this.translate.instant('label.statements.credit')}`, '0', '0.00'],
        [`${this.translate.instant('label.statements.debits')}`, '0', '0.00'],
        [`${this.translate.instant('label.statements.paid-checks')}`, '0', '0.00'],
      ]
    });
  }

  private buildTableIfHasData(doc: any, data: any, final: number) {
    doc.text(`${this.translate.instant('summary-monthly')}`, 10, final + (doc.internal.getNumberOfPages() > 1 ? 26: 25));
    doc.autoTable({
      startY: doc.internal.getNumberOfPages() > 1 ? doc.autoTableEndPosY() + 26 : final + 30,
      margin: { left: 10, right: 10, bottom: 0 },
      columnStyles: { 2: { textColor: this.columnColor } },
      headStyles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: [155, 155, 155], minCellHeight: 12, font: 'Lato-Bold' },
      bodyStyles: { halign: 'center', valign: 'middle', fillColor: [234, 234, 234], minCellHeight: 12, cellWidth: 'auto', font: 'Lato-Regular' },
      head: [[`${this.translate.instant('description-reserve')}`, `${this.translate.instant('label.statements.transactions-amount.short').toUpperCase()}`, `${this.translate.instant('amount').toUpperCase()}`]],
      body: [
        [`${this.translate.instant(data['summary'].credit.description)}`, data['summary'].credit.transactionAmount,
          data['summary'].credit.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")],
        [`${this.translate.instant(data['summary'].debit.description)}`, data['summary'].debit.transactionAmount,
          data['summary'].debit.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")],
        [`${this.translate.instant(data['summary']['paid-checks'].description)}`, data['summary']['paid-checks'].transactionAmount
          , data['summary']['paid-checks'].amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")],
      ],
      createdCell: (a: any) => {
        if (1 < a.column.index && a.column.index < 3 && a.section === 'body') {
          a.cell.styles.halign = 'right'
        }
      }
    });
  }

  moveTextToRight(a: any) {
    if (3 < a.column.index && a.column.index < 7 && a.section === 'body') {
      a.cell.styles.halign = 'right'
    }
  }

  // Construccion del postFooter, este se construye porque en el stencil si se requiere
  buildPostFooter(doc: any, data: any) {
    // Get private settings of localstorage
    if (this.storageService.getItem('securityParameters')) {
      this.settings = JSON.parse(this.storageService.getItem('securityParameters'));
    }
    const lines = doc.splitTextToSize(`${this.translate.instant('postfooter-description')}`, 330);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(155, 155, 155);
    doc.text(lines, 10, 268);

    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    const phone = this.settings?.contactsInfo.phone;
    if (environment['profile'] === 'bipa') {
      const address = this.settings?.contactsInfo.address;
      doc.text(`${this.businessType} ${address} ${this.translate.instant('postfooter-description-client')} ${phone}`, 10, 279);
    } else {
      doc.text(`${this.businessType} ${this.translate.instant('postfooter-description-client')} ${this.formatPhone(phone)}`, 10, 276);
    }
  }
}
