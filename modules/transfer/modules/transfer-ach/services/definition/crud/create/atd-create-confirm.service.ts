import { Injectable } from '@angular/core';
import { IATDCrudCreateConfirmation } from '../../../../interfaces/crud/crud-create.interface';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class AtdCreateConfirmService {

  constructor(
    private util: UtilService,
  ) { }

  private buildVoucherBaseLayout(properties: IATDCrudCreateConfirmation) {
    const { formValues, reference, bankSelected } = properties ?? {};
    const beneficiaryLabel = formValues?.typeClient === ECrudAchTypeClient.NATURAL ? 'identity_beneficiary' : 'ach_company_id';

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .class('ach-text order-lg-3 reading-text-uppercase')
      .values([`${this.util.getLabelTypeClient(formValues?.typeClient)}`])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .class('ach-text  order-lg-2')
      .values([`${formValues?.name}`])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeIdentifyBeneficiary = new AttributeReadingBuilder()
      .label(beneficiaryLabel)
      .class('ach-text  order-lg-5')
      .values([`${formValues?.identifyBeneficiary ?? formValues?.companyIdentifier}`])
      .build();
    groupGrid.attributes.push(attributeIdentifyBeneficiary);

    const attributeAlias = new AttributeReadingBuilder()
      .label('account_alias')
      .class('ach-text order-lg-4')
      .values([`${formValues?.alias}`])
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach_target_bank')
      .class('ach-text order-lg-7')
      .values([`${bankSelected?.name}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('root-account-type')
      .class('ach-text order-lg-6')
      .values([this.util.getLabelProduct(Number(Product[formValues?.typeAccount ?? '00']))])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('ach_currency')
      .class('ach-text order-lg-9')
      .values([this.util.getLabelCurrency(formValues?.currency)])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('number_account')
      .class('ach-text order-lg-8')
      .values([`${formValues?.numberAccount}`])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeEmail = new AttributeReadingBuilder()
      .label('notify_toEmail')
      .class('order-lg-12')
      .values([`${formValues?.email}`])
      .build();
    groupGrid.attributes.push(attributeEmail);

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .class('order-lg-1')
      .values([`${reference}`])
      .build();
    groupGrid.attributes.push(attributeReference);
    groupList.push(groupGrid);

    return groupList;
  }

  buildVoucherForNaturalClient(properties: IATDCrudCreateConfirmation) {
    const groupList = this.buildVoucherBaseLayout(properties);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('ach_account_confirmation')
      .class('padding-side natural_client')
      .groupList(groupList)
      .build();
  }

  buildVoucherForLegalClient(properties: IATDCrudCreateConfirmation) {
    const groupList = this.buildVoucherBaseLayout(properties);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('ach_account_confirmation')
      .class('padding-side legal_client')
      .groupList(groupList)
      .build();
  }
}
