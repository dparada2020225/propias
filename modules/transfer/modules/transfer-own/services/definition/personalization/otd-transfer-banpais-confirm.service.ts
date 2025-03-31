import { AdfFormatService, DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { IOTDConfirm } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBaseConfirmService } from '../base/otd-transfer-base-confirm.service';
import { IBasicAttributeVC } from '../../../../../../../models/build.interface';
import { IUserDataTransaction } from '../../../../../../../models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';


@Injectable({
  providedIn: 'root',
})
export class OtdTransferBanpaisConfirmService {
  constructor(
    private baseConfirm: OtdTransferBaseConfirmService,
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private util: UtilService
  ) {}

  builderLayoutConfirmation(confirm: IOTDConfirm): IDataReading {
    const accountDebited = confirm?.accountDebited;
    const accountCredit = confirm?.accountCredit;
    const amount = confirm?.amount;
    const comment = confirm?.comment;
    const title = confirm?.title;
    const subtitle = confirm?.subtitle;
    const reference = confirm?.reference;
    const isSignatureTransaction = confirm?.isSignatureTrackingMode;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-custom',
      attributes: [],
    };

    if (isSignatureTransaction) {
      const attributeReference: IBasicAttributeVC = {
        label: 'reference',
        class: 'order-lg-1 col-12 col-lg-6 list-to-column',
        values: [reference ?? ''],
      };

      groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeReference));
    }

    const userDataDebitedForBPProfile: IUserDataTransaction = {
      account: accountDebited?.account,
      alias: accountDebited?.alias,
      name: accountDebited?.name,
      currency: accountDebited?.currency,
      product: +accountDebited?.product,
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebitedForBPProfile);

    const attributeAccountDebitedBPProfile: IBasicAttributeVC = {
      label: 'account_to_be_debited',
      class: `${isSignatureTransaction ? 'order-lg-3' : 'order-lg-1'}  col-12 col-lg-6 list-to-column`,
      values: userDebited,
    };

    groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeAccountDebitedBPProfile));

    const userDataCredit: IUserDataTransaction = {
      account: accountCredit?.account,
      alias: accountCredit?.alias,
      name: accountCredit?.name,
      currency: accountCredit?.currency,
      product: +accountCredit?.product,
    };

    const userCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredited: IBasicAttributeVC = {
      label: 'account_to_be_credited',
      class: `${isSignatureTransaction ? 'order-lg-5' : 'order-lg-3'} col-12 col-lg-6 list-to-column`,
      values: userCredit,
    };

    groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeAccountCredited));

    const attributeAmountDebited: IBasicAttributeVC = {
      label: 'amount_to_be_debited',
      class: `${isSignatureTransaction ? 'order-lg-4' : 'order-lg-2'}  col-12 col-lg-6 list-to-column`,
      values: [`${this.util.geCurrencSymbol(accountDebited?.currency)}. ${this.formatService.formatAmount(amount)}`],
    };

    groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeAmountDebited));

    const attributeAmountAccredited: IBasicAttributeVC = {
      label: 'amount_to_be_credited',
      class: `${isSignatureTransaction ? 'order-lg-6' : 'order-lg-4'}  col-12 col-lg-6 list-to-column`,
      values: [`${this.util.geCurrencSymbol(accountDebited?.currency)}. ${this.formatService.formatAmount(amount)}`],
    };

    groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeAmountAccredited));

    if (comment !== '') {

      const attributeCommentConfirmBPProfile:IBasicAttributeVC = {
        label: 'comment',
        class: `${isSignatureTransaction ? 'order-lg-2' : 'order-lg-5'}  col-12 col-lg-6 list-to-column`,
        values: [comment]
      }

      groupGrid.attributes.push(this.baseConfirm.builderAttributes(attributeCommentConfirmBPProfile));
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
