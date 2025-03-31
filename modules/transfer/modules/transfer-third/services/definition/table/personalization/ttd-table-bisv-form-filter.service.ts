import {FormValidationsBuilder, ILayoutAttribute, LayoutBuilder, LayoutType, TooltipBuilder} from '@adf/components';
import {Injectable} from '@angular/core';
import {IlayoutAttributeBuilder} from 'src/app/models/build.interface';
import {AttributeThirdTransferTable} from '../../../../enums/third-transfer-control-name.enum';
import {TtdBaseTableService} from '../base/ttd-base-table.service';

@Injectable({
  providedIn: 'root'
})
export class TtdTableBisvFormFilterService {

  constructor(private base: TtdBaseTableService) {
  }

  buildFilterLayout() {

    const attributes: ILayoutAttribute[] = []

    const filterBoxValidations = new FormValidationsBuilder()
      .required(false)
      .build()

    const filterBoxAttribute: IlayoutAttributeBuilder = {
      label: ' ',
      placeholder: 'search_name_alias-sv',
      class: 'grid-item-x-9 input-filter',
      controlName: AttributeThirdTransferTable.FILTER,
      layoutType: LayoutType.INPUT,
      formValidations: filterBoxValidations,
      imaskOptions: {mask: /^[A-Za-z0-9-áéíóú,. ]{0,60}$/}
    };

    attributes.push(this.base.builderLayoutAttribute(filterBoxAttribute));

    const validationSelectTypeSearch = new FormValidationsBuilder()
      .required(false)
      .build();

    const tooltipTypeSearch = new TooltipBuilder()
      .label('tooltip_search-sv')
      .icon('banca-regional-pregunta')
      .build();

    const selectTypeSearch: IlayoutAttributeBuilder = {
      placeholder: 'advanced_search-sv',
      class: 'grid-item-x-3 select-filter',
      controlName: AttributeThirdTransferTable.SELECT_TYPE_FILTER,
      label: ' ',
      layoutType: LayoutType.INJECTABLE,
      tooltip: tooltipTypeSearch,
      formValidations: validationSelectTypeSearch
    }

    attributes.push(this.base.builderLayoutAttribute(selectTypeSearch));

    return new LayoutBuilder()
      .attributes(attributes)
      .build();

  }

}
