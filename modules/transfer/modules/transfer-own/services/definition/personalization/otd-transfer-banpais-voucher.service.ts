import { AdfFormatService, DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { IOTDVoucher } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBaseVoucherService } from '../base/otd-transfer-base-voucher.service';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBanpaisVoucherService {

  constructor(
    private baseVoucher: OtdTransferBaseVoucherService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private util: UtilService,
  ) { }

  builderLayoutVoucher(voucher: IOTDVoucher, isSignatureTrackingUpdate?: boolean): IDataReading {
    console.log(voucher)
    const accountDebited = voucher?.accountDebited;
    const accountCredit = voucher?.accountCredit;
    const formValues = voucher?.formValues;
    const reference = voucher?.reference;
    const dateTime = voucher?.dateTime;

    const comment = formValues?.comment;
    const amount = formValues?.amount;


    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-custom',
      attributes: [],
    };


    const attributeReference: IBasicAttributeVC =  {
      label: `reference`,
      class: 'order-lg-1 col-12 col-lg-6 list-to-column',
      values: [reference ?? ''],
    }

    groupGrid.attributes.push(this.baseVoucher.buildData(attributeReference));

    const userDataDebited: IUserDataTransaction = {
      account: accountDebited?.account,
      alias: accountDebited?.alias,
      name: accountDebited?.name,
      currency: accountDebited?.currency,
      product: +accountDebited?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);


    const DataAccountDebited: IBasicAttributeVC =  {
      label: `${isSignatureTrackingUpdate ? 'account_to_be_debited' : 'account_debited'}`,
      class: 'order-lg-3 col-12 col-lg-6 list-to-column',
      values: userDebited,
    }

    groupGrid.attributes.push(this.baseVoucher.buildData(DataAccountDebited));


    const userDataCredit: IUserDataTransaction = {
      account: accountCredit?.account,
      alias: accountCredit?.alias,
      name: accountCredit?.name,
      currency: accountCredit?.currency,
      product: +accountCredit?.product
    };
    const DataCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredit: IBasicAttributeVC =  {
      label: isSignatureTrackingUpdate ? 'account_to_be_credited' : 'account_credited',
      class: 'order-lg-5 col-12 col-lg-6 list-to-column',
      values: DataCredit,
    }

    groupGrid.attributes.push(this.baseVoucher.buildData(attributeAccountCredit));

    const attributeAmountsCredited: IBasicAttributeVC =  {
      label: 'amount_credited',
      class:'order-lg-4 col-12 col-lg-6 list-to-column',
      values: [`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount)}`],
    }

    groupGrid.attributes.push(this.baseVoucher.buildData(attributeAmountsCredited));

    if (!isSignatureTrackingUpdate){
      const attributeDateTime: IBasicAttributeVC =  {
        label: 'date_and_time',
        class:'order-lg-2 col-12 col-lg-6 list-to-column',
        values: [dateTime ?? ''],
      }

      groupGrid.attributes.push(this.baseVoucher.buildData(attributeDateTime));
    }

    if (comment !== '') {
    const attributeComment: IBasicAttributeVC =  {
      label: 'comment',
      class: 'order-lg-6 col-12 col-lg-6 list-to-column',
      values: [comment!],
    }
    groupGrid.attributes.push(this.baseVoucher.buildData(attributeComment));
  }

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .title(voucher?.title ?? '')
      .subtitle('voucher-transfer_own')
      .groupList(groupList)
      .class('padding-side')
      .build();
  }
}
