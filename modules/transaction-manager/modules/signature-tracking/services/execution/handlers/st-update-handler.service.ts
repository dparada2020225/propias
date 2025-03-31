import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  ITMNavigateHandlerParams,
  ITMServiceDetailAccount
} from '../../../../../interfaces/transaction-manager-navigate.interface';
import {
  EOwnTransferProtectedNavigation,
  EOwnTransferUrlNavigationCollection
} from '../../../../../../transfer/modules/transfer-own/enum/navigation-parameter.enum';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection
} from '../../../../../../transfer/modules/transfer-third/enums/third-transfer-navigate-parameters.enum';
import {
  EDonationNavigationProtected,
  EDonationTransferUrlNavigationCollection
} from '../../../../../../transfer/modules/donation/enum/donation.enum';
import {ETMServiceCode} from '../../../../../enums/service-code.enum';
import {TmCommonService} from '../../../../../services/tm-common.service';
import {
  EACHNavigationParameters,
  EACHTransferUrlNavigationCollection
} from '../../../../../../transfer/modules/transfer-ach/enum/navigation-parameter.enum';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  ENavigateProtectionParameter,
  ETPLPaymentUrlNavigationCollection
} from '../../../../../../loan/modules/third-party-loans/enum/navigate-protection-parameter.enum';
import {
  IThirdPartyLoanAssociate
} from '../../../../../../loan/modules/third-party-loans/interfaces/crud/crud-third-party-loans-interface';
import {UtilService} from '../../../../../../../service/common/util.service';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {FlowErrorBuilder} from '../../../../../../../models/error.interface';
import {ITransactionManagerAccountDetail} from '../../../../../interfaces/transaction-manger.interface';
import {
  TmdConfirmationVoucherManagerService
} from '../../../../../services/manager/bp/tmd-confirmation-voucher-manager.service';
import { SplitTransactionDetailService } from '../../../../../services/manager/bp/split-transaction-detail.service';
import {
  TmdBisvConfirmationVoucherManagerService
} from '../../../../../services/manager/bisv/tmd-bisv-confirmation-voucher-manager.service';
import {
  AchUniTransferProtectedNavigation,
  AchUniTransferUrlNavigationCollection
} from '../../../../../../transfer/modules/transfer-ach-uni/enums/ach-uni-navigation-parameter.enum';
import {
  StBisvSplitTransactionManagerService
} from '../../../../../services/manager/bisv/st-bisv-split-transaction-manager.service';
import { EACHServiceMapped } from '../../../../../../transfer/enum/ach-transaction.enum';
import { S365RouteProtected } from '../../../../../../transfer/modules/transfer-365-movil/enum/route-protected.enum';
import { EM365UrlCollection } from '../../../../../../transfer/modules/transfer-365-movil/enum/url-collection.enum';
import { ESignatureTrackingTypeAction } from '../../../enum/st-transaction-status.enum';
import { StCommonTransactionService } from '../st-common-transaction.service';

@Injectable({
  providedIn: 'root',
})
export class StUpdateHandlerService {
  constructor(
    private transactionManagerConfirmation: TmdConfirmationVoucherManagerService,
    private transactionManagerConfirmationBisv: TmdBisvConfirmationVoucherManagerService,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private transactionManagerCommon: TmCommonService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private stBisvSplit: StBisvSplitTransactionManagerService,
    private utils: UtilService,
    private tmCommon: TmCommonService,
    private stCommon: StCommonTransactionService,
  ) { }

  goToUpdateMode(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};
    const isTransactionAchMassiveTransference = transactionSelected?.serviceCode === ETMServiceCode.ACH_MASSIVE_TRANSFERENCE || transactionSelected?.serviceCode === ETMServiceCode.ACH_MASSIVE_TRANSFERENCE2;

    if (isTransactionAchMassiveTransference) return;

    if (!this.transactionManagerCommon.isSampleTransaction(transactionSelected?.serviceCode)) {
      this.navigateHandlerToSpecialTransactions(params);
      return;
    }

