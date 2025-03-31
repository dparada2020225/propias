import { Injectable } from '@angular/core';
import {
  AdfFormatService,
  FormValidationsBuilder, ILayoutAttribute, IValidationMessageHandler,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  PositionValidationMessages, RequiredMessageHandlerBuilder
} from '@adf/components';
import { B2bPaymentForm } from '../../enum/b2b-payment-control-name.enum';
import { UtilService } from '../../../../../../service/common/util.service';
import { IB2BDPaymentBuildFormParameters } from '../../interfaces/b2bd-payment-form.interface';

@Injectable({
  providedIn: 'root'
})
export class B2bdPaymentFormService {

  constructor(
    private adfFormatService: AdfFormatService,
    private utils: UtilService
  ) { }


  buildFormLayout(transferLayoutProps: IB2BDPaymentBuildFormParameters) {
    const { accountDetail, currency, b2bAccount } = transferLayoutProps ?? {};

    const attributes: ILayoutAttribute[] = [];

    const validationsMessageList: IValidationMessageHandler[] = [];

    const requiredMessageBuilder = new RequiredMessageHandlerBuilder()
      .position(PositionValidationMessages.UP)
      .build();

    validationsMessageList.push(requiredMessageBuilder);

    const validationAccountDebit = new FormValidationsBuilder()
      .validationMessageHandlerList(validationsMessageList)
      .required(true)
      .build();

    const attributeAccountDebit = new LayoutAttributeBuilder()
      .label('account_to_be_debited')
      .placeholder('account_to_be_debited')
      .controlName(B2bPaymentForm.ACCOUNT_DEBITED)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-12 input-enabled grid-item-x-6')
      .formValidations(validationAccountDebit)
      .build();
    attributes.push(attributeAccountDebit);

    const validationGeneralInformation = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeGeneralInformation = new LayoutAttributeBuilder()
      .label('information-general')
      .placeholder('')
      .layoutType(LayoutType.LABEL)
      .class('attribute-title first-title')
      .formValidations(validationGeneralInformation)
      .build();

    attributes.push(attributeGeneralInformation);

    const validationNumberAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('b2b')
      .placeholder(`${b2bAccount?.b2bID ?? 'undefined'}`)
      .controlName(B2bPaymentForm.ACCOUNT)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationNumberAccount)
      .build();

    attributes.push(attributeNumberAccount);

    const validationName = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('b2b-name')
      .placeholder(`${accountDetail?.name ?? 'undefined'}`)
      .controlName(B2bPaymentForm.NAME)
      .layoutType(LayoutType.LABEL)
      .class('c disable v-inline input-uppercase-value')
      .formValidations(validationName)
      .build();

    attributes.push(attributeName);

    const validationStateAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeStateAccount = new LayoutAttributeBuilder()
      .label('status_type')
      .placeholder(`${accountDetail?.status ?? 'undefined'}`)
      .controlName(B2bPaymentForm.STATUS)
      .layoutType(LayoutType.LABEL)
      .class('disable v-inline input-uppercase-value')
      .formValidations(validationStateAccount)
      .build();

    attributes.push(attributeStateAccount);

    const validationCurrency = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeCurrency = new LayoutAttributeBuilder()
      .label('b2b-currency')
      .placeholder((this.utils.getLabelCurrency(currency) ?? '').toLowerCase())
      .controlName(B2bPaymentForm.CURRENCY)
      .layoutType(LayoutType.LABEL)
      .class('disable v-inline input-uppercase-value')
      .formValidations(validationCurrency)
      .build();

    attributes.push(attributeCurrency);

    const validationInterestRate = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeInterestRate = new LayoutAttributeBuilder()
      .label('rate_interest')
      .placeholder(`${this.utils.parsePercent(String(accountDetail?.interestRate))} `)
      .controlName(B2bPaymentForm.INTEREST_RATE)
      .layoutType(LayoutType.LABEL)
      .class(' disable  v-inline input-uppercase-value')
      .formValidations(validationInterestRate)
      .build();

    attributes.push(attributeInterestRate);

