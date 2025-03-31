import { Injectable } from '@angular/core';
import { BulkTransactionService } from '../transaction/bulk-transfer-transaction.service';
import { ICurrentFile, IPreResponseBulkT, IResponseLote } from '../../models/bulk-transfer.interface';
import { IAccount } from '../../../../../../models/account.inteface';
import {
  IExecuteBTTransactionStartupParameters,
  IExecutePreTransferParameters
} from '../../models/bul-transaction.interface';
import { BtdTransactionManagerService } from '../definition/transaction/btd-transaction-manager.service';
import { BTSaveTransactionBuilder, IBTSaveTransactionRequest } from '../../interfaces/bt-transaction.interface';
import { Product } from '../../../../../../enums/product.enum';
import { IAchAccount } from '../../../transfer-ach/interfaces/ach-account-interface';
import { AtdUtilService } from '../../../transfer-ach/services/atd-util.service';
import { UtilService } from '../../../../../../service/common/util.service';
import { IACHSettings } from '../../../transfer-ach/interfaces/settings.interface';
import { IBulkTransferConfirmState, IBulTransferFormValues } from '../../interfaces/bulk-transfer-parameters.interface';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { concatMap, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { ModalTokenComponent } from '../../../../../../view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IExecuteTransactionWithToken,
  IExecuteTransactionWithTokenFailedResponse
} from '../../../../../../models/token-service-response.interface';
import { HandleTokenRequestService } from '../../../../../../service/common/handle-token-request.service';
import { TransferACHService } from '../../../transfer-ach/services/transaction/transfer-ach.service';
import { Router } from '@angular/router';
import { FindServiceCodeService } from '../../../../../../service/common/find-service-code.service';
import {
  StBtProcessManagerService
} from '../../../../../transaction-manager/modules/signature-tracking/services/execution/utils/st-bt-process-manager.service';

@Injectable({
  providedIn: 'root'
})
export class BteTransactionService {
  private currentFile: ICurrentFile | null = null;
  private sourceAccount: IAccount | null = null;
  private associatedAccounts!: Map<string, IAchAccount>;
  private achSettings: IACHSettings[] = [];
  private formValues: IBulTransferFormValues | null = null;
  private fileName: string = '';
  private lotCode: IResponseLote | null = null;

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  constructor(
    private btTransactionService: BulkTransactionService,
    private transactionDefinitionManager: BtdTransactionManagerService,
    private achUtils: AtdUtilService,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
    private modalService: NgbModal,
    private handleTokenRequest: HandleTokenRequestService,
    private achTransaction: TransferACHService,
    private router: Router,
    private findServiceCode: FindServiceCodeService,
    private stBTProcessManagerService: StBtProcessManagerService,
  ) {}

  init(parameters: IExecuteBTTransactionStartupParameters) {
    const currentState: IBulkTransferConfirmState = this.parameterManagement.getParameter('navigateStateParameters');
    const {
      currentFile,
      formValues,
      achSettings,
      sourceAccount,
      associatedAccountsMap } = parameters ?? {};

    this.resetParameters();
    this.currentFile = currentFile;
    this.sourceAccount = sourceAccount;
    this.associatedAccounts = associatedAccountsMap;
    this.achSettings = achSettings;
    this.formValues = formValues;
    this.fileName = `${currentState?.fileName}`;
  }

