import { Injectable } from '@angular/core';
import {
  AdfFormatService, AttributeReadingBuilder, ConfirmationModalBuilder, HeadBandBuilder,
  IGroupAttributes,
  IHeadBandAttribute, IImagesConfirmationModal, ImageConfirmationModalBuilder } from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { IB2BDModalDefinitionParameters } from '../../interfaces/b2bd-payment-modal.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { EVersionHandler } from '../../../../../../enums/version-handler.enum';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentModalService {
  constructor(
    private adfFormatService: AdfFormatService,
    private translateService: TranslateService,
    private utils: UtilService,
  ) { }


  builderModalLayout(modalLayoutProps: IB2BDModalDefinitionParameters) {
    const { paymentDetail, dateTime, bankName } = modalLayoutProps ?? {}
    const { user, currency, sourceAccount, b2bADetail } = modalLayoutProps ?? {}
    const { capital = 0, interest = 0, feciOther = 0, amount = 0, delinquentBalance = 0 } = paymentDetail.payment ?? {}

    const groupList: IGroupAttributes[] = [];
    const imageList: IImagesConfirmationModal[] = [];

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupPaymentInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const headBandAttributes: IHeadBandAttribute[] = [];

    const dateAttribute = new HeadBandBuilder()
      .label('emision-date')
      .class(' emisionDate')
      .value(`${dateTime?.date} ${dateTime?.hour}`)
      .build();
    headBandAttributes.push(dateAttribute);

    const hourAttribute = new HeadBandBuilder()
      .label('copy_generate_for')
      .class('copyGenerate')
      .value(`${paymentDetail?.b2bID} - ${user?.username}`)
      .build();
    headBandAttributes.push(hourAttribute);

    const bankNameAttribute = new HeadBandBuilder()
      .value(bankName)
      .build();
    headBandAttributes.push(bankNameAttribute);

    const attributeGeneralInformationTitle = new AttributeReadingBuilder()
      .label('general_information')
      .class('head-columns')
      .build();
    groupGeneralInformation.attributes.push(attributeGeneralInformationTitle);

    const attributeBack2Back = new AttributeReadingBuilder()
      .label('b2b-request-title')
      .values([`${currency} ${paymentDetail?.account} / ${b2bADetail?.name}`])
      .class('reading-text-uppercase list-grid general-item')
      .build();
    groupGeneralInformation.attributes.push(attributeBack2Back);

    const attributeAccountToDebit = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values([`${this.utils.getLabelProduct(Number(sourceAccount?.product ?? 0))} - ${currency} ${sourceAccount?.account} / ${sourceAccount?.name}`
      ])
      .class('reading-text-uppercase list-grid general-item')
      .build();
    groupGeneralInformation.attributes.push(attributeAccountToDebit);

    const attributeVoucher = new AttributeReadingBuilder()
      .label('voucher')
      .values([paymentDetail?.receipt])
      .class('reading-text-uppercase list-grid general-item')
      .build();
    groupGeneralInformation.attributes.push(attributeVoucher);

    const attributePaymentInformationTitle = new AttributeReadingBuilder()
      .label('payment_information')
      .class('head-columns')
      .build();
    groupPaymentInformation.attributes.push(attributePaymentInformationTitle);

    const attributeCapital = new AttributeReadingBuilder()
      .label('capital')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(capital))}`])
      .class('reading-text-uppercase list-grid ')
      .build();
    groupPaymentInformation.attributes.push(attributeCapital);

    const attributeInterest = new AttributeReadingBuilder()
      .label('interest')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(interest))}`])
      .class('third-text reading-text-uppercase list-grid ')
      .build();
    groupPaymentInformation.attributes.push(attributeInterest);

    const attributeFECI = new AttributeReadingBuilder()
      .label('fci')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(feciOther))}`])
      .class('third-text reading-text-uppercase list-grid ')
      .build();
    groupPaymentInformation.attributes.push(attributeFECI);

    const attributeSurcharge = new AttributeReadingBuilder()
      .label('surcharge')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(delinquentBalance))}`])
      .class('third-text reading-text-uppercase list-grid ')
      .build();
    groupPaymentInformation.attributes.push(attributeSurcharge);

    const attributeTotalPay = new AttributeReadingBuilder()
      .label('balance_paid')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(amount))}`])
      .class('third-text reading-text-uppercase list-grid')
      .build();
    groupPaymentInformation.attributes.push(attributeTotalPay);

    groupList.push(groupGeneralInformation);
    groupList.push(groupPaymentInformation);

    const secondImage = new ImageConfirmationModalBuilder()
      .class('secondary_logo')
      .label('secondary logo')
      .url(`assets/images/logos/${environment.profile}_logo_${EVersionHandler.ASSETS}.png`)
      .build();
    imageList.push(secondImage);


    const mainImage = new ImageConfirmationModalBuilder()
      .class('')
      .label('primary logo')
      .url(`assets/images/logos/${environment.profile}_bp_logo_${EVersionHandler.ASSETS}_${EVersionHandler.ASSETS}.png`)
      .build();

    imageList.push(mainImage);

    return new ConfirmationModalBuilder()
      .title('voucher_transfer_title')
      .attributeList(groupList)
      .view('v-list')
      .containerTitle(`${this.translateService.instant('document')}: ${+paymentDetail?.reference}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(headBandAttributes)
      .build();
  }
}
