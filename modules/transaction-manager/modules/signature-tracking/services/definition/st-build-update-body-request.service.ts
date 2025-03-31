import { Injectable } from '@angular/core';
import { ESides } from '../../../../../transfer/interface/table.enum';
import { AlertAttributeBuilder, AlertBuilder } from '@adf/components';
import { UtilService } from 'src/app/service/common/util.service';
import { ESTUpdateValueAllowProcessPaymentOfPayroll } from '../../enum/st-common.enum';
import {
  ISTBodyRequestACHTransaction,
  ISTBodyRequestDonationTransaction,
  ISTBodyRequestThirdPartyLoanTransaction,
  ISTBodyRequestThirdTransaction,
  ISTBodyUpdateTransaction
} from '../../interfaces/st-transfer.interface';
import { AtdUtilService } from '../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {
  IACHScheduleResponse
} from '../../../../../transfer/modules/transfer-ach/interfaces/ach-transaction.interface';
import { UtilWorkFlowService } from '../../../../../../service/common/util-work-flow.service';
import { Product } from '../../../../../../enums/product.enum';


@Injectable({
  providedIn: 'root'
})
export class StBuildUpdateBodyRequestService {
  constructor(
    private util: UtilService,
    private atdUtils: AtdUtilService,
    private utilWorkFlow: UtilWorkFlowService,
  ) { }


  buildUpdateAlert(message?: string) {
    const iconAlertAttribute = new AlertAttributeBuilder()
      .label('sprint2-icon-warning')
      .build();

    const titleAlertAttribute = new AlertAttributeBuilder()
      .label('confirmation')
      .build();

    const messageAlertAttribute = new AlertAttributeBuilder()
      .label(message ?? 'signature-tracking:delete_accounts')
      .build();

    const nextButtonAlertAttribute = new AlertAttributeBuilder()
      .label('agree')
      .build();

    const cancelButtonAlertAttribute = new AlertAttributeBuilder()
      .label('cancel')
      .build();

    return new AlertBuilder()
      .icon(iconAlertAttribute)
      .title(titleAlertAttribute)
      .message(messageAlertAttribute)
      .nextButtonMessage(nextButtonAlertAttribute)
      .cancelButtonMessage(cancelButtonAlertAttribute)
      .build();

  }

  buildBodyToUpdateTransaction(requestProperties: ISTBodyUpdateTransaction) {
    const { sourceAccount, targetAccount, amount, comment, detailAccountToUpdate } = requestProperties ?? {};

    const sourceProduct = this.util.filledSideStrings(String(sourceAccount?.product), '0', 2, ESides.LEFT);
    const sourceSubProduct = this.util.filledSideStrings(String(sourceAccount?.subproduct), '0', 2, ESides.LEFT);
    const sourceAccountNumber = this.util.fillStrings(sourceAccount?.account, ' ', 25);
    const currentCurrency = this.util.fillStrings(sourceAccount?.currency, ' ', 3);
    const currentAmount = this.utilWorkFlow.rebuildAmount(`${amount}`);

    const currentTargetAccount = targetAccount as any;
    const currentTargetProduct = currentTargetAccount?.type || currentTargetAccount?.product || '';
    const currentTargetSubProduct = currentTargetAccount?.subproduct || currentTargetAccount?.subProduct || '';

    const targetProduct = this.util.filledSideStrings(String(currentTargetProduct), '0', 2, ESides.LEFT);
    const targetSubProduct = this.util.filledSideStrings(String(currentTargetSubProduct), '0', 2, ESides.LEFT);
    const targetAccountNumber = this.util.fillStrings(targetAccount?.account, ' ', 25);
    const currentComment = this.util.fillStrings(comment || '', ' ', 60);
    const rateExchange = detailAccountToUpdate?.rateExchange;

    return `${sourceProduct}${sourceSubProduct}${sourceAccountNumber}${currentCurrency}${currentAmount}${targetProduct}${targetSubProduct}${targetAccountNumber}${currentCurrency}${currentAmount}${currentComment}${rateExchange}`;
  }

