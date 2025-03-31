import { DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ITTDCreateConfirm } from '../../../../../interfaces/third-crud.interface';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { IBasicAttributeVC } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TTDCreateConfirmService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) { }

  builderCreatedConfirmation(createConfirm: ITTDCreateConfirm): IDataReading {
    const reference = createConfirm?.reference;
    const alias = createConfirm?.alias;
    const email = createConfirm?.email;
    const detailAccount = createConfirm?.detailAccount;
    const account = createConfirm?.account;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };


    const attributeNumberAccount: IBasicAttributeVC = {
      label: 'account-number',
      values: [`${account?.account ?? ''}`],
      class: 'reading-text-uppercase order-lg-3',
    };

    const attributeCurrency: IBasicAttributeVC = {
      label: 'account_credit_currency',
      values: [`${this.util.getLabelCurrency(account?.currency ?? '')}`],
      class: 'third-text order-lg-4',
    };

    const attributeTypeAccount: IBasicAttributeVC = {
      label: 'root-account-type',
      values: [`${this.util.getLabelProduct(+detailAccount?.productType ?? 0)}`],
      class: 'third-text reading-text-uppercase order-lg-5',
    };

    const attributeAlias: IBasicAttributeVC = {
      label: 'account_credit_alias',
      values: [`${alias ?? ''}`],
      class: 'third-text order-lg-6',
    };

    const attributeName: IBasicAttributeVC = {
      label: 'ach-name',
      values: [`${detailAccount?.name}`],
      class: 'third-text reading-text-uppercase order-lg-7',
    };

    const attributeState: IBasicAttributeVC = {
      label: 'state',
      values: [`${this.util.getLabelStatus(account?.status ?? '')}`],
      class: 'third-text reading-text-uppercase order-lg-2',
    };

    const attributeReference: IBasicAttributeVC = {
      label: 'reference_no',
      class: 'reading-text-uppercase order-lg-1',
      values: [reference ?? ''],
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeReference));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeState));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeNumberAccount));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeCurrency));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeTypeAccount));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeAlias));
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeName));

    if (email !== '') {

      const attributeEmail: IBasicAttributeVC = {
        label: 'email',
        class: 'order-lg-8',
        values: [`${email.toLowerCase() ?? ''}`],
      };

      groupGrid.attributes.push(this.base.builderReadingBuilder(attributeEmail));
    }

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('transfers-third-title')
      .subtitle('add_third_party_accounts')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }
}
