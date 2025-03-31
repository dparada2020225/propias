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
import { IAMACHModalParameters } from '../../interfaces/voucher.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AmdAchModalService {

  constructor(
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
  ) { }

  buildModalLayoutForCreateOperation(parameters: IAMACHModalParameters, isDelete = false): IConfirmationModal {
    const { account, transactionResponse, title } = parameters;
    const {
      typeClient,
      bankName,
      currency,
      typeAccount,
      email,
      name,
      typeIdentification,
      identificationNumber,
      reason,
      status,
      isOwnAccount,
    } = account;

    const listGroup: IGroupAttributes[] = [];
    const imageList = this.utilWorkflow.buildImagesToModal();

    const groupGridAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };



    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .values([this.translate.instant(typeClient)])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeTypeClient);

    const attributeBankName = new AttributeReadingBuilder()
      .label('account-bank')
      .values([bankName])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeBankName);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([typeAccount])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeTypeAccount);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([currency])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeCurrency);

    if (status) {
      const statusRaw = `${status.toUpperCase()}`
      const statusLabel = this.translate.instant(statusRaw).toUpperCase();
      const attributeStatus = new AttributeReadingBuilder()
        .label('status')
        .values([isDelete ? account.status : statusLabel])
        .class('content-voucher list-grid')
        .build();
      groupGridAccount.attributes.push(attributeStatus);
    }

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('no_account')
      .values([account.account])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeNumberAccount);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('ach-name')
      .values([name])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeAccountName);

    const attributeEmail = new AttributeReadingBuilder()
      .label('m365:label_email')
      .values([email])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeEmail);

    const attributeTypeIdentification = new AttributeReadingBuilder()
      .label('ac:label_type_identify')
      .values([typeIdentification])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeTypeIdentification);

    const attributeIdentificationNumber = new AttributeReadingBuilder()
      .label('ac:label_no_identify')
      .values([identificationNumber])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeIdentificationNumber);

    const attributeReason = new AttributeReadingBuilder()
      .label('ac:label_reason')
      .values([reason ? this.translate.instant(reason) : ''])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeReason);

    listGroup.push(groupGridAccount);

    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: transactionResponse?.reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title(title)
      .subtitle(`${this.translate.instant('reference:')} ${transactionResponse?.reference ?? ''}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transactionResponse?.reference ?? ''}`)
      .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }
}
