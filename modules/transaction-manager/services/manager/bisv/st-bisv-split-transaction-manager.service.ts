import { Injectable } from '@angular/core';
import {
  ITMRequestDetailACHBiesTransaction,
  ITMRequestDetailACHSipaBiesTransaction
} from '../../../interfaces/transaction-manager-bies.interface';
import { UtilService } from '../../../../../service/common/util.service';
import { EACHBiesTypeService } from '../../../../transfer/enum/ach-transaction.enum';
import {
  IStAchUniTransactionDetail
} from '../../../../transfer/modules/transfer-ach-uni-multiple/interfaces/st-uni-operations.interface';

@Injectable({
  providedIn: 'root'
})
export class StBisvSplitTransactionManagerService {

  constructor(
    private utils: UtilService,
  ) { }

  getTransactionDetailForACHInBiesProfile(request: string): ITMRequestDetailACHBiesTransaction {
    const sourceProduct = this.utils.substr(request, 0, 2).trim();
    const sourceSubProduct = this.utils.substr(request, 2, 2).trim();
    const sourceAccount = this.utils.substr(request, 4, 12).trim();
    const sourceCurrency = this.utils.substr(request, 16, 3).trim();
    const sourceAmount = this.utils.substr(request, 19, 13).trim();
    const sourceAmountParsed = this.parsedAmount(sourceAmount);

    const codeBank = this.utils.substr(request, 32, 4).trim();
    const targetProduct = this.utils.substr(request, 36, 2).trim();
    const targetAccount = this.utils.substr(request, 38, 17).trim();
    const targetCurrency = this.utils.substr(request, 55, 3).trim();
    const targetAmount = this.utils.substr(request, 58, 13).trim();
    const comment = this.utils.substr(request, 71, 60).trim();
    const originalTransaction = this.utils.substr(request, 131, 12).trim();

    const numLote = this.utils.substr(request, 143, 10).trim();
    const typeService = this.utils.substr(request, 153, 3).trim();
    const targetIdentify = this.utils.substr(request, 156, 20).trim();

    const sourceCurrency2 = this.utils.substr(request, 176, 3).trim();
    const sourceAlias = this.utils.substr(request, 179, 50).trim();
    const sourceAccountDescription = this.utils.substr(request, 229, 50).trim();

    const targetAccountName = this.utils.substr(request, 279, 22).trim();
    const targetBankName = this.utils.substr(request, 301, 60).replace(/^0+/, '').trim();
    const targetAccountStatus = this.utils.substr(request, 361, 1).trim();
    const targetProduct2 = this.utils.substr(request, 362, 2).trim();
    const targetDateCrated = this.utils.substr(request, 364, 8).trim();
    const targetUserCreated = this.utils.substr(request, 372, 25).trim();
    const targetDateModify = this.utils.substr(request, 397, 8).trim();
    const targetUserModify = this.utils.substr(request, 405, 25).trim();
    const targetEmail = this.utils.substr(request, 430, 80).trim();
    const targetAccount2 = this.utils.substr(request, 510, 25).trim();

    const bankInternalCode = this.utils.substr(request, 535, 2).trim();
    const descriptionTypeAccount = this.utils.substr(request, 537, 35).trim();
    const proposalCode = this.utils.substr(request, 572, 4).trim();
    const codeTypeOperation365Business = this.utils.substr(request, 576, 5).trim();
    const descriptionTypeOperation365Business = this.utils.substr(request, 581, 50).trim();
    const codeTypeOperationOriginal365Business = this.utils.substr(request, 661, 3).trim();
    const codeTypePayment365Business = this.utils.substr(request, 664, 6).trim();
    const descriptionTypePayment365Business = this.utils.substr(request, 670, 50).trim();
    const commission = this.utils.substr(request, 720, 4).trim();
    const uniCommission = this.utils.substr(request, 690, 4).trim();
    const UniCommissionParsed = this.parseUniCommission(uniCommission).trim();
    const typeACH = EACHBiesTypeService[typeService] ?? typeService;

    return {
      uniCommission,
      UniCommissionParsed,
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
      sourceAmountParsed,
      codeBank,
      targetProduct,
      targetAccount,
      targetCurrency,
      targetAmount,
      comment,
      originalTransaction,
      numLote,
      typeService,
      targetIdentify,
      sourceCurrency2,
      sourceAlias,
      sourceAccountDescription,
      targetAccountName,
      targetBankName,
      targetAccountStatus,
      targetProduct2,
      targetDateCrated,
      targetUserCreated,
      targetDateModify,
      targetUserModify,
      targetEmail,
      targetAccount2,
      bankInternalCode,
      descriptionTypeAccount,
      proposalCode,
      codeTypeOperation365Business,
      descriptionTypeOperation365Business,
      codeTypeOperationOriginal365Business,
      codeTypePayment365Business,
      descriptionTypePayment365Business,
      commission,
      typeACH,
    }
  }

