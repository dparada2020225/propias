import {
  AdfFormatService,
  DataLayoutSelectBuilder,
  FormValidationsBuilder,
  IDataLayoutSelect,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder,
  ValidationMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { IBasicAttribute } from 'src/app/models/build.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { AttributeFormTransferOwn } from '../../../enum/own-transfer-control-name.enum';
import { IOwnAccount } from '../../../interfaces/own-transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class OtdTransferBaseHomeService {

  constructor(
    private formatService: AdfFormatService,
    private util: UtilService
    ) {}

    builderAttributeAccountDebited(data: IBasicAttribute): ILayoutAttribute {
      const formAccountDebited = new FormValidationsBuilder()
      .required(true)
      .build();

    return new LayoutAttributeBuilder()
        .label(data.label)
        .placeholder(data.placeholder!)
        .class(data.class!)
        .controlName(AttributeFormTransferOwn.ACCOUNT_DEBITED)
        .layoutType(LayoutType.SELECT)
        .formValidations(formAccountDebited)
        .build();
    }

    buildAttributeAccountCredit(data: IBasicAttribute): ILayoutAttribute {
      const accounCreditValidation = new ValidationMessageHandlerBuilder()
        .validationType('itIsTheSameAccount')
        .label('select_another_account')
        .build();

      const formAccountAccredit = new FormValidationsBuilder()
        .required(true)
        .validationMessageHandlerList([accounCreditValidation])
        .build();

    return new LayoutAttributeBuilder()
        .label(data.label)
        .placeholder(data.placeholder!)
        .class(data.class!)
        .controlName(AttributeFormTransferOwn.ACCOUNT_ACCREDIT)
        .layoutType(LayoutType.SELECT)
        .formValidations(formAccountAccredit)
        .build();
    }

    builderAttributeAmount(data: IBasicAttribute): ILayoutAttribute {
      const requiredValidation = new RequiredMessageHandlerBuilder()
        .label('required_amount')
        .build();

      const formAmount = new FormValidationsBuilder()
        .required(true)
        .minLength(0)
        .validationMessageHandlerList([requiredValidation])
        .build();

    return new LayoutAttributeBuilder()
        .label(data.label)
        .placeholder(data.placeholder!)
        .class(data.class!)
        .controlName(AttributeFormTransferOwn.AMOUNT)
        .layoutType(LayoutType.INPUT)
        .formValidations(formAmount)
        .build();
    }

    builderAttributeComment(data: IBasicAttribute): ILayoutAttribute {
      const patternValidation = new RegexMessageHandlerBuilder()
        .label('characters_invalid')
        .build();

      const formComment = new FormValidationsBuilder()
        .maxLength(60)
        .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
        .validationMessageHandlerList([patternValidation])
        .build();

    return new LayoutAttributeBuilder()
        .label(data.label)
        .placeholder(data.placeholder!)
        .controlName(AttributeFormTransferOwn.COMMENT)
        .layoutType(LayoutType.TEXTAREA)
        .formValidations(formComment)
        .build();
    }

    buildDebitedAccountSelectAttributes(account: IOwnAccount): IDataLayoutSelect[] {

      const accountDebitedDataSelectList: IDataLayoutSelect[] = [];

      const accountNameDataSelect = new DataLayoutSelectBuilder()
        .label('account-name')
        .value(account?.name ?? '')
        .build();

      const availableDataSelect = new DataLayoutSelectBuilder()
        .label('available')
        .value(`${this.util.geCurrencSymbol(account?.currency ?? '')} ${this.formatService.formatAmount(account?.availableAmount ?? '')}`)
        .build();

      accountDebitedDataSelectList.push(accountNameDataSelect);
      accountDebitedDataSelectList.push(availableDataSelect);

      return accountDebitedDataSelectList;
    }

    buildCreditAccountSelectAttributes(account: IOwnAccount): IDataLayoutSelect[] {
      const accountCreditDataSelectList: IDataLayoutSelect[] = [];
      const accountCreditNameDataSelect = new DataLayoutSelectBuilder()
        .label('account-name')
        .value(account?.name ?? '')
        .build();

      accountCreditDataSelectList.push(accountCreditNameDataSelect);
      return accountCreditDataSelectList
    }

}
