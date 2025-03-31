import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  TooltipBuilder,
  ValidationMessageHandlerBuilder,
} from '@adf/components';
import {Injectable} from '@angular/core';
import {IlayoutAttributeBuilder} from 'src/app/models/build.interface';
import {UtilService} from 'src/app/service/common/util.service';
import {AttributeThirdFormTransfer} from '../../../../enums/third-transfer-control-name.enum';
import {ITTDForm} from '../../../../interfaces/third-transfer-definition.interface';
import {TtdBaseTransferService} from '../base/ttd-base-transfer.service';

@Injectable({
  providedIn: 'root',
})
export class TtdTransferBisvFormService {
  constructor(private util: UtilService, private base: TtdBaseTransferService) {
  }

  buildSimpleThirdTransferLayout(form: ITTDForm): ILayout {

    const attributes: ILayoutAttribute[] = [];

    const accounCreditValidation = new ValidationMessageHandlerBuilder()
      .validationType('itIsTheSameAccount')
      .label('select_another_account')
      .build();

    const formAccountAccredit = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([accounCreditValidation])
      .build();


    const attributeAccountCredit: IlayoutAttributeBuilder = {
      label: 'credit-to',
      class: 'third-input credit-sv error-custom-select',
      controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT,
      layoutType: LayoutType.INJECTABLE,
      formValidations: formAccountAccredit,
      placeholder: 'select-credit-account',
    };

    attributes.push(this.base.builderLayoutAttributes(attributeAccountCredit));


    /* ============ ATTRIBUTES TO ACCREDIT ACCOUNT */

    const accountDebitValidations = new FormValidationsBuilder().required(true).build();

    const attributeAccountDebited: IlayoutAttributeBuilder = {
      label: 'debit-from',
      class: 'third-input debit-sv error-custom-select',
      controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED,
      layoutType: LayoutType.INJECTABLE,
      formValidations: accountDebitValidations,
      placeholder: 'select-account-debit',
    };

    const amountValidations = new FormValidationsBuilder().required(true).build();

    const tooltipAmount = new TooltipBuilder().icon('banca-regional-pregunta').label('tooltip-sv').build();

    const attributeAmount: IlayoutAttributeBuilder = {
      label: 'amount',
      class: 'third-input amount-sv',
      controlName: AttributeThirdFormTransfer.AMOUNT,
      layoutType: LayoutType.INPUT,
      formValidations: amountValidations,
      placeholder: 'amount_to_be_debited',
      tooltip: tooltipAmount,
    };

    const emailValidator = new RegexMessageHandlerBuilder().label('error_email-sv').build();

    const notifyValidations = new FormValidationsBuilder()
      .regex('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}')
      .required(true)
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeNotify: IlayoutAttributeBuilder = {
      label: 'notify_to',
      class: 'third-input email-sv',
      controlName: AttributeThirdFormTransfer.EMAIL,
      layoutType: LayoutType.INPUT,
      formValidations: notifyValidations,
      imaskOptions: {
        mask: String,
        prepare: function (str) {
          return str.toLowerCase();
        },
      },
      placeholder: 'email',
    };

    const patternValidation = new RegexMessageHandlerBuilder().label('characters_invalid').build();

    const commentValidations = new FormValidationsBuilder()
      .required(true)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation])
      .maxLength(60)
      .build();

    const attributeComment: IlayoutAttributeBuilder = {
      label: 'comment',
      class: 'third-input comment-sv error-comment',
      controlName: AttributeThirdFormTransfer.COMMENT,
      layoutType: LayoutType.TEXTAREA,
      formValidations: commentValidations,
      placeholder: 'comment-transition',
    };

    attributes.push(this.base.builderLayoutAttributes(attributeAccountDebited));
    attributes.push(this.base.builderLayoutAttributes(attributeAmount));
    attributes.push(this.base.builderLayoutAttributes(attributeNotify));
    attributes.push(this.base.builderLayoutAttributes(attributeComment));

    return new LayoutBuilder()
      .title(form?.title)
      .subtitle(form?.subtitle)
      .class('third-transfer-form padding-side')
      .attributes(attributes)
      .build();
  }
}