    const validationDefaultRate = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeDefaultRate = new LayoutAttributeBuilder()
      .label('rate_surcharge')
      .placeholder(`${this.utils.parsePercent(String(accountDetail?.defaultRate))}`)
      .controlName(B2bPaymentForm.DEFAULT_RATE)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationDefaultRate)
      .build();

    attributes.push(attributeDefaultRate);

    const validationBalanceInformation = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeBalanceInformation = new LayoutAttributeBuilder()
      .label('balance_information')
      .placeholder('')
      .layoutType(LayoutType.LABEL)
      .class('attribute-title second-title')
      .formValidations(validationBalanceInformation)
      .build();

    attributes.push(attributeBalanceInformation);

    const validationOpeningDate = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeOpeningDate = new LayoutAttributeBuilder()
      .label('opening_date')
      .placeholder(`${this.adfFormatService.getFormatDateTime(accountDetail?.openDate).standard}`)
      .controlName(B2bPaymentForm.DEFAULT_RATE)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationOpeningDate)
      .build();

    attributes.push(attributeOpeningDate);

    const validationExpirationDate = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeExpirationDate = new LayoutAttributeBuilder()
      .label('expiration_date')
      .placeholder(`${this.adfFormatService.getFormatDateTime(accountDetail?.dueDate).standard}`)
      .controlName(B2bPaymentForm.DEFAULT_RATE)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationExpirationDate)
      .build();

    attributes.push(attributeExpirationDate);

    const validationInterestBalance = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeInterestBalance = new LayoutAttributeBuilder()
      .label('balance_interest')
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.interestBalance)}`)
      .controlName(B2bPaymentForm.INTEREST_BALANCE)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationInterestBalance)
      .build();

    attributes.push(attributeInterestBalance);

    const validationBalanceAfterCapital = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeValanceAfterCapital = new LayoutAttributeBuilder()
      .label('balance_after_payment')
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.balanceAfterCapitalPayment)}`)
      .controlName(B2bPaymentForm.BALANCE_AFTER_PAYMENT)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationBalanceAfterCapital)
      .build();

    attributes.push(attributeValanceAfterCapital);

    const validationPaymentInformation = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributePaymentInformation = new LayoutAttributeBuilder()
      .label('information_payment')
      .placeholder('')
      .layoutType(LayoutType.LABEL)
      .class('attribute-title')
      .formValidations(validationPaymentInformation)
      .build();

    attributes.push(attributePaymentInformation);

    const validationCapital = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeCapital = new LayoutAttributeBuilder()
      .label('capital')
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.capital)}`)
      .controlName(B2bPaymentForm.CAPITAl)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationCapital)
      .build();

    attributes.push(attributeCapital);

    const validationInterest = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeInterest = new LayoutAttributeBuilder()
      .label('interest')
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.interests)}`)
      .controlName(B2bPaymentForm.INTEREST)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationInterest)
      .build();

    attributes.push(attributeInterest);

    const validationFCI = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeFCI = new LayoutAttributeBuilder()
      .label('fci')
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.feciOthers)}`)
      .controlName(B2bPaymentForm.FCI)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationFCI)
      .build();

    attributes.push(attributeFCI);

    const validationSurcharge = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeSurcharge = new LayoutAttributeBuilder()
      .label('surcharge')
      .controlName(B2bPaymentForm.ARREARS)
      .placeholder(`${currency}     ${this.adfFormatService.formatAmount(accountDetail?.delinquentBalance)}`)
      .layoutType(LayoutType.LABEL)
      .class(' disable v-inline input-uppercase-value')
      .formValidations(validationSurcharge)
      .build();

    attributes.push(attributeSurcharge);

    const validationBalancePayable = new FormValidationsBuilder()
      .validationMessageHandlerList(validationsMessageList)
      .required(true)
      .build();

    const attributeBalancePayable = new LayoutAttributeBuilder()
      .label('payment_balance')
      .placeholder('payment_balance')
      .controlName(B2bPaymentForm.BALANCE_PAYMENT)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.utils.getAmountMask(currency, .1))
      .class('v-inline  input-enabled grid-item-x-8')
      .formValidations(validationBalancePayable)
      .build();

    attributes.push(attributeBalancePayable);

    return new LayoutBuilder()
      .title('b2b')
      .subtitle('payment')
      .class('b2b-transfer-container crud-layout padding-side')
      .attributes(attributes)
      .build();
  }
}
