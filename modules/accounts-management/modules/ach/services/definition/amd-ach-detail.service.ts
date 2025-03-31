import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IAMACHVoucherParameters } from '../../interfaces/voucher.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AmdAchDetailService {

  constructor(
    private translate: TranslateService,
  ) { }

  buildVoucherConfirmationLayout(parameters: IAMACHVoucherParameters, isDelete  = false) {
    const { account  } = parameters;
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

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .values([this.translate.instant(typeClient)])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeBankName = new AttributeReadingBuilder()
      .label('account-bank')
      .values([bankName])
      .build();
    groupGrid.attributes.push(attributeBankName);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('type_account')
      .values([typeAccount])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('currency')
      .values([currency])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    if (status) {
      const statusRaw = `${status.toUpperCase()}`
      const statusLabel = this.translate.instant(statusRaw).toUpperCase();
      const statusMapped = status ? statusLabel : '';
      const attributeStatus = new AttributeReadingBuilder()
        .label('status')
        .values([(isDelete ? account.status : statusMapped) ?? 'ACTIVA'])
        .build();
      groupGrid.attributes.push(attributeStatus);
    }

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('no_account')
      .values([account.account])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeAccountName = new AttributeReadingBuilder()
      .label('ach-name')
      .values([name])
      .build();
    groupGrid.attributes.push(attributeAccountName);

    const attributeEmail = new AttributeReadingBuilder()
      .label('m365:label_email')
      .values([email ? email : ''])
      .build();
    groupGrid.attributes.push(attributeEmail);

    const attributeTypeIdentification = new AttributeReadingBuilder()
      .label('ac:label_type_identify')
      .values([typeIdentification])
      .build();
    groupGrid.attributes.push(attributeTypeIdentification);

    const attributeIdentificationNumber = new AttributeReadingBuilder()
      .label('ac:label_no_identify')
      .values([identificationNumber])
      .build();
    groupGrid.attributes.push(attributeIdentificationNumber);

    const attributeReason = new AttributeReadingBuilder()
      .label('ac:label_reason')
      .values([reason ? this.translate.instant(reason) : ''])
      .build();
    groupGrid.attributes.push(attributeReason);

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
