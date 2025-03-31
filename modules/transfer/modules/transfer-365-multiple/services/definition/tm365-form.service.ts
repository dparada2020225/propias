import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType,
  RequiredMessageHandlerBuilder, TooltipBuilder
} from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { UtilService } from '../../../../../../service/common/util.service';
import { ETM365FormControlName } from '../../enum/form-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class Tm365FormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildFormLayoutDefinition() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const requiredAmountMessage = new RequiredMessageHandlerBuilder()
      .label('tm-ach-uni:range_error')
      .build();

    const validationAttributeSourceAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ach:bisv:label_source_account')
      .placeholder('label_select_and_option')
      .controlName(ETM365FormControlName.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeSourceAccount)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

    const validationAttributeAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredAmountMessage])
      .build();

    const tooltipAmountAttribute = new TooltipBuilder()
      .label('ach-uni:label-amount-tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('label.statements.amount')
      .placeholder(`${environment.currency} 0.00`)
      .controlName(ETM365FormControlName.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeAmount)
      .tooltip(tooltipAmountAttribute)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();
    LayoutAttributeList.push(attributeAmount);

    const validationCredits = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeCredits = new LayoutAttributeBuilder()
      .label('tm365:label_credits')
      .placeholder('tm365:placeholder_credits')
      .class('grid-item-md-6')
      .controlName(ETM365FormControlName.CREDITS)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationCredits)
      .build();
    LayoutAttributeList.push(attributeCredits);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
