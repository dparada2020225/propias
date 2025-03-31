import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import {Injectable} from '@angular/core';
import {UtilService} from 'src/app/service/common/util.service';
import {IThirdTransfersAccounts} from '../../../../../../../interface/transfer-data-interface';
import {AttributeFormCrud} from '../../../../../enums/third-transfer-control-name.enum';
import {TtdBaseCrudService} from '../../base/ttd-base-crud.service';
import {IlayoutAttributeBuilder} from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TtdUpdateBisvFormService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) {
  }

  buildUpdateAccountLayout(account: IThirdTransfersAccounts): ILayout {

    const attributes: ILayoutAttribute[] = [];

    const validationLabel = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeNumberAccount: IlayoutAttributeBuilder = {
      label: 'account_number-ttr',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NUMBER_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.account ?? 'UNDEFINED'}`,
      formValidations: validationLabel,
    };


    const attributeTypeAccount: IlayoutAttributeBuilder = {
      label: 'account-type-sv',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.TYPE_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.productLabel ?? 'UNDEFINED'}`,
      formValidations: validationLabel,
    };

    const attributeName: IlayoutAttributeBuilder = {
      label: 'ach-name',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NAME_ACCOUNT,
      layoutType: LayoutType.LABEL,
      formValidations: validationLabel,
      placeholder: `${account?.name ?? 'UNDEFINED'}`,
    };

    const attributeStateAccount: IlayoutAttributeBuilder = {
      label: 'state',
      placeholder: `${this.util.getLabelStatus(account?.status ?? '').toUpperCase()}`,
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.ACCOUNT_STATE,
      layoutType: LayoutType.LABEL,
      formValidations: validationLabel,
    };

    const attributeCurrency: IlayoutAttributeBuilder = {
      label: 'ach_currency',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.CURRENCY,
      layoutType: LayoutType.LABEL,
      placeholder: `${this.util.getLabelCurrency(account?.currency ?? '').toUpperCase()}`,
      formValidations: validationLabel,
    };


    const validationRequired = new RequiredMessageHandlerBuilder()
      .label('alias_required')
      .build();


    const validationAlias = new FormValidationsBuilder()
      .disable(false)
      .required(true)
      .validationMessageHandlerList([validationRequired])
      .build();

    const attributeAlias: IlayoutAttributeBuilder = {
      label: 'alias*',
      class: 'crud_third-input alias-edit',
      controlName: AttributeFormCrud.ALIAS,
      layoutType: LayoutType.INPUT,
      formValidations: validationAlias,
      placeholder: 'account_credit_alias',
      imaskOptions: {
        mask: /^[A-Za-z0-9-áéíóúÁÉÍÓÚ,. ]{0,60}$/,
      }
    };


    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email-sv')
      .build();

    const emailRequire = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator, emailRequire])
      .required(true)
      .build();

    const attributeUpdateFormEmail: IlayoutAttributeBuilder = {
      label: 'email*',
      placeholder: 'email',
      class: 'crud_third-input email-edit',
      controlName: AttributeFormCrud.EMAIL,
      layoutType: LayoutType.INPUT,
      imaskOptions: {
        mask: String,
        prepare: function (str) {
          return str.toLowerCase();
        },
      },
      formValidations: validationEmail
    };


    attributes.push(this.base.builderLayoutAttribute(attributeNumberAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeTypeAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeName));
    attributes.push(this.base.builderLayoutAttribute(attributeStateAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeCurrency));
    attributes.push(this.base.builderLayoutAttribute(attributeAlias));
    attributes.push(this.base.builderLayoutAttribute(attributeUpdateFormEmail));

    return new LayoutBuilder()
      .subtitle('title.edit_third_party_account')
      .title('transfers-third-title')
      .class('third-edit-layout padding-side')
      .attributes(attributes)
      .build();
  }

}
