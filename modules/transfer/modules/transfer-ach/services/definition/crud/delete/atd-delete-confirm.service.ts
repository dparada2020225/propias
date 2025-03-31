import { Injectable } from '@angular/core';
import {
  AttributeReadingBuilder,
  DataReadingBuilder,
  IGroupAttributes
} from '@adf/components';
import { IATDDeleteVoucher } from '../../../../interfaces/crud/ach-delete.interface';
import { Product } from '../../../../../../../../enums/product.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class AtdDeleteConfirmService {

  constructor(
    private util: UtilService,
  ) { }

  buildDeleteConfirmation(voucherProperties: IATDDeleteVoucher) {
    const { deletedAccount, reference } = voucherProperties ?? {};

    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeTypeClient = new AttributeReadingBuilder()
      .label('type_client')
      .class('ach-text order-lg-3 reading-text-uppercase')
      .values([this.util.getLabelTypeClient(deletedAccount?.clientType ?? 'UNDEFINED')])
      .build();
    groupGrid.attributes.push(attributeTypeClient);

    const attributeNameAccount = new AttributeReadingBuilder()
      .label('ach_name_account')
      .class('ach-text order-lg-4')
      .values([deletedAccount?.name ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeNameAccount);

    const attributeIdentifyBeneficiary = new AttributeReadingBuilder()
      .label('ach_identifier')
      .class('ach-text order-lg-5')
      .values([`${deletedAccount?.documentNumber ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeIdentifyBeneficiary);

    const attributeAlias = new AttributeReadingBuilder()
      .label('account-aliases')
      .class('ach-text order-lg-6')
      .values([deletedAccount?.alias ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeAlias);

    const attributeTargetBank = new AttributeReadingBuilder()
      .label('ach_target_bank')
      .class('ach-text order-lg-7')
      .values([`${deletedAccount?.bankName ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeTargetBank);

    const attributeTypeAccount = new AttributeReadingBuilder()
      .label('root-account-type')
      .class('ach-text order-lg-8')
      .values([this.util.getLabelProduct(Number(Product[deletedAccount?.type ?? '00']))])
      .build();
    groupGrid.attributes.push(attributeTypeAccount);

    const attributeCurrency = new AttributeReadingBuilder()
      .label('ach_currency')
      .class('ach-text order-lg-9')
      .values([this.util.getLabelCurrency(deletedAccount?.currency ?? 'UNDEFINED')])
      .build();
    groupGrid.attributes.push(attributeCurrency);

    const attributeNumberAccount = new AttributeReadingBuilder()
      .label('number_account')
      .class('order-lg-10')
      .values([deletedAccount?.account ?? 'UNDEFINED'])
      .build();
    groupGrid.attributes.push(attributeNumberAccount);

    const attributeEmail = new AttributeReadingBuilder()
      .label('notify_to')
      .class('order-lg-2')
      .values([deletedAccount?.email])
      .build();
    groupGrid.attributes.push(attributeEmail);

    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .class('order-lg-1')
      .values([`${reference ?? 'UNDEFINED'}`])
      .build();
    groupGrid.attributes.push(attributeReference);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('transfers_other_banks')
      .subtitle('ach.delete_subtitle_confirmation')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
