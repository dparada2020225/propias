import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { FormValidationsBuilder, ILayout, ILayoutAttribute, LayoutAttributeBuilder, LayoutBuilder, LayoutType, RequiredMessageHandlerBuilder, TooltipBuilder, ValidationMessageHandlerBuilder } from '@adf/components';
import { ETMAchUniFormControlName } from '../../enum/ach-uni-form-control-name.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmAchUniFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildFormLayoutDefinition(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('tm-ach-uni:field_required')
      .build();

      const requiredMessageAmount = new RequiredMessageHandlerBuilder()
      .label('tm-ach-uni:range_error')
      .build();

    const rangeMessage = new ValidationMessageHandlerBuilder()
      .validationType('tm-ach-uni:range_error')
      .label('tm-ach-uni:range_error')
      .build();

    const SelecAccountMessage = new ValidationMessageHandlerBuilder()
      .validationType('tm-ach-uni:amount_invalid_account')
      .label('tm-ach-uni:amount_invalid_account')
      .build();

    const validationAttributeSourceAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('tm-ach-uni:account_source')
      .placeholder('tm-ach-uni:label_select_and_option')
      .controlName(ETMAchUniFormControlName.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeSourceAccount)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

    const validationAttributeAmount = new FormValidationsBuilder()
      .validationMessageHandlerList([rangeMessage, requiredMessageAmount])
      .required(true)
      .disable(false)
      .build();

    const tooltipAmountAttribute = new TooltipBuilder()
      .label('tm-ach-uni:tooltip_tm_ach_uni')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('tm-ach-uni:amount')
      .tooltip(tooltipAmountAttribute)
      .placeholder(`${environment.currency} 0.00`)
      .class('grid-item-md-6')
      .controlName(ETMAchUniFormControlName.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeAmount)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();
    LayoutAttributeList.push(attributeAmount);

    const validationCredits = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeCredits = new LayoutAttributeBuilder()
      .label('tm-ach-uni:number_credits')
      .placeholder('tm-ach-uni:number_credits_placeholder')
      .class('grid-item-md-6')
      .controlName(ETMAchUniFormControlName.CREDITS)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationCredits)
      .build();
    LayoutAttributeList.push(attributeCredits);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }

}
