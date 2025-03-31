import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  HeadBandBuilder,
  IDataReading,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IHeadBandLayout } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IUserDataTransaction } from '../../../../../../../models/util-work-flow.interface';
import { EConfirmationAction } from '../../../enum/payment-form.enum';
import { IConfirmationData } from '../../../interfaces/crud/crud-third-party-loans-interface';

@Injectable({
  providedIn: 'root',
})
export class TpldConfirmService {
  constructor(
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private util: UtilService,
    private translate: TranslateService
  ) { }

  builderLayoutConfirmation(confirmationData: IConfirmationData): IDataReading {
    switch (confirmationData.action) {
      case EConfirmationAction.DELETE:
        return this.deleteConfirmationLayout(confirmationData);
      case EConfirmationAction.CREATE:
        return this.createConfirmationLayout(confirmationData);
      case EConfirmationAction.PAYMENT:
        return this.paymentConfirmationLayout(confirmationData);
      case EConfirmationAction.ERROR_PAYMENT:
        return this.paymentConfirmationLayout(confirmationData);
      default:
        return this.paymentConfirmationLayout(null!);
    }

  }

  paymentConfirmationLayout(confirmationData: IConfirmationData): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([confirmationData?.reference ?? 'UNDEFINED'])
      .build();

    if (confirmationData.action != EConfirmationAction.ERROR_PAYMENT) {
      groupGrid.attributes.push(attributeReference);
    }

    const dateTime = this.formatService.getFormatDateTime(confirmationData?.dateTime);

    const attributeDateTime = new AttributeReadingBuilder()
      .label('date_timeTPL')
      .values([dateTime?.fullFormat])
      .build();

    if (confirmationData.action != EConfirmationAction.ERROR_PAYMENT) {
      groupGrid.attributes.push(attributeDateTime);
    }

    //ACCOUNT DEBITED

    const userDataDebited: IUserDataTransaction = {
      account: confirmationData.data.accountDebited as string,
      alias: confirmationData.data.aliasAccountDebited as string,
      name: confirmationData.data.nameAccountDebited as string,
      currency: confirmationData.data.currency as string,
      product: confirmationData.data.accountProduct as number,
    };

    const userAccountDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account_debited_tpl')
      .values(userAccountDebited)
      .build();
    groupGrid.attributes.push(attributeAccountDebited);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amountTPL')
      .values([
        `${this.util.getCurrencySymbolToIso(String(confirmationData?.data.currency))} ${this.formatService.formatAmount(String(confirmationData?.data.amount))}`,
      ])
      .build();
    groupGrid.attributes.push(attributeAmount);

    //ACCOUNT ACREDIT

    const userDataCredit: IUserDataTransaction = {
      account: confirmationData.data.loanIdentifier as string,
      alias: confirmationData.data.aliasLoan as string,
      name: confirmationData.data.nameLoan as string,
      currency: confirmationData.data.currency as string,
      product: parseInt(confirmationData.data.loanProduct!),
    };

    const userAccountCredit = this.utilWorkFlow.getUserDataTransaction(userDataCredit);

    const attributeAccountCredit = new AttributeReadingBuilder()
      .label('credited_account')
      .values(userAccountCredit)
      .build();

    groupGrid.attributes.push(attributeAccountCredit);

    const attributeNotify = new AttributeReadingBuilder()
      .label('notify_tpl')
      .values([`${confirmationData?.data?.notifyTo?.toLowerCase()}`])
      .build();

    if (confirmationData.data.notifyTo) {
      groupGrid.attributes.push(attributeNotify);
    }

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([`${confirmationData?.data.comment}`])
      .build();

    if (confirmationData.data.comment) {
      groupGrid.attributes.push(attributeComment);
    }

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('payments_loans')
      .subtitle('confirmation_tpl')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

  deleteConfirmationLayout(confirmationData: IConfirmationData): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([confirmationData?.reference])
      .class('order-1 order-md-1 order-lg-1')
      .build();
    groupGrid.attributes.push(attributeReference);

