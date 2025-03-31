import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IDataReading } from '@adf/components';
import { concatMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, map } from 'rxjs/operators';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import {
  IAchFormValues,
  IACHTransactionResponse,
  IAddFavoriteACH,
  TAchTransactionResponse,
} from '../../../interfaces/ach-transfer.interface';
import { TransferACHService } from '../../../services/transaction/transfer-ach.service';
import { AtdTransferManagerService } from '../../../services/definition/transaction/atd-transfer-manager.service';
import { HttpStatusCode } from '../../../../../../../enums/http-status-code.enum';
import { IAccount } from '../../../../../../../models/account.inteface';
import { EACHNavigationParameters, EACHTransferUrlNavigationCollection } from '../../../enum/navigation-parameter.enum';
import { IFlowError } from '../../../../../../../models/error.interface';
import { IACHSettings, IDataToSettingsACH } from '../../../interfaces/settings.interface';
import { IACHTransactionNavigateParametersState } from '../../../interfaces/ach-persists-parameters.interface';
import { EACHTransactionViewMode, EACHTypeTransaction } from '../../../enum/transfer-ach.enum';
import { AtdUtilService } from '../../../services/atd-util.service';
import { StBuildUpdateBodyRequestService } from '../../../../../../transaction-manager/modules/signature-tracking/services/definition/st-build-update-body-request.service';
import { SignatureTrackingService } from '../../../../../../transaction-manager/modules/signature-tracking/services/transaction/signature-tracking.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from '../../../../../../../enums/transaction-header.enum';
import {
  ISTBodyRequestACHTransaction
} from '../../../../../../transaction-manager/modules/signature-tracking/interfaces/st-transfer.interface';
import { HandleTokenRequestService } from '../../../../../../../service/common/handle-token-request.service';
import { UtilTransactionService } from '../../../../../../../service/common/util-transaction.service';
import {
  ETabPosition
} from '../../../../../../transaction-manager/modules/signature-tracking/enum/st-transaction-status.enum';
import { FindServiceCodeService } from '../../../../../../../service/common/find-service-code.service';
import {
  StBtProcessManagerService
} from '../../../../../../transaction-manager/modules/signature-tracking/services/execution/utils/st-bt-process-manager.service';
import { IACHScheduleResponse } from '../../../interfaces/ach-transaction.interface';

@Component({
  selector: 'byte-ach-confirmation',
  templateUrl: './ach-confirmation.component.html',
  styleUrls: ['./ach-confirmation.component.scss'],
})
export class AchConfirmationComponent implements OnInit {
  voucherConfirmation: IDataReading | null = null;
  targetAccountSelected: IAchAccount | null = null;
  formValues: IAchFormValues | undefined;
  sourceAccountSelected: IAccount | undefined;

  settings: IACHSettings[] = [];

