import { Injectable } from '@angular/core';
import { StBisvService } from '../../../../transaction/st-bisv.service';
import {
  IStBisvAchMassiveLoteDetailTransferResponse, IStBisvAchMassiveTransferAccountResponse,
  IStBisvAchMassiveTransferStartupParameters, IStBisvAchMassiveTransferTermsResponse
} from '../../../../../interfaces/bisv/st-ach.interface';
import { concatMap, of, throwError } from 'rxjs';
import { IUserInfo } from '../../../../../../../../../models/user-info.interface';
import {
  AchUniTransferService
} from '../../../../../../../../transfer/modules/transfer-ach-uni/services/transaction/ach-uni-transfer.service';
import {
  ServiceTypeStatusTermsConditions
} from '../../../../../../../../transfer/enum/service-type-status-terms-conditions.enum';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { TranslateService } from '@ngx-translate/core';
import { SignatureTrackingService } from '../../../../transaction/signature-tracking.service';
import {
  TmAchUniTransactionService
} from '../../../../../../../../transfer/modules/transfer-ach-uni-multiple/services/transaction/tm-ach-uni-transaction.service';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { ITransactionManagerAccountDetail } from '../../../../../../../interfaces/transaction-manger.interface';
import {
  IOwnAccount,
  OwnTransferAccount
} from '../../../../../../../../transfer/modules/transfer-own/interfaces/own-transfer.interface';
import { TmCommonService } from '../../../../../../../services/tm-common.service';
import { map } from 'rxjs/operators';
import { IFlowError } from '../../../../../../../../../models/error.interface';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import moment from 'moment/moment';


@Injectable({
  providedIn: 'root'
})
export class StBisvAchMassiveTransferenceService {

  constructor(
    private stBisvTransactionService: StBisvService,
    private achUniTransactionService: AchUniTransferService,
    private parameterManagement: ParameterManagementService,
    private translate: TranslateService,
    private stTransaction: SignatureTrackingService,
    private achUniMultipleTransactionService: TmAchUniTransactionService,
    private stSplitTransactionService: StBisvSplitTransactionManagerService,
    private tmCommonService: TmCommonService,

  ) { }

  execute(parameters: IStBisvAchMassiveTransferStartupParameters) {
    return this.handleExecuteTransaction(parameters);
  }

  handleExecuteTransaction(parameters: IStBisvAchMassiveTransferStartupParameters) {
    return this.getTermsAndCondition()
      .pipe(
        concatMap((response) => this.manageTermsAndConditionResponse({
          ...parameters,
          response,
        })),
        concatMap(() => this.executeTransaction(parameters))
      )
  }

  private manageTermsAndConditionResponse(parameters: IStBisvAchMassiveTransferTermsResponse) {
    const { response, isTokenRequired } = parameters;
    if (!response || !response.hasOwnProperty('result') || response.result === 'N') {
      return this.handleErrorAcceptedTermsAndCondition();
    }

    if (isTokenRequired) return this.processWithToken(parameters)

    return this.process(parameters);
  }

  private processWithToken(parameters: IStBisvAchMassiveTransferTermsResponse) {
    const { transaction, signatureType, token, isTokenRequired } = parameters;

    return this.stTransaction.processWithToken({
      isTokenRequired: isTokenRequired as boolean,
      tokenValue: token as string,
      typeTransaction: ERequestTypeTransaction.ACH_TRANSFER,
      bodyRequest: {
        transactionCode: transaction?.reference,
        signatureType,
        serviceCode: transaction.serviceCode,
      },
      serviceCode: transaction.serviceCode,
    });
  }

  private getTermsAndCondition() {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    return this.achUniTransactionService.getStatusTermsConditions(ServiceTypeStatusTermsConditions.UNI, userInfo.customerCode);
  }

  private executeTransaction(parameters: IStBisvAchMassiveTransferStartupParameters) {
    return this.getSourceAccount(parameters).pipe(
      concatMap((response) => this.manageExecuteTransfer({
        ...parameters,
        sourceAccountResponse: response,
      })),

    )
  }

  private manageExecuteTransfer(parameters: IStBisvAchMassiveTransferAccountResponse) {
    const { sourceAccountResponse } = parameters;

    return this.getTransactionDetailLote(parameters).pipe(
      concatMap((loteResponse) => this.executeTransfer({
        ...parameters,
        responseLote: loteResponse,
        sourceAccountResponse,
      })),
      concatMap(() => this.notify(parameters)),
      concatMap(() => this.genericNotify(parameters)),
    )
  }

  private process(parameters: IStBisvAchMassiveTransferTermsResponse) {
    const { transaction, signatureType } = parameters;

    return this.stTransaction.process({
      transactionCode: transaction?.reference,
      signatureType,
    });
  }

  private getTransactionDetailLote(parameters: IStBisvAchMassiveTransferAccountResponse) {
    const { loteDetail, transaction } = parameters;
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const transactionDetail = this.stSplitTransactionService.getDetailTransactionMultipleUniACH(transaction.request);

    if (!loteDetail) {
      return this.achUniMultipleTransactionService.getTransactionDetailByLote(userInfo.customerCode, transactionDetail.lote);
    }

    return of(loteDetail);
  }