    const attributeNumberLoan = new AttributeReadingBuilder()
      .label('no_loans_confirmation')
      .values([`${confirmationData?.data.identifier}`])
      .class('order-2 order-md-3 order-lg-3')
      .build();
    groupGrid.attributes.push(attributeNumberLoan);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency_loans')
      .values([`${confirmationData?.data.currency}`])
      .class('order-6 order-md-2 order-lg-2')
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeTypeLoan = new AttributeReadingBuilder()
      .label('type_of_loan')
      .values([`${confirmationData?.data.type}`])
      .class('order-3 order-md-5 order-lg-5')
      .build();
    groupGrid.attributes.push(attributeTypeLoan);

    const attributeAlias = new AttributeReadingBuilder()
      .label('alias_tpl')
      .values([`${confirmationData?.data.alias}`])
      .class('order-7 order-md-4 order-lg-4')
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeNameLoan = new AttributeReadingBuilder()
      .label('name_tpl')
      .values([`${confirmationData?.data.loanName}`])
      .class('order-4 order-md-7 order-lg-7')
      .build();
    groupGrid.attributes.push(attributeNameLoan);

    const attributeEmail = new AttributeReadingBuilder()
      .label('email_tpl')
      .values([`${confirmationData?.data.email}`])
      .class('order-8 order-md-6 order-lg-6')
      .build();
    groupGrid.attributes.push(attributeEmail);
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('payments_loans')
      .subtitle('delete_loan_subtitule')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

  createConfirmationLayout(confirmationData: IConfirmationData): IDataReading {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([`${confirmationData?.reference}`])
      .class('order-1 order-md-1 order-lg-1')
      .build();
    groupGrid.attributes.push(attributeReference);

    const attributeState = new AttributeReadingBuilder()
      .label('state')
      .values([`${confirmationData?.data.status}`])
      .class('order-5 order-md-2 order-lg-2')
      .build();
    groupGrid.attributes.push(attributeState);

    const attributeNumberLoan = new AttributeReadingBuilder()
      .label('no_loans_confirmation')
      .values([`${confirmationData?.data.identifier}`])
      .class('order-2 order-md-3 order-lg-3')
      .build();
    groupGrid.attributes.push(attributeNumberLoan);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency_loans')
      .values([`${confirmationData?.data.currency}`])
      .class('order-6 order-md-4 order-lg-4')
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeTypeLoan = new AttributeReadingBuilder()
      .label('type_of_loan')
      .values([`${confirmationData?.data.type}`])
      .class('order-3 order-md-5 order-lg-5')
      .build();
    groupGrid.attributes.push(attributeTypeLoan);

    const attributeAlias = new AttributeReadingBuilder()
      .label('alias_tpl')
      .values([`${confirmationData?.data.alias}`])
      .class('order-7 order-md-6 order-lg-6')
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeNameLoan = new AttributeReadingBuilder()
      .label('name_tpl')
      .values([`${confirmationData?.data.loanName}`])
      .class('order-4 order-md-7 order-lg-7')
      .build();
    groupGrid.attributes.push(attributeNameLoan);

    const attributeEmail = new AttributeReadingBuilder()
      .label('email_tpl')
      .values([`${confirmationData?.data.email}`])
      .class('order-8 order-md-8 order-lg-8')
      .build();
    groupGrid.attributes.push(attributeEmail);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('payments_loans')
      .subtitle('add_third_party_loans')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

  getHeadBandLayout(userData: IHeadBandLayout): IHeadBandAttribute[] {
    const profile = this.util.getProfileHeadBand();
    const footerAttributes: IHeadBandAttribute[] = [];
    const dateTime = userData?.date;
    const reference = userData?.reference;

    const userNameBand = new HeadBandBuilder()
      .class('user-name')
      .value(profile)
      .build();

    const dateAttribute = new HeadBandBuilder()
      .class('date')
      .value(`${dateTime?.date}`)
      .build();

    const hourAttribute = new HeadBandBuilder()
      .class('hour')
      .value(`${dateTime?.hour}`)
      .build();

    const referenceAttribute = new HeadBandBuilder()
      .class('reference')
      .value(`${this.translate.instant('reference_No')} ${reference}`)
      .build();

    footerAttributes.push(userNameBand);
    footerAttributes.push(dateAttribute);
    footerAttributes.push(hourAttribute);
    footerAttributes.push(referenceAttribute);

    return footerAttributes;
  }
}
