import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IM365VoucherDefinitionParameters, M365VoucherLayoutParameters } from '../../interfaces/voucher.interface';
import { IFormValuesForEnteredOption } from '../../interfaces/form.interface';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class M365VoucherService {

  constructor(
    private utils: UtilService,
  ) { }

  buildVoucherConfirmationLayout(parameters: IM365VoucherDefinitionParameters) {
    const {
      bankSettingSelected,
      beneficiarySelected,
      formValues } = parameters;
    const { amount, comment, numberPhone } = formValues;
    const { nameBeneficiary, email } = formValues as IFormValuesForEnteredOption ?? {};

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const attributeBank = new AttributeReadingBuilder()
      .label('m365:label_target_bank')
      .values([bankSettingSelected.description])
      .build();
    groupGrid.attributes.push(attributeBank);

    const attributeNumberPhone = new AttributeReadingBuilder()
      .label('m365:label_number_phone')
      .values([beneficiarySelected?.account ?? numberPhone])
      .build();
    groupGrid.attributes.push(attributeNumberPhone);

    const attributeNameBeneficiary = new AttributeReadingBuilder()
      .label('m365:label_beneficiary')
      .values([beneficiarySelected?.name ?? nameBeneficiary ?? ''])
      .build();
    groupGrid.attributes.push(attributeNameBeneficiary);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amount')
      .values([this.utils.formatAmountWithCurrency(amount)])
      .build();
    groupGrid.attributes.push(attributeAmount);

    if (beneficiarySelected?.email || email) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('m365:label_email')
        .values([beneficiarySelected?.email ?? email ?? ''])
        .build();
      groupGrid.attributes.push(attributeEmail);
    }

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .build();
    groupGrid.attributes.push(attributeComment);


    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }

  buildVoucherLayout(parameters: M365VoucherLayoutParameters) {
    const {
      bankSettingSelected,
      beneficiarySelected,
      sourceAccountSelected,
      formValues } = parameters;
    const { amount, comment, numberPhone } = formValues;

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const attributeSourceAccount = new AttributeReadingBuilder()
      .label('ach:bisv:label_source_account')
      .values([this.utils.parseSourceAccountToVoucher(sourceAccountSelected)])
      .build();
    groupGrid.attributes.push(attributeSourceAccount);

    const attributeSourceAccountName = new AttributeReadingBuilder()
      .label('accountName')
      .values([sourceAccountSelected.name])
      .build();
    groupGrid.attributes.push(attributeSourceAccountName);

    const attributeAmount = new AttributeReadingBuilder()
      .label('amount')
      .values([this.utils.formatAmountWithCurrency(amount)])
      .build();
    groupGrid.attributes.push(attributeAmount);

    const attributeBank = new AttributeReadingBuilder()
      .label('ach:bisv:label_bank')
      .values([bankSettingSelected.description])
      .build();
    groupGrid.attributes.push(attributeBank);

    const attributeNumberPhone = new AttributeReadingBuilder()
      .label('account_credit_name')
      .values([beneficiarySelected?.account ?? numberPhone])
      .build();
    groupGrid.attributes.push(attributeNumberPhone);

    const attributeTargetProduct = new AttributeReadingBuilder()
      .label('ach:bisv:label_type_account')
      .values(['02'])
      .build();
    groupGrid.attributes.push(attributeTargetProduct);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .build();
    groupGrid.attributes.push(attributeComment);

    groupList.push(groupGrid);
    return new DataReadingBuilder()
      .groupList(groupList)
      .build();
  }
}
