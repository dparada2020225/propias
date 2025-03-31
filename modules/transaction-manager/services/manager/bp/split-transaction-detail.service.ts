import { Injectable } from '@angular/core';
import { UtilService } from '../../../../../service/common/util.service';
import {
  ITMRequestDetailACHTransaction,
  ITMRequestDetailBulkTransaction, ITMRequestDetailThirdPartyLoanPayment,
  ITransactionManagerRequestDetail
} from '../../../interfaces/transaction-manger.interface';

@Injectable({
  providedIn: 'root',
})
export class SplitTransactionDetailService {

  constructor(
    private utils: UtilService,
  ) {
  }

  getBasePropertiesDetailTransaction(request: string) {
    const sourceProduct = request.substring(0, 2).trim();
    const sourceSubProduct = request.substring(2, 4).trim();
    const sourceAccount = request.substring(4, 29).trim();
    const sourceCurrency = request.substring(29, 32).trim();
    const sourceAmount = this.parsedAmount(request.substring(32, 45));

    return {
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
    }
  }


  /*
  * Method to get transaction detail for:
  * OWN Transfer
  * THIRD PARTY Transfer
  * DONATION transfer
  * */
  getTransactionDetailForSampleTransactions(request: string): ITransactionManagerRequestDetail {
    const {
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
    } = this.getBasePropertiesDetailTransaction(request);

    const productTarget = request.substring(45, 47).trim();
    const subProductTarget = request.substring(47, 49).trim();
    const accountTarget = request.substring(49, 74).trim();
    const currencyTarget = request.substring(74, 77).trim();
    const amountTarget = this.parsedAmount(request.substring(77, 90));
    const description = request.substring(90, 150).trim();
    const rateExchange = request.substring(150, 162).trim();
    const notify = request.substring(162, 163).trim();
    const email = request.substring(163, 203).trim();
    const targetAlias = request.substring(263, 324).trim();

    return {
      productOrigin: sourceProduct,
      subProductOrigin: sourceSubProduct,
      accountOrigin: sourceAccount,
      currencyOrigin: sourceCurrency,
      amountOrigin: sourceAmount,
      productTarget,
      subProductTarget,
      accountTarget,
      currencyTarget,
      amountTarget,
      description,
      rateExchange,
      notify,
      email,
      targetAlias,
    };
  }

  getTransactionDetailForBulkTransferRequest(request: string): ITMRequestDetailBulkTransaction {
    const {
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
    } = this.getBasePropertiesDetailTransaction(request);

    const numberOfCredits = Number(request.substring(45, 49).trim());
    const numberOfLote = request.substring(49, 59).trim();
    const description = request.substring(59, 69).trim();
    const idTrx = request.substring(69, 81).trim();

    return {
      sourceProduct: sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      amount: sourceAmount,
      numberOfCredits,
      numberOfLote,
      description,
      idTrx,
    };

  }

