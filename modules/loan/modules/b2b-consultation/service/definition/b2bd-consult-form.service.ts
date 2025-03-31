import { Injectable } from '@angular/core';
import {
  FormValidationsBuilder, ILayout, ILayoutAttribute, IValidationMessageHandler,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType, PositionValidationMessages,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { AttributeB2BConsultation } from '../../enum/b2b-consultation-control-name.enum';

@Injectable({
  providedIn: 'root'
})
export class B2bdConsultFormService {
  builderFormLayout(): ILayout {
    const layoutB2BConsultationAttributes: ILayoutAttribute[] = [];
    const validationsMessageList: IValidationMessageHandler[] = [];

    const requiredMessageBuilder = new RequiredMessageHandlerBuilder()
      .position(PositionValidationMessages.UP)
      .build();

    validationsMessageList.push(requiredMessageBuilder);

    const formAccountList = new FormValidationsBuilder()
      .validationMessageHandlerList(validationsMessageList)
      .required(true)
      .build();

    const attributesAccountList = new LayoutAttributeBuilder()
      .label('selected-account')
      .placeholder('selected-an-account')
      .class('grid-item-x-6')
      .controlName(AttributeB2BConsultation.B2B_ACCOUNT)
      .formValidations(formAccountList)
      .layoutType(LayoutType.SELECT)
      .build();


    layoutB2BConsultationAttributes.push(attributesAccountList);


    return new LayoutBuilder()
      .title('b2b')
      .subtitle('b2b-consultion')
      .class('container-form padding-side container-b2b-consultation')
      .attributes(layoutB2BConsultationAttributes)
      .build();
  }
}
