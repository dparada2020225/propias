import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeThirdTransferTable } from '../../../../enums/third-transfer-control-name.enum';
import { TtdBaseTableService } from '../base/ttd-base-table.service';
import { IlayoutAttributeBuilder } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdTableFormFilterService {


  constructor(private base: TtdBaseTableService) { }

  buildFilterLayout() {
    const attributes: ILayoutAttribute[] = []

    const filterBoxValidations = new FormValidationsBuilder()
      .maxLength(60)
      .build()

    const filterBoxAttribute: IlayoutAttributeBuilder = {
      label: 'advanced_search',
      placeholder: 'number_or_name',
      class: 'grid-item-x-6',
      controlName: AttributeThirdTransferTable.FILTER,
      layoutType: LayoutType.INPUT,
      formValidations: filterBoxValidations,
    };

    attributes.push(this.base.builderLayoutAttribute(filterBoxAttribute))

    return new LayoutBuilder()
      .title('transfers-third-title')
      .subtitle('my_third_party_account')
      .class('padding-side')
      .attributes(attributes)
      .build();
  }
}
