import { AdfFormatService, AttributeReadingBuilder, ConfirmationModalBuilder, IConfirmationModal, IGroupAttributes, IHeadBandAttribute } from '@adf/components';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { IAchUniModalLayout } from '../../../interfaces/ach-uni-definition';
import { IHeadBandLayout, IUserDataModalPdf } from 'src/app/models/util-work-flow.interface';
import { EProductFromCode } from 'src/app/enums/product.enum';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferModalService {
  constructor(
    private adfFormat: AdfFormatService,
    private util: UtilService,
    private utilWorkFlow: UtilWorkFlowService,
    private translate: TranslateService,
  ) { }

  buildTransferModalLayout(properties: IAchUniModalLayout): IConfirmationModal {
    const { formValues, dateTime, sourceAccount, targetAccount, bank, reference, commission } = properties ?? {};
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
      .label('ach-uni:voucher-source-account-debit')
      .class('head-columns')
      .build();
    GroupOriginAccount.attributes.push(originAccountAttributes);

    const operationDateAttribute = new AttributeReadingBuilder()
      .label('ach-uni:voucher-date-operation')
      .values([`${this.adfFormat.getFormatDateTime(dateTime).numberFormat}`])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(operationDateAttribute);

    const typeAccount = new AttributeReadingBuilder()
      .label('ach-uni:voucher-source-account-type')
      .values([this.util.getLabelProduct(Number(sourceAccount?.product ?? '00')).toUpperCase()])
      .class('content-voucher list-grid')
      .build();
    GroupOriginAccount.attributes.push(typeAccount);

    const nameAccount = new AttributeReadingBuilder()
    .label('ach-uni:voucher-source-account-name')
    .values([sourceAccount?.name ?? 'UNDEFINED'])
    .class('content-voucher list-grid')
    .build();
    GroupOriginAccount.attributes.push(nameAccount);

    const noAccount = new AttributeReadingBuilder()
    .label('ach-uni:voucher-source-account-no')
    .values([sourceAccount?.account ?? 'UNDEFINED'])
    .class('content-voucher list-grid')
    .build();
    GroupOriginAccount.attributes.push(noAccount);

    const amountDebitAttribute = new AttributeReadingBuilder()
      .label('ach-uni:voucher-ammount')
      .values([`${sourceAccount?.currency ?? 'UNDEFINED'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
      .class('lastPropertyCredit list-grid')
      .build();
    GroupOriginAccount.attributes.push(amountDebitAttribute);
    listGroup.push(GroupOriginAccount);


    const destinationAccountAttributes = new AttributeReadingBuilder()
      .label('ach-uni:voucher-target-account')
      .class('head-columns')
      .build();
    groupDestinationAccount.attributes.push(destinationAccountAttributes);

    const codeProduct = Number(this.getCodeFromAccountType(targetAccount?.type));
    const targetTypeAccount = new AttributeReadingBuilder()
      .label('ach-uni:voucher-target-account-type')
      .values([`${this.util.getLabelProduct(codeProduct).toUpperCase()}`])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(targetTypeAccount);

    const targetNameAccount = new AttributeReadingBuilder()
      .label('ach-uni:voucher-target-account-name')
      .values([targetAccount?.name ?? targetAccount?.alias])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(targetNameAccount);

    const targetNumberAccount = new AttributeReadingBuilder()
      .label('ach-uni:voucher-target-account-no')
      .values([targetAccount?.account])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(targetNumberAccount);

    const bankNameAttribute = new AttributeReadingBuilder()
      .label('ach-uni:voucher-bank')
      .values([bank?.description])
      .class('content-voucher list-grid')
      .build();
    groupDestinationAccount.attributes.push(bankNameAttribute);

    const commissionAttribute = new AttributeReadingBuilder()
    .label('ach-uni:voucher-commission')
    .values([`${sourceAccount?.currency ?? 'UNDEFINED'} ${this.adfFormat.formatAmount(commission)}`])
    .class('lastPropertyCredit list-grid')
    .build();
    groupDestinationAccount.attributes.push(commissionAttribute);

    if (formValues?.comment !== '') {
      const commentAttribute = new AttributeReadingBuilder()
        .label('comment')
        .values([formValues?.comment])
        .class('lastPropertyAccredit list-grid')
        .build();
      groupDestinationAccount.attributes.push(commentAttribute);
    }

    const amountCreditAttribute = new AttributeReadingBuilder()
    .label('ach-uni:voucher-ammount')
    .values([`${sourceAccount?.currency ?? 'UNDEFINED'} ${this.adfFormat.formatAmount(formValues?.amount)}`])
    .class('lastPropertyCredit list-grid')
    .build();
    groupDestinationAccount.attributes.push(amountCreditAttribute);

    listGroup.push(groupDestinationAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(dateTime),
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkFlow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('ach-uni:title-voucher')
      .subtitle(`${this.translate.instant('ach-uni:voucher-ref')}: ${reference ?? 'UNDEFINED'}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('ach-uni:voucher-document')}: ${reference ?? ''}`)
      .containerValue('note_list_uni')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }

  getCodeFromAccountType(type: string | undefined): string | null {
    if (type === undefined) {
      return null;
    }
    const entries = Object.entries(EProductFromCode) as [string, string][];
    const entry = entries.find(([, value]) => value === type);
    return entry ? entry[0] : null;
  }
}
