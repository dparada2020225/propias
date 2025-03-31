import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import {
  AdfFormatService,
  AttributeReadingBuilder, ConfirmationModalBuilder,
  IConfirmationModal,
  IGroupAttributes,
  IHeadBandAttribute
} from '@adf/components';
import { TranslateService } from '@ngx-translate/core';
import { IHeadBandLayout } from '../../../../../../models/util-work-flow.interface';
import { M365ModalLayoutParameters } from '../../interfaces/voucher.interface';
import { IFormValuesForEnteredOption } from '../../interfaces/form.interface';
import { Ttr365UtilsService } from '../../../../services/utils/ttr-365-utils.service';

@Injectable({
  providedIn: 'root'
})
export class M365ModalService {

  constructor(
    private util: UtilService,
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private util365: Ttr365UtilsService,
    private translate: TranslateService,
  ) { }

  buildTransferModalLayout(parameters: M365ModalLayoutParameters): IConfirmationModal {
    const {
      transactionResponse,
      formValues,
      beneficiarySelected,
      sourceAccountSelected,
      bankSettingSelected
    } = parameters ?? {};
    const { comment, amount, numberPhone } = formValues;
    const { nameBeneficiary } = formValues as IFormValuesForEnteredOption ?? {};

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

    const sourceAccountTitleM365 = new AttributeReadingBuilder()
      .label('account-debited')
      .class('head-columns')
      .build();
    groupSourceAccount.attributes.push(sourceAccountTitleM365);

    const attributeM365DateOperated = new AttributeReadingBuilder()
      .label('operation-date')
      .class('content-voucher list-grid')
      .values([standardWithHour])
      .build();
    groupSourceAccount.attributes.push(attributeM365DateOperated);

    const attributeM365ProductName = new AttributeReadingBuilder()
      .label('account_credit_type')
      .values([sourceAccountProduct])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeM365ProductName);

    const attributeM365AccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccountSelected.name])
      .class('content-voucher list-grid')
      .build();
    groupSourceAccount.attributes.push(attributeM365AccountName);

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
      .values(['02'])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeTargetProductName);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([beneficiarySelected?.name ?? nameBeneficiary ?? ''])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeAccountName);

    const attributeTargetAccount = new AttributeReadingBuilder()
      .label('m365:label_number_phone')
      .values([beneficiarySelected?.account ?? numberPhone ?? ''])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeTargetAccount);

    const attributeBankName = new AttributeReadingBuilder()
      .label('ach:bisv:label_bank')
      .values([bankSettingSelected.description])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeBankName);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .class('content-voucher list-grid')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    const attributeTargetAmount = new AttributeReadingBuilder()
      .label('amount')
      .class('content-voucher list-grid')
      .values([`${sourceAccountSelected.currency} ${this.util.formatAmount(amount)}`])
      .build();
    groupTargetAccount.attributes.push(attributeTargetAmount);
    listGroup.push(groupTargetAccount);

    const reference = transactionResponse?.reference ?? '';
    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime ?? ''),
      reference: reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title('ach:bisv:label_365m_voucher_title')
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
