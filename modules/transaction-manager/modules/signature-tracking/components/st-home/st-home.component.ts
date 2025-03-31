import {
  AdfFormBuilderService,
  AdfOnboardingComponent, AdfTutorialModalComponent,
  ILayout,
  ILoadItem,
  IManageAlertMessage,
  ITableStructure,
  TEMPTY_MESSAGE_HANDLER
} from '@adf/components';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITMTransaction } from 'src/app/modules/transaction-manager/interfaces/tm-transaction.interface';
import {
  ISignatureTrackingMessageOutput,
  ISignatureTrackingTable,
  ISTTransactionState
} from '../../interfaces/signature-tracking.interface';
import { ITab } from '../../interfaces/tabs.interface';
import {
  EEmbeddedTransactionStatus,
  ESignatureTrackingTypeAction,
  ESTTableOptions,
  ETableType,
  ETabPosition
} from '../../enum/st-transaction-status.enum';
import { FormGroup } from '@angular/forms';
import { IACHSettings } from '../../../../../transfer/modules/transfer-ach/interfaces/settings.interface';
import { IAchAccount } from '../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { ISettingData } from '../../../../../../models/setting-interface';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import { of, Subscription } from 'rxjs';
import { SignatureTrackingDefinitionService } from '../../services/definition/signature-tracking-definition.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { SignatureTrackingService } from '../../services/transaction/signature-tracking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationBuilder, StorageService, TransactionBuilder } from '@adf/security';
import { UtilService } from '../../../../../../service/common/util.service';
import { TmCommonService } from '../../../../services/tm-common.service';
import { StCommonTransactionService } from '../../services/execution/st-common-transaction.service';
import { SmartCoreService } from '../../../../../../service/common/smart-core.service';
import { StSendService } from '../../services/execution/operations/st-send.service';
import { StRejectService } from '../../services/execution/operations/st-reject.service';
import { StAuthorizeService } from '../../services/execution/operations/st-authorize.service';
import { StProcessService } from '../../services/execution/operations/st-process.service';
import { StDeleteService } from '../../services/execution/operations/st-delete.service';
import { StUtilsService } from '../../services/definition/st-utils.service';
import { StdTableService } from '../../services/definition/std-table.service';
import { ISignatureTrackingCheckedAccountsState } from '../../interfaces/st-common.interface';
import { delay, finalize } from 'rxjs/operators';
import { ESignatureTrackingUrlFlow, StNavigateProtectedParameter } from '../../enum/st-navigate-enum';
import {
  ESTButtonMessage,
  ESTTransactionStatus,
  ETransactionStatus,
  mapEmbeddedStatus
} from '../../enum/st-common.enum';
import { SignatureTrackingTableKeys } from '../../enum/signature-tracking.enum';
import { EProfile } from '../../../../../../enums/profile.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatureManagerService } from '../../../../../../service/common/feature-manager.service';
import { StdOnboardingService } from '../../services/definition/std-onboarding.service';
import { OnboardingSettingService } from '../../../../../../service/common/onboarding-setting.service';
import { HttpStatusCode } from '../../../../../../enums/http-status-code.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ETMServiceCode } from '../../../../enums/service-code.enum';
import { TmDetailService } from '../../../../services/handlers/tm-detail.service';
import { TranslateService } from '@ngx-translate/core';
import { StUpdateHandlerService } from '../../services/execution/handlers/st-update-handler.service';

@Component({
  selector: 'byte-st-home',
  templateUrl: './st-home.component.html',
  styleUrls: ['./st-home.component.scss'],
})
export class StHomeComponent implements OnInit, OnDestroy  {
  ONBOARDING_KEY_STORAGE = 'stOnboarding';

  // @Properties to handle every single one the table structured
  enteredAccountsTable: ITableStructure<ISignatureTrackingTable> | null = null;
  toAuthorizedAccountsTable: ITableStructure<ISignatureTrackingTable> | null = null;
  authorizedAccountsTable: ITableStructure<ISignatureTrackingTable> | null = null;

  // @Properties to manage tab component, position, currentStep
  currentTabPosition = 0;
  tabList: ITab[] = [];
  profile = this.utils.getProfile();

  selectedAccount: ILoadItem<ITMTransaction> | null = null;

  // @Properties to manage how to show every table
  signaturePosition = ETabPosition.ENTERED;
  toAuthorizePosition = ETabPosition.TO_AUTHORIZE;
  authorizedPosition = ETabPosition.AUTHORIZED;

  searchLayout!: ILayout;
  searchForm!: FormGroup;


  // @Properties to manage how show an alert. type and message
  typeAlert: string | undefined = undefined;
  messageAlert: string | undefined = undefined;

  // @Properties to manage how message, do you show.
  nextButtonMessage: string = 'send';
  prevButtonMessage: string = 'option.delete';
  subtitleCurrentPosition: string = 'sending_transactions';

  //  @Properties to get accounts from service
  enteredAccountList: ITMTransaction[] = [];
  toAuthorizeAccountList: ITMTransaction[] = [];
  authorizedAccountList: ITMTransaction[] = [];

