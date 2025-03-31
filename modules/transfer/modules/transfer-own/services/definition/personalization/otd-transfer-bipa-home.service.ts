import { Injectable } from '@angular/core';
import { OtdTransferBaseHomeService } from '../base/otd-transfer-base-home.service';
import { ILayout, ILayoutAttribute, RequiredMessageHandlerBuilder, TooltipBuilder, FormValidationsBuilder, LayoutAttributeBuilder, LayoutType, LayoutBuilder } from '@adf/components';
import { IBasicAttribute } from 'src/app/models/build.interface';
import { AttributeFormTransferOwn } from '../../../enum/own-transfer-control-name.enum';
import { IOTDForm } from '../../../interfaces/own-transfer-definition.interface';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBipaHomeService {

  constructor(private baseHome: OtdTransferBaseHomeService) { }

  builderOwnTransferLayout(form: IOTDForm): ILayout {
    let layoutAttributeList: ILayoutAttribute[] = [];

    const attributeAccountDebited: IBasicAttribute =  {
      label: 'debit-from',
      placeholder: 'select_account',
      class: 'grid-item-x-6'
    }

    const attributeAccountCredit: IBasicAttribute = {
      label: 'credit-to',
      placeholder: 'select_account',
      class: 'grid-item-x-6'
    };



    const attributeComment: IBasicAttribute = {
      label: 'comment',
      placeholder: 'comment-transition'
    };
    layoutAttributeList.push(this.baseHome.builderAttributeAccountDebited(attributeAccountDebited));
    layoutAttributeList.push(this.baseHome.buildAttributeAccountCredit(attributeAccountCredit));

    const requiredValidation = new RequiredMessageHandlerBuilder()
      .label('required_amount')
      .build();

    const tooltipAmount = new TooltipBuilder()
      .icon('banca-regional-pregunta')
      .label('tooltip-sv')
      .build();

    const formAmountValidators = new FormValidationsBuilder()
      .required(true)
      .minLength(0)
      .validationMessageHandlerList([requiredValidation])
      .build();

    const attributeAmount = new LayoutAttributeBuilder()
      .label('amount')
      .placeholder('amount_to_be_debited')
      .class('amount')
      .tooltip(tooltipAmount)
      .controlName(AttributeFormTransferOwn.AMOUNT)
      .layoutType(LayoutType.INPUT)
      .formValidations(formAmountValidators)
      .build();

    layoutAttributeList.push(attributeAmount);
    layoutAttributeList.push(this.baseHome.builderAttributeComment(attributeComment));

    return new LayoutBuilder()
      .title(form?.title)
      .subtitle(form?.subtitle)
      .class('container-form padding-side')
      .attributes(layoutAttributeList)
      .build();
  }
}

