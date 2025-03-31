import { Injectable } from '@angular/core';
import {
  AlertAttributeBuilder, AlertBuilder,
  FormValidationsBuilder, IAlert,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType, RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder, TooltipBuilder, ValidationMessageHandlerBuilder
} from '@adf/components';
import { environment } from '../../../../../../../environments/environment';
import { ES365FormTermsAndConditions, ES365FromControlName } from '../../enum/form-control.enum';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class S368dFormService {

  constructor(
    private  utils: UtilService,
  ) { }

  buildFormLayout(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationBaseAttributes = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ach:bisv:label_source_account')
      .placeholder('label_select_and_option')
      .controlName(ES365FromControlName.SOURCE_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationBaseAttributes)
      .build();
    LayoutAttributeList.push(attributeSourceAccount);

    const attributeTargetAccount = new LayoutAttributeBuilder()
      .label('account_credit_name')
      .placeholder('label_select_and_option')
      .controlName(ES365FromControlName.TARGET_ACCOUNT)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationBaseAttributes)
      .build();
    LayoutAttributeList.push(attributeTargetAccount);

    const tooltipAmountAttribute = new TooltipBuilder()
      .label('ach-uni:label-amount-tooltip')
      .icon('banca-regional-pregunta')
      .class('tooltip-sv')
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('label.statements.amount')
      .placeholder(`${environment.currency} 0.00`)
      .class('grid-item-md-6')
      .controlName(ES365FromControlName.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationBaseAttributes)
      .tooltip(tooltipAmountAttribute)
      .imaskOptions(this.utils.getAmountMask(environment.currency))
      .build();
    LayoutAttributeList.push(attributeAmount);

    const attributeReason = new LayoutAttributeBuilder()
      .label('label.statements.reason')
      .placeholder('label_select_and_option')
      .controlName(ES365FromControlName.REASON)
      .layoutType(LayoutType.SELECT)
      .formValidations(validationBaseAttributes)
      .class('grid-item-md-6')
      .build();
    LayoutAttributeList.push(attributeReason);

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
      .controlName(ES365FromControlName.COMMENT)
      .layoutType(LayoutType.TEXTAREA)
      .formValidations(formComment)
      .limit(90)
      .build();
    LayoutAttributeList.push(attributeComment);

    const checkBoxAttributes = new LayoutAttributeBuilder()
      .label('s365:label_schedule_transaction')
      .class('checkbox-365')
      .controlName(ES365FromControlName.IS_SCHEDULE)
      .layoutType(LayoutType.CHECKBOX_DEFAULT)
      .build();
    LayoutAttributeList.push(checkBoxAttributes);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }

  buildScheduleFormLayout() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const dateInvalidMessageBuilder = new ValidationMessageHandlerBuilder()
      .validationType('date_not_allowed')
      .label('date_not_allowed')
      .build();

    const validationDate = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([dateInvalidMessageBuilder])
      .build();

    const attributeDate = new LayoutAttributeBuilder()
      .label('label.statements.date-modal')
      .class('grid-item-md-5 datepicker-attribute')
      .placeholder('dd/mm/aaaa')
      .controlName(ES365FromControlName.DATE)
      .layoutType(LayoutType.DATEPICKER)
      .formValidations(validationDate)
      .limit(90)
      .build();
    LayoutAttributeList.push(attributeDate);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }

  buildModalScheduleDefinition(message: string): IAlert {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('sprint2-icon-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('title:important')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message)
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .build();
  }

  buildAcceptTermsAndConditionFormLayout() {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const validationDate = new FormValidationsBuilder()
      .requiredTrue()
      .build();

    const attributeDate = new LayoutAttributeBuilder()
      .label('s365:terms_label')
      .controlName(ES365FormTermsAndConditions.ACCEPTED)
      .layoutType(LayoutType.CHECKBOX_DEFAULT)
      .formValidations(validationDate)
      .limit(90)
      .build();
    LayoutAttributeList.push(attributeDate);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