  getTransactionDetailForACHRequest(request: string): ITMRequestDetailACHTransaction {
    const {
      sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      sourceAmount,
    } = this.getBasePropertiesDetailTransaction(request);

    const bankId = Number(request.substring(45, 49).trim());
    const targetProduct = request.substring(49, 51).trim();
    const targetAccount = request.substring(51, 76).trim();
    const targetCurrency = request.substring(76, 79).trim();
    const targetAmount = request.substring(79, 92).trim();
    const comment = request.substring(92, 152).trim();
    const reference = request.substring(152, 164).trim();
    const numberLote = request.substring(164, 174).trim();
    const sourceCurrency2 = this.utils.substr(request, 174, 3).trim();
    const sourceAlias = this.utils.substr(request, 177, 50).trim();
    const sourceProductDescription = this.utils.substr(request, 227, 50).trim();
    const typeClientTargetAccount = this.utils.substr(request, 277, 1).trim();
    const targetAccountName = this.utils.substr(request, 278, 22).trim();
    const targetAccountBankName = this.utils.substr(request, 300, 60).trim();
    const targetAccountStatus = this.utils.substr(request, 360, 1).trim();
    const targetAccountProduct2 = this.utils.substr(request, 361, 2).trim();
    const targetAccountDateCreated = this.utils.substr(request, 363, 8).trim();
    const targetAccountUserCreated = this.utils.substr(request, 371, 25).trim();
    const targetAccountDateModified = this.utils.substr(request, 396, 8).trim();
    const targetAccountUserModified = this.utils.substr(request, 404, 25).trim();
    const targetAccountEmail = this.utils.substr(request, 429, 80).trim();
    const targetAccount2 = this.utils.substr(request, 509, 25).trim();
    const bankId2 = Number(this.utils.substr(request, 534, 2).trim());
    const transferenceHour = this.utils.substr(request, 536, 20).trim();
    const transferenceDate = this.utils.substr(request, 556, 20).trim();
    const transferenceType = this.utils.substr(request, 576, 4).trim();
    const transferenceHourRaw = this.utils.substr(request, 580, 6).trim();
    const transferenceDateRaw = this.utils.substr(request, 586, 8).trim();
    const idTargetAccount = this.utils.substr(request, 594, 18).trim();
    const selectedQuest = this.utils.substr(request, 612, 1).trim();
    const inputQuest = this.utils.substr(request, 613, 50).trim();
    const targetAccountAlias = this.utils.substr(request, 663, 25).trim();

    return {
      sourceProduct: sourceProduct,
      sourceSubProduct,
      sourceAccount,
      sourceCurrency,
      amount: sourceAmount,
      bankId,
      targetProduct,
      targetAccount,
      targetCurrency,
      targetAmount,
      comment,
      reference,
      numberLote,
      sourceCurrency2,
      sourceAlias,
      sourceProductDescription,
      typeClientTargetAccount,
      targetAccountName,
      targetAccountBankName,
      targetAccountStatus,
      targetAccountProduct2,
      targetAccountDateCreated,
      targetAccountUserCreated,
      targetAccountDateModified,
      targetAccountUserModified,
      targetAccountEmail,
      targetAccount2,
      bankId2,
      transferenceHour,
      transferenceDate,
      transferenceType,
      transferenceHourRaw,
      transferenceDateRaw,
      idTargetAccount,
      selectedQuest,
      inputQuest,
      targetAccountAlias,
    };

  }



