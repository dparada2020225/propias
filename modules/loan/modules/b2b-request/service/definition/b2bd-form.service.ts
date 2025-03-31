import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  IDataLayoutSelect, ILayout, ILayoutAttribute, IValidationMessageHandler,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType, PositionValidationMessages, RequiredMessageHandlerBuilder
} from '@adf/components';
import { AttributeB2BRequest } from '../../enum/b2b-request-control-name.enum';
import { UtilService } from '../../../../../../service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class B2bdFormService {

  constructor(
    private utilService: UtilService
  ) { }

  builderFormLayout(currency: string): ILayout {
    const layoutB2BRequestAttributes: ILayoutAttribute[] = [];
    const validationsMessageList: IValidationMessageHandler[] = [];

    const requiredMessageBuilder = new RequiredMessageHandlerBuilder()
      .position(PositionValidationMessages.UP)
      .build();

    validationsMessageList.push(requiredMessageBuilder);

    const formAmountToRequest = new FormValidationsBuilder()
      .validationMessageHandlerList(validationsMessageList)
      .required(true)
      .build();

    const attributesAmountToRequest = new LayoutAttributeBuilder()
      .label('amount-to-request')
      .placeholder('enter-amount')
      .class('amount grid-item-x-6')
      .controlName(AttributeB2BRequest.AMOUNT_TO_REQUEST)
      .layoutType(LayoutType.INPUT)
      .formValidations(formAmountToRequest)
      .imaskOptions(this.utilService.getAmountMask(currency))
      .build();

    layoutB2BRequestAttributes.push(attributesAmountToRequest);

    const fixedTermDataSelect = new Array<IDataLayoutSelect>();

    const formFixedTerm = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesFixedTerm = new LayoutAttributeBuilder()
      .label('fixed-term')
      .placeholder('select-fixed-term')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.FIXED_TERM)
      .formValidations(formFixedTerm)
      .layoutType(LayoutType.SELECT)
      .layoutSelect(fixedTermDataSelect)
      .build();

    layoutB2BRequestAttributes.push(attributesFixedTerm);

    const formWayPay = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesWayPay = new LayoutAttributeBuilder()
      .label('way-pay')
      .placeholder('select-way-pay')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.WAY_PAY)
      .formValidations(formWayPay)
      .layoutType(LayoutType.SELECT)
      .build();

    layoutB2BRequestAttributes.push(attributesWayPay);

    const accountNumberDataSelect = new Array<IDataLayoutSelect>();

    const formAccountNumber = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesAccountNumber = new LayoutAttributeBuilder()
      .label('account-number')
      .placeholder('select-account')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.ACCOUNT_NUMBER)
      .formValidations(formAccountNumber)
      .layoutType(LayoutType.SELECT)
      .layoutSelect(accountNumberDataSelect)
      .build();
    layoutB2BRequestAttributes.push(attributesAccountNumber);


    const formCapitalFrequency = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesCapitalFrequency = new LayoutAttributeBuilder()
      .label('capital-frequency')
      .placeholder('select-payment-frequency')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.CAPITAL_FREQUENCY)
      .formValidations(formCapitalFrequency)
      .layoutType(LayoutType.SELECT)
      .build();

    layoutB2BRequestAttributes.push(attributesCapitalFrequency);

    const formInterestFrequency = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesInterestFrequency = new LayoutAttributeBuilder()
      .label('interest-frequency')
      .placeholder('select-payment-frequency')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.INTEREST_FREQUENCY)
      .formValidations(formInterestFrequency)
      .layoutType(LayoutType.SELECT)
      .build();

    layoutB2BRequestAttributes.push(attributesInterestFrequency);



    const accountCreditDataSelect: IDataLayoutSelect[] = [];

    const formAccountCredit = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList(validationsMessageList)
      .build();

    const attributesAccountCredit = new LayoutAttributeBuilder()
      .label('account-credit')
      .placeholder('select-account-credit')
      .class('grid-item-x-6')
      .controlName(AttributeB2BRequest.ACCOUNT_CREDIT)
      .formValidations(formAccountCredit)
      .layoutType(LayoutType.SELECT)
      .layoutSelect(accountCreditDataSelect)
      .build();

    layoutB2BRequestAttributes.push(attributesAccountCredit);


    return new LayoutBuilder()
      .title('b2b-request-title-forms')
      .subtitle('request')
      .class('container-form padding-side b2b-request-container-form')
      .attributes(layoutB2BRequestAttributes)
      .build();
  }
}