  typeAlert: string | undefined;
  messageAlert: string | undefined;
  isFavorite: boolean = false;
  isGeneralSettingsError = false;
  view: string | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  constructor(
    private location: Location,
    private modalService: NgbModal,
    private router: Router,
    private persistStepStateService: ParameterManagementService,
    private transferACH: TransferACHService,
    private transactionDefinitionManager: AtdTransferManagerService,
    private util: UtilService,
    private activatedRoute: ActivatedRoute,
    private achUtils: AtdUtilService,
    private stBuildUpdateBodyRequest: StBuildUpdateBodyRequestService,
    private handleTokenRequest: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
    private findServiceCode: FindServiceCodeService,
    private stBTProcessManager: StBtProcessManagerService,
    private stTransactionService: SignatureTrackingService,
  ) {
    this.handleBackNavigation();
  }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.util.hideLoader();
  }

  initState() {
    const navigateStateParameters: IACHTransactionNavigateParametersState = this.persistStepStateService.getParameter('navigateStateParameters');

    this.targetAccountSelected = navigateStateParameters?.targetAccount;
    this.sourceAccountSelected = navigateStateParameters?.sourceAccount;
    this.formValues = navigateStateParameters?.formValues;
    this.view = this.activatedRoute.snapshot.data['view'];
  }

  initDefinition() {
    if (this.view === EACHTransactionViewMode.DEFAULT) {
      this.showAlert('info', 'info_ach_message_confirm');
      this.getLisOfBank();
      this.isFavorite = this.targetAccountSelected?.favorite as boolean;

      this.buildConfirmationVoucher('transfers_other_banks', 'transfer_confirmation');
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.buildConfirmationVoucher('signature_tracking', 'signature_tackingModifyConfirmationTransaction', false);
    }
  }

  buildConfirmationVoucher(title: string, subtitle: string, isShowFavoriteWidget = true) {
    this.voucherConfirmation = this.transactionDefinitionManager.buildVoucherConfirmation(
      {
        accountToDebited: this.sourceAccountSelected as IAccount,
        accountToCredit: this.targetAccountSelected as IAchAccount,
        formValues: this.formValues as IAchFormValues,
        title,
        subtitle,
      },
      isShowFavoriteWidget
    );
  }

  nextStep() {
    if (this.view === EACHTransactionViewMode.DEFAULT) {
      this.handleExecuteTransaction();
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.handleExecuteModifyTransaction();
    }
  }

  handleExecuteTransaction() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction()
      .subscribe({
        next: (response) => {
          this.handleResponseTransaction(response);
        }
      })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.util.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = this.executeTransaction.bind(this);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result as Promise<TAchTransactionResponse>).then(
      (result) => {
        if (!result) {
          return;
        }

        console.log(result);

        this.handleResponseTransaction(result);
      },
      (error) => error
    );
  }

  handleResponseTransaction(response: TAchTransactionResponse) {
    if (response?.status !== 200 && +response?.status !== +HttpStatusCode.SIGNATURE_TRACKING) {
      this.util.hideLoader();
      this.showAlert('error', response?.message);
      this.scrollToTop();
      return;
    }

    const isSignatureTrackingTransaction = Number(response?.status) === Number(HttpStatusCode.SIGNATURE_TRACKING);

    const parameters: IACHTransactionNavigateParametersState = {
      sourceAccount: this.sourceAccountSelected,
      targetAccount: this.targetAccountSelected as IAchAccount,
      formValues: this.formValues,
      transactionResponse: isSignatureTrackingTransaction ? null : response?.data,
      message: isSignatureTrackingTransaction ? response?.message : undefined,
      typeTransaction: isSignatureTrackingTransaction ? EACHTypeTransaction.SIGNATURE_TRACKING : EACHTypeTransaction.DEFAULT,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: EACHNavigationParameters.VOUCHER,
    });

    this.router.navigate([EACHTransferUrlNavigationCollection.DEFAULT_VOUCHER]).finally(() => this.util.hideLoader());
  }

  executeTransaction(token?: string) {
    const navigateStateParameters: IACHTransactionNavigateParametersState = this.persistStepStateService.getParameter('navigateStateParameters');
    this.util.showLoader();
    const data = this.achUtils.dataToExecuteTransaction({
      accreditedAccount: this.targetAccountSelected as IAchAccount,
      debitedAccount: this.sourceAccountSelected as IAccount,
      formValues: this.formValues as IAchFormValues,
      dataFromSettings: this.achUtils.getDataToListOfBanks(this.settings, this.targetAccountSelected as IAchAccount) as IDataToSettingsACH,
      omitASTransaction: false,
      hourSelected: navigateStateParameters?.hourSelected as IACHScheduleResponse,
    });

    return this.transferACH.transactionLimits({
      currency: this.sourceAccountSelected?.currency as string,
      service: this.findServiceCode.getServiceCode(this.router.url),
    })
      .pipe(
        concatMap(limitsResponse => {
          if (limitsResponse && Number(this.formValues?.amount) > Number(limitsResponse.amount)) {
            return this.stBTProcessManager.handleErrorToTransactionLimits();
          }

          return this.transferACH.achTransfer(this.isTokenRequired, data, token as string)
            .pipe(finalize(() => this.managementFavoriteTransaction()));
        }),
        map(response => this.utilsTransaction.handleResponseTransaction<IACHTransactionResponse>(response)),
        catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
      );
  }

  managementFavoriteTransaction() {
    if (this.isFavorite !== this.targetAccountSelected?.favorite && this.isFavorite) {
      const account: IAddFavoriteACH = {
        number: this.targetAccountSelected?.account ?? '',
        alias: this.targetAccountSelected?.alias ?? '',
      };

      this.transferACH.addFavorite(account).subscribe(() => {});
    } else if (this.isFavorite !== this.targetAccountSelected?.favorite && !this.isFavorite) {
      this.transferACH.deleteFavorite(this.targetAccountSelected?.account as string).subscribe(() => {});
    }
  }

  getLisOfBank() {
    const responseFromResolver = this.activatedRoute.snapshot.data['settings'];

    if (!responseFromResolver || responseFromResolver.hasOwnProperty('error')) {
      this.isGeneralSettingsError = !this.isGeneralSettingsError;
      this.showAlert('error', (responseFromResolver as IFlowError).message);
      return;
    }

    this.settings = responseFromResolver as IACHSettings[];
  }

  lastStep() {
    if (this.view === EACHTransactionViewMode.DEFAULT) {
      this.resetStorage(EACHNavigationParameters.TRANSFER_FORM);
      this.location.back();
      return;
    }

    if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
      this.resetStorage(EACHNavigationParameters.TRANSFER_FORM_UPDATE_MODE);
      this.location.back();
    }
  }

  handleExecuteModifyTransaction() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    const updateParams = {
      transactionCode: achState?.transactionSelected?.reference,
      serviceModify: achState.transactionSelected?.serviceCode,
      data: this.getBodyToUpdateTransaction(),
    };



    this.util.showLoader();

    this.stTransactionService.update(updateParams).subscribe({
      next: (response) => {
        this.goToSignatureTrackingVoucher(response?.reference, response?.dateTime);
      },
      error: (error: HttpErrorResponse) => {
        if (error?.error?.code === HttpStatusCode.SIGNATURE_TRACKING_MODIFY_SUCCESS) {
          this.goToSignatureTrackingVoucher(error?.error?.reference ?? undefined, error?.error?.dateTime ?? undefined);
          return;
        }

        this.showAlert('error', error?.error?.message ?? 'signature_tracking:error:modify_transaction');
      },
    });
  }

  getBodyToUpdateTransaction() {
    const achState = this.persistStepStateService.getParameter('navigateStateParameters');

    const requestProperties: ISTBodyRequestACHTransaction = {
      sourceAccount: achState?.sourceAccount,
      targetAccount: achState?.targetAccount,
      amount: this.formValues?.amount as any,
      comment: this.formValues?.comment,
      detailAccountToUpdate: achState?.transactionManagerDetail,
      formValues: this.formValues as IAchFormValues,
      hourSelected: achState?.hourSelected as IACHScheduleResponse,
    };

    return this.stBuildUpdateBodyRequest.buildBodyToUpdateACHTransfer({ ...requestProperties });
  }

  goToSignatureTrackingVoucher(reference: string, date: string) {
    const parameters: IACHTransactionNavigateParametersState = {
      sourceAccount: this.sourceAccountSelected,
      targetAccount: this.targetAccountSelected as IAchAccount,
      formValues: this.formValues,
      transactionResponse: {
        reference,
        dateTime: date,
      },
      position: ETabPosition.ENTERED,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: EACHNavigationParameters.VOUCHER_UPDATE_MODE,
    });

    this.router.navigate([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_VOUCHER]).finally(() => this.util.hideLoader());
  }

  resetStorage(navParam: string | null = null) {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: navParam,
    });
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  handleBackNavigation() {
    this.router.events.subscribe((event: any) => {
      if (event.navigationTrigger === 'popstate') {
        if (this.view === EACHTransactionViewMode.DEFAULT) {
          this.resetStorage(EACHNavigationParameters.TRANSFER_FORM);
          return;
        }

        if (this.view === EACHTransactionViewMode.SIGNATURE_TRACKING_UPDATE) {
          this.resetStorage(EACHNavigationParameters.TRANSFER_FORM_UPDATE_MODE);
          return;
        }
      }
    });
  }

  showAlert(typeAlert?: string, message?: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  handleChangeIsFavoriteTransaction() {
    this.isFavorite = !this?.isFavorite;
  }
}