  getTransactionDetailForThirdPartyPaymentLoan(request: string): ITMRequestDetailThirdPartyLoanPayment {
    const dummy = request.substring(1, 3);
    const receiptNumber = request.substring(3, 13);
    const dummy2 = request.substring(13, 65);
    const sourceProduct = request.substring(65, 67);
    const sourceSubProduct = request.substring(67, 69);
    const sourceAccount = request.substring(69, 94).trim();
    const sourceCurrency = request.substring(94, 97);
    const sourceAmount = this.parsedAmount(request.substring(97, 110).trim());
    const targetProduct = request.substring(110, 112);
    const targetSubProduct = request.substring(112, 114);
    const targetAccount = this.parseAccount(request.substring(114, 139).trim());
    const targetCurrency = request.substring(139, 142);
    const targetAmount = this.parsedAmount(request.substring(142, 155).trim());
    const dummy3 = request.substring(155, 215);
    const defaultRate = request.substring(215, 231);
    const interestRate = request.substring(231, 247);
    const capital = request.substring(247, 260);
    const interest = request.substring(260, 273);
    const defaultAmount = request.substring(273, 286);
    const dummy4 = request.substring(286, 299);
    const capitalBackWard = request.substring(299, 312);
    const dummy5 = request.substring(312, 325);
    const dummy6 = request.substring(325, 338);
    const currentBalance = request.substring(338, 351);
    const backWardBalance = request.substring(351, 364);
    const dummy7 = request.substring(364, 377);
    const nameLoan = request.substring(377, 437);
    const aliasLoan = request.substring(437, 497);
    const email = request.substring(497, 545);
    const targetLoanCurrency = request.substring(545, 548);
    const targetLoanAlias = request.substring(548, 598);
    const email2 = request.substring(598, 610);
    const comment = request.substring(610, 670);
    const typePayment = request.substring(670, 672);
    const quotas = request.substring(672, 675);
    const sourceAccountAlias = request.substring(675, 735);
    const dummy8 = request.substring(735, 739);
    const targetAmountToPayment = request.substring(739, 752);
    const currentLoanBalance = request.substring(752, 765);
    const valueCurrencyExchange = request.substring(765, 779);
    const amountCurrencies = request.substring(779, 794);
    const amountCurrenciesTarget = request.substring(794, 807);
    const commission = request.substring(807, 819);
    const conversionAmount = request.substring(819, 832);
    const conversionAmount2 = request.substring(832, 845);
    const capitalPayment = request.substring(845, 846);
    const date = request.substring(846, 856);
    const dateOperation = request.substring(856, 864);
    const userWeb = request.substring(864, 889);


    return {
      nameLoan,
      aliasLoan,
      email,
      email2,
      dummy8,
      comment,
      typePayment,
      quotas,
      currentBalance,
      currentLoanBalance,
      valueCurrencyExchange,
      amountCurrencies,
      amountCurrenciesTarget,
      commission,
      conversionAmount,
      conversionAmount2,
      capitalPayment,
      date,
      dateOperation,
      userWeb,
      dummy,
      receiptNumber,
      dummy2,
      sourceAccount,
      sourceAmount,
      sourceCurrency,
      sourceProduct,
      sourceSubProduct,
      targetAccount,
      targetAmount,
      targetProduct,
      targetSubProduct,
      targetCurrency,
      defaultAmount,
      defaultRate,
      interest,
      interestRate,
      dummy3,
      dummy4,
      capital,
      capitalBackWard,
      backWardBalance,
      dummy6,
      dummy7,
      dummy5,
      targetAmountToPayment,
      targetLoanAlias,
      targetLoanCurrency,
      sourceAccountAlias,
    };

  }

  /*  --------  SPLIT METHODS. NOTE: THIS SERVICES CANNOT SUPPORT TO ONLINE BAKING -------  */
  /* Only use to process multiple transaction. in SIGNATURE TRACKING module */

  getDetailTransactionExchangeCurrencyAuction(request: string) {
    const clientName = request.substring(172, 197).trim();
    const reference = request.substring(297, 309).trim();
    const rateExchangeReference = request.substring(101, 114).trim();
    const targetCurrency = request.substring(60, 63).trim();
    const currentAmount = request.substring(88, 99).replace(/^0+/, '').trim();
    const amount = this.parsedAmount(request.substring(88, 101).replace(/^0+/, '')).trim();
    const sourceAccountNumber = request.substring(21, 46).trim();
    const sourceCurrency = request.substring(18, 21).trim();
    const amountDebit = this.parsedAmount(request.substring(88, 101)).trim();
    const targetAccountNumber = request.substring(63, 88).trim();

    return {
      clientName,
      reference,
      rateExchangeReference,
      targetCurrency,
      currentAmount,
      amount,
      sourceAccountNumber,
      sourceCurrency,
      amountDebit,
      targetAccountNumber,
    };
  }