  // @Properties accounts to enter a process (send, delete, etc.)
  checkedEnteredAccounts: ITMTransaction[] = [];
  checkedToAuthorizeAccounts: ITMTransaction[] = [];
  checkedAuthorizeAccounts: ITMTransaction[] = [];

  associatedAccounts: IAchAccount[] = [];
  associatedAccountsMap: Map<string, IAchAccount> = new Map<string, IAchAccount>();
  achSettings: IACHSettings[] = [];

  isLoadingEnteredAccounts: boolean = true;
  isLoadingToAuthorizeAccounts: boolean = true;
  isLoadingAuthorizedAccounts: boolean = true;

  propertiesToSearch: string[] = [
    SignatureTrackingTableKeys.DATE,
    SignatureTrackingTableKeys.TRANSACTION,
    SignatureTrackingTableKeys.REFERENCE,
    SignatureTrackingTableKeys.CURRENCY,
    SignatureTrackingTableKeys.AMOUNT,
    SignatureTrackingTableKeys.USER,
  ];

  settings: ISettingData | null = null;
  userInfo: IUserInfo | null = null;
  sendTransactionMessageSubscription!: Subscription;
  messageEmptyListSelectedMap = {
    [EProfile.PANAMA]: 'info',
    [EProfile.HONDURAS]: 'warning',
    [EProfile.SALVADOR]: 'error',
  }

  messageDeleteTransactionMap = {
    [EProfile.PANAMA]: 'warning',
    [EProfile.HONDURAS]: 'warning',
    [EProfile.SALVADOR]: 'success',
  }

  currentInfoMessageByStep = '';
  currentLanguage = this.translate.currentLang;

  get isSelectByCheckboxDisabled() {
    return this.featureManager.isStBisvMultipleEnabled();
  }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get tabColorForStMultipleClassName() {
    return this.featureManager.isStBisvMultipleEnabled() ? 'st-active' : ''
  }

  get isManageAlertByManualRemoved() {
    return this.featureManager.isStBisvMultipleEnabled();
  }

  get isFeatureEnabledInBisv() {
    return this.featureManager.isStBisvMultipleEnabled();
  }

  get isShowSearchBox() {
    return this.profile !== EProfile.PANAMA;
  }

  get showImportantAlert() {
    return this.featureManager.isStBisvMultipleEnabled();
  }

  get isShowButtonActions() {
    return this.featureManager.isStBisvMultipleEnabled();
  }

  get showCheckbookInTableHeader() {
    return this.profile !== EProfile.HONDURAS && this.featureManager.isStBisvMultipleEnabled();
  }

  get isTableManageByScrolled() {
    return this.profile !== EProfile.HONDURAS && this.featureManager.isStBisvMultipleEnabled();
  }

  get isTableManageEmptyRegistersWithoutAlert() {
    return this.profile !== EProfile.HONDURAS;
  }

  get typeAlertToShowInTableWithoutRegisters() {
    return this.profile === EProfile.HONDURAS ? 'alert' : 'message' as TEMPTY_MESSAGE_HANDLER;
  }


  constructor(
    private signatureTrackingDefinition: SignatureTrackingDefinitionService,
    private persistStepStateService: ParameterManagementService,
    private signatureTrackingService: SignatureTrackingService,
    private formBuilderService: AdfFormBuilderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private utils: UtilService,
    private transactionManagerCommon: TmCommonService,
    private updateHandlerManager: StUpdateHandlerService,
    private detailHandlerManager: TmDetailService,
    private stCommonTransaction: StCommonTransactionService,
    private smartCore: SmartCoreService,
    private stSendTransaction: StSendService,
    private stRejectTransaction: StRejectService,
    private stAuthorizeTransaction: StAuthorizeService,
    private stProcessTransaction: StProcessService,
    private stDeleteTransaction: StDeleteService,
    private stUtil: StUtilsService,
    private stTableDefinition: StdTableService,
    private modalService: NgbModal,
    private featureManager: FeatureManagerService,
    private stdOnboardingDefinition: StdOnboardingService,
    private onBoardingSettingService: OnboardingSettingService,
    private translate: TranslateService,
  ) {
    this.manageLanguageChange();
  }

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.callAccountCallSmartCore();
    this.associatedAccounts = this.activatedRoute.snapshot.data['associatedAccounts'] ?? [];
    this.achSettings = this.activatedRoute.snapshot.data['settings'] ?? [];

    this.settings = JSON.parse(this.storage.getItem('securityParameters'));
    this.userInfo = this.persistStepStateService.getParameter('userInfo');

    this.handleShowTypeInfoAlert();
    this.setMessageFromOperationResult();
    this.setLastPositionFromOperations();

    this.resetStorageFromSignatureTrackingToEmbbeded();

