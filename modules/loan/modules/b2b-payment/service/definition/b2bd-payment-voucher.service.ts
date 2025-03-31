import { Injectable } from '@angular/core';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IB2BDPaymentVoucherDefinitionParameters } from '../../interfaces/b2bd-payment-voucher.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentVoucherService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utils: UtilService,

  ) { }

  builderVoucherLayout(confirmationVoucherProps: IB2BDPaymentVoucherDefinitionParameters) {
    const { paymentDetail, sourceAccount, currency, b2bAccount } = confirmationVoucherProps ?? {}
    const { capital, interest, feciOther, amount, delinquentBalance } = paymentDetail.payment ?? {}
    const groupList: IGroupAttributes[] = [];



    const groupGeneralInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const groupPayInformation: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeTitle = new AttributeReadingBuilder()
      .label('general_information')
      .values([])
      .class('reading-text-uppercase group-title col-md-12')
      .build();

    groupGeneralInformation.attributes.push(attributeTitle);

    const attributeBack2Back = new AttributeReadingBuilder()
      .label('b2b-request-title')
      .values([`B2B ${currency} ${paymentDetail?.account}`, b2bAccount?.name])
      .class('reading-text-uppercase')
      .build();

    groupGeneralInformation.attributes.push(attributeBack2Back);

    const attributeAccountToDebit = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values([`${this.utils.getLabelProduct(Number(sourceAccount?.product ?? 0))} - ${currency} ${sourceAccount?.account}`, sourceAccount?.name])
      .class('reading-text-uppercase')
      .build();

    groupGeneralInformation.attributes.push(attributeAccountToDebit);

    const attributeVoucher = new AttributeReadingBuilder()
      .label('voucher')
      .values([paymentDetail?.receipt ?? 'undefined'])
      .class('reading-text-uppercase')
      .build();

    groupGeneralInformation.attributes.push(attributeVoucher);

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('payment_information')
      .values([])
      .class('reading-text-uppercase group-title col-md-12')
      .build();

    groupPayInformation.attributes.push(attributePaymentTitle);

    const attributeCapital = new AttributeReadingBuilder()
      .label('capital')
      .values([`${currency ?? 'undefined'}`, `${this.adfFormatService.formatAmount(+capital ?? 0)}`])
      .class('reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributeCapital);

    const attributeInterest = new AttributeReadingBuilder()
      .label('interest')
      .values([`${currency ?? 'undefined'}`, `${this.adfFormatService.formatAmount(+interest ?? 0)}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributeInterest);

    const attributeFECI = new AttributeReadingBuilder()
      .label('fci')
      .values([`${currency ?? 'undefined'}`, `${this.adfFormatService.formatAmount(+feciOther ?? 0)}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributeFECI);

    const attributeSurcharge = new AttributeReadingBuilder()
      .label('surcharge')
      .values([`${currency ?? 'undefined'}`, `${this.adfFormatService.formatAmount(+delinquentBalance ?? 0)}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributeSurcharge);

    const attributeTotalPay = new AttributeReadingBuilder()
      .label('balance_paid')
      .values([`${currency ?? 'undefined'}`, `${this.adfFormatService.formatAmount(+amount ?? 0)}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributeTotalPay);

    groupList.push(groupGeneralInformation);
    groupList.push(groupPayInformation);

    return new DataReadingBuilder()
      .title('payment_b2b_title')
      .subtitle('confirm_payment')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
