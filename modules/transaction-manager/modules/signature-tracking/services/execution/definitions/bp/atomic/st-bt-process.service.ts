import { Injectable } from '@angular/core';
import { concatMap, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import {
  IACHSettings,
  IDataToSettingsACH
} from '../../../../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import {
  IAchAccount,
  IAChBulkTransferAccount
} from '../../../../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import {
  IBTSaveTransactionRequest
} from '../../../../../../../../transfer/modules/bulk-transfer/interfaces/bt-transaction.interface';
import { AccountBuilder, IAccount } from '../../../../../../../../../models/account.inteface';
import { ITMTransaction } from '../../../../../../../interfaces/tm-transaction.interface';
import {
  IBulTransferFormValues
} from '../../../../../../../../transfer/modules/bulk-transfer/interfaces/bulk-transfer-parameters.interface';
import { HandleTokenRequestService } from '../../../../../../../../../service/common/handle-token-request.service';
import {
  ParameterManagementService
} from '../../../../../../../../../service/navegation-parameters/parameter-management.service';
import {
  SplitTransactionDetailService
} from '../../../../../../../services/manager/bp/split-transaction-detail.service';
import { StBtProcessManagerService } from '../../../utils/st-bt-process-manager.service';
import { AtdUtilService } from '../../../../../../../../transfer/modules/transfer-ach/services/atd-util.service';
import { UtilService } from '../../../../../../../../../service/common/util.service';
import { UtilTransactionService } from '../../../../../../../../../service/common/util-transaction.service';
import { IBTProcessStartupParameters } from '../../../../../interfaces/st-process-multiple.interface';
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
import { ITMRequestDetailBulkTransaction } from '../../../../../../../interfaces/transaction-manger.interface';


@Injectable({
  providedIn: 'root'
})
export class StBtProcessService {
  private settings: IACHSettings[] = [];
  private associatedAccounts: IAchAccount[] = [];
  private achAssociatedAccountsLoaded: IBTSaveTransactionRequest | undefined = undefined;
  private sourceAccountLoaded: IAccount | undefined = undefined;
  private transactionSelected: ITMTransaction | null = null;
  private associatedMappedAccounts: Map<string, IAchAccount> = new Map<string, IAchAccount>();
  private formValues: IBulTransferFormValues | null = null;

  constructor(
    private handleTokenRequest: HandleTokenRequestService,
    private persistStepStateService: ParameterManagementService,
    private splitService: SplitTransactionDetailService,
    private stBTProcessManagerService: StBtProcessManagerService,
    private achUtils: AtdUtilService,
    private modalService: NgbModal,
    private router: Router,
    private utils: UtilService,
    private utilTransaction: UtilTransactionService,
  ) {
    this.reset();
  }

  private setAssociatedMappedAccounts() {
    for (const account of this.associatedAccounts) {
      this.associatedMappedAccounts.set(account.account, account);
    }
  }

  execute(parameters: IBTProcessStartupParameters) {
    const {
      achSettings,
      achAssociatedAccounts,
      transactionSelected,
      achAssociatedAccountsLoaded,
      sourceAccountLoaded,
      formValues} = parameters ?? {};

    this.settings = achSettings;
    this.associatedAccounts = achAssociatedAccounts;
    this.achAssociatedAccountsLoaded = achAssociatedAccountsLoaded;
    this.sourceAccountLoaded = sourceAccountLoaded;
    this.transactionSelected = transactionSelected;
    this.formValues = formValues as IBulTransferFormValues;

    this.setAssociatedMappedAccounts();
    this.handleValidateToken();
  }

  private handleExecutionTransaction(token?: string) {
    this.utils.showLoader();
    return this.executeTransaction(token)
      .pipe(
        map(response => this.utilTransaction.handleResponseTransaction(response)),
        catchError(error => of(this.utilTransaction.handleErrorTransaction(error))),
      );
  }

  private executeTransaction(token?: string) {
    const transactionDetailFromRequest = this.splitService.getTransactionDetailForBulkTransferRequest(this.transactionSelected?.request!);
    const sourceAccount = this.buildSourceAccount(transactionDetailFromRequest);

    return this.process(token)
      .pipe(
        concatMap(() => this.stBTProcessManagerService.getTransactionLimits(this.transactionSelected!, transactionDetailFromRequest)),
        concatMap((limitsResponse) => {
          const currentAmount = transactionDetailFromRequest.amount;
          if (limitsResponse && Number(currentAmount) > Number(limitsResponse.amount)) {
            return this.stBTProcessManagerService.handleErrorToTransactionLimits();
          }

          return this.stBTProcessManagerService.executeNotification(this.transactionSelected!, sourceAccount, transactionDetailFromRequest);
        }),
        concatMap(() => {
          return this.stBTProcessManagerService.executeTransaction({
            parameters: {
              transactionSelected: this.transactionSelected!,
              sourceAccount,
              accountsToTransaction: this.achAssociatedAccountsLoaded!,
              transactionDetail: transactionDetailFromRequest,
            },
            targetAccount: this.buildTargetAccounts(),
            formValues: this.formValues,
          });
        })
      );
  }

  private process(token?: string) {
    if (!this.handleTokenRequest.isTokenRequired(this.transactionSelected?.serviceCode)) {
      return this.stBTProcessManagerService.executeProcessTransactionWithoutToken(this.transactionSelected!, false);
    }

    return this.stBTProcessManagerService.executeProcessTransactionWithToken(this.transactionSelected!, token);
  }

  private handleValidateToken() {
    if (this.handleTokenRequest.isTokenRequired(this.transactionSelected?.serviceCode)) {
      this.tokenModal();
      return
    }

    this.handleExecutionTransaction().subscribe({
      next: (result) => {
        this.handleTransactionResponse(result);
      },
    })
  }

  private tokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = this.handleExecutionTransaction.bind(this);

    modal.result.then(result => {
      this.handleTransactionResponse(result);
    }).catch(error => error);
  }

  private handleTransactionResponse(result: ITransactionSuccessResponse | ITransactionFailedResponse) {
    if (result.status === HttpStatusCode.INVALID_TOKEN) return;

    if (result.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      const parameters = {
        position: ETabPosition.AUTHORIZED,
        message: result.message,
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

  private buildSourceAccount(detailTransaction: ITMRequestDetailBulkTransaction) {
    return new AccountBuilder()
      .account(detailTransaction?.sourceAccount)
      .currency(detailTransaction?.sourceCurrency)
      .product(Number(detailTransaction?.sourceProduct))
      .subproduct(Number(this.sourceAccountLoaded?.subproduct ?? this.sourceAccountLoaded?.subProduct))
      .name(this.sourceAccountLoaded?.name!)
      .email('')
      .build();
  }

  private buildTargetAccounts() {
    const accountParsed: IAChBulkTransferAccount[] = [];

    for (const account of this.achAssociatedAccountsLoaded?.details!) {
      if (this.associatedMappedAccounts.has(account.account)) {
        accountParsed.push({
          ...this.associatedMappedAccounts.get(account.account)!,
          currentAmount: account.amount,
          ...(this.achUtils.getDataToListOfBanks(this.settings, this.associatedMappedAccounts.get(account.account)!) as IDataToSettingsACH),
        })
      }
    }

    return accountParsed;
  }

  private reset() {
    this.settings = [];
    this.associatedAccounts = [];
    this.achAssociatedAccountsLoaded = undefined;
    this.sourceAccountLoaded = undefined;
    this.transactionSelected = null;
    this.formValues = null;
  }
}
