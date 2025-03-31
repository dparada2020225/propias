import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType,
  PositionValidationMessages,
  RequiredMessageHandlerBuilder,
  TooltipBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeFormCrud } from '../../../../../enums/third-transfer-control-name.enum';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { IlayoutAttributeBuilder } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TTDCreateSeachService {

  constructor(private base: TtdBaseCrudService) { }

  buildConsultingLayout(): ILayout {

    const attributes: ILayoutAttribute[] = [];

    const validationTypeAccount = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeTypeAccount: IlayoutAttributeBuilder = {
      label: 'select_account_type',
      class: 'grid-item-x-6 consulting-input',
      controlName: AttributeFormCrud.TYPE_ACCOUNT,
      placeholder: 'select_account_type',
      layoutType: LayoutType.SELECT,
      formValidations: validationTypeAccount,
    }

    const requiredNumberAccount = new RequiredMessageHandlerBuilder()
      .label('require_nember_account')
      .position(PositionValidationMessages.BELOW)
      .build();

    const validationNumberAccount = new FormValidationsBuilder()
      .required(true)
      .maxLength(12)
      .validationMessageHandlerList([requiredNumberAccount])
      .build();

    const numberAccountTooltip = new TooltipBuilder()
      .label('no_hyphens_or_spaces')
      .icon('banca-regional-pregunta')
      .class('third-transfer')
      .build();


    const attributeNumberAccount: IlayoutAttributeBuilder = {
      label: 'label.statements.account-number',
      class: 'grid-item-x-6 consulting-input',
      controlName: AttributeFormCrud.NUMBER_ACCOUNT,
      layoutType: LayoutType.INPUT,
      placeholder: 'enter_your_account_number',
      tooltip: numberAccountTooltip,
      imaskOptions: { mask: '000000000000' },
      formValidations: validationNumberAccount,
    };

    attributes.push(this.base.builderLayoutAttribute(attributeTypeAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeNumberAccount));

    return new LayoutBuilder()
      .subtitle('add_third_party_account')
      .title('transfers-third-title')
      .class('third-transfer-container padding-side consulting-layout')
      .attributes(attributes)
      .build();
  }
}