  private executeTransfer(parameters: IStBisvAchMassiveLoteDetailTransferResponse) {
    const bodyRequest = this.buildBodyRequestToTransfer(parameters);
    return this.achUniMultipleTransactionService.executeMultipleTransfer(bodyRequest, false);
  }

  private notify(parameters: IStBisvAchMassiveTransferAccountResponse) {
    const { transaction, sourceAccountResponse } = parameters;
    const transactionDetail = this.stSplitTransactionService.getDetailTransactionMultipleUniACH(transaction.request);

    return this.stBisvTransactionService.achMassiveNotify({
      accountDebit: transactionDetail.sourceAccount,
      lot: transactionDetail.lote,
      accountDebitName: sourceAccountResponse.name,
      currency: transactionDetail.sourceAccountCurrency,
      creditsQuantity: transactionDetail.credits,
      totalCreditAmount: transactionDetail.formattedAmount,
    });
  }

  getEmissionDate() {
    const date = moment().format('DD/MM/YYYY')
    const hour = moment().format('HH')
    const minute = moment().format('mm')

    return `${date.split('/').join('')}${hour}${minute}00`;
  }

  private genericNotify(parameters: IStBisvAchMassiveTransferAccountResponse) {
    const transactionDetail = this.stSplitTransactionService.getDetailTransactionMultipleUniACH(parameters.transaction.request);
    const date = this.getEmissionDate();

    return this.stBisvTransactionService.achGenericNotify({
      sourceAccount: parameters.sourceAccountResponse?.account ?? '',
      dateTime: date,
      amount: transactionDetail?.formattedAmount,
      reference: parameters?.transaction?.reference,
      currency: transactionDetail.sourceAccountCurrency,
    })
  }

  private getSourceAccount(parameters: IStBisvAchMassiveTransferStartupParameters) {
    const { transaction, sourceAccount } = parameters;
    const transactionDetail = this.stSplitTransactionService.getDetailTransactionMultipleUniACH(transaction.request);

    if (sourceAccount) return of(sourceAccount as unknown as IOwnAccount);

    return this.tmCommonService.getSourceAccount(transactionDetail.sourceAccount).pipe(
      map((response) => this.buildSourceAccount(response))
    )
  }

  private buildBodyRequestToTransfer(parameters: IStBisvAchMassiveLoteDetailTransferResponse) {
    const { transaction, sourceAccountResponse } = parameters;

    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const transactionDetail = this.stSplitTransactionService.getDetailTransactionMultipleUniACH(transaction.request);
    const clientType = this.parameterManagement.getParameter('clientType');
    const date: Date = new Date();

    return {
      clientNumber: userInfo.customerCode,
      creditCount: String(transactionDetail.credits),
      amount: String(transactionDetail.formattedAmount),
      currency: transactionDetail.sourceAccountCurrency,
      authorization: transactionDetail.lote,
      sourceAccountNumber: transactionDetail.sourceAccount,
      fileName: transactionDetail.fileName,
      date: date.toISOString(),
      sourceAccountProduct: String(0),
      sourceAccountName: sourceAccountResponse.name,
      clientType: clientType,
      omitASTransaction: true,
      credits: this.buildCreditsToTransfer(parameters),
    }
  }

  private buildCreditsToTransfer(parameters: IStBisvAchMassiveLoteDetailTransferResponse) {
    const { responseLote } = parameters;

    return responseLote.map(register => {
      return {
        bankCode: String(register.bankCode),
        product: String(register.product),
        currency: register.currency,
        accountNumber: register.account,
        amount: String(register.amount),
        description: register.comment,
        lineNumber: register.id,
        serviceType: 'UNI',
        targetType: '',
        email: '',
      }
    });
  }

  private handleErrorAcceptedTermsAndCondition() {
    const message = this.translate.instant('error:massive_transference_limit');

    return throwError(() => ({
      error: {
        message,
      },
      status: 400,
      statusText: message,
    }));
  }

  private buildSourceAccount(account: ITransactionManagerAccountDetail | IFlowError) {
    if (account.hasOwnProperty('error')) {
      return new OwnTransferAccount()
        .build();
    }

    const sourceAccount = account as ITransactionManagerAccountDetail;
    return new OwnTransferAccount()
      .account(sourceAccount?.account ?? '')
      .currency(sourceAccount?.currency ?? '')
      .enabled(true)
      .mask(sourceAccount?.mask ?? '')
      .name(sourceAccount?.name ?? '')
      .product(Number(sourceAccount?.productType ?? 0))
      .status(sourceAccount?.status ?? '')
      .subproduct(Number(sourceAccount?.subProductType ?? 0))
      .build();
  }


  // servicios
  // un metodo por cada servbicio

  // getAccont - cuenta origen ✅
  // getCard (response getAccount)- /*
  // if cuenta valida === ok
  // service cuenta valida
  // service cuenta no valida
  // */
  // succecss (respuesta) =>

  // getInfo - cif - respueta get CArd
  // payment - numero cuenta, monedas

}