  getTransactionDetailForSipaInBiesProfile(request: string): ITMRequestDetailACHSipaBiesTransaction {
    const sourceProduct = this.utils.substr(request, 0, 2).trim();
    const sourceSubProduct = this.utils.substr(request, 2, 2).trim();
    const sourceAccount = this.utils.substr(request, 4, 25).trim();
    const sourceCurrency = this.utils.substr(request, 29, 3).trim();

    const bankCode = this.utils.substr(request, 45, 4).trim();
    const targetProduct = this.utils.substr(request, 49, 2).trim();
    const targetAccount = this.utils.substr(request, 51, 25).trim();
    const targetCurrency = this.utils.substr(request, 76, 3).trim();
    const sourceAmount = this.utils.substr(request, 79, 13).trim();
    const sourceAmountParsed = this.parsedAmount(sourceAmount).trim();

    const comment = this.utils.substr(request, 92, 60).trim();
    const numLote = this.utils.substr(request, 152, 12).trim();
    const originalTransaction = this.utils.substr(request, 164, 10).trim();
    const typeService = this.utils.substr(request, 174, 3).trim();
    const valueUnknown = this.utils.substr(request, 177, 20).trim();
    const reasonCode = this.utils.substr(request, 197, 12).trim();
    const countryCode = this.utils.substr(request, 209, 2).trim();


    return {
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
      sourceAmountParsed,
      targetAccount,
      targetCurrency,
      comment,
      originalTransaction,
      numLote,
      typeService,
      countryCode,
      valueUnknown,
      reasonCode,
      bankCode,
      targetProduct,
    }
  }

  getDetailTransactionPaymentOfPayroll(request: string) {
    const sourceAccountNumber = request.substring(0, 25).trim();
    const countAccounts = request.substring(25, 30).replace(/^0+/, '').trim();
    const amount = request.substring(30, 43);
    const user = request.substring(43, 68);
    const typeSignature = request.substring(68, 69);
    const principalClient = request.substring(69, 89);
    const authorization = request.substring(89, 96);
    const nameFile = request.substring(96, 108);
    const template = request.substring(108, 109);
    const selectedTime = request.substring(109, 112);
    const datePayment = request.substring(112, 120);
    const typeLoad = request.substring(120, 121);
    const authorization2 = request.substring(121, 133);
    const currency = request.substring(133, 136).trim();
    const alias = request.substring(136, 186);
    const productDescription = request.substring(186, 236).trim();
    const createdDate = request.substring(236, 246);
    const hourCreate = request.substring(246, 254);
    const datePayment2 = request.substring(254, 264);
    const hourPayment = request.substring(264, 272);
    const idx = request.substring(272, 284);
    const currentAmount = request.substring(30, 41).replace(/^0+/, '');



    return {
      sourceAccountNumber,
      countAccounts,
      amount,
      user,
      typeSignature,
      principalClient,
      authorization,
      nameFile,
      template,
      selectedTime,
      datePayment,
      typeLoad,
      authorization2,
      currency,
      alias,
      productDescription,
      createdDate,
      hourCreate,
      datePayment2,
      hourPayment,
      idx,
      currentAmount
    };
  }

  getDetailTransactionForInfoTreasuryPaymentNPE(request: string) {
    const indicatorOk = this.utils.substr(request, 0, 1);
    const authorization = this.utils.substr(request, 1, 7);
    const sequence1 = this.utils.substr(request, 8, 3);
    const sequence2 = this.utils.substr(request, 11, 7);
    const dayOperation = this.utils.substr(request, 18, 2);
    const monthOperation = this.utils.substr(request, 20, 2);
    const yearOperation = this.utils.substr(request, 22, 4);
    const hourOperation = this.utils.substr(request, 26, 6);
    const transactionToJteller = this.utils.substr(request, 32, 4);

    return {
      indicatorOk,
      authorization,
      sequence1,
      sequence2,
      dayOperation,
      monthOperation,
      yearOperation,
      hourOperation,
      transactionToJteller,
    }
  }

