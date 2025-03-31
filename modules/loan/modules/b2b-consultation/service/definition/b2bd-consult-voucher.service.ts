import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { IB2bConsultationDetail } from '../../interfaces/b2b-consultation.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdConsultVoucherService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utilService: UtilService,
  ) { }

  builderVoucherLayout(back2back: IB2bConsultationDetail, currency: string): IDataReading {
    const groupList: IGroupAttributes[] = [];
    const groupBalanceInformation: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const attributeGeneralInformation = new AttributeReadingBuilder()
      .label('general-information')
      .class('head-columns')
      .build();

    groupBalanceInformation.attributes.push(attributeGeneralInformation);

    const attributeB2B = new AttributeReadingBuilder()
      .label('b2b')
      .values([`${back2back?.b2bID}`])
      .class('content-voucher list-grid')
      .build();

    groupBalanceInformation.attributes.push(attributeB2B);

    const attributeName = new AttributeReadingBuilder()
      .label('b2b-name')
      .values([(`${back2back?.name}`).toUpperCase()])
      .class('content-voucher list-grid')
      .build();

    groupBalanceInformation.attributes.push(attributeName);

    const attributeProduct = new AttributeReadingBuilder()
      .label('product')
      .values([(`${back2back?.product}`).toUpperCase()])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeProduct);

    const attributeStatus = new AttributeReadingBuilder()
      .label('status_type')
      .values([`${back2back?.status}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeStatus);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('b2b-currency')
      .values([this.utilService.getLabelCurrency(`${currency}`)])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeCurrency);

    const attributeSubState = new AttributeReadingBuilder()
      .label('substate')
      .values([`${back2back?.subStatus}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeSubState);

    const attributeTerm = new AttributeReadingBuilder()
      .label('term')
      .values([`${back2back?.term}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeTerm);

    const attributeBalanceInformation = new AttributeReadingBuilder()
      .label('balance-information')
      .class('head-columns')
      .build();
    groupBalanceInformation.attributes.push(attributeBalanceInformation);

    const attributeAmountAwarded = new AttributeReadingBuilder()
      .label('amount-awarded')
      .values([`${currency}`, `${this.adfFormatService.formatAmount(Number(back2back?.amountGranted))}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeAmountAwarded);

    const attributeWarranty = new AttributeReadingBuilder()
      .label('warranty')
      .values([`${back2back?.warranty}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeWarranty);

    const attributeRate = new AttributeReadingBuilder()
      .label('nominal-rate')
      .values([`${this.utilService.parsePercent(String(back2back?.nominalRate))}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeRate);

    const attributeConcession = new AttributeReadingBuilder()
      .label('concession')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.concession).standard}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeConcession);

    const attributeRateEffective = new AttributeReadingBuilder()
      .label('rate-effective')
      .values([`${this.utilService.parsePercent(String(back2back?.effectiveRate))}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeRateEffective);

    const attributeExpiration = new AttributeReadingBuilder()
      .label('expiration')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.dueDate).standard}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributeExpiration);

    const attributePaymentDate = new AttributeReadingBuilder()
      .label('next-payment-date')
      .values([`${this.adfFormatService.getFormatDateTime(back2back?.nextPaymentDate).standard}`])
      .class('content-voucher list-grid')
      .build();
    groupBalanceInformation.attributes.push(attributePaymentDate);
    groupList.push(groupBalanceInformation);

    return new DataReadingBuilder()
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
