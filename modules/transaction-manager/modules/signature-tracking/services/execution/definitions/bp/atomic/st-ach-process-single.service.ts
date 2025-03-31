import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { concatMap, of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map } from 'rxjs/operators';
import { AccountBuilder, IAccount } from '../../../../../../../../../models/account.inteface';
import { IAchAccount } from '../../../../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import { IACHSettings } from '../../../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { ITMRequestDetailACHTransaction } from '../../../../../../../interfaces/transaction-manger.interface';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import { StBtProcessManagerService } from '../../../utils/st-bt-process-manager.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { AtdUtilService } from '../../../../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import {
  TransferACHService
} from '../../../../../../../../transfer/modules/transfer-ach/services/transaction/transfer-ach.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import { IACHProcessSingleTransactionParameters } from '../../../../../interfaces/st-ach-process.interface';
import { ModalTokenComponent } from '../../../../../../../../../view/private/token/modal-token/modal-token.component';
import { environment } from '../../../../../../../../../../environments/environment';
import { ERequestTypeTransaction } from '../../../../../../../../../enums/transaction-header.enum';
import {
  ITransactionFailedResponse,
  ITransactionSuccessResponse
} from '../../../../../../../../../models/utils-transaction.interface';
import { HttpStatusCode } from '../../../../../../../../../enums/http-status-code.enum';
import { ETabPosition } from '../../../../../enum/st-transaction-status.enum';
import { ESTTransactionStatus } from '../../../../../enum/st-common.enum';
import { ESignatureTrackingUrlFlow } from '../../../../../enum/st-navigate-enum';


@Injectable({
  providedIn: 'root'
})
export class StAchProcessSingleService {
  private account: IAchAccount | null = null;
  private transaction: ITMTransaction | null = null;
  private sourceAccount: IAccount | null = null;
  private achSettings: IACHSettings[] = [];
  private detailACHTransaction: ITMRequestDetailACHTransaction | undefined = undefined;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private utils: UtilService,
    private utilTransaction: UtilTransactionService,
    private handleTokenRequest: HandleTokenRequestService,
    private stBTProcessManagerService: StBtProcessManagerService,
    private splitService: SplitTransactionDetailService,
    private achUtils: AtdUtilService,
    private achTransaction: TransferACHService,
    private translate: TranslateService,
    private persistStepStateService: ParameterManagementService,
  ) {
    this.resetState();
  }

  execute(parameters: IACHProcessSingleTransactionParameters) {
    const { associatedAccounts, transaction, achSettings, sourceAccount } = parameters;

    this.transaction = transaction;
    this.sourceAccount = sourceAccount;
    this.achSettings = achSettings;
    const detailFromRequest = this.splitService.getTransactionDetailForACHRequest(this.transaction?.request);
    this.detailACHTransaction = detailFromRequest;
    this.account = associatedAccounts.find(account => account.account === detailFromRequest?.targetAccount) as IAchAccount;
    this.handleTokenRequestService();
  }

  private handleTokenRequestService() {
    if (this.handleTokenRequest.isTokenRequired(this.transaction?.serviceCode)) {
      this.tokenModal();
      return;
    }

    this.transactionHandler().subscribe({
      next: response => this.handleTransactionResponse(response),
    });
  }

  private tokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = this.transactionHandler.bind(this);

    modal.result.then(result => {
      console.log('result', result);
      this.handleTransactionResponse(result);
    }).catch(error => error);
  }

  private executeProcessTransaction(token?: string) {
    this.utils.showLoader();

    return this.process(token)
      .pipe(
        concatMap(() => this.achTransaction.transactionLimits({
          currency: this.detailACHTransaction?.sourceCurrency as string,
          service: this.transaction?.serviceCode as string,
        })),
        concatMap((limitsResponse) => {
          const currentAmount = this.detailACHTransaction?.amount;

          if (limitsResponse && Number(currentAmount) > Number(limitsResponse.amount)) {
            return this.stBTProcessManagerService.handleErrorToTransactionLimits();
          }

          return this.executeTransaction();
        })
      );
  }

  private process(token?: string) {
    if (!this.handleTokenRequest.isTokenRequired(this.transaction?.serviceCode)) {
      return this.stBTProcessManagerService.executeProcessTransactionWithoutToken(this.transaction!, false);
    }

    return this.stBTProcessManagerService.executeProcessTransactionWithToken(this.transaction!, token)
  }

  private executeTransaction() {
    const detailFromRequest = this.splitService.getTransactionDetailForACHRequest(this.transaction?.request!);
    const bankData = this.achUtils.getDataToListOfBanks(this.achSettings, this.account!);

    const errorMessage = this.translate.instant('error:st_missing_target_account');

    if (!this.account || !bankData) {
      return throwError(() => {
        return {
          error: {
            message: errorMessage,
          },
          status: 400,
          statusText: errorMessage,
          headers: null,
        }
      })
    }

    const calcDate = this.achUtils.buildScheduleForUseInServiceProcess(detailFromRequest?.transferenceDateRaw, detailFromRequest?.transferenceHour);
    const isSchedule = this.achUtils.buildIsTransactionSchedule(detailFromRequest?.transferenceDate, detailFromRequest?.transferenceHour);
    const hourSchedule = {
      hour: '',
      code: detailFromRequest?.transferenceHourRaw,
      description: detailFromRequest?.transferenceHour
    }

    const dataToExecute = this.achUtils.dataToExecuteTransaction({
      debitedAccount: new AccountBuilder()
        .account(detailFromRequest?.sourceAccount)
        .currency(detailFromRequest?.sourceCurrency)
        .product(Number(detailFromRequest?.sourceProduct))
        .subproduct(Number(detailFromRequest?.sourceSubProduct))
        .name(this.sourceAccount?.name as string)
        .build(),
      formValues: {
        accountDebited: detailFromRequest?.sourceAccount,
        amount: detailFromRequest?.amount,
        comment: detailFromRequest?.comment,
        schedule: isSchedule,
        date: isSchedule ? calcDate.date : null,
        hour: isSchedule ? calcDate.hour : null,
      },
      omitASTransaction: true,
      dataFromSettings: bankData,
      accreditedAccount: this.account,
      hourSelected: isSchedule ? hourSchedule : null,
    });


    return this.achTransaction.achTransfer(false, dataToExecute, null);
  }

  private transactionHandler(token?: string) {
    this.utils.showLoader();

    return this.executeProcessTransaction(token)
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error))),
      );
  }

  private handleTransactionResponse(response: ITransactionSuccessResponse | ITransactionFailedResponse) {
    if (response.status === HttpStatusCode.INVALID_TOKEN) return;

    if (response.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      const parameters = {
        position: ETabPosition.AUTHORIZED,
        message: response.message,
        failed: true,
        status: ESTTransactionStatus.FAILED,
      };

      this.persistStepStateService.sendParameters({
        navigateStateParameters: parameters,
        navigationProtectedParameter: null,
      });

      this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
      return;
    }

    const parameters = {
      position: ETabPosition.AUTHORIZED,
      message: null,
      failed: false,
      status: ESTTransactionStatus.SUCCESS,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: null,
    });

    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => this.utils.hideLoader());
  }

  private resetState() {
    this.account = null;
    this.transaction = null;
  }
}
