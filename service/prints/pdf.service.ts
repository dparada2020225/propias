import { AdfAlertModalComponent, AlertAttributeBuilder, AlertBuilder, DateTimeFormat, IAlert } from '@adf/components';
import { StorageService } from '@adf/security';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EProfile } from 'src/app/enums/profile.enum';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { IPrintData } from 'src/app/modules/transfer/interface/print-data-interface';
import { environment } from 'src/environments/environment';
import imgLogosJson from '../../../assets/data/images-print-pdf.json';
import { ISettingData } from '../../models/setting-interface';
import { UtilService } from '../common/util.service';
import { BusinessNameService } from '../shared/business-name.service';
import { default as fonts } from './../../../assets/fonts/jsfonts/font-config.json';

/**
 * @author Noe Fernandez
 *
 *  Servicios utilizados para la impression de pdf
 */

@Injectable({
  providedIn: 'root'
})

// Se declara la clase como clase Abstracta (esto para que esta sea él, témplate base de los prints (clase padre))
export abstract class  PdfService {

  userName = '';
  businessName = '';
  authorization = '';
  so = navigator['platform'];
  profile = environment.profile;
  titleY = 52;
  dataY = 60;
  lineY = 0;
  isTransferFlow: boolean = false;
  settings!: ISettingData;

  constructor(
    public translate: TranslateService,
    public businessNameService: BusinessNameService,
    public datePipe: DatePipe,
    public storageService: StorageService,
    public util: UtilService,
    public modalService: NgbModal,
  ) {
  }


  // Se declara el metodo pdfGenerate, este metodo hace el llamado de toda la composition del pdf (header - body - footer)
  // Este metodo recibe como argumento:
  // Data: que datos se mostraran en el pdf
  // Filename: Nombre del archivo (como se exportara) en caso de que este parameter no sea enviado se le ponder como nombre "PRINT"
  // startYFooter: La position en la que extra el footer, por defecto "268" (Position Vertical)
  // authorization: Token de authorization que se mostrara en el footer
  // pdfGenerate(data: any, filename = 'print', startYFooter = 268, authorization: string, title?: string, printDataList?: Array<IPrintData>)
  pdfGenerate(data: any, authorization: string, filename = 'print', startYFooter = 268, title?: string, printDataList?: IPrintData[], isTransaction?: boolean, transactionPdfCustom?: string) {
    this.authorization = authorization;
    this.isTransferFlow = Boolean(isTransaction);

    // Se declara un nuevo JSPDF
    const doc = new jsPDF();
    this.addCustomFonts(doc);

    doc.setFont('Lato-Bold', 'normal');

    // De instancia el header pasándole como argumento la instancia del nuevo JSPDF (esto para poder usar jspdf dentro del metodo) y la data que será mostrada
    this.buildHeader(doc, data);
    doc.setFont('Lato-Regular', 'normal');

    // De instancia el body pasándole como argumento la instancia del nuevo JSPDF (esto para poder usar jspdf dentro del metodo) y la data que será mostrada
    this.buildBody(doc, data);

    // De instancia el footer pasándole como argumento la instancia del nuevo JSPDF (esto para poder usar jspdf dentro del metodo) y la data que será mostrada
    // Y startYFooter para la position
    this.buildFooter(doc, data, startYFooter, isTransaction);

    if (title) {
      this.buildTitlesRefactor(doc, data, title);
    }

    if (printDataList) {
      this.buildBodyRefactor(doc, data, printDataList, transactionPdfCustom);
    }

    if (this.so === 'Win32') {
      doc.save(`${filename}.pdf`);
    } else {
      doc.setProperties({
        title: filename,
      });

      const myWindow = window.open(URL.createObjectURL(doc.output('blob')));
      if (!myWindow || myWindow.closed || typeof myWindow.closed === undefined) {
        this.openModalMissingShowPdf();
      }
    }
  }

