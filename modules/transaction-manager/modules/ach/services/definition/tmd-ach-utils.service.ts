import { Injectable } from '@angular/core';
import { AttributeReadingBuilder, IGroupAttributes } from '@adf/components';
import {
  ITMAtomicACHTransactionDetailVoucherParameters
} from '../../interfaces/tm-atomic-transaction-detail.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ETMLookUpAchTypeTransaction } from '../../enum/catalog.enum';
import { EACHServiceMapped } from '../../../../../transfer/enum/ach-transaction.enum';
import { IPrintData, PrintDataBuilder } from '../../../../../transfer/interface/print-data-interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TmdAchUtilsService {

  constructor(
    private utils: UtilService,
    private translate: TranslateService,
  ) { }

  buildDataForTargetAccount(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction: { typeTransaction } } = parameters;

    if (typeTransaction === ETMLookUpAchTypeTransaction.UNI) {
      return this.buildDataForAchUni(parameters);
    }

    if (typeTransaction === EACHServiceMapped.MOVIL_365) {
      return this.buildDataForAch365Movil(parameters);
    }

    return this.buildDataForAchUni(parameters);
  }

  private buildDataForAchUni(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction, className } = parameters;
    const {
      bankName,
      product,
      targetAccount,
      targetAccountName,
      comment,
      amount,
      currency,
    } = transaction;


    const groupTargetAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('tm:ach:title_group_target_account')
      .class('reading-text-uppercase col-md-12 group-title')
      .build();
    groupTargetAccount.attributes.push(attributePaymentTitle);

    const attributeBank = new AttributeReadingBuilder()
      .label('bank')
      .values([bankName])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeBank);

    const productName = String(this.utils.getLabelProduct(+product));
    const attributeProduct = new AttributeReadingBuilder()
      .label('type_account')
      .values([isNaN(+product) ? product : productName.toUpperCase()])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeProduct);

    const attributeAccount = new AttributeReadingBuilder()
      .label('account')
      .values([`${targetAccount} - ${targetAccountName}`])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeAccount);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    const attributeAmount = new AttributeReadingBuilder()
      .label('label.home.value')
      .values([`${currency} ${amount}`])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeAmount);

    return groupTargetAccount;
  }

  private buildDataForAch365Movil(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction, className } = parameters;
    const {
      bankName,
      targetAccount,
      targetAccountName,
      comment,
      amount,
      currency,
    } = transaction;


    const groupTargetAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('tm:ach:title_group_target_account')
      .class('reading-text-uppercase col-md-12 group-title')
      .build();
    groupTargetAccount.attributes.push(attributePaymentTitle);

    const attributeBank = new AttributeReadingBuilder()
      .label('bank')
      .values([bankName])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeBank);

    const attributeName = new AttributeReadingBuilder()
      .label('ac:365_label_beneficiary_name')
      .values([`${targetAccountName}`])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeName);

    const attributeAccount = new AttributeReadingBuilder()
      .label('m365:label_number_phone')
      .values([`${targetAccount}`])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeAccount);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([comment])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    const attributeAmount = new AttributeReadingBuilder()
      .label('label.home.value')
      .values([`${currency} ${amount}`])
      .class(className ?? '')
      .build();
    groupTargetAccount.attributes.push(attributeAmount);

    return groupTargetAccount;
  }


  /*===================================================== MODAL ====================================================-*/
  buildDataForTargetAccountModal(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction: { typeTransaction } } = parameters;

    if (typeTransaction === ETMLookUpAchTypeTransaction.UNI) {
      return this.buildDataForAchUniModal(parameters);
    }

    if (typeTransaction === EACHServiceMapped.MOVIL_365) {
      return this.buildDataForAch365MovilModal(parameters);
    }

    return this.buildDataForAchUniModal(parameters);
  }

  private buildDataForAchUniModal(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction } = parameters;

    const groupTargetAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('tm:ach:title_group_target_account')
      .class('col-md-12 head-title')
      .build();
    groupTargetAccount.attributes.push(attributePaymentTitle);

    const attributeBank = new AttributeReadingBuilder()
      .label('bank')
      .values([transaction.bankName])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeBank);

    const productName = String(this.utils.getLabelProduct(+transaction.product));
    const attributeProduct = new AttributeReadingBuilder()
      .label('type_account')
      .values([isNaN(+transaction.product) ? transaction.product : productName.toUpperCase()])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeProduct);

    const attributeAccount = new AttributeReadingBuilder()
      .label('account')
      .values([`${transaction.targetAccount} - ${transaction.targetAccountName}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeAccount);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([transaction.comment])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    const attributeAmount = new AttributeReadingBuilder()
      .label('label.home.value')
      .values([`${transaction.currency} ${transaction.amount}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeAmount);

    return groupTargetAccount;
  }

  private buildDataForAch365MovilModal(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction } = parameters;

    const groupTargetAccount: IGroupAttributes = {
      view: 'v-grid',
      attributes: [],
    };

    const attributePaymentTitle = new AttributeReadingBuilder()
      .label('tm:ach:title_group_target_account')
      .class('col-md-12 head-title')
      .build();
    groupTargetAccount.attributes.push(attributePaymentTitle);

    const attributeBank = new AttributeReadingBuilder()
      .label('bank')
      .values([transaction.bankName])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeBank);

    const attributeName = new AttributeReadingBuilder()
      .label('ac:365_label_beneficiary_name')
      .values([`${transaction.targetAccountName}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeName);

    const attributeAccount = new AttributeReadingBuilder()
      .label('m365:label_number_phone')
      .values([`${transaction.targetAccount}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeAccount);

    const attributeComment = new AttributeReadingBuilder()
      .label('comment')
      .values([transaction.comment])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeComment);

    const attributeAmount = new AttributeReadingBuilder()
      .label('label.home.value')
      .values([`${transaction.currency} ${transaction.amount}`])
      .class('content-voucher list-grid col-md-12')
      .build();
    groupTargetAccount.attributes.push(attributeAmount);

    return groupTargetAccount;
  }


  /*===================================================== PDF ====================================================-*/

  buildDataForTargetAccountPdf(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction: { typeTransaction } } = parameters;

    if (typeTransaction === ETMLookUpAchTypeTransaction.UNI) {
      return this.buildDataForAchUniPdf(parameters);
    }

    if (typeTransaction === EACHServiceMapped.MOVIL_365) {
      return this.buildDataForAch365MovilPdf(parameters);
    }

    return this.buildDataForAchUniPdf(parameters);
  }

  private buildDataForAchUniPdf(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction } = parameters;
    const {
      bankName,
      product,
      targetAccount,
      targetAccountName,
      comment,
      amount,
      currency,
    } = transaction;

    const attributes: Array<IPrintData> = [];
    const attributePaymentTitle = new PrintDataBuilder()
      .label('tm:ach:title_group_target_account')
      .title(true)
      .build();
    attributes.push(attributePaymentTitle);

    const attributeBank = new PrintDataBuilder()
      .label('bank')
      .value(bankName)
      .build();
    attributes.push(attributeBank);

    const productName = String(this.utils.getLabelProduct(+product));
    const attributeProduct = new PrintDataBuilder()
      .label('type_account')
      .value(isNaN(+product) ? product : productName.toUpperCase())
      .build();
    attributes.push(attributeProduct);

    const attributeAccount = new PrintDataBuilder()
      .label('account')
      .value(`${targetAccount} ${targetAccountName}`)
      .build();
    attributes.push(attributeAccount);

    const attributeComment = new PrintDataBuilder()
      .label('comment')
      .value(comment)
      .build();
    attributes.push(attributeComment);

    const attributeAmount = new PrintDataBuilder()
      .label('label.home.value')
      .value(`${currency} ${amount}`)
      .build();
    attributes.push(attributeAmount);

    return attributes;
  }

  private buildDataForAch365MovilPdf(parameters: ITMAtomicACHTransactionDetailVoucherParameters) {
    const { transaction } = parameters;
    const {
      bankName,
      targetAccount,
      targetAccountName,
      comment,
      amount,
      currency,
    } = transaction;

    const attributes: Array<IPrintData> = [];
    const attributePaymentTitle = new PrintDataBuilder()
      .label('tm:ach:title_group_target_account')
      .title(true)
      .build();
    attributes.push(attributePaymentTitle);

    const attributeBank = new PrintDataBuilder()
      .label('bank')
      .value(bankName)
      .build();
    attributes.push(attributeBank);

    const attributeName = new PrintDataBuilder()
      .label('ac:365_label_beneficiary_name')
      .value(targetAccountName)
      .build();
    attributes.push(attributeName);

    const attributeAccount = new PrintDataBuilder()
      .label('m365:label_number_phone')
      .value(`${targetAccount}`)
      .build();
    attributes.push(attributeAccount);

    const attributeComment = new PrintDataBuilder()
      .label('comment')
      .value(comment)
      .build();
    attributes.push(attributeComment);

    const attributeAmount = new PrintDataBuilder()
      .label('label.home.value')
      .value(`${currency} ${amount}`)
      .build();
    attributes.push(attributeAmount);

    return attributes;
  }

  getServiceName(service: string) {
    const mapped = {
      [EACHServiceMapped.NORMAL_365]: this.translate.instant('ach:label_365_serviceName'),
      [EACHServiceMapped.MOVIL_365]: this.translate.instant('ach:label_365movil_serviceName'),
      [EACHServiceMapped.SIPA]: this.translate.instant('ach:label_365sipa_serviceName'),
    }

    return mapped[service] ?? service;
  }

}
