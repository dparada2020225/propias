import { Injectable } from '@angular/core';
import { IThirdTransferConfirmationVoucher } from '../../../../interfaces/third-transfer.interface';
import { AdfFormatService, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IUserDataTransaction } from 'src/app/models/util-work-flow.interface';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { TtdBaseTransferService } from '../base/ttd-base-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTransferConfirmService {

  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private formatService: AdfFormatService,
    private base: TtdBaseTransferService
  ) { }

  buildConfirmationVoucher(
    confirmationVoucherProps: IThirdTransferConfirmationVoucher,
    isSignatureTrackingUpdate?: boolean
  ) {

    const formValues = confirmationVoucherProps?.formValues;
    const reference = confirmationVoucherProps?.reference;
    const accountCredit = confirmationVoucherProps?.accountCredit;
    const accountDebited = confirmationVoucherProps?.accountDebited;
    const date = confirmationVoucherProps?.date;

    const amount = formValues?.amount;
    const email = formValues?.email;
    const comment = formValues?.comment;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-custom',
      attributes: [],
    };

    const attributeReference: IBasicAttributeVC = {
      label: 'reference_no',
      values: [reference ?? '']
    }

    const userDataDebited: IUserDataTransaction = {
      account: accountDebited?.account,
      alias: accountDebited?.alias,
      name: accountDebited?.name,
      currency: accountDebited?.currency,
      product: +accountDebited?.product
    };

    const userDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited: IBasicAttributeVC = {
      label: isSignatureTrackingUpdate ? 'account_to_be_debited' : 'account_debited',
      class: 'third-text',
      values: userDebited
    }

    const attributeAmountDebited: IBasicAttributeVC = {
      label: 'amount',
      values: [`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount ?? '')}`]
    }

    const userDataCredit: IUserDataTransaction = {
      account: accountCredit?.account,
      alias: accountCredit?.alias,
      name: accountCredit?.name,
      currency: accountCredit?.currency,
      product: +accountCredit?.type
    };

    const userCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredit: IBasicAttributeVC = {
      label: isSignatureTrackingUpdate ? 'account_to_be_credited' : 'account_credited',
      class: 'third-text',
      values: userCredit
    }

    groupGrid.attributes.push(this.base.builderDataReading(attributeReference));

    if (!isSignatureTrackingUpdate) {

      const attributeDate: IBasicAttributeVC = {
        label: 'date_and_time',
        values: [date ?? '']
      }

      groupGrid.attributes.push(this.base.builderDataReading(attributeDate));
    }

    groupGrid.attributes.push(this.base.builderDataReading(attributeAccountDebited));
    groupGrid.attributes.push(this.base.builderDataReading(attributeAmountDebited));
    groupGrid.attributes.push(this.base.builderDataReading(attributeAccountCredit));

    if (email) {

      const attributeNotify: IBasicAttributeVC = {
        label: 'notify_to',
        values: [email ?? '']
      }

      groupGrid.attributes.push(this.base.builderDataReading(attributeNotify));
    }

    if (comment) {

      const attributeComment: IBasicAttributeVC = {
        label: 'comment',
        values: [comment ?? '']
      }

      groupGrid.attributes.push(this.base.builderDataReading(attributeComment));
    }

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title(confirmationVoucherProps.title)
      .subtitle(confirmationVoucherProps.subtitle)
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
