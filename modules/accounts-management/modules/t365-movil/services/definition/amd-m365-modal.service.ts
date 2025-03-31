import { Injectable } from '@angular/core';
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
import { IAM365ModalParameters } from '../../interfaces/voucher.interface';

@Injectable({
  providedIn: 'root'
})
export class AmdM365ModalService {
  constructor(
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
  ) { }

  buildModalLayoutForCreateOperation(parameters: IAM365ModalParameters): IConfirmationModal {
    const { account, transactionResponse, title } = parameters;
    const { name, numberPhone, bankName, email, status } = account;

    const listGroup: IGroupAttributes[] = [];
    const imageList = this.utilWorkflow.buildImagesToModal();

    const groupGridAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const attributeNumberPhone = new AttributeReadingBuilder()
      .label('ac:365_label_beneficiary_number_phone')
      .values([numberPhone])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeNumberPhone);

    const attributeName = new AttributeReadingBuilder()
      .label('ac:365_label_beneficiary_name')
      .values([name])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeName);

    const attributeBankName = new AttributeReadingBuilder()
      .label('account_credit_bank')
      .values([bankName])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeBankName);

    if (status) {
      const statusRaw = `label_statu_${status.toUpperCase()}`
      const statusLabel = this.translate.instant(statusRaw).toUpperCase();
      const attributeStatus = new AttributeReadingBuilder()
        .label('status')
        .values([statusLabel])
        .class('content-voucher list-grid')
        .build();
      groupGridAccount.attributes.push(attributeStatus);
    }

    if (email) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('notify_toEmail')
        .values([email])
        .class('content-voucher list-grid')
        .build();
      groupGridAccount.attributes.push(attributeEmail);
    }

    listGroup.push(groupGridAccount)

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: transactionResponse?.reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    const value = transactionResponse?.reference ? `${this.translate.instant('document')}: ${transactionResponse?.reference ?? ''}` : '';
    const valueReference = transactionResponse?.reference ? `${this.translate.instant('reference:')} ${transactionResponse?.reference ?? ''}` : '';
    return new ConfirmationModalBuilder()
      .title(title)
      .subtitle(valueReference)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(value)
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