  execute(token?: string) {
    return this.achTransaction.transactionLimits({
      currency: this.sourceAccount?.currency as string,
      service: this.findServiceCode.getServiceCode(this.router.url),
    })
      .pipe(
        concatMap((limitsResponse) =>  {
          const currentAmount = this.currentFile!.heading.totalAmount;
          if (limitsResponse && Number(currentAmount) > Number(limitsResponse.amount)) {
            return this.stBTProcessManagerService.handleErrorToTransactionLimits();
          }

          return this.executeHandler(token);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
            return this.handleInExecuteSaveTransactionByTokenMode(error);
          }

          return of(this.templateServiceResponseByTokenFlow(null, error));
        })
      )
  }

  private executeHandler(token?: string) {
    let preTransferResponse: IPreResponseBulkT;

    return this.getCodeOfLoteTransaction()
      .pipe(
        concatMap((lotCode) => this.executePreTransfer({
          isTokenRequired: this.isTokenRequired,
          token: token || '',
          lotCode,
        })),
        concatMap((response) => {
          preTransferResponse = response;
          return this.executeSaveTransaction(this.lotCode!);
        }),
        concatMap(() => this.executeTransaction(this.lotCode!, preTransferResponse)),
      );
  }

  /*  =================  HANDLER'S TO EXECUTE TRANSACTIONS WITH TOKEN REQUIRED ============= */

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.utils.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = this.executeByToken.bind(this);

    modal.dismissed.subscribe(() => {
      return;
    });

    return modal.result;
  }
  private executeByToken(token?: string) {
    this.utils.showLoader();
    return this.execute(token)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING) {
            return this.handleInExecuteSaveTransactionByTokenMode(error);
          }

          if (error?.error?.code === HttpStatusCode.INVALID_TOKEN) {
            return of(this.templateServiceResponseByTokenFlow(HttpStatusCode.INVALID_TOKEN, error));
          }

          return of(this.templateServiceResponseByTokenFlow(null, error));
        })
      );
  }

  private handleInExecuteSaveTransactionByTokenMode(errorPreTransfer: HttpErrorResponse) {
    return this.executeSaveTransaction(this.lotCode!)
      .pipe(
        map(() => this.templateServiceResponseByTokenFlow(HttpStatusCode.SIGNATURE_TRACKING, errorPreTransfer)),
        catchError((error: HttpErrorResponse) => of(this.templateServiceResponseByTokenFlow(null, error))),
      );
  }

  private getSchedule() {
    if (!this.formValues?.schedule) { return null; }

    const day = ('0' + this.formValues?.date?.day).slice(-2);
    const month = ('0' + this.formValues?.date?.month).slice(-2);
    const year = this.formValues?.date?.year;

    return {
      date: `${day}${month}${year}`,
      hour: this.formValues?.hour
    }
  }


  /*  =================  HANDLER'S TO EXECUTE TRANSACTIONS WITH TOKEN REQUIRED ============= */


  /*  ===================== SERVICES TO EXECUTE A TRANSACTION  ===================  */

  private getCodeOfLoteTransaction() {
    return this.btTransactionService.codLote();
  }

  private executePreTransfer(parameters: IExecutePreTransferParameters) {
    const { isTokenRequired, token, lotCode } = parameters ?? {};
    this.lotCode = lotCode;

    const data = this.transactionDefinitionManager.dataToExecutePreTransfer({
      sourceAccount: this.sourceAccount!,
      transactionDetail: this.currentFile?.heading!,
      loteCode: String(lotCode.correlative),
    });

    return this.btTransactionService.preTransfer(isTokenRequired, data, token)
  }

  private executeSaveTransaction(lotCode: IResponseLote) {
    const idClient = this.parameterManagement.getParameter('userInfo')?.customerCode;
    const accountsToCredit = this.parseAccountInCurrentFileToACHAccount();

    const params: IBTSaveTransactionRequest = {
      company: idClient,
      lotCode: String(lotCode.correlative),
      details: accountsToCredit,
    };

    return this.btTransactionService.saveTransaction(params);
  }

  private executeTransaction(lotCode: IResponseLote, lastResponse: IPreResponseBulkT) {
    const targetAccountList = this.achUtils.getTargetAccountForMassiveTransferenceMap({
      associatedAccountsMap: this.associatedAccounts,
      achSettings: this.achSettings,
      currentFile: this.currentFile as ICurrentFile,
    });

    const data = this.transactionDefinitionManager.dataToExecuteTransaction({
      lote: lotCode,
      sourceAccount: this.sourceAccount as IAccount,
      targetAccounts: targetAccountList,
      formValues: this.formValues as IBulTransferFormValues,
      formatRegister: 'CTX',
      fileName: this.fileName as any
    });

    return this.btTransactionService.bulkTransfer(data)
      .pipe(map(() => this.templateServiceResponseSuccess(lastResponse)));
  }


  /*  ===================== SERVICES TO EXECUTE A TRANSACTION  ===================  */


  /*  ===================== UTILITIES ====================*/

  private parseAccountInCurrentFileToACHAccount() {
    const targetAccountList = this.achUtils.getTargetAccountForMassiveTransferenceMap({
      associatedAccountsMap: this.associatedAccounts,
      achSettings: this.achSettings,
      currentFile: this.currentFile as ICurrentFile,
    });

    const schedule = this.getSchedule();
    const date = schedule ? `${schedule.date}${schedule.hour}` : '';
    const hour = schedule ? `${schedule.hour}` : '';

    return  targetAccountList?.map(account => (
      new BTSaveTransactionBuilder()
        .account(account?.account)
        .accountType(Product[account?.type])
        .amount(account?.currentAmount)
        .institution(account?.bankName)
        .institutionId(String(account?.bank))
        .participant(account?.name)
        .programmedTransfer(this.formValues?.schedule ? this.formValues?.schedule : false)
        .transferHour(hour)
        .transferDate(date)
        .build()
    ));
  }

  private resetParameters() {
    this.lotCode = null;
    this.fileName = '';
    this.currentFile = null;
    this.sourceAccount = null;
    this.achSettings = [];
    this.formValues = null;

    if (this.associatedAccounts) {
      this.associatedAccounts.clear();
    }
  }

  private templateServiceResponseByTokenFlow(status?: any, error?: HttpErrorResponse) {
    return {
      status: status ? status : error?.status,
      message: error?.error?.message,
      error: error?.error,
    } as IExecuteTransactionWithTokenFailedResponse<IPreResponseBulkT>;
  }

  private templateServiceResponseSuccess(data: IPreResponseBulkT | null) {
    return {
      status: HttpStatusCode.SUCCESS_TRANSACTION,
      message: undefined,
      data,
    } as IExecuteTransactionWithToken<IPreResponseBulkT>;
  }

  /*  ===================== UTILITIES ====================*/


}