    this.initDefinition();
    this.setAssociatedAccountsACH();
    this.searchInputChange(this.enteredAccountList, this.enteredAccountsTable as ITableStructure<ISignatureTrackingTable>);
    this.utils.hideLoader();
    this.scrollToTop();
    this.validateIsOpenOnboardingModal();
    this.manageLanguageChange();
  }

  validateIsOpenOnboardingModal() {
    const { isOpenAtFirstTime } = this.onBoardingSettingService.validateIsOpenOnboardingAtFirstTime(this.ONBOARDING_KEY_STORAGE);

    if (!isOpenAtFirstTime && this.featureManager.isStBisvMultipleEnabled()) {
      this.openOnboardingModal();
    }
  }

  manageLanguageChange() {
    this.translate.onLangChange.subscribe(() => {
      this.currentLanguage = this.translate.currentLang;
    });
  }

  openVideoTutorial() {
    const modal = this.modalService.open(AdfTutorialModalComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} third-transfer-welcome`,
      size: `lg`,
      backdrop : 'static',
      keyboard : false,
    });

    modal.componentInstance.videoUrl = 'assets/videos/signature-tracking/bisv_tutorial_auth_multiple.mp4';
    modal.componentInstance.title = 'signature_tracking';
    modal.componentInstance.description = 'label:st_tutorial';
    modal.componentInstance.controls = true;

    modal.result.then((isConfirm) => {
        if (!isConfirm) return;
      })
      .catch((error) => error);
  }

  openOnboardingModal(isManualOpen = false) {
    const modal = this.modalService.open(AdfOnboardingComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} st-on st-onboarding`,
      size: `lg`,
      backdrop: 'static',
      keyboard: false,
    });

    modal.componentInstance.onboardingStructure = this.stdOnboardingDefinition.buildOnBoardingDefinition();
    modal.componentInstance.isManualOpen = isManualOpen;
    modal.componentInstance.onCloseModal = () => this.onBoardingSettingService.closeModalSavedUser(this.ONBOARDING_KEY_STORAGE);

    modal.result.then((isConfirm) => {
        if (!isConfirm) return;
      })
      .catch((error) => error);
  }

  setAssociatedAccountsACH() {
    this.associatedAccounts.forEach((account) => {
      this.associatedAccountsMap.set(account?.account, account);
    });
  }

  ngOnDestroy() {
    if (this.sendTransactionMessageSubscription) {
      this.sendTransactionMessageSubscription.unsubscribe();
    }
  }

  callAccountCallSmartCore(){
    const transaction = new TransactionBuilder()
      .category('Signatura tracking')
      .type('Autorize transaction')
      .build();

    const operation = new OperationBuilder()
      .transaction(transaction)
      .build();

    this.smartCore.personalizationOperation(operation);
  }

  handleShowTypeInfoAlert() {
    const isShowMessage = this.featureManager.isSignatureTrackingMultipleOperationsEnabled()

    const mappedMessage = {
      [ETabPosition.ENTERED]: 'info_message_signature-tracking:step1',
      [ETabPosition.TO_AUTHORIZE]: 'info_message_signature-tracking',
      [ETabPosition.AUTHORIZED]: 'info_message_signature-tracking:step3',
    }

    const message = mappedMessage[this.currentTabPosition] ?? mappedMessage[ETabPosition.ENTERED];

    if (isShowMessage) {
      this.showAlert('info', message);
    } else {
      this.typeAlert = undefined;
      this.messageAlert = undefined;
    }
  }

  setDefaultAlert() {
    if (this.featureManager.isStBisvMultipleEnabled()) return;

    of(this.featureManager.isStBisvMultipleEnabled())
      .pipe(delay(10000))
      .subscribe(() => {
        this.handleShowTypeInfoAlert();
      });
  }

  /* ========================= DEFINITIONS ======================= */
  initDefinition() {
    this.formSearchDefinition();
    this.handleShowAlertFromEmbedded();

    if (this.currentTabPosition === ETabPosition.ENTERED) {
      this.getEnteredAccountList();
    }

    this.initTableDefinition();
    this.tabList = this.signatureTrackingDefinition.buildTabDefinition();
  }

  setLastPositionFromOperations() {
    const state = this.persistStepStateService.getParameter('navigateStateParameters');

    if (!state?.position) return;

    this.currentTabPosition = state?.position;

    if (this.currentTabPosition !== ETabPosition.ENTERED) {
      this.getActionTab();
    }
  }

  getStatusFormBisvAuthorizationAlert(state: ISignatureTrackingMessageOutput) {
    return state.data?.code === HttpStatusCode.SIGNATURE_TRACKING_PENDING_AUTHORIZATION ? 'success' : 'warning';
  }

  setMessageFromOperationResult() {
    const state = this.persistStepStateService.getParameter('navigateStateParameters');

    if (!state?.message) return


    const mappedMessageType = {
      [EProfile.HONDURAS]: {
        [ESignatureTrackingTypeAction.SEND]: 'warning',
        [ESignatureTrackingTypeAction.AUTHORIZE]: 'warning',
        [ESignatureTrackingTypeAction.DELETE]: 'warning',
        [ESignatureTrackingTypeAction.PROCESS]: 'warning',
        [ESignatureTrackingTypeAction.REJECT]: 'warning',
      },
      [EProfile.SALVADOR]: {
        [ESignatureTrackingTypeAction.SEND]: 'warning',
        [ESignatureTrackingTypeAction.AUTHORIZE]: this.getStatusFormBisvAuthorizationAlert(state),
        [ESignatureTrackingTypeAction.DELETE]: 'success',
        [ESignatureTrackingTypeAction.PROCESS]: 'success',
        [ESignatureTrackingTypeAction.REJECT]: 'success',
      },
      [EProfile.PANAMA]: {
        [ESignatureTrackingTypeAction.SEND]: 'warning',
        [ESignatureTrackingTypeAction.AUTHORIZE]: 'warning',
        [ESignatureTrackingTypeAction.DELETE]: 'success',
        [ESignatureTrackingTypeAction.PROCESS]: 'warning',
        [ESignatureTrackingTypeAction.REJECT]: 'warning',
      }
    }


    const status = state?.status === ESTTransactionStatus.FAILED ? 'error' : mappedMessageType[this.profile][state?.action] ?? 'info';

    this.showAlert(status, state?.message);
    this.setDefaultAlert();
  }

  initTableDefinition() {
    this.enteredAccountsTable = this.stTableDefinition
      .buildEnteredAccountsTable(this.enteredAccountList);
  }

  formSearchDefinition() {
    this.searchLayout = this.signatureTrackingDefinition.buildSearchLayout();
    this.searchForm = this.formBuilderService.formDefinition(this.searchLayout.attributes);
  }


  handleShowAlertFromEmbedded() {
    const route = this.activatedRoute.snapshot.queryParams;
    const status = route['status'];
    const errorDescription = route['errorDescription'];
    const currentStep = route['current-step-seg'];
    const currentAction = route['action-seg'];

    if (currentStep) {
      this.currentTabPosition = this.stCommonTransaction.getCurrentTabPositionFromEmbbeded(currentStep);
      if (this.currentTabPosition !== ETabPosition.ENTERED) { this.getActionTab(); }
    }

    if ((status && status === EEmbeddedTransactionStatus.SUCCESS) && !errorDescription) {
      this.handleShowTypeAlert(currentAction);
      return;
    }

    if ((status && status === EEmbeddedTransactionStatus.FAILED) && errorDescription) {
      const error = errorDescription.split('-');

      if (error && error[0] === HttpStatusCode.SIGNATURE_TRACKING_AUTHORIZATION) {
        const message = this.getErrorMessage(error[1])
        this.showAlert(`warning`, `${message}`);
        return;
      }

      const message = this.getErrorMessage(errorDescription)
      this.showAlert(`${mapEmbeddedStatus[status] ?? 'info'}`, `${message ?? 'No message configured'}`);
    }


  }

  private getErrorMessage(message: string) {
    try {
      const regex = /<!\[CDATA\[(.*?)]]>/;
      const result = RegExp(regex).exec(message);
      return result ? result[1] : message;
    } catch (e) {
      return message;
    }
  }



  handleShowTypeAlert(action: string) {
    switch (action) {
      case ESignatureTrackingTypeAction.SEND:
        this.showAlert('warning', 'signature_tracking:send_successfully');
        break;
      case ESignatureTrackingTypeAction.AUTHORIZE:
        this.showAlert('success', 'signature_tracking:authorize_successfully');
        break;
      case ESignatureTrackingTypeAction.DELETE:
        if (this.profile === EProfile.SALVADOR) {
          this.showAlert('success', 'st-delete-transaction-success');
        }
        break;
    }
  }


  /* ========================= END DEFINITIONS ======================= */


  searchInputChange(accountList: ITMTransaction[], tableStructure: ITableStructure) {
    this.searchForm.get(SignatureTrackingTableKeys.FILTER_SEARCH)?.valueChanges
      .subscribe({
        next: (query) => {
          this.handleSearchAccounts(query, accountList, tableStructure);
        }
      })
  }

  handleSearchAccounts(query: string, accountList: ITMTransaction[], tableStructure: ITableStructure) {
    const list = this.stUtil.parseAccounts(accountList);
    tableStructure.items = this.utils.searchByMultipleAttributes(list, query, this.propertiesToSearch);


    if (accountList.length > 0) {
      (tableStructure.manageAlertMessage as IManageAlertMessage).message = 'no_matches_found';
    }

  }


  /* ==========  METHOD TO GET DIFFERENCE'S TYPE ACCOUNTS  ============= */
  getEnteredAccountList() {
    this.utils.showPulseLoader();
    this.isLoadingEnteredAccounts = true;

    if (this.featureManager.isStBisvMultipleEnabled()) {
      this.handleGetInfoMessage();
    }

    this.signatureTrackingService.getAll(ETransactionStatus.ENTERED)
      .pipe(finalize(() => {
        this.utils.hidePulseLoader();
        this.setDefaultAlert();
      }))
      .subscribe({
        next: (accountList) => {
        this.enteredAccountList = accountList ?? [];
        this.initTableDefinition();
        this.searchInputChange(this.enteredAccountList, this.enteredAccountsTable as ITableStructure<ISignatureTrackingTable>);
        this.isLoadingEnteredAccounts = false;
        this.resetParameterStateStorage();
      },
      error: (error: HttpErrorResponse) => {
        this.enteredAccountList = [];
        this.initTableDefinition();
        this.isLoadingEnteredAccounts = false;
        this.showAlert('error', error?.error?.message ?? 'error:getting_signature_account_list');
      }
    });
  }

  getToAuthorizeAccountList() {
    this.utils.showPulseLoader();
    this.isLoadingToAuthorizeAccounts = true;
    if (this.featureManager.isStBisvMultipleEnabled()) {
      this.handleGetInfoMessage();
    }

    this.signatureTrackingService.getAll(ETransactionStatus.TO_AUTHORIZE)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (data) => {
          this.toAuthorizeAccountList = data ?? [];
          this.toAuthorizedAccountsTable = this.stTableDefinition
            .buildToAuthorizeSignatureTrackingTable(this.toAuthorizeAccountList);
          this.searchInputChange(this.toAuthorizeAccountList, this.toAuthorizedAccountsTable);
          this.isLoadingToAuthorizeAccounts = false;
          this.resetParameterStateStorage();
          this.setDefaultAlert();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoadingToAuthorizeAccounts = false;
          this.toAuthorizeAccountList = [];
          this.toAuthorizedAccountsTable = this.stTableDefinition
            .buildToAuthorizeSignatureTrackingTable(this.toAuthorizeAccountList);
          this.showAlert('error', error?.error?.message ?? 'error:getting_signature_account_list');
        }
      });
  }

  getAuthorizedAccountList() {
    this.utils.showPulseLoader();
    this.isLoadingAuthorizedAccounts = true;
    if (this.featureManager.isStBisvMultipleEnabled()) {
      this.handleGetInfoMessage();
    }

    this.signatureTrackingService.getAll(ETransactionStatus.AUTHORIZED)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (data) => {
          this.authorizedAccountList = data ?? [];
          this.authorizedAccountsTable = this.stTableDefinition
            .buildAuthorizedAccountsTable(this.authorizedAccountList);
          this.searchInputChange(this.authorizedAccountList, this.authorizedAccountsTable);
          this.isLoadingAuthorizedAccounts = false;
          this.resetParameterStateStorage();

          this.setDefaultAlert();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoadingAuthorizedAccounts = false;
          this.authorizedAccountList = [];
          this.authorizedAccountsTable = this.stTableDefinition.buildAuthorizedAccountsTable(this.authorizedAccountList);
          this.showAlert('error',  error?.error?.message ?? 'error:getting_signature_account_list');
        }
      });
  }

  /* =========END METHOD TO GET DIFFERENCE'S TYPE ACCOUNTS  ============ */

  /* ======================== TAB UTILITIES ========================== */


  selectActiveTab(position: number) {
    this.currentTabPosition = position;
    this.searchForm.reset();
    this.getActionTab();
    this.handleShowTypeInfoAlert();
    this.resetParameterStateStorage();
  }

  getActionTab() {
    switch (this.currentTabPosition) {
      case ETabPosition.ENTERED:
        this.nextButtonMessage = ESTButtonMessage.SEND;
        this.prevButtonMessage = ESTButtonMessage.DELETE;
        this.checkedEnteredAccounts = [];
        this.subtitleCurrentPosition = 'sending_transactions';
        this.getEnteredAccountList();
        break;
      case ETabPosition.AUTHORIZED:
        this.nextButtonMessage = ESTButtonMessage.PROCESS;
        this.prevButtonMessage = ESTButtonMessage.SEND_BACK;
        this.subtitleCurrentPosition = 'subtitle:process_transaction';
        this.getAuthorizedAccountList();
        this.checkedAuthorizeAccounts = [];
        break;
      case ETabPosition.TO_AUTHORIZE:
        this.nextButtonMessage = ESTButtonMessage.AUTHORIZE;
        this.prevButtonMessage = ESTButtonMessage.SEND_BACK;
        this.subtitleCurrentPosition = 'subtitle:to_authorize';
        this.getToAuthorizeAccountList();
        this.checkedToAuthorizeAccounts = [];
        break;
    }

    this.resetParameterStateStorage();
  }

  handleGetInfoMessage() {
    const settings: ISettingData = JSON.parse(this.storage.getItem('securityParameters'));

    const messageMapped = {
      [ETabPosition.ENTERED]: settings.messages['delete-send'][this.currentLanguage],
      [ETabPosition.AUTHORIZED]: settings.messages['return-process'][this.currentLanguage],
      [ETabPosition.TO_AUTHORIZE]: settings.messages['return-authorize'][this.currentLanguage],
    }

    this.currentInfoMessageByStep = messageMapped[this.currentTabPosition];
  }


  nextStep() {
    const actionMap = {
      [ETabPosition.ENTERED]: () => this.handleSendAccounts(this.checkedEnteredAccounts),
      [ETabPosition.TO_AUTHORIZE]: () => this.handleAuthorizeFromToAuthorize(this.checkedToAuthorizeAccounts),
      [ETabPosition.AUTHORIZED]: () => this.handleProcessFromAuthorized(this.checkedAuthorizeAccounts),
    }

    const action = actionMap[this.currentTabPosition];
    if (!action) return;

    action();
    this.scrollToTop();
  }

  prevStep() {
    const actionMap = {
      [ETabPosition.ENTERED]: () => this.handleDeleteAccount(this.checkedEnteredAccounts),
      [ETabPosition.AUTHORIZED]: () => this.handleRejectAccount(this.checkedAuthorizeAccounts),
      [ETabPosition.TO_AUTHORIZE]: () => this.handleRejectAccount(this.checkedToAuthorizeAccounts),
    }

    const action = actionMap[this.currentTabPosition];
    if (!action) return;

    action();
    this.scrollToTop();
  }

  /* ====================  GET ACCOUNT FROM TABLE  ===================== */
  getAccountFromEnteredTable(transactionSelectedTemp: any) {
    const transactionSelected: ILoadItem<ITMTransaction> = transactionSelectedTemp;

    const actionMap = {
      [ESTTableOptions.UPDATE]: () => this.handleModifyAccount(transactionSelected),
      [ESTTableOptions.VIEW]: () => this.handleViewAccountDetail(transactionSelected),
      [ESTTableOptions.DELETE]: () => this.handleDeleteAccount([transactionSelected.item]),
      [ESTTableOptions.SEND]: () => this.handleSendAccounts([transactionSelected.item]),
    }

    const action = actionMap[transactionSelected.action as string];
    if (!action) return

    action();
  }

  getAccountFromToAuthorizedTable(transactionSelectedTemp: any) {
    const transactionSelected: ILoadItem<ITMTransaction> = transactionSelectedTemp;

    const actionMap = {
      [ESTTableOptions.VIEW_SIGNATURE]: () => this.handleViewSignatureList(transactionSelected),
      [ESTTableOptions.VIEW]: () => this.handleViewAccountDetail(transactionSelected),
      [ESTTableOptions.REJECT]: () => this.handleRejectAccount([transactionSelected.item]),
      [ESTTableOptions.AUTHORIZE]: () => this.handleAuthorizeFromToAuthorize([transactionSelected.item]),
    }

    const action = actionMap[transactionSelected.action as string];

    if (!action) return;

    action();
  }

  getAccountFromAuthorizedTable(transactionSelectedTemp: any) {
    const transactionSelected: ILoadItem<ITMTransaction> = transactionSelectedTemp;

    const actionMap = {
      [ESTTableOptions.VIEW_SIGNATURE]: () => this.handleViewSignatureList(transactionSelected),
      [ESTTableOptions.VIEW]: () => this.handleViewAccountDetail(transactionSelected),
      [ESTTableOptions.REJECT]: () => this.handleRejectAccount([transactionSelected.item]),
      [ESTTableOptions.PROCESS]: () => this.handleProcessFromAuthorized([transactionSelected.item]),
    }

    const action = actionMap[transactionSelected.action as string];

    if (!action) return;

    action();
  }

  handleViewSignatureList(account: ILoadItem<ITMTransaction>) {
    this.utils.showLoader();

    const parameters: ISTTransactionState = {
      transactionSelected: account?.item,
      position: this.currentTabPosition,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: parameters,
      navigationProtectedParameter: StNavigateProtectedParameter.SIGNATURES,
    });


    this.router.navigate([ESignatureTrackingUrlFlow.SIGNATURES]).finally(() => this.utils.hideLoader());
  }


  handleModifyAccount(transaction: ILoadItem<ITMTransaction>) {
    const transactionSelected = transaction?.item;

    const isOptionDisabled = this.transactionManagerCommon.SERVICES_WITH_UPDATE_OPTION_DISABLED.includes(transactionSelected.serviceCode as ETMServiceCode);

    if (isOptionDisabled) {
      this.utils.scrollToTop();
      this.showAlert('warning', 'label:error-st-invalid-transaction-update')
      this.setDefaultAlert();
      return;
    }

    const isSupportedTransaction = this.transactionManagerCommon
      .isSupportedTransaction(this.settings?.onlineBankingCoreServices ?? [], transactionSelected);

    if (!isSupportedTransaction) {
      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(this.currentTabPosition),
        action: ESignatureTrackingTypeAction.MODIFY,
        reference: transactionSelected?.reference,
        service: transactionSelected?.serviceCode
      });
      return;
    }

    this.updateHandlerManager.goToUpdateMode({
      transactionSelected: transactionSelected,
      isTransactionHistoryMode: false,
      position: this.currentTabPosition,
    });
  }


  /* ======================= END GET ACCOUNT FROM TABLE  ============================ */


  /* =================== HANDLERS ACTIONS WITH SINGLE ACTION TABLE ================== */


  handleViewAccountDetail(accountSelected: ILoadItem<ITMTransaction>) {
    const account = accountSelected?.item;

    const isSupportedTransaction = this.transactionManagerCommon.isSupportedTransaction(this.settings?.onlineBankingCoreServices ?? [], account);

    if (!isSupportedTransaction) {
      this.transactionManagerCommon.handleNavigateToEmbbededBanking({
        tabPosition: this.stCommonTransaction.getCurrentStep(this.currentTabPosition),
        action: ESignatureTrackingTypeAction.VIEW,
        reference: account?.reference,
        service: account?.serviceCode
      });
      return;
    }

    this.detailHandlerManager.manageDetailTransferNavigation({
      transactionSelected: account,
      isTransactionHistoryMode: false,
      position: this.currentTabPosition,
    });
  }

  /* =======================  GET ACCOUNTS LIST FROM TABLE  ========================== */


  /* ============= METHODS TO MANAGE SELECTED ACCOUNTS PERSISTENCE ================== */

  getCheckedAccounts(accounts: ISignatureTrackingTable[], typeTable: string) {
    switch (typeTable) {
      case ETableType.ENTERED:
        this.saveCheckedEnteredAccountsState(accounts);
        break;
      case ETableType.TO_AUTHORIZE:
        this.saveCheckedToAuthorizedAccountsState(accounts);
        break;
      case ETableType.AUTHORIZED:
        this.saveCheckedAuthorizedAccountsState(accounts);
        break;
    }
  }

  saveCheckedEnteredAccountsState(accountsFromTable: ISignatureTrackingTable[]) {
    this.checkedEnteredAccounts = accountsFromTable.filter((acc) => acc.isChecked && !acc.disabled);

    (this.enteredAccountsTable as ITableStructure<ISignatureTrackingTable>).items = accountsFromTable;

    const state: ISignatureTrackingCheckedAccountsState = {
      structure: this.enteredAccountsTable as ITableStructure<ISignatureTrackingTable>,
      accounts: this.checkedEnteredAccounts,
      position: ETableType.ENTERED
    };

    this.persistStepStateService.sendParameters({
      selectedState: this.checkedEnteredAccounts.length <= 0 ? null : state
    });

  }

  saveCheckedToAuthorizedAccountsState(accountsFromTable: ISignatureTrackingTable[]) {
    this.checkedToAuthorizeAccounts = accountsFromTable.filter((acc) => acc.isChecked && !acc.disabled);

    (this.toAuthorizedAccountsTable as ITableStructure<ISignatureTrackingTable>).items = accountsFromTable;

    const state: ISignatureTrackingCheckedAccountsState = {
      structure: this.toAuthorizedAccountsTable as ITableStructure<ISignatureTrackingTable>,
      accounts: this.checkedToAuthorizeAccounts,
      position: ETableType.TO_AUTHORIZE
    };

    this.persistStepStateService.sendParameters({
      selectedState: this.checkedToAuthorizeAccounts.length <= 0 ? null : state
    });

  }

  saveCheckedAuthorizedAccountsState(accountsFromTable: ISignatureTrackingTable[]) {
    this.checkedAuthorizeAccounts = accountsFromTable.filter((acc) => acc.isChecked && !acc.disabled);

    (this.authorizedAccountsTable as ITableStructure<ISignatureTrackingTable>).items = accountsFromTable;

    const state: ISignatureTrackingCheckedAccountsState = {
      structure: this.authorizedAccountsTable as ITableStructure<ISignatureTrackingTable>,
      accounts: this.checkedAuthorizeAccounts,
      position: ETableType.AUTHORIZED
    };

    this.persistStepStateService.sendParameters({
      selectedState: this.checkedAuthorizeAccounts.length <= 0 ? null : state
    });
  }



  /* =================== HANDLERS ACTIONS WITH SINGLE ACTION TABLE ================== */

  handleRejectAccount(transactionList: ITMTransaction[]) {
    this.stRejectTransaction.reject({
      transactionList,
      servicesSupported: this.settings?.onlineBankingCoreServices ?? [],
      currentTabPosition: this.currentTabPosition,
      fn: this.handleResponseOperationsInToAuthorizeTransaction.bind(this),
    });

    /* Utilities to interact with sendTransactionService response */

    // How show skeleton loader in table.
    this.isLoadingEnteredAccounts = this.stRejectTransaction.loading;


    // How show static alert's.
    if (this.stRejectTransaction.currentMessage) {
      this.showAlert(this.messageEmptyListSelectedMap[this.profile], this.stRejectTransaction.currentMessage);
    }

    // How to show interactive alert. If show the service response.
    this.sendTransactionMessageSubscription = this.stRejectTransaction.message
      .subscribe(message => {
        this.showAlert(this.messageDeleteTransactionMap[this.profile], message);
        this.sendTransactionMessageSubscription.unsubscribe();
    });
  }

  handleSendAccounts(transactionList: ITMTransaction[]) {
    this.stSendTransaction.send({
      servicesSupported: this.settings?.onlineBankingCoreServices ?? [],
      currentTabPosition: this.currentTabPosition,
      transactionList,
      fn: this.handleResponseOperationsInEnteredTransaction.bind(this),
    });

    /* Utilities to interact with sendTransactionService response */

    // How show skeleton loader in table.
    // this.isLoadingEnteredAccounts = this.stSendTransaction.loadingTransaction;


    // How show static alert's.
    if (this.stSendTransaction.currentMessage) {
      this.showAlert(this.messageEmptyListSelectedMap[this.profile], this.stSendTransaction.currentMessage);
    }

    // How to show interactive alert. If show the service response.
    this.stSendTransaction.messageAlert.subscribe(message => {
      this.showAlert('warning', message);
    });

  }

  handleAuthorizeFromToAuthorize(transactionList: ITMTransaction[]) {
    this.stAuthorizeTransaction.authorize({
      transactionList,
      servicesSupported: this.settings?.onlineBankingCoreServices ?? [],
      currentTabPosition: this.currentTabPosition,
      fn: this.handleResponseOperationsInToAuthorizeTransaction.bind(this),
    });

    /* Utilities to interact with sendTransactionService response */

    // How show skeleton loader in table.
    this.isLoadingEnteredAccounts = this.stAuthorizeTransaction.loading;


    // How show static alert's.
    if (this.stAuthorizeTransaction.currentMessage) {
      this.showAlert(this.messageEmptyListSelectedMap[this.profile], this.stAuthorizeTransaction.currentMessage);
    }

    // How to show interactive alert. If show the service response.
    this.stAuthorizeTransaction.message.subscribe(message => {
      if (message === 'signature_tracking:authorize_successfully') {
        this.showAlert('success', message);
      } else {
        this.showAlert('warning', message);
      }
    });
  }

  handleProcessFromAuthorized(transactionList: ITMTransaction[]) {
    this.stProcessTransaction.process({
      transactionList,
      servicesSupported: this.settings?.onlineBankingCoreServices ?? [],
      currentTabPosition: this.currentTabPosition,
      fn: this.handleResponseOperationsInAuthorizedTransaction.bind(this),
      achSettings: this.achSettings,
      associatedAccounts: this.associatedAccounts,
      associatedAccountsMap: this.associatedAccountsMap,
    });

    /* Utilities to interact with sendTransactionService response */

    // How show skeleton loader in table.
    this.isLoadingEnteredAccounts = this.stProcessTransaction.loading;


    // How show static alert's.
    if (this.stProcessTransaction.currentMessage) {
      this.showAlert(this.messageEmptyListSelectedMap[this.profile], this.stProcessTransaction.currentMessage);
    }

    // How to show interactive alert. If show the service response.
    this.stProcessTransaction.message.subscribe(message => {
      this.showAlert(this.messageDeleteTransactionMap[this.profile], message);
    });
  }

  handleDeleteAccount(transactionList: ITMTransaction[]) {
    this.stDeleteTransaction.delete({
      transactionList,
      servicesSupported: this.settings?.onlineBankingCoreServices ?? [],
      currentTabPosition: this.currentTabPosition,
      fn: this.handleResponseOperationsInEnteredTransaction.bind(this),
    });

    /* Utilities to interact with sendTransactionService response */

    // How show skeleton loader in table.
    this.isLoadingEnteredAccounts = this.stDeleteTransaction.loading;


    // How show static alert's.
    if (this.stDeleteTransaction.currentMessage) {
      this.showAlert(this.messageEmptyListSelectedMap[this.profile], this.stDeleteTransaction.currentMessage);
    }

    // How to show interactive alert. If show the service response.
    this.stDeleteTransaction.message.subscribe(message => {
      this.showAlert(this.messageDeleteTransactionMap[this.profile], message);
    });
  }

  /* =================== HANDLERS ACTIONS WITH SINGLE ACTION TABLE ================== */

  /* ====================================== HELPERS RESPONSE FUNCTIONS   =============================== */
  // Helpers to handle how to manage execute every operation in table.

  handleResponseOperationsInEnteredTransaction() {
    this.checkedEnteredAccounts = [];
    this.persistStepStateService.sendParameters({
      selectedState: null
    });

    this.scrollToTop();

    this.getEnteredAccountList();
  }

  handleResponseOperationsInToAuthorizeTransaction() {
    this.checkedToAuthorizeAccounts = [];
    this.checkedAuthorizeAccounts = [];
    this.persistStepStateService.sendParameters({
      selectedState: null
    });

    this.scrollToTop();

    if (this.currentTabPosition === 1) {
      this.getToAuthorizeAccountList();
    } else {
      this.getAuthorizedAccountList();
    }
  }

  handleResponseOperationsInAuthorizedTransaction() {
    this.checkedAuthorizeAccounts = [];
    this.checkedToAuthorizeAccounts = [];
    this.persistStepStateService.sendParameters({
      selectedState: null
    });

    this.scrollToTop();

    this.getAuthorizedAccountList();
  }

  /* ====================================== HELPERS RESPONSE FUNCTIONS   =============================== */

  /* ===================================== UTILITIES ===================================== */


  resetParameterStateStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  mangeToRemoveAlert() {
    this.typeAlert = '';
    this.messageAlert = '';
  }

  scrollToTop() {
    this.utils.scrollToTop();
  }

  orderRegisters(registers: any, type: string) {
    if (type === 'entered') {
      this.enteredAccountsTable!.items = registers;
    }

    if (type === 'toAuthorize') {
      this.toAuthorizedAccountsTable!.items = registers;
    }

    if (type === 'authorized') {
      this.authorizedAccountsTable!.items = registers;
    }
  }

  resetStorageFromSignatureTrackingToEmbbeded() {
    this.persistStepStateService.sendParameters({
      signatoryParams: null,
      serviceEmbedded: null,
    });
  }

  /* ===================================== UTILITIES ===================================== */

}
