import {DataReadingBuilder, IDataReading, IGroupAttributes} from '@adf/components';
import {Injectable} from '@angular/core';
import {IAccount} from 'src/app/models/account.inteface';
import {ITTDUpdateConfirm} from '../../../../../interfaces/third-crud.interface';
import {TtdBaseCrudService} from '../../base/ttd-base-crud.service';
import {IBasicAttributeVC} from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdUpdateBisvConfirmService {

  constructor(
    private base: TtdBaseCrudService
  ) {
  }

  private onChangeField<Account = any>(valueToUpdate: string, valueUpdated: string) {
    return valueToUpdate === valueUpdated ? '' : 'banca-regional-success';
  }

  builderUpdateConfirmation(updateConfirm: ITTDUpdateConfirm): IDataReading {

    const account = updateConfirm?.account;
    const formValues = updateConfirm?.formValues;
    const reference = updateConfirm?.reference;

    const {email, alias} = formValues;
    const groupList: IGroupAttributes[] = [];
    const groupGrid: IGroupAttributes = {
      view: 'v-list',
      attributes: [],
    };

    const hasAliasChanges = this.onChangeField<IAccount>(account?.alias, formValues?.alias);
    const hasEmailChanges = this.onChangeField<IAccount>(account?.email, formValues?.email as never);

    const attributeAlias: IBasicAttributeVC = {
      label: 'account_alias-ttr',
      values: [alias ?? ''],
      class: `update-transfer third-text list-grid ${hasAliasChanges}`,
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeAlias));
    if (email) {
      const attributeEmail: IBasicAttributeVC = {
        label: 'mail',
        values: [String(email).toLowerCase() ?? ''],
        class: `update-transfer list-grid ${hasEmailChanges}`,
      };

      groupGrid.attributes.push(this.base.builderReadingBuilder(attributeEmail));
    }


    const attributeReference: IBasicAttributeVC = {
      label: 'label.reference-sv',
      values: [reference ?? ''],
      class: 'update-transfer list-grid',
    };

    groupGrid.attributes.push(this.base.builderReadingBuilder(attributeReference));
    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('transfers-third-title')
      .subtitle(' ')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

}
