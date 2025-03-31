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
import { IDTDModal } from '../../interfaces/donation-definition.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { IHeadBandLayout, IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';

@Injectable({
  providedIn: 'root',
})
export class DtdTransferVoucherModalService {
  constructor(
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
    private formatService: AdfFormatService
  ) {}

  builderLayoutVoucherModal(modalProperties: IDTDModal): IConfirmationModal {
    const { dateTime, reference, fundationAccount, accountDebited, amount } = modalProperties ?? {};

    const listGroup: IGroupAttributes[] = [];

    const groupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupDestinationAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const originAccountAttributesDonation = new AttributeReadingBuilder()
      .label('root-account')
      .class('head-columns')
      .build();

    const operationDateAttributeDonation = new AttributeReadingBuilder()
      .label('operation-date')
      .values([`${dateTime?.numberFormat} ${dateTime?.hourSuffix}`])
      .class('content-voucher list-grid')
      .build();

    const typeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([this.util.getLabelProduct(accountDebited?.product ?? 0)])
      .class('content-voucher list-grid')
      .build();

    const userDataDebit: IUserDataModalPdf = {
      account: accountDebited?.account,
      name: accountDebited?.name,
    };

    const userDebit = this.utilWorkFlow.getUserDataModalPdf(userDataDebit);

    const accountDebitAttribute = new AttributeReadingBuilder()
      .label('account_debited_modal')
      .values([userDebit])
      .class('content-voucher list-grid')
      .build();

    const amountDebitAttribute = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([`${this.util.geCurrencSymbol(accountDebited?.currency ?? '')}. ${this.formatService.formatAmount(amount)}`])
      .class('lastPropertyCredit list-grid')
      .build();

    groupOriginAccount.attributes.push(originAccountAttributesDonation);
    groupOriginAccount.attributes.push(operationDateAttributeDonation);
    groupOriginAccount.attributes.push(typeAccount);
    groupOriginAccount.attributes.push(accountDebitAttribute);
    groupOriginAccount.attributes.push(amountDebitAttribute);

    listGroup.push(groupOriginAccount);

    const destinationAccountAttributes = new AttributeReadingBuilder().label('destination-account').class('head-columns').build();

    const userDataCredit: IUserDataModalPdf = {
      account: fundationAccount?.account,
      name: fundationAccount?.name,
    };

    const userCredit = this.utilWorkFlow.getUserDataModalPdf(userDataCredit);

    const amountCreditAttribute = new AttributeReadingBuilder()
      .label('credited_fundation')
      .values([userCredit])
      .class('content-voucher list-grid')
      .build();

    const typeAccountAttribute = new AttributeReadingBuilder()
      .label('type_account')
      .values([`${this.util.getLabelProduct(+fundationAccount?.productCode ?? 0)}`])
      .class('lastPropertyAccredit list-grid')
      .build();

    groupDestinationAccount.attributes.push(destinationAccountAttributes);
    groupDestinationAccount.attributes.push(amountCreditAttribute);
    groupDestinationAccount.attributes.push(typeAccountAttribute);

    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: dateTime,
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);
    const imageList = this.utilWorkFlow.buildImagesToModal();



    return new ConfirmationModalBuilder()
      .title('donation-title')
      .subtitle(`No. ${reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .images(imageList)
      .containerTitle(`${this.translate.instant('document')}: ${reference}`)
      .containerValue('note_list')
      .headBandAttributes(footerAttributes)
      .build();
  }
}
