import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder, LayoutBuilder, LayoutType,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { EAMS365FormControl } from '../../enum/form-control.enum';

@Injectable({
  providedIn: 'root'
})
export class AmdS365CreateFormService {

  constructor() { }

  buildFormLayout(): ILayout {
    const LayoutAttributeList: ILayoutAttribute[] = [];

    const requiredMessage = new RequiredMessageHandlerBuilder()
      .label('payroll:field_required')
      .build();

    const validationAttributeRequired = new FormValidationsBuilder()
      .required(true)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeTypeCustomer = new LayoutAttributeBuilder()
      .label('tm365:label_type_person')
      .placeholder('label_select_and_option')
      .controlName(EAMS365FormControl.TYPE_CLIENT)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeTypeCustomer);

    const validationAttributeName = new FormValidationsBuilder()
      .required(true)
      .maxLength(21)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeName = new LayoutAttributeBuilder()
      .label('ac:s365:label_name_beneficiary')
      .placeholder('ac:s365:placeholder_name')
      .class('grid-item-md-6')
      .controlName(EAMS365FormControl.NAME)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeName)
      .build();
    LayoutAttributeList.push(attributeName);

    const validationNoIdentify = new FormValidationsBuilder()
      .required(true)
      .maxLength(18)
      .validationMessageHandlerList([requiredMessage])
      .build();

    const attributeIdentify = new LayoutAttributeBuilder()
      .label('ac:s365:label_document_number_beneficiary')
      .placeholder('ac:placeholder_identify')
      .class('grid-item-md-6')
      .controlName(EAMS365FormControl.IDENTIFY_NUMBER)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationNoIdentify)
      .build();
    LayoutAttributeList.push(attributeIdentify);

    const attributeAddress = new LayoutAttributeBuilder()
      .label('ac:s365:label_address_beneficiary')
      .placeholder('ac:s365:placeholder_address')
      .class('grid-item-md-6')
      .controlName(EAMS365FormControl.ADDRESS_BENEFICIARY)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeAddress);

    const attributeCityOfBeneficiary = new LayoutAttributeBuilder()
      .label('ac:s365:label_city_beneficiary')
      .placeholder('ac:s365:placeholder_city')
      .class('grid-item-md-6')
      .controlName(EAMS365FormControl.CITY)
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeCityOfBeneficiary);

    const attributeCountry = new LayoutAttributeBuilder()
      .label('ac:s365:label_target_country')
      .placeholder('label_select_and_option')
      .controlName(EAMS365FormControl.COUNTRY)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeCountry);

    const attributeBank = new LayoutAttributeBuilder()
      .label('target-bank')
      .placeholder('label_select_and_option')
      .controlName(EAMS365FormControl.BANK)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeBank);

    const attributeTypeAccount = new LayoutAttributeBuilder()
      .label('type_account')
      .placeholder('label_select_and_option')
      .controlName(EAMS365FormControl.PRODUCT)
      .layoutType(LayoutType.SELECT)
      .class('grid-item-md-6')
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeTypeAccount);

    const attributeNumberAccount = new LayoutAttributeBuilder()
      .label('ac:s365:label_account_beneficiary')
      .placeholder('ac:placeholder_number_account')
      .class('grid-item-md-6')
      .controlName(EAMS365FormControl.NUMBER_ACCOUNT)
      .imaskOptions({ mask: /^[a-zA-Z0-9\sñÑ]*$/ })
      .layoutType(LayoutType.INPUT)
      .formValidations(validationAttributeRequired)
      .build();
    LayoutAttributeList.push(attributeNumberAccount);

    return new LayoutBuilder()
      .attributes(LayoutAttributeList)
      .build();
  }
}
