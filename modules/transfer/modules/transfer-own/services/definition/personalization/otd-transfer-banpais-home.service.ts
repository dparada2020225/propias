import { ILayout, ILayoutAttribute, LayoutBuilder } from '@adf/components';
import { Injectable } from '@angular/core';
import { IOTDForm } from '../../../interfaces/own-transfer-definition.interface';
import { OtdTransferBaseHomeService } from '../base/otd-transfer-base-home.service';
import { IBasicAttribute } from 'src/app/models/build.interface';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBanpaisHomeService {

  constructor(private baseHome: OtdTransferBaseHomeService) { }

  builderOwnTransferLayout(form: IOTDForm): ILayout {
    let layoutAttributeList: ILayoutAttribute[] = [];

    const attributeAccountDebited: IBasicAttribute =  {
      label: 'debit-from',
      placeholder: 'select-account-debit',
      class: 'grid-item-x-6'
    }

    const attributeAccountCredit: IBasicAttribute = {
      label: 'credit-to',
      placeholder: 'select-credit-account',
      class: 'grid-item-x-6'
    };

    const attributeAmount: IBasicAttribute = {
      label: 'amount_to_be_debited',
      placeholder: 'amount_to_be_debited',
      class: 'amount'
    };

    const attributeComment: IBasicAttribute = {
      label: 'comment',
      placeholder: 'enter-your-comment'
    };

    layoutAttributeList.push(this.baseHome.builderAttributeAccountDebited(attributeAccountDebited));
    layoutAttributeList.push(this.baseHome.buildAttributeAccountCredit(attributeAccountCredit));
    layoutAttributeList.push(this.baseHome.builderAttributeAmount(attributeAmount));
    layoutAttributeList.push(this.baseHome.builderAttributeComment(attributeComment));

    return new LayoutBuilder()
      .title(form?.title)
      .subtitle(form?.subtitle)
      .class('container-form padding-side')
      .attributes(layoutAttributeList)
      .build();
  }
}