  buildBodyToUpdateThirdPartyTransaction(requestProperties: ISTBodyRequestThirdTransaction) {
    const { targetAccount, detailAccountToUpdate } = requestProperties;

    const base = this.buildBodyToUpdateTransaction(requestProperties);
    const currentEmail = this.util.fillStrings(requestProperties?.email ?? '', ' ', 100);
    const currentTargetAlias = this.util.fillStrings(targetAccount?.alias ?? '', ' ', 60);
    const isNotify = this.util.fillStrings(detailAccountToUpdate?.notify ?? '', ' ', 1);

    return `${base}${isNotify}${currentEmail}${currentTargetAlias}`;
  }

  buildBodyToUpdateDonation(requestProperties: ISTBodyRequestDonationTransaction) {
    const { sourceAccount, targetAccount, amount } = requestProperties ?? {};

    const productOrigin = this.util.fillStrings(String(sourceAccount?.product), ' ', 2);
    const sourceSubProduct = this.util.fillStrings(String(sourceAccount?.subproduct), ' ', 2);
    const account = this.util.fillStrings(sourceAccount?.account, ' ', 25);
    const currency = this.util.fillStrings(sourceAccount?.currency, ' ', 3);
    const currentAmount = this.util.fillStrings(this.utilWorkFlow.rebuildAmount(`${amount}`), ' ', 13);
    const targetProduct = this.util.fillStrings(String(targetAccount?.productCode), ' ', 2);
    const targetSubProduct = this.util.fillStrings(String(targetAccount?.subProductCode), ' ', 2);
    const currentTargetAccount = this.util.fillStrings(targetAccount?.account, ' ', 25);
    const targetCurrency = this.util.fillStrings(targetAccount?.currency, ' ', 3);

    return `${productOrigin}${sourceSubProduct}${account}${currency}${currentAmount}${targetProduct}${targetSubProduct}${currentTargetAccount}${targetCurrency}${currentAmount}`;
  }

