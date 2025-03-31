import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { IATDCrudCreateVoucher } from '../../../../interfaces/crud/crud-create.interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';
import { ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class AtdCreateVoucherService {

  constructor(
    private util: UtilService,
  ) { }

  private buildVoucherCreateConfirmationBase(properties: IATDCrudCreateVoucher) {
    const { formValues, bankSelected } = properties ?? {};
    const beneficiaryLabel = formValues?.typeClient === ECrudAchTypeClient.NATURAL ? 'identity_beneficiary' : 'ach_company_id';
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .class('ach-text reading-text-uppercase')
      .values([`${this.util.getLabelTypeClient(formValues?.typeClient ?? 'UNDEFINED')}`])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .class('ach-text')
      .values([`${formValues?.name}`])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeIdentifyBeneficiary = new AttributeReadingBuilder()
      .label(beneficiaryLabel)
      .class('ach-text')
      .values([`${formValues?.identifyBeneficiary ?? formValues?.companyIdentifier}`])
      .build();
    groupGrid.attributes.push(attributeIdentifyBeneficiary);

    const attributeAlias = new AttributeReadingBuilder()
      .label('account_alias')
      .class('ach-text')
      .values([`${formValues?.alias}`])
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach_target_bank')
      .class('ach-text')
      .values([`${bankSelected?.name}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('root-account-type')
      .class('ach-text')
      .values([this.util.getLabelProduct(Number(Product[formValues?.typeAccount]))])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('ach_currency')
      .class('ach-text')
      .values([this.util.getLabelCurrency(formValues?.currency)])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('number_account')
      .class('ach-text')
      .values([`${formValues?.numberAccount}`])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeEmail = new AttributeReadingBuilder()
      .label('notify_toEmail')
      .values([`${formValues?.email}`])
      .build();
    groupGrid.attributes.push(attributeEmail);
    groupList.push(groupGrid);

    return groupList;
  }

  buildConfirmationVoucherCreateForNaturalClient(properties: IATDCrudCreateVoucher) {
    const groupList = this.buildVoucherCreateConfirmationBase(properties);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('ach_confirm_account')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

  buildConfirmationVoucherCreateForLegalClient(properties: IATDCrudCreateVoucher) {
    const groupList = this.buildVoucherCreateConfirmationBase(properties);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('ach_account_confirmation')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
