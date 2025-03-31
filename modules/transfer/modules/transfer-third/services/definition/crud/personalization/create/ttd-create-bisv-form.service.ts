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
import {AttributeFormCrud} from '../../../../../enums/third-transfer-control-name.enum';
import {IGetThirdTransferResponse} from '../../../../../interfaces/third-transfer-service';
import {IlayoutAttributeBuilder} from 'src/app/models/build.interface';
import {TtdBaseCrudService} from '../../base/ttd-base-crud.service';


@Injectable({
  providedIn: 'root'
})
export class TtdCreateBisvFormService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) {
  }

  buildCreateAccountLayout(account: IGetThirdTransferResponse): ILayout {

    const attributes: ILayoutAttribute[] = [];

    const validationLabel = new FormValidationsBuilder()
      .disable(true)
      .required(true)
      .build();

    const attributeNumberAccount: IlayoutAttributeBuilder = {
      label: 'account_number-ttr',
      class: 'third-layout crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NUMBER_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.account}`,
      formValidations: validationLabel,
    };


    const attributeTypeAccount: IlayoutAttributeBuilder = {
      label: 'account-type-sv',
      class: 'third-layout crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.TYPE_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: this.util.getLabelProduct(+account?.productType || 0).toUpperCase(),
      formValidations: validationLabel,
    };

    const attributeName: IlayoutAttributeBuilder = {
      label: 'ach-name',
      class: 'third-layout crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NAME_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.name ?? 'UNDEFINED'}`,
      formValidations: validationLabel,
    };


    const attributeStateAccount: IlayoutAttributeBuilder = {
      label: 'state',
      class: 'third-layout crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.ACCOUNT_STATE,
      layoutType: LayoutType.LABEL,
      formValidations: validationLabel,
      placeholder: `${this.util.getLabelStatus(account?.status ?? '').toUpperCase()}`,
    };

    const attributeCurrency: IlayoutAttributeBuilder = {
      label: 'ach_currency',
      class: 'third-layout crud_third-input disable v-inline input-uppercase-value',
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
      class: 'crud_third-input third-text alias-sv',
      controlName: AttributeFormCrud.ALIAS,
      layoutType: LayoutType.INPUT,
      placeholder: 'account_credit_alias',
      formValidations: validationAlias,
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


    const attributeEmail: IlayoutAttributeBuilder = {
      label: 'email*',
      class: 'crud_third-input email-sv',
      controlName: AttributeFormCrud.EMAIL,
      layoutType: LayoutType.INPUT,
      placeholder: 'email',
      formValidations: validationEmail,
      imaskOptions: {
        mask: String,
        prepare: function (str) {
          return str.toLowerCase();
        },
      }
    };

    attributes.push(this.base.builderLayoutAttribute(attributeNumberAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeTypeAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeName));
    attributes.push(this.base.builderLayoutAttribute(attributeStateAccount));
    attributes.push(this.base.builderLayoutAttribute(attributeCurrency));
    attributes.push(this.base.builderLayoutAttribute(attributeAlias));
    attributes.push(this.base.builderLayoutAttribute(attributeEmail));

    return new LayoutBuilder()
      .subtitle('add_third_party_account')
      .title('transfers-third-title')
      .class('third-crate-layout padding-side')
      .attributes(attributes)
      .build();
  }

}
