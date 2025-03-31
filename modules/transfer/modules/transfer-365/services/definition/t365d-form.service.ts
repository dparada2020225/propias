import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder, RequiredMessageHandlerBuilder, TooltipBuilder
} from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { UtilService } from '../../../../../../service/common/util.service';
import { ET365FormControlName } from '../../enum/form-control.enum';

@Injectable({
  providedIn: 'root'
})
export class T365dFormService {

  constructor(
    private utils: UtilService,
  ) { }

  buildAchTransferLayout(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeSourceAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ach:bisv:label_source_account')
      .placeholder('label_select_and_option')
      .controlName(ET365FormControlName.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeSourceAccount)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

    const validationAttributeAmount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const tooltipAmountAttribute = new TooltipBuilder()
      .label('ach-uni:label-amount-tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('label.statements.amount')
      .placeholder(`${environment.currency} 0.00`)
      .class('grid-item-md-6')
      .controlName(ET365FormControlName.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeAmount)
      .tooltip(tooltipAmountAttribute)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();
    LayoutAttributeList.push(attributeAmount);

    const validationAttributeBank = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeBank = new LayoutAttributeBuilder()
      .label('ach:bisv:label_bank')
      .placeholder('label_select_and_option')
      .class('grid-item-md-6')
      .controlName(ET365FormControlName.BANK)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeBank)
      .build();
    LayoutAttributeList.push(attributeBank);


    const checkBoxAttributes = new LayoutAttributeBuilder()
      .label('ach:bisv:label_favorite_accounts')
      .class('checkbox-365')
      .controlName(ET365FormControlName.IS_SHOW_FAVORITES)
      .layoutType(LayoutType.CHECKBOX_DEFAULT)
      .build();
    LayoutAttributeList.push(checkBoxAttributes);

    const validationAttributeTargetAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeTargetAccount = new LayoutAttributeBuilder()
      .label('account_credit_name')
      .placeholder('label_select_and_option')
      .controlName(ET365FormControlName.TARGET_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationAttributeTargetAccount)
      .build();
    LayoutAttributeList.push(attributeTargetAccount);

    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const formComment = new FormValidationsBuilder()
      .maxLength(60)
      .required(true)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation, requiredMessage])
      .build();

    const attributeComment = new LayoutAttributeBuilder()
      .label('comment')
      .placeholder('ach:bisv:label_comment')
      .controlName(ET365FormControlName.COMMENT)
      .layoutType(LayoutType.TEXTAREA)
      .formValidations(formComment)
      .limit(90)
      .build();
    LayoutAttributeList.push(attributeComment);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