  getDetailTransactionPurchaseForeignCurrency(request: string) {
    const amount = this.parsedAmount(request.substring(54, 67)).trim();
    const rateExchange = this.parsedAmount(request.substring(67, 77).replace(/^0+/, '')).trim();
    const lempirasEquivalence = this.parsedAmount(request.substring(77, 90).replace(/^0+/, '')).trim();
    const accountDebited = request.substring(20, 40).trim();
    const accountAccredited = request.substring(91, 111).trim();

    return {
      amount,
      rateExchange,
      accountDebited,
      accountAccredited,
      lempirasEquivalence,
    };
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

  getDetailTransactionCashierCreditRequest(request: string) {
    const userName = request.substring(272, 322).trim();
    const accountDebit = request.substring(7, 32).trim();
    const nameOfAccountDebit = request.substring(225, 285).trim();
    const listOfBefits = request.substring(153, 212).trim();

    return {
      userName,
      accountDebit,
      nameOfAccountDebit,
      listOfBefits,
    };
  }

  getDetailTransactionLoanDisbursement(request: string) {
    const nameBusiness = request.substring(10, 20).trim();
    const creditAccount = request.substring(158, 183).trim();
    const nameOfClient = request.substring(72, 122).trim();
    const currency = request.substring(233, 236).trim();
    const amount = this.parsedAmount(request.substring(59, 72).replace(/^0+/, '')).trim();

    return {
      nameBusiness,
      creditAccount,
      nameOfClient,
      currency,
      amount,
    };
  }

  getDetailTransactionDivideAll(request: string) {
    const nameBusiness = request.substring(72, 152).trim();
    const reference = request.substring(172, 184).trim();
    const targetNumberAccountTrunc = request.substring(107, 123).trim();
    const nameCard = request.substring(32, 72).trim();
    const amount = this.parsedAmount(request.substring(187, 199).replace(/^0+/, '').trim());
    const currency = request.substring(184, 187).trim();
    const deadline = request.substring(310, 312).trim();
    const monthlyQuota = request.substring(262, 274).trim();
    const description = request.substring(199, 214).trim();

    return {
      nameBusiness,
      reference,
      targetNumberAccountTrunc,
      nameCard,
      amount,
      currency,
      deadline,
      monthlyQuota,
      description
    };
  }

  getDetailTransactionBulkPaymentServices(request: string) {
    const userName = request.substring(1, 25).trim();
    const reference = request.substring(80, 91).trim();
    const dateTime = request.substring(66, 79).trim();
    const code = request.substring(92, 96).trim();
    const numberOfLote = request.substring(97, 106).trim();
    const amountOfPayments = request.substring(157, 166).trim();
    const currency = request.substring(416, 418).trim();
    const accountDebit = request.substring(167, 178).trim();
    const amount = this.parsedAmount(request.substring(403, 415).replace(/^0+/, '').trim());
    return {
      userName,
      reference,
      dateTime,
      code,
      numberOfLote,
      amountOfPayments,
      amount,
      currency,
      accountDebit
    };
  }

  getDetailTransactionPaymentCreditCard(request: string) {
    const sourceAccountNumber = request.substring(69, 94).trim();
    const cardTrucMasked = request.substring(155, 171).trim();
    const nameOfCard = request.substring(321, 381).trim();
    const currencyConverterLPS = request.substring(427, 442).trim();
    const amount = this.parsedAmount(request.substring(142, 155).replace(/^0+/, '').trim());

    return {
      nameOfCard,
      sourceAccountNumber,
      cardTrucMasked,
      currencyConverterLPS,
      amount,
    };
  }

  getDetailTransactionPaymentServices(request: string) {
    const code = request.substring(1, 5).trim();
    const reference = request.substring(5, 45).trim();
    const currency = request.substring(45, 48).trim();
    const sourceAccountNumber = request.substring(78, 109).trim();
    const date = request.substring(3911, 3920).trim();
    const hour = request.substring(3920, 3926).trim();
    const paymentValue = this.parsedAmount(request.substring(48, 61).replace(/^0+/, '').trim());

    return {
      code,
      reference,
      currency,
      paymentValue,
      sourceAccountNumber,
      date,
      hour,
    };
  }

  getDetailTransactionPaymentTaxes(request: string) {
    const id = this.utils.substr(request, 116, 12);

    return {
      id,
    };
  }

  getDetailTransactionPaymentToProviders(request: string) {
    const sourceAccountNumber = this.utils.substr(request, 0, 25).trim();
    const numberOfLote = this.utils.substr(request, 89, 7).trim();
    const comment = this.utils.substr(request, 122, 60);
    const paymentMethod = this.utils.substr(request, 120, 1).trim();

    return {
      sourceAccountNumber,
      numberOfLote,
      comment,
      paymentMethod,
    };
  }

  private parsedAmount(amount: string) {
    const decimal = amount.substring(11, 14);
    const real = amount.substring(0, 11);
    return `${+real}.${decimal}`;
  }

  private parseAccount(value: string) {
    return value.replace(/^0+/, '');
  }
}
