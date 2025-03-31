import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IGroupAttributes,
  IHeadBandAttribute,
} from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICADDetailTransactionModalParameters } from '../../interfaces/consult-ach-definition.interface';
import { ICOTransactionCreditDetail } from '../../interfaces/navigate-parameters.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { IHeadBandLayout, IUserDataModalPdf } from '../../../../../../models/util-work-flow.interface';

@Injectable({
  providedIn: 'root',
})
export class CadModalService {
  constructor(
    private util: UtilService,
    private format: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService
  ) {}

  builderLayoutModal(parameters: ICADDetailTransactionModalParameters, transactionCreditDetail?: ICOTransactionCreditDetail) {
    const { detailTransaction, reference } = parameters ?? {};

    const listGroup: IGroupAttributes[] = [];

    const imagesList = this.utilWorkFlow.buildImagesToModal()

    const GroupOriginAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const groupDestinationAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const originAccountAttributes = new AttributeReadingBuilder().label('root-account').class('head-columns').build();
    GroupOriginAccount.attributes.push(originAccountAttributes);

    const date = this.format.getFormatDateTime(transactionCreditDetail?.operationDate as string);

    const operationDateAttribute = new AttributeReadingBuilder()
      .label('operation-date')
      .values([`${date.fullFormat}`])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(operationDateAttribute);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([`${this.translate.instant(this.util.getProductName(this.util.parseCustomNumber(transactionCreditDetail?.product as string)))}`])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(attributeTypeAccount);

    const userDataDebited: IUserDataModalPdf = {
      account: transactionCreditDetail?.debitAccount as string,
      name: transactionCreditDetail?.debitAccountName as string,
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account_debited_modal')
      .values([`${userDebited ?? 'UNDEFINED'}`])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(attributeAccountDebited);

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([
        `${this.util.getCurrencySymbolToIso(transactionCreditDetail?.currency as string)} ${this.format.formatAmount(
          transactionCreditDetail?.amount as string
        )}`,
      ])
      .class('lastPropertyCredit list-grid')
      .build();
    GroupOriginAccount.attributes.push(attributeAmountDebited);

    listGroup.push(GroupOriginAccount);

    const destinationAccountAttributes = new AttributeReadingBuilder().label('destination-account').class('head-columns').build();
    groupDestinationAccount.attributes.push(destinationAccountAttributes);

    const destinationAmountDebited = new AttributeReadingBuilder()
      .label('creditAccount')
      .values([`${transactionCreditDetail?.beneficiaryAccount}`])
      .class('lastPropertyCredit list-grid')
      .build();
    groupDestinationAccount.attributes.push(destinationAmountDebited);

    const destinationFinancialInstitution = new AttributeReadingBuilder()
      .label('financial-institution')
      .values([detailTransaction?.issuingDestination || ''])
      .class('lastPropertyCredit list-grid bankName')
      .build();
    groupDestinationAccount.attributes.push(destinationFinancialInstitution);

    const destinationName = new AttributeReadingBuilder()
      .label('currency_name_header')
      .values([detailTransaction?.senderBeneficiary || ''])
      .class('lastPropertyCredit list-grid')
      .build();
    groupDestinationAccount.attributes.push(destinationName);

    const destinationResult = new AttributeReadingBuilder()
      .label('ach-result')
      .values([detailTransaction?.status || ''])
      .class('lastPropertyCredit list-grid')
      .build();
    groupDestinationAccount.attributes.push(destinationResult);

    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: date,
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('transfers_other_banks')
      .subtitle(`No. ${reference}`)
      .attributeList(listGroup)
      .view('v-grid')
      .containerTitle(`${this.translate.instant('document')}: ${reference}`)
      .containerValue('note_list')
      .images(imagesList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
