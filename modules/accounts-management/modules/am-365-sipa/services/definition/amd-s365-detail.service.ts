import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IAMS365VoucherParameters } from '../../interfaces/voucher.interface';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AmdS365DetailService {

  constructor(
    private translate: TranslateService,
    private utils: UtilService,
  ) { }

  buildVoucherDefinition(parameters: IAMS365VoucherParameters) {
    const { account  } = parameters;
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

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const productName = String(this.utils.getLabelProduct(product));

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('tm365:label_type_person')
      .values([this.parseTypeClientValue(typeClient).toUpperCase()])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('ac:s365:label_name_beneficiary')
      .values([name])
      .build();
    groupGrid.attributes.push(attributeAccountName);

    const attributeDocumentNumber = new AttributeReadingBuilder()
      .label('ac:s365:label_document_number_beneficiary')
      .values([documentNumber])
      .build();
    groupGrid.attributes.push(attributeDocumentNumber);

    const attributeAddress = new AttributeReadingBuilder()
      .label('ac:s365:label_address_beneficiary')
      .values([address])
      .build();
    groupGrid.attributes.push(attributeAddress);

    const attributeCity = new AttributeReadingBuilder()
      .label('ac:s365:label_city_beneficiary')
      .values([city])
      .build();
    groupGrid.attributes.push(attributeCity);

    const attributeCountry = new AttributeReadingBuilder()
      .label('ac:s365:label_target_country')
      .values([country])
      .build();
    groupGrid.attributes.push(attributeCountry);

    const attributeBankName = new AttributeReadingBuilder()
      .label('target-bank')
      .values([bankName])
      .build();
    groupGrid.attributes.push(attributeBankName);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([productName.toUpperCase()])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('ac:s365:label_account_beneficiary')
      .values([account.account])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    if (status) {
      const statusRaw = `label_statu_${status.toUpperCase()}`
      const statusLabel = this.translate.instant(statusRaw).toUpperCase();

      const attributeStatus = new AttributeReadingBuilder()
        .label('status')
        .values([statusLabel])
        .build();
      groupGrid.attributes.push(attributeStatus);
    }

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  parseTypeClientValue(value: string): string {
    const clientMapped = {
      j: 'ac:ach_label_type_person_j',
      'legal': 'ac:ach_label_type_person_j',
      n: 'label_client_type_natural',
      'natural': 'label_client_type_natural',
    }

    const clientType = clientMapped[value.toLowerCase()] ?? '';

    return this.translate.instant(clientType);
  }
}
