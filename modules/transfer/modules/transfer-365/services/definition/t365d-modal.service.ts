import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  AttributeReadingBuilder,
  ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import { Product } from '../../../../../../enums/product.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { I365ModalLayoutParameters } from '../../interfaces/voucher-definition.interface';
import { TranslateService } from '@ngx-translate/core';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';

@Injectable({
  providedIn: 'root'
})
export class T365dModalService {

  constructor(
    private util: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private util365: Ttr365UtilsService,
  ) { }

  buildTransferModalLayout(parameters: I365ModalLayoutParameters): IConfirmationModal {
    const {
      transactionResponse,
      formValues,
      targetAccountSelected,
      sourceAccountSelected,
      bankSelected
    } = parameters ?? {};
    const { comment, amount} = formValues;

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

    const dateFormatted = this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? '');
    const { standardWithHour } = this.util365.getDateOperation(dateFormatted);
    const sourceAccountProduct = this.util.getLabelProduct(sourceAccountSelected.product).toUpperCase();
    const targetAccountProduct = this.util.getLabelProduct(Number(Product[targetAccountSelected.type])).toUpperCase();

    const originAccountAttributes = new AttributeReadingBuilder()
      .label('account-debited')
      .class('head-columns')
      .build();
    groupSourceAccount.attributes.push(originAccountAttributes);

    const attributeDateOperated = new AttributeReadingBuilder()
      .label('operation-date')
      .class('content-voucher list-grid')
      .values([standardWithHour])
      .build();
    groupSourceAccount.attributes.push(attributeDateOperated);

    const attributeSourceAccountProduct = new AttributeReadingBuilder()
      .label('account_credit_type')
      .values([sourceAccountProduct])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeSourceAccountProduct);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccountSelected.name])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeSourceAccountName);

    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('account-number')
      .values([sourceAccountSelected.account])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeSourceAccount);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amount')
      .class('content-voucher list-grid')
      .values([`${sourceAccountSelected.currency} ${this.util.formatAmount(amount)}`])
      .build();
    groupSourceAccount.attributes.push(attributeAmount);
    listGroup.push(groupSourceAccount);

    const destinationAccountAttributes = new AttributeReadingBuilder()
      .label('credited-account')
      .class('head-columns')
      .build();
    groupTargetAccount.attributes.push(destinationAccountAttributes);

    const attributeTargetProductName = new AttributeReadingBuilder()
      .label('account_credit_type')
      .values([targetAccountProduct])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeTargetProductName);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([targetAccountSelected.name])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeAccountName);

    const attributeTargetAccount = new AttributeReadingBuilder()
      .label('account-number')
      .values([targetAccountSelected.account])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeTargetAccount);

    const attributeBankName = new AttributeReadingBuilder()
      .label('ach:bisv:label_bank')
      .values([bankSelected.description])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeBankName);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeComment);
    listGroup.push(groupTargetAccount);

    const reference = transactionResponse?.reference ?? '';

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('ach:bisv:label_365t_voucher_title')
      .subtitle(`${this.translate.instant('reference:')} ${reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${reference}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