  // Este metodo agrega la fuente dentro del pdf
  addCustomFonts(doc: jsPDF) {
    doc.addFileToVFS('Lato-Regular-normal.ttf', fonts['lato-normal']);
    doc.addFont('Lato-Regular-normal.ttf', 'Lato-Regular', 'normal');

    doc.addFileToVFS('Lato-Bold-normal.ttf', fonts['lato-bold']);
    doc.addFont('Lato-Bold-normal.ttf', 'Lato-Bold', 'normal');
  }
  // Este metodo añade las images (header o encabezado del pdf) y también el titular distanciando el metodo buildTitles
  buildHeader(doc: jsPDF, data: any) {
    try {
      this.buildHeaderLogos(doc);
    } catch (error) {
      this.buildHeaderLogos(doc);
    }


    // Sé instancia el buildTitles pasándole como argumento la instancia del nuevo JSPDF (esto para poder usar jspdf dentro del metodo) y la data que será mostrada
    this.buildTitles(doc, data);
  }

  private buildHeaderLogos(doc: jsPDF) {
    const firstImage = `./assets/images/logos/${environment.profile}_logo_${EVersionHandler.ASSETS}.png`;
    const secondImage = `./assets/images/logos/${environment.profile}_bp_logo_${EVersionHandler.ASSETS}.png`;

    switch (environment.profile) {
      case EProfile.SALVADOR:
        doc.addImage(firstImage, 'png', 10, 15, 44, 13);
        doc.addImage(secondImage, 'png', 170, 15, 30, 25);
        break;
      case EProfile.PANAMA:
        const logos = imgLogosJson[environment.profile];

        doc.addImage(logos.img1, 'png', 10, 15, 25, 13);
        doc.addImage(logos.img2, 'png', 180, 15, 20, 25);
        break;
      default:
        doc.addImage(firstImage, 'png', 10, 15, 44, 13);
        doc.addImage(secondImage, 'png', 163, 15, 37, 15);
    }
  }
  // metodo abstracto: Ya que la clase es abstracta este metodo se podría llamar desde otro archivo siempre y cuando sea extendido de la clase
  abstract buildBody(doc: jsPDF, data: any): void;


