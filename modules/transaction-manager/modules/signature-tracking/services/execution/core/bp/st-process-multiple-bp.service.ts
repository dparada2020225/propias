import { Injectable } from '@angular/core';
import { StCommonTransactionService } from '../../st-common-transaction.service';
import { FeatureManagerService } from '../../../../../../../../service/common/feature-manager.service';
import {
  IStartupParametersToExecuteRetryProcessPaymentOfPayroll,
  IStartupParametersToMultipleProcessTransaction
} from '../../../../interfaces/st-process-multiple.interface';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ISignatureTrackingServiceResponse } from '../../../../interfaces/signature-tracking.interface';
import { ETMServiceCode } from '../../../../../../enums/service-code.enum';
import { StExchangeCurrencyAuctionService } from '../../definitions/bp/multiple/st-exchange-currency-auction.service';
import { StExchangeCurrencyPurchaseService } from '../../definitions/bp/multiple/st-exchange-currency-purchase.service';
import { StCashierCheckRequestService } from '../../definitions/bp/multiple/st-cashier-check-request.service';
import { StDisbursementOfCreditService } from '../../definitions/bp/multiple/st-disbursement-of-credit.service';
import { StDivideAllService } from '../../definitions/bp/multiple/st-divide-all.service';
import { StBulkServicesPaymentService } from '../../definitions/bp/multiple/st-bulk-services-payment.service';
import { StPaymentOfPayrollService } from '../../definitions/bp/multiple/st-payment-of-payroll.service';
import { StPaymentOfCreditCardService } from '../../definitions/bp/multiple/st-payment-of-credit-card.service';
import { StPaymentOfServicesService } from '../../definitions/bp/multiple/st-payment-of-services.service';
import { DonationProcessService } from '../../definitions/bp/multiple/st-donation.service';
import { StPaymentTaxesService } from '../../definitions/bp/multiple/st-payment-taxes.service';
import { StPaymentProvidersService } from '../../definitions/bp/multiple/st-payment-providers.service';
import { SignatureTrackingService } from '../../../transaction/signature-tracking.service';
import { StBulkTransactionsService } from '../../definitions/bp/multiple/st-bulk-transactions.service';
import { StAchService } from '../../definitions/bp/multiple/st-ach.service';
import { StTplPaymentService } from '../../definitions/bp/multiple/st-tpl-payment.service';

@Injectable({
  providedIn: 'root'
})
export class StProcessMultipleBpService {
  constructor(
    private stCommonTransaction: StCommonTransactionService,
    private exchangeCurrencyAuction: StExchangeCurrencyAuctionService,
    private exchangeCurrencyPurchase: StExchangeCurrencyPurchaseService,
    private cashierCheckRequest: StCashierCheckRequestService,
    private disbursementOfCredit: StDisbursementOfCreditService,
    private divideAll: StDivideAllService,
    private bulkServicesPayment: StBulkServicesPaymentService,
    private paymentOfPayroll: StPaymentOfPayrollService,
    private paymentOfCreditCard: StPaymentOfCreditCardService,
    private paymentOfServices: StPaymentOfServicesService,
    private donationProcess: DonationProcessService,
    private paymentTaxes: StPaymentTaxesService,
    private paymentProviders: StPaymentProvidersService,
    private stTransaction: SignatureTrackingService,
    private stProcessBulkTransaction: StBulkTransactionsService,
    private stProcessACHTransaction: StAchService,
    private stProcessThirdPartyLoanPayment: StTplPaymentService,
    private featureManagerService: FeatureManagerService,
  ) { }

  executeTransactionMap(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected } = startupParameters;
    const transaction = this.transactionWitPostProcessService[transactionSelected.serviceCode];

    if (!transaction) {
      return this.processTransactionSimple(startupParameters);
    }

