import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  HeadBandBuilder, IConfirmationModal, IGroupAttributes,
  IHeadBandAttribute, IImagesConfirmationModal,
  ImageConfirmationModalBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { B2bdModalInterface } from '../../interfaces/b2bd-modal.interface';
import { EVersionHandler } from '../../../../../../enums/version-handler.enum';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdModalService {

  constructor(
    private formatService: AdfFormatService,
    private translate: TranslateService,
    private utils: UtilService,
  ) { }


  builderModalLayout(startupParameters: B2bdModalInterface): IConfirmationModal {
    const { user, requestDetail, currency, accountDebited, bankName, dateTime} = startupParameters ?? {};

    const listGroup: IGroupAttributes[] = [];
    const imageList: IImagesConfirmationModal[] = [];

    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const footerAttributes: IHeadBandAttribute[] = [];

    const generalInformationAttributes = new AttributeReadingBuilder()
      .label('general-information')
      .class('head-columns')
      .build();

    groupGeneralInformation.attributes.push(generalInformationAttributes);

    const b2bNumberAttribute = new AttributeReadingBuilder()
      .label('b2b-no')
      .values([requestDetail?.b2bID])
      .class('content-voucher list-grid')
      .build();

    groupGeneralInformation.attributes.push(b2bNumberAttribute);

    const expensiveValueAttribute = new AttributeReadingBuilder()
      .label('expense-value')
      .values([
        currency,
        `${this.formatService.formatAmount(Number(requestDetail.expensesValue))}`,
      ])
      .class('content-voucher amount list-grid')
      .build();

    groupGeneralInformation.attributes.push(expensiveValueAttribute);

    const rateAttribute = new AttributeReadingBuilder()
      .label('rate')
      .values([`${this.utils.parsePercent(String(requestDetail.rate))}`])
      .class('content-voucher list-grid')
      .build();

    groupGeneralInformation.attributes.push(rateAttribute);

    const nextPaymentDateAttribute = new AttributeReadingBuilder()
      .label('next-payment-date')
      .values([this.formatService.getFormatDateTime(requestDetail.nextPaymentDate).date])
      .class('content-voucher list-grid')
      .build();

    groupGeneralInformation.attributes.push(nextPaymentDateAttribute);

    const amountPayableAttribute = new AttributeReadingBuilder()
      .label('amount-payable')
      .values([
        currency,
        `${this.formatService.formatAmount(Number(requestDetail.paymentAmount))}`,
      ])
      .class('content-voucher amount list-grid')
      .build();

    groupGeneralInformation.attributes.push(amountPayableAttribute);

    const amountDisbursedAttribute = new AttributeReadingBuilder()
      .label('amount-disbursed')
      .values([
        currency,
        `${this.formatService.formatAmount(Number(requestDetail.amount))}`,
      ])
      .class('content-voucher amount list-grid')
      .build();

    groupGeneralInformation.attributes.push(amountDisbursedAttribute);

    const commissionAttribute = new AttributeReadingBuilder()
      .label('commission')
      .values([
        currency,
        `${this.formatService.formatAmount(Number(requestDetail.commission))}`,
      ])
      .class('content-voucher amount list-grid')
      .build();

    groupGeneralInformation.attributes.push(commissionAttribute);

    const attributeDueDate = new AttributeReadingBuilder()
      .label('due-date')
      .values([this.formatService.getFormatDateTime(requestDetail?.dueDate).date])
      .class('content-voucher list-grid')
      .build();


    groupGeneralInformation.attributes.push(attributeDueDate);

    const interestFrequencyAttribute = new AttributeReadingBuilder()
      .label('interest-frequency')
      .values([requestDetail?.interestPaymentFrequency])
      .class('content-voucher list-grid')
      .build();

    groupGeneralInformation.attributes.push(interestFrequencyAttribute);

    const capitalFrequencyAttribute = new AttributeReadingBuilder()
      .label('capital-frequency')
      .values([requestDetail?.capitalPaymentFrequency])
      .class('content-voucher list-grid')
      .build();

    groupGeneralInformation.attributes.push(capitalFrequencyAttribute);

    listGroup.push(groupGeneralInformation);

    /* Headband Information */

    const dateAttribute = new HeadBandBuilder()
      .label('emision-date')
      .class(' emisionDate')
      .value(`${dateTime.date} ${dateTime.hour}`)
      .build();

    footerAttributes.push(dateAttribute);

    const hourAttribute = new HeadBandBuilder()
      .label('copy_generate_for')
      .class('copyGenerate')
      .value(`${accountDebited.account} - ${user.username}`)
      .build();

    footerAttributes.push(hourAttribute);

    const bankNameAttribute = new HeadBandBuilder()
      .value(bankName)
      .build();

    footerAttributes.push(bankNameAttribute);

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
      .title('request-b2b')
      .attributeList(listGroup)
      .view('v-list')
      .images(imageList)
      .containerTitle(
        `${this.translate.instant('document')}: ${+requestDetail?.reference}`
      )
      .containerValue('note_list')
      .headBandAttributes(footerAttributes)
      .build();
  }
}
