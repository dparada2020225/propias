import { Injectable } from '@angular/core';
import { INavigateEmbbededParams, ITransactionManagerAccountDetail } from '../interfaces/transaction-manger.interface';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FlowErrorBuilder, IFlowError } from '../../../models/error.interface';
import { TransactionManagerService } from './transaction-manager.service';
import { ETMServiceCode } from '../enums/service-code.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StepService } from 'src/app/service/private/step.service';
import { ITMServiceDetailAccount } from '../interfaces/transaction-manager-navigate.interface';
import { UtilService } from '../../../service/common/util.service';
import { ITMTransaction } from '../interfaces/tm-transaction.interface';
import { EProfile } from '../../../enums/profile.enum';
import { ESTButtonMessage } from '../modules/signature-tracking/enum/st-common.enum';
import { subTitleMessage } from '../modules/signature-tracking/enum/signature-tracking.enum';
import { SplitTransactionDetailService } from './manager/bp/split-transaction-detail.service';

@Injectable({
  providedIn: 'root'
})
export class TmCommonService {
  private THIRD_TRANSFER_MAPPED =  {
    [EProfile.HONDURAS]: ETMServiceCode.THIRD_TRANSFER2,
    [EProfile.PANAMA]: ETMServiceCode.THIRD_TRANSFER,
    [EProfile.SALVADOR]: ETMServiceCode.THIRD_TRANSFER,
  }

  private SERVICES_WITH_UPDATE_OPTION_DISABLED_BP = [
    ETMServiceCode.ACH_MASSIVE_TRANSFERENCE,
    ETMServiceCode.ACH_MASSIVE_TRANSFERENCE2,
    ETMServiceCode.PAYMENT_OF_PAYROLL,
    ETMServiceCode.BISV_PAYMENT_SUPPLIER
  ]

  private SERVICES_WITH_UPDATE_OPTION_DISABLED_BISV = [
    ETMServiceCode.PAYMENT_OF_PAYROLL,
    ETMServiceCode.ACH_MASSIVE_TRANSFERENCE,
    ETMServiceCode.ACH_MASSIVE_TRANSFERENCE_365,
    ETMServiceCode.ACH_365_SIPA,
    ETMServiceCode.BISV_PAYMENT_SUPPLIER

  ]

  THIRD_TRANSFER_VALUE = this.THIRD_TRANSFER_MAPPED[this.utils.getProfile()] ?? this.THIRD_TRANSFER_MAPPED[EProfile.HONDURAS];

  private sampleTransactions = [
    ETMServiceCode.DONATION2,
    ETMServiceCode.OWN_TRANSFER2,
    this.THIRD_TRANSFER_VALUE,
  ];

  constructor(
    private parameterManager: ParameterManagementService,
    private splitTransactionDetail: SplitTransactionDetailService,
    private transactionManager: TransactionManagerService,
    private router: Router,
    private stepService: StepService,
    private utils: UtilService,
  ) { }

  isSampleTransaction(serviceCode: string) {
    return this.sampleTransactions.includes(serviceCode as ETMServiceCode);
  }

  getTitleAndSubtitleStOperation(action: string) {
    return {
      buttonMessage: ESTButtonMessage[action],
      subtitleMessage: subTitleMessage[action.toLowerCase()],
    }
  }

  get SERVICES_WITH_UPDATE_OPTION_DISABLED() {
    const profile = this.utils.getProfile();

    if (profile === EProfile.PANAMA) return [];

    if (profile === EProfile.SALVADOR) return this.SERVICES_WITH_UPDATE_OPTION_DISABLED_BISV;

    return this.SERVICES_WITH_UPDATE_OPTION_DISABLED_BP;
  }

  isSupportedTransaction(supportedServices: string[], transactionSelected: ITMTransaction) {
    const decryptedServices = supportedServices.map(service => this.stepService.s(service));
    decryptedServices.push('pag-pro');
    return decryptedServices.includes(transactionSelected.serviceCode);
  }

  handleNavigateToEmbbededBanking(navigateProperties: INavigateEmbbededParams) {
    this.router.navigate(['/embedded-ob']).then(() => {});

    this.parameterManager.sendParameters({
      signatoryParams: {
        reference: navigateProperties.reference,
        currentTabPosition: navigateProperties.tabPosition,
        action: navigateProperties.action,
      },
      serviceEmbedded: navigateProperties.service
    });
  }

  /*
  * PRINCIPAL DIFFERENCE TO #getSourceAccount().
  * IS THIS ONE TAKEs TWO PARAMETERS SOURCE ACCOUNT, AND TARGET ACCOUNT
  * AND #getSourceAccount() TAKE ONLY ONE PARAMETER IF the TRANSACTION ONLY HAS a SINGLE ONE SOURCE ACCOUNT.
  * FOR EXAMPLE, THIRD PARTY PAYMENT LOAN.
  * THIS ONE ONLY HAS A SOURCE ACCOUNT
  * */
  getAccountsToDetail(parameters: ITMServiceDetailAccount) {
    const { transactionSelected, isTransactionHistoryMode, navigateHandler } = parameters ?? {};


    const data = this.splitTransactionDetail.getTransactionDetailForSampleTransactions(transactionSelected?.request.trimStart());
    this.utils.showLoader();


    forkJoin(
      [data?.accountOrigin, data?.accountTarget]
        .map((acc) => this.transactionManager.getAccountDetail(acc).pipe(
          catchError((error: HttpErrorResponse) => of(new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message)
            .status(error?.status)
            .build()
          ))
        ))
    )
      .subscribe({
        next: (response: (ITransactionManagerAccountDetail | IFlowError)[]) => {
          if (navigateHandler) {
            navigateHandler({
              transactionResponse: response as ITransactionManagerAccountDetail[],
              transactionSelected,
              isTransactionHistoryMode,
              position: parameters?.position,
              action: parameters?.action,
            })
          }
        }
      })
  }


  /*
  * USE ONLY IF a TRANSACTION ONLY HAS A SOURCE ACCOUNT OR TARGET ACCOUNT, FOR EXAMPLE
  * THIRD PARTY PAYMENT LOAN, THIS SERVICE ONLY HAVE SOURCE ACCOUNT THEIR EQUIVALENCE TO A TARGET ACCOUNT IS
  * LOAN NUMBER. ITS VERY LITTLE DIFFERENCE TO @method getAccountsToDetail()
  * */
  getSourceAccount(accountNumber: string) {
    return this.transactionManager.getAccountDetail(accountNumber)
      .pipe(
        catchError(error => of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error:getting_source_accounts')
            .status(error?.status)
            .build()
        ))
      );
  }



}
