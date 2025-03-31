import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  HeadBandBuilder, IConfirmationModal, IGroupAttributes,
  IHeadBandAttribute, IImagesConfirmationModal,
  ImageConfirmationModalBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { IB2BDConsultModalParameters } from '../../interfaces/b2bd-consult-modal.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdConsultModalService {

  constructor(
    private adfFormatService: AdfFormatService,
    private translate: TranslateService,
    private utilService: UtilService,
  ) { }

  builderModalLayout(voucherProps: IB2BDConsultModalParameters): IConfirmationModal {
    const { back2back, bankName, user, dateTime, currency } = voucherProps ?? {}
    const { balance } = back2back ?? {}

    const listGroup: IGroupAttributes[] = [];
    const imageList: IImagesConfirmationModal[] = [];


    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupGeneralDetailInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const groupBalanceInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const footerAttributes: IHeadBandAttribute[] = [];

    // ------------------------------ HEADER VOUCHER MODAL ----------------------------------

    const generalInformationAttributes = new AttributeReadingBuilder()
      .label('general-information')
      .class('head-columns')
      .build();
    groupGeneralInformation.attributes.push(generalInformationAttributes);

    const expensiveValueAttribute = new AttributeReadingBuilder()
      .label('b2b-name')
      .values([(`${back2back?.name}`).toUpperCase()])
      .class('content-voucher list-grid')
      .build();
    groupGeneralInformation.attributes.push(expensiveValueAttribute);

    const b2bNumberAttribute = new AttributeReadingBuilder()
      .label('b2b-no')
      .values([`${back2back?.b2bID}`])
      .class('content-voucher list-grid')
      .build();
    groupGeneralInformation.attributes.push(b2bNumberAttribute);

    listGroup.push(groupGeneralInformation);

    const attributeProduct = new AttributeReadingBuilder()
      .label('product')
      .values([(`${back2back?.product}`).toUpperCase()])
      .class('b2b-product align-title col-md-12')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeProduct);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status_type')
      .values([back2back?.status])
      .class('status align-title col-md-12 padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeStatus);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('b2b-currency')
      .values([this.utilService.getLabelCurrency(`${currency}`)])
      .class('currency align-title col-md-12')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeCurrency);

    const attributeSubstate = new AttributeReadingBuilder()
      .label('substate')
      .values([`${back2back?.subStatus}`])
      .class('subState align-title col-md-12 padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeSubstate);

    const attributeTerm = new AttributeReadingBuilder()
      .label('term')
      .values([`${back2back?.term}`])
      .class('term align-title col-md-12')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeTerm);

    const attributeAmountAwarded = new AttributeReadingBuilder()
      .label('amount-awarded')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.amountGranted))}`])
      .class('amountGranted col-md-12 align-title padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeAmountAwarded);

    const attributeWarranty = new AttributeReadingBuilder()
      .label('warranty')
      .values([`${back2back?.warranty}`])
      .class('warranty align-title col-md-12')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeWarranty);

    const attributeRate = new AttributeReadingBuilder()
      .label('nominal-rate')
      .values([`${this.utilService.parsePercent(String(back2back?.nominalRate))}`])
      .class('nominal-rate align-title col-md-12 padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeRate);

    const attributeConcession = new AttributeReadingBuilder()
      .label('concession')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.concession).standard}`])
      .class('concession align-title col-md-12')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeConcession);

    const attributeRateEffective = new AttributeReadingBuilder()
      .label('rate-effective')
      .values([`${this.utilService.parsePercent(String(back2back?.effectiveRate))}`])
      .class('rate-effective align-title col-md-12 padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributeRateEffective);

    const attributeExpiration = new AttributeReadingBuilder()
      .label('expiration')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.dueDate).standard}`])
      .class('dueDate align-title col-md-12')
      .build();

    groupGeneralDetailInformation.attributes.push(attributeExpiration);

    const attributePaymentDate = new AttributeReadingBuilder()
      .label('next-payment-date')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.nextPaymentDate).standard}`])
      .class('nextPaymentDate align-title col-md-12 padding-left')
      .build();
    groupGeneralDetailInformation.attributes.push(attributePaymentDate);
    listGroup.push(groupGeneralDetailInformation);

    const attributeBalanceInformation = new AttributeReadingBuilder()
      .label('balance-information')
      .class('head-columns title-balance')
      .build();
    groupBalanceInformation.attributes.push(attributeBalanceInformation);

    const attributeCapitalToDate = new AttributeReadingBuilder()
      .label('capitalToDate')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.balance.capitalToDate))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeCapitalToDate);

    const attributeValueNextInstallment = new AttributeReadingBuilder()
      .label('nextInstallmentValue')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.balance.nexInstallmentValue))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeValueNextInstallment);

    const attributeInterest = new AttributeReadingBuilder()
      .label('interest')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.balance.interest))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeInterest);

    const attributeMarginToRotate = new AttributeReadingBuilder()
      .label('marginTurning')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.balance.marginTurning))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeMarginToRotate);

    const attributeAdditionalCharges = new AttributeReadingBuilder()
      .label('additionalCharger')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(balance?.additionalCharger))}`])
      .build();

    groupBalanceInformation.attributes.push(attributeAdditionalCharges);

    const attributeTotalCancellationBalance = new AttributeReadingBuilder()
      .label('totalCancellationBalance')
      .class('content-voucher align-amount col-md-12 padding-left')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(balance?.totalCancellationBalance))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeTotalCancellationBalance);

    const attributeSurcharge = new AttributeReadingBuilder()
      .label('surcharge')
      .class('content-voucher align-amount col-md-12 padding-left title-balance')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(balance?.delinquentBalance))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeSurcharge);

    const attributeTotalBalance = new AttributeReadingBuilder()
      .label('totalBalance')
      .class('content-voucher align-amount col-md-12 padding-left title-balance')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(balance?.totalBalance))}`])
      .build();
    groupBalanceInformation.attributes.push(attributeTotalBalance);
    listGroup.push(groupBalanceInformation);

    // -------------------------- FOOTER INFORMATION ----------------------------------
    const dateAttribute = new HeadBandBuilder()
      .label('emision-date')
      .class(' emisionDate')
      .value(`${dateTime?.date} ${dateTime?.hour}`)
      .build();
    footerAttributes.push(dateAttribute);

    const hourAttribute = new HeadBandBuilder()
      .label('copy_generate_for')
      .class('copyGenerate')
      .value(`${back2back?.b2bID} - ${user?.username}`)
      .build();
    footerAttributes.push(hourAttribute);

    const bankNameAttribute = new HeadBandBuilder()
      .value(bankName)
      .build();
    footerAttributes.push(bankNameAttribute);

    const secondaryImage = new ImageConfirmationModalBuilder()
      .class('secondary_logo')
      .label('secondary logo')
      .url(`assets/images/logos/${environment.profile}_logo_${EVersionHandler.ASSETS}.png`)
      .build();
    imageList.push(secondaryImage);

    const mainImage = new ImageConfirmationModalBuilder()
      .class('')
      .label('primary logo')
      .url(`assets/images/logos/${environment.profile}_bp_logo_${EVersionHandler.ASSETS}_${EVersionHandler.ASSETS}.png`)
      .build();

    imageList.push(mainImage);

    return new ConfirmationModalBuilder()
      .title('consultation-b2b')
      .attributeList(listGroup)
      .view('v-list')
      .profile(environment.profile)
      .images(imageList)
      .containerTitle(`${this.translate.instant('document')}: ${back2back?.reference}`)
      .containerValue('note_list')
      .headBandAttributes(footerAttributes)
      .build();
  }
}
