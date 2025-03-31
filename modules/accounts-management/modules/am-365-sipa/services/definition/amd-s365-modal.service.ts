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
import { IAMS365ModalParameters } from '../../interfaces/voucher.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AmdS365ModalService {
  constructor(
    private utilWorkflow: UtilWorkFlowService,
    private adfFormat: AdfFormatService,
    private translate: TranslateService,
    private utils: UtilService,
  ) { }

  buildModalLayoutForCreateOperation(parameters: IAMS365ModalParameters): IConfirmationModal {
    const { account, transactionResponse, title } = parameters;
    const {
      typeClient,
      documentNumber,
      city,
      country,
      bankName,
      name,
      address,
      status,
      product,
    } = account;

    const listGroup: IGroupAttributes[] = [];
    const imageList = this.utilWorkflow.buildImagesToModal();

    const groupGridAccount: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const productName = String(this.utils.getLabelProduct(product));

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('tm365:label_type_person')
      .values([this.parseTypeClientValue(typeClient).toUpperCase()])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeTypeClient);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('ac:s365:label_name_beneficiary')
      .values([name])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeAccountName);

    const attributeDocumentNumber = new AttributeReadingBuilder()
      .label('ac:s365:label_document_number_beneficiary')
      .values([documentNumber])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeDocumentNumber);

    const attributeAddress = new AttributeReadingBuilder()
      .label('ac:s365:label_address_beneficiary')
      .values([address])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeAddress);

    const attributeCity = new AttributeReadingBuilder()
      .label('ac:s365:label_city_beneficiary')
      .values([city])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeCity);

    const attributeCountry = new AttributeReadingBuilder()
      .label('ac:s365:label_target_country')
      .values([country])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeCountry);

    const attributeBankName = new AttributeReadingBuilder()
      .label('target-bank')
      .values([bankName])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeBankName);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([productName.toUpperCase()])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeTypeAccount);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('ac:s365:label_account_beneficiary')
      .values([account.account])
      .class('content-voucher list-grid')
      .build();
    groupGridAccount.attributes.push(attributeNumberAccount);

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

    listGroup.push(groupGridAccount)


    const headBandLayout: IHeadBandLayout = {
      date: this.adfFormat.getFormatDateTime(transactionResponse?.dateTime),
      reference: transactionResponse?.reference,
    };

    const footerAttributes: IHeadBandAttribute[] = this.utilWorkflow.getHeadBandLayout(headBandLayout);

    return new ConfirmationModalBuilder()
      .title(title)
      .subtitle(`${this.translate.instant('reference:')} ${transactionResponse.reference}`)
      .attributeList(listGroup)
      .view('v-list')
      .containerTitle(`${this.translate.instant('document')}: ${transactionResponse?.reference ?? ''}`)
      // .containerValue('note_list')
      .images(imageList)
      .headBandAttributes(footerAttributes)
      .build();
  }

  private parseTypeClientValue(value: string) {
    const clientMapped = {
      j: 'ac:ach_label_type_person_j',
      legal: 'ac:ach_label_type_person_j',
      n: 'label_client_type_natural',
      natural: 'label_client_type_natural',
    }

    const clientType = clientMapped[value.toLowerCase()] ?? '';

    return this.translate.instant(clientType);
  }
}