    this.navigateHandlerToSampleTransactions(params);
  }

  private buildParametersToOwnTransfer(params: ITMNavigateHandlerParams) {
    const { transactionSelected, transactionResponse } = params ?? {};

    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToTransferOwn({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });



    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: EOwnTransferProtectedNavigation.HOME_ST_UPDATE_MODE,
    });

    this.router.navigate([EOwnTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME]).finally(() => this.utils.hideLoader());
  }

  private buildParametersToThirdTransfer(params: ITMNavigateHandlerParams) {
    const { transactionSelected, transactionResponse } = params ?? {};

    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToTransferThird({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });


    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: EThirdTransferNavigateParameters.SIGNATURE_TRACKING_HOME,
    });

    this.router.navigate([EThirdTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME]).finally(() => this.utils.hideLoader());
  }

  private buildParametersToDonations(params: ITMNavigateHandlerParams) {
    const { transactionSelected, transactionResponse } = params ?? {};

    const dataToVoucher = this.transactionManagerConfirmation.buildParametersToDonation({
      accountDebited: transactionResponse[0],
      accountCredited: transactionResponse[1],
      transaction: transactionSelected,
    });


    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: EDonationNavigationProtected.SIGNATURE_TRACKING_HOME,
    });

    this.router.navigate([EDonationTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME]).finally(() => this.utils.hideLoader());
  }

  private buildParametersToACHTransfer(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};
    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForACHRequest(transactionSelected?.request);
    this.utils.showLoader();
    const sourceAccount = this.transactionManagerCommon.getSourceAccount(transactionDetail?.sourceAccount);
    forkJoin([sourceAccount])
      .pipe(
        catchError((error: HttpErrorResponse) => of(new FlowErrorBuilder()
          .error(error?.error)
          .message(error?.error?.message)
          .status(error?.status)
          .build()
        ))
      )
      .subscribe({
        next: response => {
          const sourceAccount = response[0] as ITransactionManagerAccountDetail;

          const dataToVoucher = this.transactionManagerConfirmation.buildParametersToACHTransaction({
            accountDebited: sourceAccount,
            accountCredited: null as any,
            transaction: transactionSelected,
          });

          this.parameterManager.sendParameters({
            navigateStateParameters: {
              ...dataToVoucher,
            },
            navigationProtectedParameter: EACHNavigationParameters.TRANSFER_FORM_UPDATE_MODE,
          });

          this.router.navigate([EACHTransferUrlNavigationCollection.SIGNATURE_TRACKING_HOME]).finally(() => this.utils.hideLoader());
        }});
  }

  private navigateToVoucherHandler(params: ITMNavigateHandlerParams) {
    const { transactionSelected } = params ?? {};

    switch (transactionSelected?.serviceCode) {
      case ETMServiceCode.OWN_TRANSFER2:
        this.buildParametersToOwnTransfer(params);
        break;
      case this.tmCommon.THIRD_TRANSFER_VALUE:
        this.buildParametersToThirdTransfer(params);
        break;
      case ETMServiceCode.DONATION2:
        this.buildParametersToDonations(params);
        break;
      default:
        break;
    }
  }

  private buildParametersToThirdPartyLoanPayment(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};

    this.utils.showLoader();

    const transactionDetail = this.splitTransactionDetail.getTransactionDetailForThirdPartyPaymentLoan(transactionSelected?.request);

    const loanTransaction: IThirdPartyLoanAssociate = {
      identifier: transactionDetail?.targetAccount,
      name: '',
      currencyCode: (transactionDetail?.sourceCurrency ?? 'UNDEFINED').trim() as any,
      currency: this.utils.getLabelCurrency((transactionDetail?.sourceCurrency ?? 'UNDEFINED').trim()).toUpperCase(),
      typeCode: '',
      type: '',
      statusCode: '',
      status: '',
      installmentDate: '',
      balance: '',
      installmentAmount: '',
      installmentValue: '',
      product: transactionDetail?.targetProduct,
      subProduct: transactionDetail?.targetSubProduct,
    };

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        transaction: transactionSelected,
        detailTransaction: transactionDetail,
        loanToPayment: loanTransaction,
      },
      navigationProtectedParameter: ENavigateProtectionParameter.FORM_ST_MODIFY_PAYMENT
    });

    this.router.navigate([ETPLPaymentUrlNavigationCollection.SIGNATURE_TRACKING_MODIFY_HOME]).finally(() => this.utils.hideLoader());
  }

  /* Methods to handle how go to every transaction flow for Sample transaction - OWN, THIRD PARTY - DONATIONS */
  private navigateHandlerToSampleTransactions(params: ITMServiceDetailAccount) {
    this.transactionManagerCommon.getAccountsToDetail({
      transactionSelected: params?.transactionSelected,
      isTransactionHistoryMode: params?.isTransactionHistoryMode,
      navigateHandler: this.navigateToVoucherHandler.bind(this),
      position: 0,
      targetAccount: '',
      sourceAccount: ''
    });
  }

  private navigateHandlerToSpecialTransactions(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};

    switch (transactionSelected.serviceCode) {
      case ETMServiceCode.THIRD_PARTY_PAYMENT_LOAN:
        this.buildParametersToThirdPartyLoanPayment(params);
        break;
      case ETMServiceCode.ACH_TRANSFER2:
        this.buildParametersToACHTransfer(params);
        break;
      case ETMServiceCode.ACH_TRANSFER_MANAGER:
        this.buildParametersToAchUniTransfer(params);
        break;
      case ETMServiceCode.PAYMENT_TAXES:
        console.log('PAYMENT_TAXES');
        break;
      case ETMServiceCode.PAYMENT_CHECKS:
        console.log('PAYMENT_CHECKS');
        break;
    }
  }


  private buildParametersToAchUniTransfer(params: ITMServiceDetailAccount) {
    const { transactionSelected, position } = params ?? {};
    this.utils.showLoader();

    const { typeService } = this.stBisvSplit.getTransactionDetailForACHInBiesProfile(transactionSelected?.request);


    // if (typeService !== EACHServiceMapped.UNI) {
    //   this.tmCommon.handleNavigateToEmbbededBanking({
    //     tabPosition: this.stCommon.getCurrentStep(position ?? 0),
    //     action: ESignatureTrackingTypeAction.VIEW,
    //     reference: transactionSelected?.reference,
    //     service: transactionSelected?.serviceCode,
    //   });
    //   return;
    // }



    if (typeService === EACHServiceMapped.MOVIL_365) {
      // this.buildParametersTo365MovilTransfer(params);

      this.tmCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommon.getCurrentStep(position ?? 0),
        action: ESignatureTrackingTypeAction.VIEW,
        reference: transactionSelected?.reference,
        service: transactionSelected?.serviceCode,
      });
      return;
    }

    // if (typeService === EACHServiceMapped.MOVIL_365) {
    //   this.buildParametersTo365MovilTransfer(params);
    //   return;
    // }
    //
    // if (typeService === EACHServiceMapped.NORMAL_365) {
    //   this.buildParametersTo365Transfer(params);
    //   return;
    // }

    if (typeService === EACHServiceMapped.NORMAL_365) {
      this.buildParametersTo365Transfer(params);
      return;
    }

    this.utils.showLoader();
    const dataToVoucher = this.transactionManagerConfirmationBisv.buildParametersToACHBiesTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: AchUniTransferProtectedNavigation.ST_UPDATE_HOME,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_MODIFY_HOME]).finally(() => {});
  }


  private buildParametersTo365Transfer(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};
    this.utils.showLoader();

    const dataToVoucher = this.transactionManagerConfirmationBisv.buildParametersToACHBiesTransaction({
      transaction: transactionSelected,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: AchUniTransferProtectedNavigation.ST_UPDATE_HOME,
    });

    this.router.navigate([AchUniTransferUrlNavigationCollection.ST_MODIFY_HOME]).finally(() => {});
  }

  private buildParametersTo365MovilTransfer(params: ITMServiceDetailAccount) {
    const { transactionSelected } = params ?? {};
    this.utils.showLoader();
    const dataToVoucher = this.transactionManagerConfirmationBisv.buildParametersToACHMovil365Transaction({
      transaction: transactionSelected,
      useFormValues: false,
    });

    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...dataToVoucher,
      },
      navigationProtectedParameter: S365RouteProtected.ST_MODIFY,
    });

    this.router.navigate([EM365UrlCollection.ST_MODIFY]).finally(() => {});
  }
}
