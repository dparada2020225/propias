import {
  AdfFormatService,
  AttributeReadingBuilder,
  DataReadingBuilder,
  FormValidationsBuilder,
  IDataReading,
  IGroupAttributes,
  ILayout,
  ILayoutAttribute,
  LayoutAttributeBuilder,
  LayoutBuilder,
  LayoutType,
  RegexMessageHandlerBuilder,
  RequiredMessageHandlerBuilder
} from '@adf/components';
import { Injectable } from '@angular/core';
import { AttributeFormThirdPartyLoansCrud } from '../../../enum/third-party-loans-control-name.enum';
import { IDataPayment } from '../../../interfaces/crud/crud-third-party-loans-interface';
import { UtilService } from '../../../../../../../service/common/util.service';
import { UtilWorkFlowService } from '../../../../../../../service/common/util-work-flow.service';
import { IUserDataTransaction } from '../../../../../../../models/util-work-flow.interface';

@Injectable({
  providedIn: 'root'
})
export class TpldConfirmPaymentService {

  constructor(
    private util: UtilService,
    private formatService: AdfFormatService,
    private utilWorkFlow: UtilWorkFlowService,


  ) { }

  builderLayoutConfirmation(data: IDataPayment, amountToDebit: string): IDataReading {


    const groupList: IGroupAttributes[] = [];

    const groupGrid: IGroupAttributes = {
      view: 'v-grid',
      attributes: []
    };

    //ACCOUNT DEBITED

    const userDataDebited: IUserDataTransaction = {
      account: data.loanDetailToPayment.accountDebited.account,
      alias: data.loanDetailToPayment.accountDebited.alias as string,
      name: data.loanDetailToPayment.accountDebited.name,
      currency: data.loanDetailToPayment.accountDebited.currency,
      product: data.loanDetailToPayment.accountDebited.product
    };

    const userAccountDebited = this.utilWorkFlow.getUserDataTransaction(userDataDebited);

    const attributeAccountDebited = new AttributeReadingBuilder()
      .label('account_to_be_debited')
      .values(userAccountDebited)
      .build();

    groupGrid.attributes.push(attributeAccountDebited);


    //NUMBER AND NAME LOAN TO PAY

    const userDataLoan: IUserDataTransaction = {
      account: data.loanDetailToPayment.identifierLoan,
      alias: data.loanDetailToPayment.detailLoan.alias as string,
      name: data.loanDetailToPayment.detailLoan.loanName,
      currency: data.loanDetailToPayment.currencyLoan as string,
      product: data.loanDetailToPayment.accountDebited.product

    };

    const userLoanDetail = this.utilWorkFlow.getUserDataTransaction(userDataLoan);


    const attributeNumberLoanPayment = new AttributeReadingBuilder()
      .label('no_loans_payment')
      .values(userLoanDetail)
      .build();

    groupGrid.attributes.push(attributeNumberLoanPayment);

    //MOUNT TO DEBIT

    const attributeAmountDebited = new AttributeReadingBuilder()
      .label('amount_to_be_debited')
      .values([`${this.util.getCurrencySymbolToIso(data.loanDetailToPayment.currencyLoan!)} ${this.formatService.formatAmount(amountToDebit)}`])
      .build();

    groupGrid.attributes.push(attributeAmountDebited);

    groupList.push(groupGrid);

    return new DataReadingBuilder()
      .title('payments_loans')
      .subtitle('confirmation_paymentTPL')
      .class('padding-side confirmation_payment')
      .groupList(groupList)
      .build();
  }

  builderConfirmPaymentLayout(): ILayout {
    let LayoutAttributeList: ILayoutAttribute[] = [];

    //EMAIL
    const emailValidator = new RegexMessageHandlerBuilder()
      .label('error_email')
      .build();

    const emailRequire = new RequiredMessageHandlerBuilder()
      .label('require_email')
      .build();

    const validationEmail = new FormValidationsBuilder()
      .regex("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}")
      .validationMessageHandlerList([emailValidator, emailRequire])
      .build();

    const attributeEmail = new LayoutAttributeBuilder()
      .label('notify_to')
      .placeholder('email')
      .controlName(AttributeFormThirdPartyLoansCrud.EMAIL)
      .layoutType(LayoutType.INPUT)
      .imaskOptions(this.util.buildMaskToEmailField())
      .class('text-color-tpl')
      .formValidations(validationEmail)
      .build();

    LayoutAttributeList.push(attributeEmail);


    //COMMENT
    const patternValidation = new RegexMessageHandlerBuilder()
      .label('characters_invalid')
      .build();

    const formComment = new FormValidationsBuilder()
      .maxLength(60)
      .regex('^[A-Za-z0-9-áéíóúñ,. ]+$')
      .validationMessageHandlerList([patternValidation])
      .build();

    const attributeComment = new LayoutAttributeBuilder()
      .label('comment')
      .placeholder('enter-your-comment')
      .controlName(AttributeFormThirdPartyLoansCrud.COMMENT)
      .layoutType(LayoutType.TEXTAREA)
      .formValidations(formComment)
      .build();


    LayoutAttributeList.push(attributeComment);

    return new LayoutBuilder()
      .class('container-form padding-side')
      .attributes(LayoutAttributeList)
      .build();
  }

}
