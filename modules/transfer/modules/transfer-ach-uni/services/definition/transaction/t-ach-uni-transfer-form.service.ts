import { Injectable } from '@angular/core';
import { AchUniFormStartupParameters } from '../../../interfaces/ach-uni-definition';
import { FormValidationsBuilder, ILayout, ILayoutAttribute, ITooltip, LayoutAttributeBuilder, LayoutBuilder, LayoutType, RequiredMessageHandlerBuilder, ValidationMessageHandlerBuilder } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { AchUniAttributeForm } from '../../../enums/ach-uni-attribute-form.enum';

@Injectable({
  providedIn: 'root'
})
export class TAchUniTransferFormService {

  private readonly tooltipAmount: ITooltip = {
    icon: 'banca-regional-pregunta',
    class: 'tooltip-sv',
    label: `ach-uni:label-amount-tooltip`,
  };

  constructor(
    private util: UtilService,
  ) { }

  buildAchTransferLayout(startupParameters: AchUniFormStartupParameters): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];
    const { targetAccountSelected, isModify } = startupParameters ?? {};

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('ach-uni:field_required')
      .build();

    const SelecAccountMessage = new ValidationMessageHandlerBuilder()
      .validationType('tm-ach-uni:amount_invalid_account')
      .label('tm-ach-uni:amount_invalid_account')
      .build();

    const sourceAccount = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .disable(false)
      .build();

    // Declaración del formcontrol
    const attributeSourceAccount = new LayoutAttributeBuilder()
      .label('ach-uni:label-account-source')
      .placeholder(`${!isModify ? 'ach-uni:label-select-option-placeholder' : targetAccountSelected?.account}`)
      .class(`${startupParameters?.isModify ? 'modify-mode' : 'disable'}  v-inline`)
      .controlName(AchUniAttributeForm.SOURCE_ACCOUNT)
      .layoutType(startupParameters?.isModify ? LayoutType.SELECT : LayoutType.SELECT)
      .formValidations(sourceAccount)
      .build();
      LayoutAttributeList.push(attributeSourceAccount);

    const AmountMessageLimitUserValidation = new ValidationMessageHandlerBuilder()
      .validationType('ach-uni:limit_user_error')
      .label('ach-uni:limit_user_error')
      .build()

    const AmountMessageValidation = new ValidationMessageHandlerBuilder()
    .validationType('ach-uni:amount_validate_range')
    .label('ach-uni:amount_validate_range')
    .build()

    const insufficientFundsMessageValidation = new ValidationMessageHandlerBuilder()
    .validationType('ach-uni:amount_validate_found')
    .label('ach-uni:amount_validate_found')
    .build()

    const amountValidation = new FormValidationsBuilder()
      .validationMessageHandlerList([insufficientFundsMessageValidation, AmountMessageValidation, AmountMessageLimitUserValidation, requiredMessage, SelecAccountMessage])
      .required(true)
      .disable(false)
      .build();

    const amount = new LayoutAttributeBuilder()
    .label('ach-uni:label-amount')
    .tooltip(this.tooltipAmount)
    .placeholder(`${isModify ? 'ach-uni:label-amount' : targetAccountSelected?.account}`)
    .class(`grid-item-md-12 input-enabled grid-item-x-6`)
    .controlName(AchUniAttributeForm.AMOUNT)
    .layoutType(startupParameters?.isModify ? LayoutType.INPUT : LayoutType.INPUT)
    .formValidations(amountValidation)
    .build();
    LayoutAttributeList.push(amount);

    const bankValidation = new FormValidationsBuilder()
    .required(true)
    .validationMessageHandlerList([requiredMessage])
    .disable(false)
    .build();

    const bank = new LayoutAttributeBuilder()
    .label('ach-uni:label-bank')
    .placeholder(`${!isModify ? 'ach-uni:label-select-option-placeholder' : targetAccountSelected?.account}`)
    .class(`grid-item-md-12 input-enabled grid-item-x-6`)
    .controlName(AchUniAttributeForm.BANK)
    .layoutType(LayoutType.SELECT)
    .formValidations(bankValidation)
    .build();
    LayoutAttributeList.push(bank);

    const destinationAccountValidation = new FormValidationsBuilder()
    .required(true)
    .validationMessageHandlerList([requiredMessage])
    .disable(false)
    .build();

    const destinationAccount = new LayoutAttributeBuilder()
    .label('ach-uni:label-account-target')
    .placeholder(`${!isModify ? 'ach-uni:label-select-option-placeholder' : targetAccountSelected?.account}`)
    .class(`${startupParameters?.isModify ? 'modify-mode' : 'disable'}  v-inline`)
    .controlName(AchUniAttributeForm.DESTINATION_ACCOUNT)
    .layoutType(startupParameters?.isModify ? LayoutType.SELECT : LayoutType.SELECT)
    .formValidations(destinationAccountValidation)
    .build();
    LayoutAttributeList.push(destinationAccount);

    const purposeValidation = new FormValidationsBuilder()
    .required(true)
    .validationMessageHandlerList([requiredMessage])
    .disable(false)
    .build();

    const purpose = new LayoutAttributeBuilder()
    .controlName(AchUniAttributeForm.PURPOSE)
    .layoutType(LayoutType.INJECTABLE)
    .formValidations(purposeValidation)
    .build();
    LayoutAttributeList.push(purpose);

    const commentValidation = new FormValidationsBuilder()
    .required(true)
    .validationMessageHandlerList([requiredMessage])
    .disable(false)
    .maxLength(60)
    .build();

    const comment = new LayoutAttributeBuilder()
    .label('ach-uni:label-comment')
    .placeholder(`${!isModify ? 'ach-uni:label-comment-placeholder' : targetAccountSelected?.account}`)
    .class(`${startupParameters?.isModify ? 'modify-mode' : 'disable'}  v-inline`)
    .controlName(AchUniAttributeForm.COMMENT)
    .layoutType(startupParameters?.isModify ? LayoutType.TEXTAREA : LayoutType.TEXTAREA)
    .formValidations(commentValidation)
    .build();
    LayoutAttributeList.push(comment);

    const commissionValidation = new FormValidationsBuilder()
    .required(false)
    .disable(false)
    .build();

    const commission = new LayoutAttributeBuilder()
    .label('ach-uni:commission-points')
    .class(`disable`)
    .controlName(AchUniAttributeForm.COMMISSION)
    .layoutType(startupParameters?.isModify ? LayoutType.LABEL : LayoutType.LABEL)
    .formValidations(commissionValidation)
    .build();
    LayoutAttributeList.push(commission);

      return new LayoutBuilder()
      .title(startupParameters.title)
      .subtitle(startupParameters.subtitle)
      .class('transfers-ach padding-side')//declaración de estilos
      .attributes(LayoutAttributeList)
      .build();
  }

}
