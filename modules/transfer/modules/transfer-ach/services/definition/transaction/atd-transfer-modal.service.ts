import { Injectable } from '@angular/core';
import { IATEModalLayout } from '../../../interfaces/ach-transfer-definition.inteface';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute,
} from '@adf/components';
import { IHeadBandLayout, IUserDataModalPdf } from '../../../../../../../models/util-work-flow.interface';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';


@Injectable({
  providedIn: 'root'
})
export class AtdTransferModalService {

  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
  ) { }

  buildTransferModalLayout(properties: IATEModalLayout): IConfirmationModal {
    const { transactionResponse, formValues, sourceAccount, targetAccount } = properties ?? {};
    const listGroup: IGroupAttributes[] = [];
    const imageList = this.utilWorkFlow.buildImagesToModal();

    const GroupOriginAccount: IGroupAttributes = {
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
    GroupOriginAccount.attributes.push(originAccountAttributes);

    const operationDateAttribute = new AttributeReadingBuilder()
      .label('operation-date')
      .values([`${this.adfFormat.getFormatDateTime(transactionResponse?.dateTime).numberFormat}`])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(operationDateAttribute);

    const typeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([this.util.getLabelProduct(Number(sourceAccount?.product ?? '00'))])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(typeAccount);

    const userDataDebited: IUserDataModalPdf = {
      account: sourceAccount?.account,
      name: sourceAccount?.alias
    };

    const userDebited = this.utilWorkFlow.getUserDataModalPdf(userDataDebited);

    const accountDebitAttribute = new AttributeReadingBuilder()
      .label('account_debited_modal')
      .values([userDebited])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(accountDebitAttribute);

    const amountDebitAttribute = new AttributeReadingBuilder()
      .label('amount-debited')
      .values([`${sourceAccount?.currency ?? 'UNDEFINED'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
      .class('lastPropertyCredit list-grid')
      .build();
    GroupOriginAccount.attributes.push(amountDebitAttribute);
    listGroup.push(GroupOriginAccount);


    const destinationAccountAttributes = new AttributeReadingBuilder()
      .label('destination-account')
      .class('head-columns')
      .build();

    groupDestinationAccount.attributes.push(destinationAccountAttributes);


    const targetNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .values([targetAccount?.name ?? targetAccount?.alias])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(targetNameAccount);

    const targetNumberAccount = new AttributeReadingBuilder()
      .label('credit_account')
      .values([targetAccount?.account])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(targetNumberAccount);

    const bankNameAttribute = new AttributeReadingBuilder()
      .label('target-bank')
      .values([targetAccount?.bankName])
      .class('content-voucher list-grid')
      .build();

    groupDestinationAccount.attributes.push(bankNameAttribute);


    if (formValues?.comment !== '') {
      const commentAttribute = new AttributeReadingBuilder()
        .label('comment')
        .values([formValues?.comment])
        .class('lastPropertyAccredit list-grid')
        .build();
      groupDestinationAccount.attributes.push(commentAttribute);
    }

    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: transactionResponse?.reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('transfers-ach-title')
      .subtitle(`No. ${transactionResponse?.reference ?? 'UNDEFINED'}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transactionResponse?.reference ?? ''}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
