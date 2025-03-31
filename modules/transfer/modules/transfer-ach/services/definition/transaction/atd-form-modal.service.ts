import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutModalBuilder,
  LayoutType, MinLengthMessageHandlerBuilder, RegexMessageHandlerBuilder
} from '@adf/components';
import { AttributeFormCrudAch } from '../../../enum/ach-crud-control-name.enum';

@Injectable({
  providedIn: 'root',
})
export class AtdFormModalService {
  buildFormModal() {
    const layoutAttributeList: ILayoutAttribute[] = [];

    const validationLegalNameAccount = new RegexMessageHandlerBuilder()
      .label('error:ach_name_invalid')
      .build();

    const nameMinLengthTransactionValidator = new MinLengthMessageHandlerBuilder()
      .label('error:ach_name_min_length')
      .build();

    const validationNameAccount = new FormValidationsBuilder()
      .required(true)
      .minLength(4)
      .regex('^[-a-zA-Z0-9ñÑ]+ [-a-zA-Z0-9ñÑ]+( [-a-zA-Z0-9ñÑ]+)*$')
      .validationMessageHandlerList([validationLegalNameAccount, nameMinLengthTransactionValidator])
      .build();

    const attributeNameAccount = new LayoutAttributeBuilder()
      .label('accountName')
      .class('v-inline')
      .placeholder('enter_name_of_account')
      .controlName(AttributeFormCrudAch.NAME)
      .imaskOptions({
        mask: /^.{0,22}x*$/
      })
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNameAccount)
      .build();
    layoutAttributeList.push(attributeNameAccount);

    const validationIdentifyAccount = new FormValidationsBuilder().required(true).build();

    const attributeIdentifyAccount = new LayoutAttributeBuilder()
      .label('identity_beneficiary')
      .class('v-inline')
      .placeholder('enter_identification_of_user')
      .controlName(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)
      .imaskOptions({
        mask: /^[a-zA-Z0-9]{0,18}$/
      })
      .layoutType(LayoutType.INPUT)
      .formValidations(validationIdentifyAccount)
      .build();
    layoutAttributeList.push(attributeIdentifyAccount);

    const validationAliasAccount = new FormValidationsBuilder().required(true).build();

    const attributeAliasAccount = new LayoutAttributeBuilder()
      .label('enter_alias')
      .class('v-inline')
      .placeholder('enter_alias')
      .controlName(AttributeFormCrudAch.ALIAS)
      .imaskOptions({
        mask: /^[a-zA-Z0-9\s]{0,25}$/
      })
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAliasAccount)
      .build();
    layoutAttributeList.push(attributeAliasAccount);

    return new LayoutModalBuilder()
      .attributes(layoutAttributeList)
      .title('title:update_data')
      .subtitle('description:update_data')
      .icon('sprint2-icon-warning')
      .build();
  }
}
