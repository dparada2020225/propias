import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute,
} from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IHeadBandLayout, IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ETypeAccount } from '../../../enum/payment-form.enum';
import { IVoucherPaymentTPL } from '../../../interfaces/payment-interface';

@Injectable({
  providedIn: 'root'
})
export class TpldVoucherModalService {

  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
    private formatService: AdfFormatService
  ) { }

  builderLayoutVoucherModal(modalProperties: IVoucherPaymentTPL): IConfirmationModal {

    console.log(modalProperties);

    const listGroup: IGroupAttributes[] = [];

    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupDestinationAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const originAccountAttributes = new AttributeReadingBuilder()
      .label('root-account')
      .class('head-columns')
      .build();


    const dateTime = this.formatService.getFormatDateTime(modalProperties?.rootData.dateOperation)


    const operationDateAttribute = new AttributeReadingBuilder()
      .label('operation-date')
      .values([dateTime?.fullFormat ?? 'UNDEFINED'])
      .class('content-voucher list-grid')
      .build();

    const typeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([this.util.getLabelProduct(modalProperties?.rootData.typeAccount ?? 0)])
      .class('content-voucher list-grid')
      .build();

    const userDataDebit: IUserDataModalPdf = {
      account: modalProperties.rootData.accountDebited,
      name: modalProperties.rootData.nameAccount
    };

    const userDebit = this.utilWorkFlow.getUserDataModalPdf(userDataDebit);

    const accountDebitAttribute = new AttributeReadingBuilder()
      .label('account_debited_modalTPL')
      .values([userDebit])
      .class('content-voucher list-grid')
      .build();


    const amountDebitAttribute = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([`${this.util.getCurrencySymbolToIso(modalProperties?.rootData.currency ?? 'UNDEFINED')}. ${this.formatService.formatAmount(modalProperties?.rootData.amountDebited)}`])
      .class('lastPropertyCredit list-grid')
      .build();

    groupOriginAccount.attributes.push(originAccountAttributes);
    groupOriginAccount.attributes.push(operationDateAttribute);
    groupOriginAccount.attributes.push(typeAccount);
    groupOriginAccount.attributes.push(accountDebitAttribute);
    groupOriginAccount.attributes.push(amountDebitAttribute);

    listGroup.push(groupOriginAccount);

    const destinationAccountAttributes = new AttributeReadingBuilder()
      .label('destination-account')
      .class('head-columns')
      .build();

    groupDestinationAccount.attributes.push(destinationAccountAttributes);


    const userDataCredit: IUserDataModalPdf = {
      account: modalProperties.destinationData.accountCredit,
      name: modalProperties.destinationData.nameLoan
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const amountCreditAttribute = new AttributeReadingBuilder()
      .label('credit_accountTPL')
      .values([userCredit])
      .class('content-voucher list-grid')
      .build();

    groupDestinationAccount.attributes.push(amountCreditAttribute);

    const typeAccountAttribute = new AttributeReadingBuilder()
      .label('type_account')
      .values([`${this.util.getLabelProduct(ETypeAccount.LOANS)}`])
      .class('lastPropertyAccredit list-grid')
      .build();

    groupDestinationAccount.attributes.push(typeAccountAttribute);


    const commmentAccountAttribute = new AttributeReadingBuilder()
      .label('comment')
      .values([modalProperties?.destinationData.comment ?? 'UNDEFINED'])
      .class('lastPropertyAccredit list-grid')
      .build();

    if (modalProperties.destinationData.comment) {
      groupDestinationAccount.attributes.push(commmentAccountAttribute);
    }


    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: dateTime,
      reference: modalProperties.reference
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);
    const imageList = this.utilWorkFlow.buildImagesToModal();


    return new ConfirmationModalBuilder()
      .title('payments_loans')
      .subtitle(`No. ${modalProperties.reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .images(imageList)
      .containerTitle(`${this.translate.instant('document')}: ${modalProperties.reference}`)
      .containerValue('note_list')
      .headBandAttributes(footerAttributes)
      .build();
  }



}