  buildBodyToUpdateACHTransfer(requestProperties: ISTBodyRequestACHTransaction) {
    const {
      sourceAccount,
      targetAccount,
      amount,
      detailAccountToUpdate,
      formValues,
      hourSelected,
      comment } = requestProperties;

    const schedule = this.atdUtils.buildScheduleParameter(formValues?.date as NgbDate, formValues?.hour as string) || '';
    const date = this.atdUtils.calcDateParameters(schedule);
    const rawHour = this.atdUtils.getRawHour(hourSelected as IACHScheduleResponse);

    const productOrigin = this.util.filledSideStrings(String(sourceAccount?.product), '0', 2, ESides.LEFT);
    const sourceSubProduct = this.util.filledSideStrings(String(sourceAccount?.subproduct ?? sourceAccount?.subProduct), '0', 2, ESides.LEFT);
    const currentSourceAccount = this.util.fillStrings(sourceAccount?.account, ' ', 25);
    const currency = this.util.fillStrings(sourceAccount?.currency, ' ', 3);
    const currentAmount = this.util.fillStrings(this.utilWorkFlow.rebuildAmount(`${amount}`), ' ', 13);
    const bankCode = this.util.filledSideStrings(String(targetAccount.bank), '0', 4, ESides.LEFT);
    const targetProduct = this.util.filledSideStrings(this.atdUtils.getProduct(targetAccount?.type), '0', 2, ESides.LEFT);
    const currentTargetAccount = this.util.fillStrings(targetAccount?.account, ' ', 25);
    const currentComment = this.util.fillStrings(String(comment), ' ', 60);
    const reference = this.util.fillStrings(detailAccountToUpdate?.reference, ' ', 12);
    const lote = this.util.fillStrings(detailAccountToUpdate?.numberLote, ' ', 10);
    const sourceAccountAlias = this.util.fillStrings(sourceAccount?.alias, ' ', 50);
    const sourceProductDescription = this.util.fillStrings(sourceAccount?.name, ' ', 50);
    const typeClientTargetAccount = this.util.fillStrings(this.atdUtils.getTypeClientAccount(targetAccount?.clientType), ' ', 1);
    const targetAccountName = this.util.fillStrings(targetAccount?.name, ' ', 22);
    const targetAccountBankName = this.util.fillStrings(targetAccount?.bankName, ' ', 60);
    const targetAccountStatus = this.util.fillStrings(this.atdUtils.getStatusAccount(targetAccount?.status), ' ', 1);
    const targetAccountDateCreated = this.util.fillStrings(targetAccount?.creationDate, ' ', 8);
    const targetAccountUserCreated = this.util.fillStrings(targetAccount?.userOfCreation, ' ', 25);
    const targetAccountDateModified = this.util.fillStrings(targetAccount?.modificationDate, ' ', 8);
    const targetAccountUserModified = this.util.fillStrings(targetAccount?.userOfModification, ' ', 25);
    const targetAccountEmail = this.util.fillStrings(targetAccount?.email, ' ', 80);
    const bankId = this.util.fillStrings(String(targetAccount?.bank), ' ', 2);
    const transferenceHour = this.util.fillStrings(rawHour?.code, ' ', 6);
    const transferenceDate = this.util.fillStrings(date.transferenceDateRaw, ' ', 8);
    const transferenceType = this.util.fillStrings(this.atdUtils.getTypeTransaction(`${amount}`), ' ', 4);
    const transferenceHourRaw = this.util.fillStrings(rawHour.raw, ' ', 20);
    const transferenceDateRaw = this.util.fillStrings(date.transferenceDate, ' ', 20);
    const idTargetAccount = this.util.fillStrings(targetAccount?.documentNumber, ' ', 18);
    const selectedQuest = this.util.fillStrings(' ', ' ', 1);
    const inputQuest = this.util.fillStrings(' ', ' ', 50);
    const targetAccountAlias = this.util.fillStrings(targetAccount?.alias, ' ', 25);

    const firstRow = `${productOrigin}${sourceSubProduct}${currentSourceAccount}${currency}${currentAmount}${bankCode}${targetProduct}${currentTargetAccount}${currency}${currentAmount}`
    const secondRow = `${currentComment}${reference}${lote}${currency}${sourceAccountAlias}${sourceProductDescription}${typeClientTargetAccount}${targetAccountName}${targetAccountBankName}${targetAccountStatus}`;
    const thirdRow = `${targetProduct}${targetAccountDateCreated}${targetAccountUserCreated}${targetAccountDateModified}${targetAccountUserModified}${targetAccountEmail}`;
    const fourthRow = `${currentTargetAccount}${bankId}${transferenceHourRaw}${transferenceDateRaw}${transferenceType}${transferenceHour}${transferenceDate}${idTargetAccount}`;
    const fiveRow = `${selectedQuest}${inputQuest}${targetAccountAlias}`
    return `${firstRow}${secondRow}${thirdRow}${fourthRow}${fiveRow}`;
  }

