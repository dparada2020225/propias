import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IAtdConfirmationVoucher } from '../../../../interfaces/crud/update.interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdUpdateConfirmService {

  constructor(
    private util: UtilService,
  ) { }

  private buildVoucherConfirmationLayoutBase(voucherProperties: IAtdConfirmationVoucher) {
    const { formValues, reference, accountToUpdate } = voucherProperties ?? {};

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .class('')
      .values([`${reference}`])
      .build();
    groupGrid.attributes.push(attributeReference);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .class('ach-text')
      .values([`${formValues?.name}`])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .class('ach-text  reading-text-uppercase')
      .values([this.util.getLabelTypeClient(`${accountToUpdate?.clientType}`)])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeStatus = new AttributeReadingBuilder()
      .label('state')
      .class('ach-text')
      .values([this.util.getLabelStatus(`${formValues?.status}`)])
      .build();
    groupGrid.attributes.push(attributeStatus);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('root-account-type')
      .class('ach-text')
      .values([this.util.getLabelProduct(Number(Product[accountToUpdate?.type ?? '00']))])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeAlias = new AttributeReadingBuilder()
      .label('account_alias')
      .class('ach-text')
      .values([`${formValues?.alias}`])
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach_target_bank')
      .class('ach-text')
      .values([`${accountToUpdate?.bankName}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeIdentifyBeneficiary = new AttributeReadingBuilder()
      .label('identity_beneficiary')
      .class('ach-text')
      .values([`${formValues?.companyIdentifier ?? formValues?.identifyBeneficiary}`])
      .build();
    groupGrid.attributes.push(attributeIdentifyBeneficiary);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('number_account')
      .values([`${accountToUpdate?.account}`])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeEmail = new AttributeReadingBuilder()
      .label('notify_toEmail')
      .values([`${formValues?.email}`])
      .build();
    groupGrid.attributes.push(attributeEmail);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('ach_currency')
      .class('ach-text')
      .values([this.util.getLabelCurrency(`${accountToUpdate?.currency}`)])
      .build();
    groupGrid.attributes.push(attributeCurrency);
    groupList.push(groupGrid);

    return groupList;
  }

  buildVoucherConfirmationUpdateLegalClient(voucherProperties: IAtdConfirmationVoucher) {
    const groupList = this.buildVoucherConfirmationLayoutBase(voucherProperties);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('modify_account')
      .class('padding-side legal-client')
      .groupList(groupList)
      .build();
  }

  buildVoucherConfirmationUpdateNaturalClient(voucherProperties: IAtdConfirmationVoucher) {
    const groupList = this.buildVoucherConfirmationLayoutBase(voucherProperties);


    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('modify_account')
      .class('padding-side natural-client')
      .groupList(groupList)
      .build();
  }
}