  // Se declara el metodo footer pasándole como argumento la instancia del nuevo JSPDF (esto para poder usar jspdf dentro del metodo) y la data que será mostrada
  // Y startYFooter para la position
  buildFooter(doc: any, data: any, startY: number, isTransaction?: boolean) {
    const headband = isTransaction ? this.buildHeadBandForTransactions(data) : this.buildDefaultHeadBand();
    this.businessName = this.businessNameService.getBusiness(environment.profile);

    let fontSize = 10; // valor predeterminado

    if(isTransaction && this.profile === EProfile.SALVADOR){
      fontSize = 9;
    }

    autoTable(doc, {
      startY,
      margin: { left: 10, right: 10, bottom: 0 },
      styles: {
        fontSize,
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155,  155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        headband,
      ]
    });

    this.buildPostFooter(doc, data);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('Lato-Regular', 'normal');
      doc.text(`${this.translate.instant('page-n')}` + String(i), 200, 10, null, null, 'right');
    }
  }

  private buildHeadBandForTransactions(data: any) {
    let footerBand

    const currentDate: DateTimeFormat = data?.date;
    const userName = this.util.getUserName();
    const bisvLabelEmissionDate = this.translate.instant('label.term-deposit.issue-date');
    const userNameLabel = this.translate.instant('label.statements.copy-by');
    const userNameLabelBipa = this.translate.instant('copy_generate_for');
    const BISV_BANK_NAME = 'BEL/EL SALVADOR';
    const BIPA_REFEREMCE = `BI-MON`;

    if (!currentDate) { return []; }

    const defaultHeadband = [`${userName}`, `${currentDate.date}`, `${currentDate?.hour}`, `${this.translate.instant('authorization')}: ${this.authorization}`];
    const headBandForBISV = [`${bisvLabelEmissionDate}: ${currentDate.standard} ${currentDate?.hour}`, `${userNameLabel} ${userName}`, `${BISV_BANK_NAME}`];
    const headBandForBIPA = [`${currentDate.standard} ${currentDate?.hour}`, `${userNameLabelBipa} ${data.account}-${userName}`, `${BIPA_REFEREMCE}-${this.authorization}`];

    switch (this.profile) {
      case EProfile.SALVADOR:
        footerBand = headBandForBISV
        break;
        case EProfile.PANAMA:
          footerBand = headBandForBIPA
        break;
        case EProfile.HONDURAS:
          footerBand = defaultHeadband
        break;
      default:
        break;
    }
    return footerBand;
  }

  private buildDefaultHeadBand() {
    const userName = this.util.getUserName();
    const date = new Date();
    const lang = this.translate.currentLang || this.translate.defaultLang;

    return [`${userName}`, this.getFormatDate(date, lang), this.datePipe.transform(date, 'HH:mm:ss a'), `${this.translate.instant('authorization')}: ${this.authorization}`];
  }


  // Metodo para los títulos
  abstract buildTitles(doc: jsPDF, data: any): void;

  // Metodo para postFooter: Este hara que se muestre otro elemento después del footer (opcional (si el stencil lo requiere se usará))
  abstract buildPostFooter(doc: any, data: any): void;

  getFormatDate(date: any, lang: string) {
    let formatDate: string = '';
    formatDate = formatDate.concat(this.datePipe.transform(date, 'dd-', '', lang)?? '');
    formatDate = formatDate.concat(this.translate.instant(`month-${date.getMonth() + 1}`) ?? '');
    formatDate = formatDate.concat(this.datePipe.transform(date, '-yyyy', '', lang) ?? '');
    return formatDate;
  }

  formatPhone(phone: string): string {
    const subPhone1 = phone.substring(0, 9);
    const subPhone2 = phone.substring(9, 13);

    return subPhone1 + '-' + subPhone2;
  }

  buildTitlesRefactor(doc: any, data: any, title: string) {
    doc.setFont('Lato-Regular', 'normal');
    doc.setFontSize(16);
    switch (this.profile) {
      case EProfile.PANAMA:
        doc.setFont('Lato-Bold', 'normal');
        doc.setTextColor(44, 139, 158);
        break;
      case EProfile.HONDURAS:
        doc.setFont('Lato-Regular', 'normal');
        doc.setTextColor(10, 73, 137);
        break;
      case EProfile.SALVADOR:
        doc.setFont('Lato-Regular', 'normal');
        doc.setTextColor(12, 63, 120);
        break;
      default:
        doc.setFont('Lato-Regular', 'normal');
        doc.setTextColor(1, 92, 141);
    }
    doc.text(`${this.translate.instant(title)}`, 10, 50, { align: 'left' });

    doc.setFontSize(20);
    if (data.referenceNumber) {
      doc.text(`No. ${data.referenceNumber}`, 200, 50, { align: 'right' });
    }
  }

  buildBodyRefactor(doc: any, data: any, printDataList: Array<IPrintData>, transactionPdfCustom?: string) {
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);

    this.buildTitlesContentForBodyRefactor(doc, printDataList);
    this.buildDescriptionsContentForBodyRefactor(doc, printDataList);

    this.buildTableForBodyRefactor(doc)
  }

  buildTableForBodyRefactor(doc: any, isShowNoteSection: boolean = true) {
    this.lineY = this.dataY += 8;

    if (this.profile !== EProfile.SALVADOR) {
      doc.line(10, this.lineY, 200, this.lineY);
    }

    if (this.authorization) {
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
    }


    if(this.profile !== EProfile.SALVADOR){
      doc.setFont('Lato-Regular', 'normal');
    }else{
      doc.setFont('Lato-Bold', 'normal');
    }

    if  (isShowNoteSection) {
      doc.setTextColor(155, 155, 155);
      const noteTitlePositionY = this.lineY += 25;
      doc.text(`${this.translate.instant('note-title')}`, 52, noteTitlePositionY);

      doc.setFont('Lato-Regular', 'normal');
      doc.text(`${this.translate.instant( this.profile != EProfile.SALVADOR ? 'note-message-first' : 'note-message-first-sv')}`, 66, this.lineY);
      const secondMessagePositionY = this.lineY += 5;
      doc.text(`${this.translate.instant('note-message-second')}`, doc.internal.pageSize.getWidth() / 2, secondMessagePositionY, { align: 'center' });
      this.titleY = 52;
      this.lineY = 0;
      this.dataY = 60;
    }
  }

  buildTitlesContentForBodyRefactor(doc: any, printDataList: IPrintData[]) {
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
          const firstColumnPositionY = this.titleY += 8;
          doc.text(`${this.translate.instant(printDataList[x].label)}`, 10, firstColumnPositionY);
        }
      }
    }
  }

  buildDescriptionsContentForBodyRefactor(doc: any, printDataList: IPrintData[], data?: any) {
    let positionDataY = 0;
    for (const x in printDataList) {
      doc.setTextColor(155, 155, 155);
      if (printDataList[x].title && x !== '0' && printDataList[x].label) {
        positionDataY = this.dataY += 8;
        doc.text('', 65, positionDataY);
      }
      const value = printDataList[x].value ? printDataList[x].value : '';
      if (printDataList[x].secondColumn) {
        positionDataY = this.dataY;
        doc.text(value, 170, positionDataY);
      } else {
        positionDataY = this.dataY += 8;
        doc.text(value, 65, positionDataY);
      }
    }
  }

  buildPosterFooterForStatementModule(doc: any, data: any) {
    // Get private settings of localstorage
    const businessType = this.businessNameService.getBusinessType(this.profile);
    if (this.storageService.getItem('securityParameters')) {
      this.settings = JSON.parse(this.storageService.getItem('securityParameters'));
    }
    const lines = doc.splitTextToSize(`${this.translate.instant('postfooter-description')}`, 240);
    doc.setFontSize(8);
    doc.setTextColor(155, 155, 155);
    doc.text(lines, 10, 268);
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(10);
    const phone = this.settings?.contactsInfo.phone;
    if (environment['profile'] === EProfile.PANAMA) {
      const address = this.settings?.contactsInfo.address;
      doc.text(`${businessType} ${address} ${this.translate.instant('postfooter-description-client')} ${phone}`, 10, 279);
    } else {
      doc.text(`${businessType} ${this.translate.instant('postfooter-description-client')} ${this.formatPhone(phone)}`, 10, 276);
    }
  }


  private openModalMissingShowPdf() {
    this.modalService.dismissAll();

    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });


    modal.componentInstance.data = this.buildMissingShowPdf();

    modal.result.then(result => result)
      .catch(error => error);
  }

  private buildMissingShowPdf(): IAlert {
    const iconAttribute = new AlertAttributeBuilder()
      .label('banca-regional-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('alert-title')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label('txt:pdf_window_message')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();


    return new AlertBuilder()
      .icon(iconAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();

  }

  buildPosterForConsultWithoutReference(doc: any, data: any, startY: number) {
    const userName = this.util.getUserName();
    const date = new Date();
    const lang = this.translate.currentLang || this.translate.defaultLang;
    const profileName = 'Banpais';
    const userLabel = this.translate.instant('user');

    autoTable(doc, {
      startY,
      margin: { left: 10, right: 10, bottom: 0 },
      styles: {
        halign: 'center', valign: 'middle', textColor: [255, 255, 255], lineColor: [155, 155, 155], lineWidth: 0.1, font: 'Lato-Bold',
        fillColor: [155, 155, 155], minCellHeight: 13
      },
      head: [
        [`${profileName}`, this.getFormatDate(date, lang), this.datePipe.transform(date, 'HH:mm:ss a'), `${userLabel}: ${userName}`],
      ]
    });

    this.buildPostFooter(doc, data);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('Lato-Regular', 'normal');
      doc.text(`${this.translate.instant('page-n')}` + String(i), 200, 10, null, null, 'right');
    }
  }




}