    return transaction(startupParameters);
  }

  executeRetryPaymentOfPayroll(parameters: IStartupParametersToExecuteRetryProcessPaymentOfPayroll) {
    const { transactions, signatureType } = parameters;

    return transactions.map((transaction) => this.paymentOfPayroll.retryProcess(transaction, signatureType)
      .pipe(
        map((response) => {
          if (response?.hasOwnProperty('error')) {
            const error = response as HttpErrorResponse;
            return this.stCommonTransaction.buildTransactionDetailResponse(transaction, error);
          }

          return this.stCommonTransaction.buildTransactionDetailResponse(transaction);
        }),
        catchError((error: HttpErrorResponse) => of(this.stCommonTransaction.buildTransactionDetailResponse(transaction, error))),
      ));
  }


  private transactionWitPostProcessService: Record<string, (startupParameters: IStartupParametersToMultipleProcessTransaction) => Observable<ISignatureTrackingServiceResponse>> = {
    // [ETMServiceCode.PAYMENT_OF_SERVICES]: this.executePaymentOfServices.bind(this),
    [ETMServiceCode.DONATION2]: this.executeDonationProcess.bind(this),
    [ETMServiceCode.DONATION]: this.executeDonationProcess.bind(this),
    [ETMServiceCode.PAYMENT_OF_TAXES]: this.executePaymentOfTaxes.bind(this),
    [ETMServiceCode.PAYMENT_OF_PROVIDERS]: this.executePaymentToProviders.bind(this),
    // [ETMServiceCode.PAYMENT_OF_CREDIT_CARD]: this.executePaymentOfCreditCard.bind(this),
    [ETMServiceCode.PAYMENT_OF_PAYROLL]: this.executePaymentOfPayroll.bind(this),
    [ETMServiceCode.PAYMENT_OF_PAYROLL_SPECIAL]: this.executePaymentOfPayroll.bind(this),
    // [ETMServiceCode.BULK_SERVICES_PAYMENT]: this.executeBulkServicesPayment.bind(this),
    // [ETMServiceCode.DIVIDE_ALL]: this.executeDivideAll.bind(this),
    // [ETMServiceCode.DISBURSEMENT_OF_CREDIT]: this.executeDisbursementOfCredit.bind(this),
    // [ETMServiceCode.EXCHANGE_CURRENCY_AUCTION]: this.executeExchangeCurrencyAction.bind(this),
    // [ETMServiceCode.EXCHANGE_CURRENCY_PURCHASE]: this.executeExchangeCurrencyPurchase.bind(this),
    // [ETMServiceCode.CASHIER_CHECK_REQUEST]: this.executeCashierCheckRequest.bind(this),
    [ETMServiceCode.ACH_TRANSFER_MANAGER]: this.processACHTransaction.bind(this),
    [ETMServiceCode.ACH_TRANSFER2]: this.processACHTransaction.bind(this),
    [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE]: this.processBulkTransaction.bind(this),
    [ETMServiceCode.ACH_MASSIVE_TRANSFERENCE2]: this.processBulkTransaction.bind(this),
    [ETMServiceCode.THIRD_PARTY_PAYMENT_LOAN]: this.executeThirdPartyLoanPayment.bind(this),
  }

  private processACHTransaction(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, achSettings, achAssociatedAccounts } = startupParameters;

    return this.stProcessACHTransaction.execute({
        settings: achSettings,
        transaction: transactionSelected,
        achAssociatedAccounts,
      })
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private processBulkTransaction(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const {
      transactionSelected,
      achSettings,
      achAssociatedAccountsMap } = startupParameters;

    return this.stProcessBulkTransaction.execute({
        transactionSelected,
        achSettings,
        achAssociatedAccounts: achAssociatedAccountsMap,
      })
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private processTransactionSimple(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.stTransaction.process({
        transactionCode: transactionSelected?.reference,
        signatureType: signatureType,
      }, this.featureManagerService.isMultipleParameterRequiredForSignatureTracking())
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }


  private executeExchangeCurrencyAction(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.exchangeCurrencyAuction.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeExchangeCurrencyPurchase(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.exchangeCurrencyPurchase.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeCashierCheckRequest(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.cashierCheckRequest.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeDisbursementOfCredit(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.disbursementOfCredit.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeDivideAll(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.divideAll.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeBulkServicesPayment(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.bulkServicesPayment.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentOfPayroll(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.paymentOfPayroll.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentOfCreditCard(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.paymentOfCreditCard.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentOfServices(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.paymentOfServices.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeDonationProcess(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.donationProcess.executeMultipleProcess(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentOfTaxes(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.paymentTaxes.execute(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executePaymentToProviders(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType, achSettings } = startupParameters;

    return this.paymentProviders.execute(transactionSelected, signatureType, achSettings)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }

  private executeThirdPartyLoanPayment(startupParameters: IStartupParametersToMultipleProcessTransaction) {
    const { transactionSelected, signatureType } = startupParameters;

    return this.stProcessThirdPartyLoanPayment.executeMultipleProcess(transactionSelected, signatureType)
      .pipe(
        map(() => this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected)),
        catchError((error) => of(this.stCommonTransaction.buildTransactionDetailResponse(transactionSelected, error)))
      );
  }
}