  getDetailTransactionForTreasuryPaymentNPE(request: string) {
    const sourceAccountProduct = this.utils.substr(request, 0, 2);
    const sourceAccountSubProduct = this.utils.substr(request, 2, 2);
    const sourceAccountCurrency = this.utils.substr(request, 4, 3);
    const sourceAccount = this.utils.substr(request, 7, 25);
    const currency = this.utils.substr(request, 32, 13);
    const locationCode = this.utils.substr(request, 45, 4);
    const dueDate = this.utils.substr(request, 49, 8);
    const paymentAmount = this.utils.substr(request, 57, 13);
    const wilCard = this.utils.substr(request, 70, 1);
    const reference = this.utils.substr(request, 71, 10);
    const digitCode = this.utils.substr(request, 81, 1);
    const npe = this.utils.substr(request, 82, 34);

    return {
      sourceAccountProduct,
      sourceAccountSubProduct,
      sourceAccountCurrency,
      sourceAccount,
      currency,
      locationCode,
      dueDate,
      paymentAmount,
      wilCard,
      reference,
      digitCode,
      npe
    }
  }

  getDetailTransactionPaymentAFPCrecerNPE(request: string) {
    const gln = this.utils.substr(request, 0, 4);
    const total = this.utils.substr(request, 4, 9);
    const zero = this.utils.substr(request, 13, 1);
    const employInternalCode = this.utils.substr(request, 14, 7);
    const paymentPeriod = this.utils.substr(request, 21, 6);
    const npeCorrelative = this.utils.substr(request, 27, 3);
    const lastDatePayment = this.utils.substr(request, 30, 8);
    const npeValidator = this.utils.substr(request, 38, 1);
    const account = this.utils.substr(request, 39, 25);
    const transactionCode = this.utils.substr(request, 64, 3);
    const nit = this.utils.substr(request, 67, 20);
    const amountParsed = this.parseSpecialAmount2(total);
    const npe = this.utils.substr(request, 0, 39);
    const dateParsed = this.parseDateEng(lastDatePayment);

    return {
      gln,
      npe,
      dateParsed,
      total,
      zero,
      employInternalCode,
      paymentPeriod,
      npeCorrelative,
      lastDatePayment,
      npeValidator,
      account,
      transactionCode,
      nit,
      amountParsed,
    }
  }

  getDetailTransactionPaymentAFPCrecerNPESG1(request: string) {
    const gln = this.utils.substr(request, 0, 4);
    const total = this.utils.substr(request, 4, 10);
    const lastDatePayment = this.utils.substr(request, 14, 8);
    const zero = this.utils.substr(request, 22, 1);
    const paymentPeriod = this.utils.substr(request, 23, 6);
    const npeCorrelative = this.utils.substr(request, 29, 8);
    const npeValidator = this.utils.substr(request, 37, 1);
    const account = this.utils.substr(request, 38, 25);
    const transactionCode = this.utils.substr(request, 63, 3);
    const nit = this.utils.substr(request, 66, 20);
    const amountParsed = this.parseSpecialAmount(total);
    const npe = this.utils.substr(request, 0, 39);
    const dateParsed = this.parseDateEng(lastDatePayment);

    return {
      gln,
      npe,
      dateParsed,
      total,
      zero,
      paymentPeriod,
      npeCorrelative,
      lastDatePayment,
      npeValidator,
      account,
      transactionCode,
      nit,
      amountParsed,
    }
  }

  getDetailTransactionPaymentAFPConfiaNPE(request: string) {
    const prefix = this.utils.substr(request, 0, 4);
    const id = this.utils.substr(request, 4, 1);
    const amount = this.utils.substr(request, 5, 10);
    const dueDate = this.utils.substr(request, 15, 8);
    const seder = this.utils.substr(request, 23, 6);
    const consecutive = this.utils.substr(request, 29, 7);
    const verifier = this.utils.substr(request, 36, 1);
    const surcharge = this.utils.substr(request, 37, 1);
    const sourceAccount = this.utils.substr(request, 38, 25);
    const nit = this.utils.substr(request, 63, 17);
    const nit2 = this.utils.substr(request, 80, 17);
    const amountParsed = this.parseSpecialAmount(amount);
    const dateParsed = this.parseDateEng(dueDate);
    const npe = `${prefix}${amount}${dueDate}${seder}${consecutive}${verifier}`;

    return {
      npe,
      dateParsed,
      prefix,
      id,
      amount,
      dueDate,
      seder,
      consecutive,
      verifier,
      surcharge,
      sourceAccount,
      nit,
      nit2,
      amountParsed,
    }
  }