  buildBodyToUpdateAchUniTxn(state: any) {
    const {
      accountDebited,
      accountDestination,
      bank,
      formValues: { comment, purpose, amount },
      transactionManagerDetail,
    } = state;

    const targetProductRaw = Number(Product[accountDestination?.type] ?? '01');
    const productName = `CUENTA DE ${this.util.getLabelProduct(targetProductRaw).toUpperCase()}`;

    const sourceProduct = this.util.filledSideStrings(String(accountDebited?.product), '0', 2, ESides.LEFT);
    const sourceSubProduct = this.util.filledSideStrings(String(accountDebited?.subproduct), '0', 2, ESides.LEFT);
    const sourceAccount = this.util.fillStrings(accountDebited?.account, '0', 12);
    const sourceCurrency = this.util.fillStrings(accountDebited?.currency, '0', 3);
    const sourceAmount = this.util.fillStrings(this.utilWorkFlow.rebuildAmount(`${amount}`), '0', 13);

    const codeBank = this.util.filledSideStrings(String(bank.code), '0', 4, ESides.LEFT);
    const targetProduct = this.util.filledSideStrings(this.atdUtils.getProduct(accountDestination?.type), '0', 2, ESides.LEFT);
    const targetAccount = this.util.fillStrings(accountDestination?.account, ' ', 17);
    const targetCurrency = this.util.fillStrings(accountDestination?.currency, ' ', 3);
    const targetAmount = sourceAmount;
    const currentComment = this.util.fillStrings(String(comment), ' ', 60);
    const originalTransaction = this.util.fillStrings(transactionManagerDetail?.originalTransaction, '0', 12);

    const numLote = this.util.fillStrings(transactionManagerDetail?.numLote, '0', 10);
    const typeService = transactionManagerDetail?.typeService;
    const targetIdentify = this.util.fillStrings(accountDestination?.documentNumber, ' ', 20);

    const sourceCurrency2 = sourceCurrency
    const sourceAlias = this.util.fillStrings(accountDebited?.alias, ' ', 50);
    const sourceAccountDescription = this.util.fillStrings(accountDebited?.name, ' ', 50);

    const targetAccountName = this.util.fillStrings(accountDestination?.name, ' ', 22);
    const targetBankName = this.util.filledSideStrings(bank.description, ' ', 60);
    const targetAccountStatus = this.util.fillStrings(accountDestination?.status, ' ', 1);

    const targetProduct2 = this.util.filledSideStrings(String(targetProductRaw), ' ', 2);
    const targetDateCrated = this.util.fillStrings(accountDestination?.creationDate, ' ', 8);
    const targetUserCreated = this.util.fillStrings(accountDestination?.userOfCreation, ' ', 25);
    const targetDateModify = this.util.fillStrings(accountDestination?.modificationDate, ' ', 8);
    const targetUserModify = this.util.fillStrings(accountDestination?.userOfModification, ' ', 25);
    const targetEmail = this.util.fillStrings(accountDestination?.email, ' ', 80);
    const targetAccount2 = this.util.fillStrings(accountDestination?.account, ' ', 25);

    const bankInternalCode = this.util.filledSideStrings(String(bank.code), '0', 2, ESides.LEFT);
    const descriptionTypeAccount = this.util.fillStrings(productName, ' ', 35);
    const proposalCode = this.util.fillStrings(purpose, ' ', 4);
    const unknown = this.util.fillStrings(' ', ' ', 114);
    const uniCommission = transactionManagerDetail.uniCommission;

    const first = `${sourceProduct}${sourceSubProduct}${sourceAccount}${sourceCurrency}${sourceAmount}`;
    const second = `${codeBank}${targetProduct}${targetAccount}${targetCurrency}${targetAmount}${currentComment}${originalTransaction}`;
    const third = `${numLote}${typeService}${targetIdentify}`;
    const four = `${sourceCurrency2}${sourceAlias}${sourceAccountDescription}`;
    const five = `${targetAccountName}${targetBankName}${targetAccountStatus}`;
    const six = `${targetProduct2}${targetDateCrated}${targetUserCreated}${targetDateModify}${targetUserModify}${targetEmail}${targetAccount2}`;
    const seven = `${bankInternalCode}${descriptionTypeAccount}${proposalCode}${unknown}${uniCommission}`;

    return `${first}${second}${third}${four}${five}${six}${seven}`;
  }

