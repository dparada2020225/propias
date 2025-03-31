import { AttributeReadingBuilder, DataReadingBuilder, IDataReading, IGroupAttributes } from '@adf/components';
import { Injectable } from '@angular/core';
import { ITPLVoucherStartupParameters } from '../../../../interfaces/crud/tpl-update.interface';

@Injectable({
  providedIn: 'root'
})
export class TplUpdateConfirmService {
  builderLayoutConfirmation(data: ITPLVoucherStartupParameters): IDataReading {

    const groupList: IGroupAttributes[] = [];


    const groupGrid: IGroupAttributes = {
      view: 'v-list',
      attributes: []
    };


    const attributeReference = new AttributeReadingBuilder()
      .label('reference')
      .values([data?.reference])
      .class('order-3 list-data')
      .build();

    groupGrid.attributes.push(attributeReference);


    const attributeAlias = new AttributeReadingBuilder()
      .label('alias_tpl')
      .values([data.alias])
      .class('order-1 list-data')
      .build();

    groupGrid.attributes.push(attributeAlias);

    if (data?.email) {
      const attributeEmail = new AttributeReadingBuilder()
        .label('email')
        .values([data.email])
        .class('order-2 list-data')
        .build();

      groupGrid.attributes.push(attributeEmail);
    }

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('payments_loans')
      .subtitle('updateTPL_subtitule')
      .class('padding-side')
      .groupList(groupList)
      .build();
  }

}
