import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, DataReadingBuilder, IGroupAttributes } from '@adf/components';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { IUpdateAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdUpdateVoucherService {

  constructor(
    private util: UtilService,
  ) { }

  private buildVoucherBaseLayout(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };
    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .class('ach-text reading-text-uppercase')
      .values([this.util.getLabelTypeClient(selectedAccount?.clientType)])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .class('ach-text')
      .values([formValues?.name])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('root-account-type')
      .values([this.util.getLabelProduct(Number(Product[selectedAccount?.type ?? '00']))])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeStatusAccount = new AttributeReadingBuilder()
      .label('status')
      .class('ach-text')
      .values([this.util.getLabelStatus(formValues?.status)])
      .build();
    groupGrid.attributes.push(attributeStatusAccount);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach_target_bank')
      .values([`${selectedAccount?.bankName}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeAlias = new AttributeReadingBuilder()
      .label('account_alias')
      .values([formValues?.alias])
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('number_account')
      .values([selectedAccount?.account])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeIdentifyBeneficiary = new AttributeReadingBuilder()
      .label('ach_company_id')
      .class('ach-text')
      .values([formValues?.companyIdentifier ?? formValues?.identifyBeneficiary])
      .build();
    groupGrid.attributes.push(attributeIdentifyBeneficiary);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('ach_currency')
      .values([this.util.getLabelCurrency(selectedAccount?.currency)])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeEmail = new AttributeReadingBuilder()
      .label('notify_toEmail')
      .values([formValues?.email])
      .build();
    groupGrid.attributes.push(attributeEmail);

    groupList.push(groupGrid);
    return groupList;
  }

  buildUpdateSampleVoucherForLegalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    const groupList = this.buildVoucherBaseLayout(selectedAccount, formValues);


    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('modify_account')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

  buildUpdateSampleVoucherForNaturalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    const groupList = this.buildVoucherBaseLayout(selectedAccount, formValues);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('modify_account')
      .class('padding-side naturalClient')
      .groupList(groupList)
      .build();
  }
}