  buildBodyToUpdateThirdPartyLoan(requestProperties: ISTBodyRequestThirdPartyLoanTransaction) {
    const { detailAccountToUpdate, sourceAccount, receiptNumber, amount, typePayment, quotasSelected, email } = requestProperties ?? {};

    const dummy = this.util.fillStrings(detailAccountToUpdate?.dummy, ' ', 3);
    const receiptNumberValue = this.util.fillStrings(receiptNumber as string, ' ', 10);
    const dummy2 = detailAccountToUpdate?.dummy2;
    const sourceProduct = this.util.fillStrings(String(sourceAccount?.product), ' ', 2);
    const sourceSubProduct = this.util.fillStrings(String(sourceAccount?.subproduct), ' ', 2);
    const sourceAccountNumber = this.util.fillStrings(sourceAccount?.account, ' ', 25);
    const sourceCurrency = this.util.fillStrings(detailAccountToUpdate?.sourceCurrency, ' ', 3);
    const currentAmount = this.utilWorkFlow.rebuildAmount(`${amount}`);
    const targetProduct = detailAccountToUpdate?.targetProduct;
    const targetSubProduct = detailAccountToUpdate?.targetSubProduct;
    const targetAccountNumber = this.util.filledSideStrings(detailAccountToUpdate?.targetAccount, '0', 25, ESides.LEFT);
    const targetCurrency = this.util.fillStrings(detailAccountToUpdate?.targetCurrency, ' ', 3);
    const dummy3 = detailAccountToUpdate?.dummy3;
    const defaultRate = detailAccountToUpdate?.defaultRate;
    const interestRate = detailAccountToUpdate?.interestRate;
    const capital = detailAccountToUpdate?.capital;
    const interest = detailAccountToUpdate?.interest;
    const defaultAmount = detailAccountToUpdate?.defaultAmount;
    const dummy4 = detailAccountToUpdate?.dummy4;
    const capitalBackWard = detailAccountToUpdate?.capitalBackWard;
    const dummy5 = detailAccountToUpdate?.dummy5;
    const dummy6 = detailAccountToUpdate?.dummy6;
    const currentBalance = detailAccountToUpdate?.currentBalance;
    const backWardBalance = detailAccountToUpdate?.backWardBalance;
    const dummy7 = detailAccountToUpdate?.dummy7;
    const nameLoan = this.util.filledSideStrings(detailAccountToUpdate?.nameLoan.trim(), ' ', 60, ESides.LEFT);
    const aliasLoan = this.util.filledSideStrings(detailAccountToUpdate?.aliasLoan.trim(), ' ', 60, ESides.LEFT);
    const currentEmail = this.util.fillStrings(email as string, ' ', 48);
    const targetLoanCurrency = detailAccountToUpdate?.targetLoanCurrency;
    const targetLoanAlias = detailAccountToUpdate?.targetLoanAlias;
    const email2 = this.util.fillStrings(detailAccountToUpdate?.email2, ' ', 12);
    const currentComment = this.util.fillStrings(detailAccountToUpdate?.comment, ' ', 60);
    const paymentType = this.util.filledSideStrings(String(typePayment), ' ', 2, ESides.LEFT);
    const quotas = this.util.filledSideStrings(String(quotasSelected), ' ', 3, ESides.LEFT);
    const dummy8 = detailAccountToUpdate?.dummy8;
    const sourceAccountAlias = this.util.fillStrings(sourceAccount?.alias, '0', 60);
    const currentLoanBalance = detailAccountToUpdate?.currentLoanBalance;
    const valueCurrencyExchange = detailAccountToUpdate?.valueCurrencyExchange;
    const amountCurrencies = detailAccountToUpdate?.amountCurrencies;
    const commission = detailAccountToUpdate?.commission;
    const conversionAmount2 = detailAccountToUpdate?.conversionAmount2;
    const capitalPayment = detailAccountToUpdate?.capitalPayment;
    const date = detailAccountToUpdate?.date;
    const dateOperation = detailAccountToUpdate?.dateOperation;
    const userWeb = detailAccountToUpdate?.userWeb;


    return `${dummy}${receiptNumberValue}${dummy2}${sourceProduct}${sourceSubProduct}${sourceAccountNumber}${sourceCurrency}${currentAmount}${targetProduct}${targetSubProduct}${targetAccountNumber}${targetCurrency}${currentAmount}${dummy3}${defaultRate}${interestRate}${capital}${interest}${defaultAmount}${dummy4}${capitalBackWard}${dummy5}${dummy6}${currentBalance}${backWardBalance}${dummy7}${nameLoan}${aliasLoan}${currentEmail}${targetLoanCurrency}${targetLoanAlias}${email2}${currentComment}${paymentType}${quotas}${sourceAccountAlias}${dummy8}${currentAmount}${currentLoanBalance}${valueCurrencyExchange}${amountCurrencies}${currentAmount}${commission}${currentAmount}${conversionAmount2}${capitalPayment}${date}${dateOperation}${userWeb}`;
  }

  buildBodyToUpdatePaymentOfPayrollMultiple(request: string) {
    const initial = request.substring(0, 108);
    const end = request.substring(109);
    return `${initial}${ESTUpdateValueAllowProcessPaymentOfPayroll.YES}${end}`
  }


  parsedAmount(amount: string) {
    const decimal = amount.substring(11, 14);
    const real = amount.substring(0, 11);
    return `${+real}.${decimal}`;
  }



}