  getDetailTransactionPaymentOfCreditCard(request: string) {
    const value1 = this.utils.substr(request, 0, 13);
    const value2 = this.utils.substr(request, 13, 13);
    const value3 = this.utils.substr(request, 26, 13);
    const value4 = this.utils.substr(request, 39, 13);
    const value5 = this.utils.substr(request, 52, 13);
    const product = this.utils.substr(request, 65, 2);
    const subProduct = this.utils.substr(request, 67, 2);
    const account = this.utils.substr(request, 69, 25);
    const currency = this.utils.substr(request, 94, 3);
    const amount = this.utils.substr(request, 97, 13);
    const product2 = this.utils.substr(request, 110, 2);
    const subProduct2 = this.utils.substr(request, 112, 2);
    const targetAccount = this.utils.substr(request, 114, 25);
    const targetCurrency = this.utils.substr(request, 139, 3);
    const targetAmount = this.utils.substr(request, 142, 13);
    const description = this.utils.substr(request, 155, 60);
    const multiCurrencyCurrency = this.utils.substr(request, 215, 3);
    const multiCurrencyAlias = this.utils.substr(request, 218, 50);
    const multiCurrencyProductDescription = this.utils.substr(request, 268, 50);
    const multiCurrencyCurrency2 = this.utils.substr(request, 318, 3);
    const multiCurrencyName = this.utils.substr(request, 321, 60);
    const multiCurrencyNumberTC = this.utils.substr(request, 381, 16);
    const multiCurrencyConfirmTC = this.utils.substr(request, 399, 16);
    const multiCurrencyRate = this.utils.substr(request, 413, 14);
    const multiCurrencyAmountLPS = this.utils.substr(request, 427, 15);
    const commission = this.utils.substr(request, 442, 12);
    const amountParsed = this.parsedAmount(amount);


    return {
      value1,
      value2,
      value3,
      value4,
      value5,
      product,
      amount,
      subProduct,
      account,
      currency,
      subProduct2,
      targetAccount,
      targetCurrency,
      description,
      multiCurrencyCurrency,
      multiCurrencyAlias,
      multiCurrencyProductDescription,
      multiCurrencyCurrency2,
      multiCurrencyName,
      multiCurrencyNumberTC,
      multiCurrencyConfirmTC,
      multiCurrencyRate,
      multiCurrencyAmountLPS,
      commission,
      targetAmount,
      product2,
      amountParsed,
    }
  }

  getDetailTransactionMultipleUniACH(request: string): IStAchUniTransactionDetail {
    const lote = this.utils.substr(request, 0, 10).trim();
    const sourceAccount = this.utils.substr(request, 10, 25).trim();
    const sourceAccountCurrency = this.utils.substr(request, 35, 3).trim();
    const credits = this.utils.substr(request, 38, 10).trim();
    const totalAmount = this.utils.substr(request, 48, 13).trim();
    const fileName = this.utils.substr(request, 61, 12).trim();
    const clientCode = this.utils.substr(request, 73, 18).trim();
    const formattedAmount = this.parsedAmount(totalAmount);

    return {
      lote,
      sourceAccount,
      sourceAccountCurrency,
      formattedAmount,
      totalAmount,
      fileName,
      clientCode,
      credits,
    }
  }

  private parsedAmount(amount: string) {
    const decimal = amount.substring(11, 14);
    const real = amount.substring(0, 11);
    return `${+real}.${decimal}`;
  }

  private parseSpecialAmount(amount: string) {
    const decimal = amount.substring(8, 10);
    const real = amount.substring(0, 8);
    return `${+real}.${decimal}`;
  }

  private parseSpecialAmount2(amount: string) {
    const decimal = amount.substring(7, 9);
    const real = amount.substring(0, 7);
    return `${+real}.${decimal}`;
  }

  private parseDateEng(date: string) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    return `${day}/${month}/${year}`
  }

  private parseUniCommission(value: string) {
    const decimal = value.substring(2, 4);
    const real = value.substring(0, 2);
    return `${+real}.${decimal}`;
  }

}
