import {ITMTransaction} from '../../../interfaces/tm-transaction.interface';
import {IACHSettings} from '../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import {IAchAccount} from '../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {IAccount} from '../../../../../models/account.inteface';

export interface IExecuteACHTransactions {
  transaction: ITMTransaction;
  settings: IACHSettings[];
  achAssociatedAccounts: IAchAccount[];
  sourceAccount?: IAccount;
  achTargetAccounts?: IAchAccount[];
}

export interface IForeignCurrencyAuction {
  reference: string;
  customerName: string;
  referenceExchangeRate: string;
  targetCurrency: string;
  amount: string;
  debitAccount: string;
  sourceCurrency: string;
  amountDebited: string;
  targetAccount: string;
}

export interface IPurchaseForeignCurrency {
  reference: string;
  name: string;
  amount: string;
  equivalentAmount: string;
  exchangeRate: string;
  debitAccount: string;
  creditAccount: string;
  currency: string;
}

export interface ICashierCheckRequest {
  reference: string;
  customerName: string;
  debitAccount: string;
  debitAccountName: string;
  beneficiaries: Beneficiary[];
}

export interface ICreditPurchaseDisbursements {
  reference: string;
  name: string;
  debitAccount: string;
  customerName: string;
  currency: string;
  amount: string;
}

export interface IDivideItAllUp {
  reference: string;
  name: string;
  cardNumber: string;
  cardName: string;
  currency: string;
  amount: string;
  term: string;
  monthlyFee: string;
}

export interface IPaymentOfBulkServices {
  reference: string;
  name: string;
  agreementCode: string;
  serviceCode: string;
  lot: string;
  paymentAmount: string;
  amount: string;
  currency: string;
  debitAccount: string;
}

export interface IPaymentOfPayroll {
  reference: string;
  name: string;
  formLot: string;
  debitAccount: string;
  debitAccountName: string;
  currency: string;
  amount: string;
  paymentAmount: string;
  scheduleDateTime: string;
  scheduleHourTime: string;
}

export interface ICreditCardPayments {
  reference: string;
  cardName: string;
  debitAccount: string;
  cardNumber: string;
  amount: string;
  debitAmount: string;
}

export interface IPaymentOFServices {
  reference: string;
  name: string;
  agreementCode: string;
  serviceName: string;
  amount: string;
  currency: string;
  debitAccount: string;
}

export interface Beneficiary {
  name: string;
  amount: string;
}

export interface IPaymentOfProvidersRequest {
  company: string;
  lotCode: string;
}

export interface IPaymentOfTaxesRequest {
  processID: string;
}

export interface IPaymentProvidersDetail {
  code: number;
  message: string;
  providerDetails: IProviderDetail[];
}

export interface IProviderDetail {
  company: number;
  paymentType: string;
  providerCode: string;
  correlative: number;
  targetAccount: string;
  accountStatus: string;
  targetAmount: string;
  name: string;
  providerId: string;
  groupCorrelative: number;
  bankId: string;
  bankRoute: string;
  isProgrammedDate: boolean;
  programmedDate: string;
  accountType: string;
}

export type TPaymentOfPayrollManageFinalizeRequest = () => void;
