import { DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { ITTDDeleteConfirm } from '../../../../../interfaces/third-crud.interface';
import { IBasicAttributeVC } from 'src/app/models/build.interface';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';

@Injectable({
  providedIn: 'root'
})
export class TTDDeleteConfirmService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) { }

  builderDeleteConfirmation(deleteConfirm: ITTDDeleteConfirm): IDataReading {
    const account = deleteConfirm?.account;
    const reference = deleteConfirm?.reference;

    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributeReference: IBasicAttributeVC = {
      label: 'reference_no',
      values: [`${reference ?? ''}`],
      class: 'reading-text-uppercase order-1',
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeReference));


    const attributeCurrency: IBasicAttributeVC = {
      label: 'ach_currency',
      class: 'reading-text-uppercase order-2',
      values: [`${this.util.getLabelCurrency(account?.currency ?? '')}`],
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeCurrency));

    const attributeNumberAccount: IBasicAttributeVC = {
      label: 'account-number',
      class: 'reading-text-uppercase order-3',
      values: [`${account?.account ?? ''}`],
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeNumberAccount));

    const attributeAlias: IBasicAttributeVC = {
      label: 'account_credit_alias',
      class: 'order-4',
      values: [`${account?.alias ?? ''}`],
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeAlias));

    const attributeTypeAccount: IBasicAttributeVC = {
      label: 'root-account-type',
      class: 'reading-text-uppercase order-5',
      values: [`${this.util.getLabelProduct(+account?.type ?? 0)}`],
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeTypeAccount));


    if (account?.email) {

      const attributeEmail: IBasicAttributeVC = {
        label: 'email',
        class: 'order-6',
        values: [`${account?.email ?? ''}`],
      };

      groupGrid.attributes.push(this.base.builderReadingBuilder(attributeEmail));
    }

    const attributeName: IBasicAttributeVC = {
      label: 'ach-name',
      class: 'reading-text-uppercase order-7',
      values: [`${account?.name ?? ''}`],
    };
    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeName));

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('transfers-third-title')
      .subtitle('third_party_account_deletion')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

}
