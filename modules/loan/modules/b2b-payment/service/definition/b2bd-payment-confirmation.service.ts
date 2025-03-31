import { Injectable } from '@angular/core';
import { AdfFormatService, AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { UtilService } from '../../../../../../service/common/util.service';
import { IB2BDPaymentConfirmationDefinitionParameters } from '../../interfaces/b2bd-payment-confirmation.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentConfirmationService {
  constructor(
    private adfFormatService: AdfFormatService,
    private utils: UtilService,
  ) { }


  builderConfirmationLayout(sampleVoucherProps: IB2BDPaymentConfirmationDefinitionParameters) {
    const { detailAccount, sourceAccount } = sampleVoucherProps ?? {}
    const { currency, formValues, b2bAccount } = sampleVoucherProps ?? {}

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
      .class('reading-text-uppercase col-md-12 group-title')
      .build();
    groupGeneralInformation.attributes.push(attributeTitle);

    const attributeBack2BackNumber = new AttributeReadingBuilder()
      .label('b2b-request-title')
      .values([`${currency} ${b2bAccount?.b2bID}`, `${detailAccount?.name}`])
      .class('reading-text-uppercase ')
      .build();
    groupGeneralInformation.attributes.push(attributeBack2BackNumber);

    const attributeAccountToDebit = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values([`${this.utils.getLabelProduct(Number(sourceAccount?.product))} - ${currency} ${sourceAccount?.account}`, `${sourceAccount?.name}`])
      .class('reading-text-uppercase')
      .build();
    groupGeneralInformation.attributes.push(attributeAccountToDebit);

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('payment_information')
      .class('reading-text-uppercase col-md-12 group-title')
      .build();
    groupPayInformation.attributes.push(attributePaymentTitle);

    const attributeCapital = new AttributeReadingBuilder()
      .label('capital')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(detailAccount?.capital))}`])
      .class('reading-text-uppercase view-inline')
      .build();
    groupPayInformation.attributes.push(attributeCapital);

    const attributeInterest = new AttributeReadingBuilder()
      .label('interest')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(detailAccount?.interests))}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();
    groupPayInformation.attributes.push(attributeInterest);

    const attributeFECI = new AttributeReadingBuilder()
      .label('fci')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(detailAccount?.feciOthers))}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();
    groupPayInformation.attributes.push(attributeFECI);

    const attributeSurcharge = new AttributeReadingBuilder()
      .label('surcharge')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(detailAccount?.delinquentBalance))}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();
    groupPayInformation.attributes.push(attributeSurcharge);

    const attributePaymentBalance = new AttributeReadingBuilder()
      .label('total_pay')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(formValues?.paymentBalance))}`])
      .class('third-text reading-text-uppercase view-inline')
      .build();

    groupPayInformation.attributes.push(attributePaymentBalance);
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
