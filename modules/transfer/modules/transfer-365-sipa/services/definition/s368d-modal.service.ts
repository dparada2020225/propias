import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { TranslateService } from '@ngx-translate/core';
import {
  IS365ModalVoucherParameters
} from '../../interfaces/voucher-definition.interface';
import { S368dVoucherService } from './s368d-voucher.service';

@Injectable({
  providedIn: 'root'
})
export class S368dModalService {

  constructor(
    private utils: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private voucherDefinition: S368dVoucherService,
  ) {
  }

  buildTransferModalLayout(parameters: IS365ModalVoucherParameters) {
    const {
      sourceAccountSelected,
      targetAccountSelected,
      transactionResponse,
      formValues,
      scheduleFormValues,
      reasonSelected,
      commission,
      totalValue,
    } = parameters;
    const { amount, comment } = formValues;

    const listGroup: IGroupAttributes[] = [];
    const imageList = this.utilWorkflow.buildImagesToModal();

    const groupSourceAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupTargetAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const dateFormatted = this.adfFormat.getFormatDateTime(transactionResponse.dateTime);
    const sourceAccountProductName = this.utils.getLabelProduct(sourceAccountSelected.product);
    const sourceProductAmount = this.utils.formatAmountWithCurrency(`${amount}`);

    const sourceAccountTitleS365 = new AttributeReadingBuilder()
      .label('root_account')
      .class('head-columns')
      .build();
    groupSourceAccount.attributes.push(sourceAccountTitleS365);

    const attributeS365DateOperated = new AttributeReadingBuilder()
      .label('operation-date')
      .class('content-voucher list-grid')
      .values([dateFormatted.fullFormat])
      .build();
    groupSourceAccount.attributes.push(attributeS365DateOperated);

    const attributeS365ProductName = new AttributeReadingBuilder()
      .label('account_credit_type')
      .values([sourceAccountProductName])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeS365ProductName);

    const attributeS365AccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccountSelected.name])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeS365AccountName);

    const attributeSourceAccountS365 = new AttributeReadingBuilder()
      .label('account-number')
      .values([sourceAccountSelected.account])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeSourceAccountS365);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amount')
      .class('content-voucher list-grid')
      .values([`${sourceProductAmount}`])
      .build();
    groupSourceAccount.attributes.push(attributeAmount);
    listGroup.push(groupSourceAccount);

    const attributeCommission = new AttributeReadingBuilder()
      .label('sp365:label_commission2')
      .class('content-voucher list-grid')
      .values([`${sourceAccountSelected.currency} ${commission}`])
      .build();
    groupSourceAccount.attributes.push(attributeCommission);

    const attributeTotalToDebit = new AttributeReadingBuilder()
      .label('sp365:total_to_debit2')
      .class('content-voucher list-grid')
      .values([`${totalValue}`])
      .build();
    groupSourceAccount.attributes.push(attributeTotalToDebit);

    const destinationAccountAttributes = new AttributeReadingBuilder()
      .label('destination-account')
      .class('head-columns')
      .build();
    groupTargetAccount.attributes.push(destinationAccountAttributes);

    const attributeTargetAccount = new AttributeReadingBuilder()
      .label('account-number')
      .values([targetAccountSelected.account])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeTargetAccount);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([targetAccountSelected.name])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeAccountName);

    const attributeBankName = new AttributeReadingBuilder()
      .label('target-bank')
      .values([targetAccountSelected.bankName])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeBankName);

    const attributeReason = new AttributeReadingBuilder()
      .label('sp365:label_reason')
      .values([reasonSelected.description])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeReason);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    if (formValues.isSchedule) {
      const date = this.voucherDefinition.parseScheduleDate(scheduleFormValues.date);
      const attributeTransactionSchedule = new AttributeReadingBuilder()
        .label('sp365:label_schedule_transaction')
        .values([date])
        .class('content-voucher list-grid')
        .build();
      groupTargetAccount.attributes.push(attributeTransactionSchedule);
    }

    listGroup.push(groupTargetAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: transactionResponse?.reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('s365:label_home')
      .subtitle(`${this.translate.instant('reference:')} ${transactionResponse.reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transactionResponse?.reference ?? ''}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
