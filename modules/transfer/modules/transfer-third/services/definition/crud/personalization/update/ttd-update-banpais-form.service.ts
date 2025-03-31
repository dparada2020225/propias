import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/service/common/util.service';
import { IThirdTransfersAccounts } from '../../../../../../../interface/transfer-data-interface';
import { AttributeFormCrud } from '../../../../../enums/third-transfer-control-name.enum';
import { TtdBaseCrudService } from '../../base/ttd-base-crud.service';
import { IlayoutAttributeBuilder } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class TTDUpdateFormService {

  constructor(
    private util: UtilService,
    private base: TtdBaseCrudService
  ) { }

  buildUpdateAccountLayout(account: IThirdTransfersAccounts): ILayout {

    const attributes: ILayoutAttribute[] = [];
    const validationNumberAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeNumberAccount: IlayoutAttributeBuilder = {
      label: 'account-number',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NUMBER_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.account ?? 'UNDEFINED'}`,
      formValidations: validationNumberAccount,
    };

    const validationTypeAccount = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeTypeAccount: IlayoutAttributeBuilder = {
      label: 'root-account-type',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.TYPE_ACCOUNT,
      layoutType: LayoutType.LABEL,
      placeholder: `${account?.productLabel ?? 'UNDEFINED'}`,
      formValidations: validationTypeAccount,
    };

    const validationName = new FormValidationsBuilder()
      .disable(true)
      .build();

    const attributeName: IlayoutAttributeBuilder = {
      label: 'ach-name',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.NAME_ACCOUNT,
      layoutType: LayoutType.LABEL,
      formValidations: validationName,
      placeholder: `${account?.name ?? 'UNDEFINED'}`,
    };

    const validationStateAccount = new FormValidationsBuilder()
      .disable(true)
      .build();


    const attributeStateAccount: IlayoutAttributeBuilder = {
      label: 'state',
      placeholder: `${this.util.getLabelStatus(account?.status ?? '')}`,
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.ACCOUNT_STATE,
      layoutType: LayoutType.LABEL,
      formValidations: validationStateAccount,
    };

    const validationCurrency = new FormValidationsBuilder()
      .disable(true)
      .build();


    const attributeCurrency: IlayoutAttributeBuilder = {
      label: 'ach_currency',
      class: 'crud_third-input disable v-inline input-uppercase-value',
      controlName: AttributeFormCrud.CURRENCY,
      layoutType: LayoutType.LABEL,
      placeholder: `${this.util.getLabelCurrency(account?.currency ?? '').toUpperCase()}`,
      formValidations: validationCurrency,
    };

    const validationAlias = new FormValidationsBuilder()
      .required(true)
      .build();

    const attributeAlias: IlayoutAttributeBuilder = {
      label: 'account_credit_alias',
      class: 'crud_third-input ',
      controlName: AttributeFormCrud.ALIAS,
      layoutType: LayoutType.INPUT,
      formValidations: validationAlias,
      placeholder: 'account_credit_alias',
    };


    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator])
      .build();

    const attributeUpdateFormEmail: IlayoutAttributeBuilder = {
      label: 'email',
      placeholder: 'email',
      class: 'crud_third-input',
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
