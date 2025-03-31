import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  IDataReading,
  IGroupAttributes
} from '@adf/components';
import { ITPLPVoucherState } from '../../../interfaces/payment-interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';


@Injectable({
  providedIn: 'root'
})
export class TpldPaymentStVoucherService {

  constructor(
    private utilWorkFlow: UtilWorkFlowService,
    private util: UtilService,
    private format: AdfFormatService,
  ) { }

  buildLayoutVoucher(transaction: ITPLPVoucherState, title: string, subtitle: string): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: []
    };


    const userDataDebited = {
      account: transaction?.accountDebited,
      alias: transaction?.aliasAccountDebited,
      name: transaction?.nameAccountDebited,
      currency: transaction?.currency,
      product: transaction?.accountProduct
    };

    const userAccountDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .class('order-1')
      .values(userAccountDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount_to_be_debited')
      .class(`order-4 order-md-2 order-lg-2`)
      .values([`${this.util.getCurrencySymbolToIso(transaction?.currency)} ${this.format.formatAmount(transaction?.amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const userDataLoan = {
      account: transaction?.loanIdentifier,
      alias: transaction?.aliasLoan,
      name: transaction?.nameLoan,
      currency: transaction?.currency,
      product: +transaction?.loanProduct,

    };

    const userLoanDetail = this.utilWorkFlow.getUserDataTransaction(userDataLoan);

    const attributeNumberLoanPayment = new AttributeReadingBuilder()
      .label('account_to_be_credited')
      .class('order-2 order-md-3 order-lg-3')
      .values(userLoanDetail)
      .build();
    groupGrid.attributes.push(attributeNumberLoanPayment);

    if (transaction?.notifyTo) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('notify_to')
        .class('order-5 order-md-4 order-lg-4')
        .values([transaction?.notifyTo])
        .build();
      groupGrid.attributes.push(attributeEmail);
    }

    if (transaction?.comment) {
      const attributeComment = new AttributeReadingBuilder()
        .label('comment')
        .class('order-3 order-md-5 order-lg-5')
        .values([transaction?.comment])
        .build();
      groupGrid.attributes.push(attributeComment);
    }


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(title)
      .subtitle(subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }


  buildTransactionHistoryTPLVoucher(transaction: ITPLPVoucherState, title: string, subtitle: string, reference: string, date: string): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: []
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('signature-reference')
      .class('order-1')
      .values([reference ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeReference);



    const dateTime = this.format.getFormatDateTime(date ?? 'UNDEFINED');

    const attributeDateTime = new AttributeReadingBuilder()
      .label('date_timeTPL')
      .class('order-2')
      .values([dateTime?.fullFormat ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeDateTime);


    const userDataDebited = {
      account: transaction?.accountDebited,
      alias: transaction?.aliasAccountDebited,
      name: transaction?.nameAccountDebited,
      currency: transaction?.currency,
      product: transaction?.accountProduct
    };

    const userAccountDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account_debited_tpl')
      .class('order-3')
      .values(userAccountDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount-debited')
      .class('order-md-4 order-6')
      .values([`${this.util.getCurrencySymbolToIso(transaction?.currency)} ${this.format.formatAmount(transaction?.amount)}`])
      .build();
    groupGrid.attributes.push(attributeAmountDebited);

    const userDataLoan = {
      account: transaction?.loanIdentifier,
      alias: transaction?.aliasLoan,
      name: transaction?.nameLoan,
      currency: transaction?.currency,
      product: +transaction?.loanProduct,

    };

    const userLoanDetail = this.utilWorkFlow.getUserDataTransaction(userDataLoan);

    const attributeNumberLoanPayment = new AttributeReadingBuilder()
      .label('account_credited')
      .values(userLoanDetail)
      .class('order-md-5 order-4')
      .build();
    groupGrid.attributes.push(attributeNumberLoanPayment);

    if (transaction?.notifyTo) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('notify_to')
        .class('order-md-6 order-7')
        .values([transaction?.notifyTo])
        .build();
      groupGrid.attributes.push(attributeEmail);
    }

    if (transaction?.comment) {
      const attributeComment = new AttributeReadingBuilder()
        .label('comment')
        .class('order-md-7 order-5')
        .values([transaction?.comment])
        .build();
      groupGrid.attributes.push(attributeComment);
    }


    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(title)
      .subtitle(subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
