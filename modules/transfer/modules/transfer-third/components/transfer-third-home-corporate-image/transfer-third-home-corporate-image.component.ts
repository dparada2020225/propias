import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AdfAlertModalComponent,
  AdfFormBuilderService,
  ICON_IN_TABLE_KEY,
  IDataSelect,
  ILayout,
  ILoadItem,
  ITableStructure
} from "@adf/components";
import {FormGroup} from "@angular/forms";
import {IThirdTransfersAccounts} from "../../../../interface/transfer-data-interface";
import {TableOption} from "../../../../interface/table.enum";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {UtilService} from "../../../../../../service/common/util.service";
import {TtdTableManagerService} from "../../services/definition/table/manager/ttd-table-manager.service";
import {TransferThirdService} from "../../services/transaction/transfer-third.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ValidationTriggerTimeService} from "../../../../../../service/common/validation-trigger-time.service";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {IFlowError} from "../../../../../../models/error.interface";
import {IIsSchedule} from "../../../../../../models/isSchedule.interface";
import {environment} from "../../../../../../../environments/environment";
import {AttributeThirdTransferTable} from "../../enums/third-transfer-control-name.enum";
import {catchError, map} from 'rxjs/operators';
import {
  EThirdCrudUrlNavigationCollection,
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection
} from "../../enums/third-transfer-navigate-parameters.enum";
import {
  IThirdTransferTransactionState,
  IThirdTransferUpdateState
} from "../../interfaces/third-transfer-persistence.interface";
import {OnboardingNewsComponent} from "./onboarding-news/onboarding-news.component";
import {EProfile} from "../../../../../../enums/profile.enum";
import {HandleTokenRequestService} from "../../../../../../service/common/handle-token-request.service";
import {UtilTransactionService} from "../../../../../../service/common/util-transaction.service";
import {of, Subscription} from "rxjs";
import {HttpStatusCode} from "../../../../../../enums/http-status-code.enum";
import {ModalTokenComponent} from "../../../../../../view/private/token/modal-token/modal-token.component";
import {ERequestTypeTransaction} from "../../../../../../enums/transaction-header.enum";
import {TranslateService} from "@ngx-translate/core";
import {Base64Service} from "../../../../../../service/common/base64.service";

@Component({
  selector: 'byte-transfer-third-home-corporate-image',
  templateUrl: './transfer-third-home-corporate-image.component.html',
  styleUrls: ['./transfer-third-home-corporate-image.component.scss']
})
export class TransferThirdHomeCorporateImageComponent implements OnInit, OnDestroy {

  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = [];
  menuOptionsLicenses: string[] = [];

  associatedThirdFavoriteAccounts: IThirdTransfersAccounts[] = [];
  associatedThirdAccounts: IThirdTransfersAccounts[] = [];

  favoriteAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  thirdAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  selectedAccount!: ILoadItem<IThirdTransfersAccounts>;
  private numberAccountToDelete: string | null = null;

  typeAlert: string | undefined;
  messageAlert!: string | undefined;
  typeAlertFavoriteAccount: string | undefined;
  messageAlertFavoriteAccount: string | undefined;
  typeAlertThirdAccounts!: string;
  messageAlertThirdAccounts!: string;

  propertiesToSearch: string[] = ['name', 'alias', 'account'];
  valueToSearch: string = '';
  queryToSearchInput: string = '';

  typeProfile: string = environment.profile;
  profileSv: string = EProfile.SALVADOR;
  isInitialState: boolean = true;

  private subscription!: Subscription;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowCreateButton() {
    return this.menuOptionsLicenses?.includes(TableOption.CREATE);
  }

  get showDivideLine(): boolean {
    return (this.favoriteAccountsLayout.items.length === 0 && this.thirdAccountsLayout.items.length === 0) && !this.isInitialState
  }

  get optionsListPers() {
    return this.optionsList.find((option) => option.controlName === AttributeThirdTransferTable.SELECT_TYPE_FILTER)?.data ?? []
  }

  get filterAttribute() {
    return this.formLayout.attributes.find((attribute) => attribute.controlName === AttributeThirdTransferTable.SELECT_TYPE_FILTER)!
  }


  constructor(
    private parameterManagement: ParameterManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private util: UtilService,
    private tableManagerService: TtdTableManagerService,
    private thirdFormBuilder: AdfFormBuilderService,
    private transferThirdService: TransferThirdService,
    private modalService: NgbModal,
    private validationTriggerTime: ValidationTriggerTimeService,
    private utilWorkflow: UtilWorkFlowService,
    private handleTokenRequestService: HandleTokenRequestService,
    private utilsTransaction: UtilTransactionService,
    private translateService: TranslateService,
    private base64: Base64Service
  ) {
  }


  ngOnInit(): void {
    this.validateThirdTransferSchedule();
    this.getMenuOptionsLicenses();
    this.initDefinition();
    this.getAssociatedThirdAccounts(null, true);
    this.verifyOpenModal();

    this.util.hideLoader();
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.modalService.dismissAll();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMenuOptionsLicenses() {
    const menuOptions = this.activatedRoute.snapshot.data['menuOptionsLicenses'];

    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      return;
    }

    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);
  }

  verifyOpenModal(): void {
    let usuarios: string[] = [];

    const item = localStorage.getItem('isOpen');
    if (item !== null) {
      const items: string[] = JSON.parse(item);

      for (let i of items) {
        usuarios.push(this.base64.decoded(i))
      }

    }

    if (!usuarios.includes(this.util.getUserName())) {
      const modal = this.modalService.open(OnboardingNewsComponent, {
        centered: true,
        windowClass: `${environment.profile || 'byte-theme'} third-transfer-welcome`,
        size: `lg`,
        backdrop: 'static',
        keyboard: false,
      });

      modal.result
        .then((isConfirm) => {
          if (!isConfirm) {
            return;
          }
        })
        .catch((error) => error);

    }
  }

  /* =========================================================== FORM DEFINITION  =================================================================== */

  initDefinition() {
    this.favoriteAccountsLayout = this.tableManagerService.buildFavoriteTable(this.menuOptionsLicenses);
    this.thirdAccountsLayout = this.tableManagerService.buildAssociateTable(this.menuOptionsLicenses);
    this.filterLayoutDefinition();
  }

  filterLayoutDefinition() {
    this.formLayout = this.tableManagerService.buildFilterForm();
    this.form = this.thirdFormBuilder.formDefinition(this.formLayout.attributes);
    this.changeDataFormFilter();
  }

  /* ========================================================== END FORM DEFINITION  ================================================================= */

  /* =========================================================== FILTERS  =================================================================== */

  changeDataFormFilter() {
    this.form.get(AttributeThirdTransferTable.SELECT_TYPE_FILTER)?.valueChanges.subscribe((data) => {

      if (data === 'Titulo') {
        return
      }

      let datoSelected = data;
      this.handleSearchByDropDow(data);
      this.checkInitialState(datoSelected, this.form.get(AttributeThirdTransferTable.FILTER)?.value);
    });

    this.form.get(AttributeThirdTransferTable.FILTER)?.valueChanges.subscribe((data) => {
      let datoInput = data;
      this.searchAccount(data);
      this.checkInitialState(this.form.get(AttributeThirdTransferTable.SELECT_TYPE_FILTER)?.value, datoInput);
    });
  }

  checkInitialState(datoSelected: string | null, datoInput: string | null) {
    if (!datoInput && !datoSelected) {
      this.isInitialState = true;
    } else {
      this.isInitialState = false;
    }
  }


  /* ======================== SELECT ======================== */

  handleSearchByDropDow(data: string) {
    const {associated, favorites} = this.searchByDropDown(data) ?? {};

    (this.thirdAccountsLayout as ITableStructure).items = [...associated];
    (this.favoriteAccountsLayout as ITableStructure).items = [...favorites];

    if (this.favoriteAccountsLayout.items.length === 0) {
      this.showAlertFavoriteAccount('info', 'no_matches_found');
    }

    if (this.thirdAccountsLayout.items.length === 0) {
      this.showAlertAccount('info', 'no_matches_found');
    }

  }

  searchByDropDown(data: string) {
    const dataSplit = data.split('-');
    this.valueToSearch = data;

    if (!dataSplit[0]) {
      const favoritesAccount = this.mapAccountsIcon(this.associatedThirdFavoriteAccounts, 'sprint2-icon-favoritos active')
      const accountsThird = this.mapAccountsIcon(this.associatedThirdAccounts, 'sprint2-icon-favoritos')

      return {
        associated: this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(
          accountsThird,
          this.queryToSearchInput,
          this.propertiesToSearch
        ),
        favorites: this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(
          favoritesAccount,
          this.queryToSearchInput,
          this.propertiesToSearch
        ),
      };
    }

    const query = dataSplit[0].trim();
    const propertyToSearch = dataSplit[1].trim();

    const filterAssociated = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(this.associatedThirdAccounts, query, [
      propertyToSearch,
    ]);
    const filterFavorite = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(this.associatedThirdFavoriteAccounts, query, [
      propertyToSearch,
    ]);

    const filterAssociatedByQuery = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(
      filterAssociated,
      this.queryToSearchInput,
      this.propertiesToSearch
    );
    const filterFavoriteByQuery = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(
      filterFavorite,
      this.queryToSearchInput,
      this.propertiesToSearch
    );

    const favoriteByQuery = this.mapAccountsIcon(filterFavoriteByQuery, 'sprint2-icon-favoritos active')
    const accountByQuery = this.mapAccountsIcon(filterAssociatedByQuery, 'sprint2-icon-favoritos')

    return {
      associated: accountByQuery,
      favorites: favoriteByQuery,
    };
  }

  /* ======================== END SELECT ======================== */

  /* ======================== INPUT ======================== */
  searchAccount(value: string) {
    let filterAssociated: IThirdTransfersAccounts[];
    let filterFavorite: IThirdTransfersAccounts[];

    const UpperValue: string = value.toUpperCase();

    this.queryToSearchInput = value;

    const {associated, favorites} = this.searchByDropDown(this.valueToSearch);
    filterAssociated = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(associated, value, this.propertiesToSearch);
    filterFavorite = this.util.searchByMultipleAttributes<IThirdTransfersAccounts>(favorites, value, this.propertiesToSearch);


    if (value) {
      this.favoriteAccountsLayout.items = this.filterAccountList(
        filterFavorite,
        UpperValue
      );
      this.thirdAccountsLayout.items = this.filterAccountList(filterAssociated, UpperValue);

      if (this.favoriteAccountsLayout.items.length === 0) {
        this.showAlertFavoriteAccount('info', 'no_matches_found');
      }

      if (this.thirdAccountsLayout.items.length === 0) {
        this.showAlertAccount('info', 'no_matches_found');
      }

    } else {
      this.favoriteAccountsLayout.items = filterFavorite;
      this.thirdAccountsLayout.items = filterAssociated;
    }
  }

  /**
   * @return Method to search on array list
   * and get a new array with coincidences found
   */
  filterAccountList(accountList: IThirdTransfersAccounts[], value: string): IThirdTransfersAccounts[] {
    return accountList.filter((item) => {
      return this.propertiesToSearch.some((prop) => {
        return String(item[prop])
          .toLowerCase()
          .includes((value ?? '').toLowerCase());
      });
    });
  }

  /* ======================== END INPUT ======================== */

  /* =========================================================== END FILTERS  =================================================================== */

  /* =========================================================== GET ACCOUNTS  =================================================================== */

  /**
   * @return Method to get transfer thirds accounts and get filter to use
   */

  getAssociatedThirdAccounts(associatedThirdAccounts?: any, fromRoute: boolean = false): void {

    const responseValidation = fromRoute
      ? this.activatedRoute.snapshot.data['associatedThirdAccounts']
      : associatedThirdAccounts;

    if (this.isErrorResponse(responseValidation)) {
      return;
    }

    if (!responseValidation) {
      this.clearLayoutItems();
      return;
    }

    this.getFilters();
    this.separateAccountsByFavorites(responseValidation);

    this.thirdAccountsLayout.items = this.mapAccountsIcon(this.associatedThirdAccounts, 'sprint2-icon-favoritos');
    this.favoriteAccountsLayout.items = this.mapAccountsIcon(this.associatedThirdFavoriteAccounts, 'sprint2-icon-favoritos active');
  }

  isErrorResponse(response: any): boolean {
    if (response?.hasOwnProperty('error')) {
      this.showAlert('error', response.message);
      return true;
    }
    return false;
  }

  clearLayoutItems(): void {
    this.thirdAccountsLayout.items = [];
    this.favoriteAccountsLayout.items = [];
    this.associatedThirdFavoriteAccounts = [];
    this.associatedThirdAccounts = [];
  }

  separateAccountsByFavorites(associatedAccounts: IThirdTransfersAccounts[]): void {
    this.associatedThirdFavoriteAccounts = [];
    this.associatedThirdAccounts = [];

    associatedAccounts.forEach(account => {
      const enhancedAccount = {
        ...account,
        productLabel: this.util.getLabelProductSimple(+account?.type || 0)
      };

      if (account.favorite) {
        this.associatedThirdFavoriteAccounts.push(enhancedAccount);
      } else {
        this.associatedThirdAccounts.push(enhancedAccount);
      }
    });
  }

  getFilters() {
    const typeAccounts = [
      {
        name: this.translateService.instant("type-account"),
        value: "Titulo",
      },
      {
        name: this.translateService.instant('bisv_cheks-UP'),
        value: '1 - type'
      },
      {
        name: String(this.translateService.instant('bisv_savings')).toUpperCase(),
        value:  '2 - type'
      }
    ]

    const filterDataSelect: IDataSelect = {
      controlName: AttributeThirdTransferTable.SELECT_TYPE_FILTER,
      data: [...typeAccounts],
    };
    this.optionsList = [filterDataSelect];
  }


  /* =========================================================== END GET ACCOUNTS  =================================================================== */

  /* =========================================================== GET ACTIONS TABLE  =================================================================== */

  /**
   * @return Method that obtains the selected
   * action in the associated accounts
   * table and favorites
   */

  getSelectedAccount(selectAccountTemp: any): ILoadItem<IThirdTransfersAccounts> {
    return selectAccountTemp as ILoadItem<IThirdTransfersAccounts>;
  }

  handleAction(selectAccount: ILoadItem<IThirdTransfersAccounts>, actionsMap: Record<string, Function>) {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    const actionFunction = actionsMap[selectAccount.action!];
    if (actionFunction) {
      actionFunction(selectAccount);
    }
  }

  getActionTable(selectAccountTemp: any) {
    const selectAccount = this.getSelectedAccount(selectAccountTemp);

    this.handleAction(selectAccount, {
      [TableOption.UPDATE]: (account: ILoadItem<IThirdTransfersAccounts>) => this.goToUpdateFlow(account.item),
      [TableOption.TRANSFER]: (account: ILoadItem<IThirdTransfersAccounts>) => this.goToTransferFlow(account.item),
      [TableOption.DELETE]: (account: ILoadItem<IThirdTransfersAccounts>) => this.openDeleteModal(account),
      [TableOption.ADD_FAVORITE]: (account: ILoadItem<IThirdTransfersAccounts>) => this.handleAddAccountToFavorite(account),
      [TableOption.DELETE_FAVORITE]: (account: ILoadItem<IThirdTransfersAccounts>) => this.handleRemoveAccountFromFavorite(account),
    });
  }

  /* =========================================================== END GET ACTIONS TABLE  =================================================================== */

  /* =========================================================== FAVORITES  =================================================================== */
  handleRemoveAccountFromFavorite(account: ILoadItem<IThirdTransfersAccounts>) {
    const {item} = account;

    this.util.showPulseLoader();
    this.setLoadingAnimationToRemoveFromFavorite(account);
    this.transferThirdService.deleteFavorite(item.account)
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.removeLoadingAnimationFromAccountFavorite(account)
          this.util.scrollToTop();
          this.util.hidePulseLoader();
          this.showAlert('error', 'error_delete_favorite_account')

          setTimeout(() => {
            this.hideAlert();
          }, 5000)
        }
      });
  }

  handleAddAccountToFavorite(account: ILoadItem<IThirdTransfersAccounts>) {
    const {item} = account;

    this.util.showPulseLoader();
    this.setLoadingAnimationToAccountToAddFavorite(account);
    this.transferThirdService.addFavorite({number: item.account, alias: item.alias})
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.removeLoadingAnimationFromAccount(account)
          this.util.scrollToTop();
          this.util.hidePulseLoader()
          this.showAlert('error', 'error_add_favorite_account')

          setTimeout(() => {
            this.hideAlert();
          }, 5000)

        },
      });
  }

  /* =========================================================== END FAVORITES  =================================================================== */

  /* =========================================================== ACTIONS TABLE  =================================================================== */
  goToCreateAccountFlow() {
    if (!this.menuOptionsLicenses.includes(TableOption.CREATE)) {
      return;
    }

    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    this.util.showLoader();
    this.router.navigate([EThirdCrudUrlNavigationCollection.CREATE_HOME]).finally(() => this.util.hideLoader());
  }

  goToTransferFlow(accountSelected: IThirdTransfersAccounts) {
    this.util.showLoader();

    const transactionState: IThirdTransferTransactionState = this.parameterManagement.getParameter('navigateStateParameters');

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.TRANSFER_HOME,
      navigateStateParameters: {
        targetAccount: accountSelected,
        sourceAccount: null,
        formValues: transactionState?.formValues ? transactionState.formValues : null,
      } as IThirdTransferTransactionState,
    });

    this.router.navigate([EThirdTransferUrlNavigationCollection.HOME_TRANSACTION]).finally(() => this.util.hideLoader());
  }


  openDeleteModal(selectAccount: ILoadItem<IThirdTransfersAccounts>) {

    this.numberAccountToDelete = selectAccount?.item?.account || '';

    const iconMap = {
      [EProfile.SALVADOR]: 'sprint2-icon-warning',
    }

    const messageMap = {
      [EProfile.SALVADOR]: 'delete_message_modal-sv'
    }

    const messageNextButton = {
      [EProfile.SALVADOR]: 'label.accept-message-sv'
    }

    const classDelete = this.typeProfile === this.profileSv ? 'delete-modal-sv' : '';

    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} ${classDelete} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.utilWorkflow.buildDeleteAchAlert(iconMap[this.typeProfile] || 'banca-regional-warning', messageMap[this.typeProfile] || null, messageNextButton[this.typeProfile] || null);

    modal.result
      .then((result) => {
        if (!result) {
          this.numberAccountToDelete = null;
          return;
        }

        this.handleTokenRequest();
      })
      .catch(() => {
        this.numberAccountToDelete = null;
      });
  }

  handleTokenRequest() {

    if (this.handleTokenRequestService.isTokenRequired()) {
      this.tokenModal();
      return;
    }

    this.executeDelete().subscribe({
      next: (response) => {
        this.handleTransactionResponse(response)
      }
    })
  }

  tokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;
    modal.componentInstance.executeService = this.executeDelete.bind(this);

    modal.dismissed.subscribe(() => {
      return;
    });

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleTransactionResponse(result);
      })
      .catch((error) => error);
  }

  executeDelete(token?: string,) {
    this.util.showPulseLoader();
    return this.transferThirdService.delete({
      numberAccount: this.numberAccountToDelete!,
      isTokenRequired: this.handleTokenRequestService.isTokenRequired(),
      token,
    })
      .pipe(
        map((response) => this.utilsTransaction.handleResponseTransaction(response)
        ),
        catchError((error) => of(this.utilsTransaction.handleErrorTransaction(error)))
      )

  }

  handleTransactionResponse(response: any) {
    this.numberAccountToDelete = null;


    if (response?.status === HttpStatusCode.INVALID_TOKEN) {
      this.util.hidePulseLoader()
      return;
    }

    if (response?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.util.hidePulseLoader()
      this.util.scrollToTop();
      this.showAlert('error', response.message as string);
      setTimeout(() => {
        this.hideAlert()
      }, 5000)

      return;
    }

    this.refreshTableData()
    this.util.scrollToTop()
    this.showAlert('success', 'account_successfully_removed-sv')
    setTimeout(() => {
      this.hideAlert()
    }, 5000)
  }

  goToUpdateFlow(selectedAccount: IThirdTransfersAccounts) {
    this.util.showLoader();

    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_UPDATE_FORM,
      navigateStateParameters: {
        accountToUpdate: selectedAccount,
      } as IThirdTransferUpdateState,
    });

    this.router.navigate([EThirdCrudUrlNavigationCollection.UPDATE_HOME]).finally(() => this.util.hideLoader());
  }

  /* =========================================================== END ACTIONS TABLE  =================================================================== */

  /* =========================================================== UTILS  =================================================================== */

  setLoadingAnimationToAccountToAddFavorite(account: ILoadItem<IThirdTransfersAccounts>) {
    this.updateIconInLayout(account, this.thirdAccountsLayout, 'sprint2-icon-favoritos loading');
  }

  removeLoadingAnimationFromAccount(account: ILoadItem<IThirdTransfersAccounts>) {
    this.updateIconInLayout(account, this.thirdAccountsLayout, 'sprint2-icon-favoritos');
  }

  setLoadingAnimationToRemoveFromFavorite(account: ILoadItem<IThirdTransfersAccounts>) {
    this.updateIconInLayout(account, this.favoriteAccountsLayout, 'sprint2-icon-favoritos loading');
  }

  removeLoadingAnimationFromAccountFavorite(account: ILoadItem<IThirdTransfersAccounts>) {
    this.updateIconInLayout(account, this.favoriteAccountsLayout, 'sprint2-icon-favoritos active');
  }

  updateIconInLayout(account: ILoadItem<IThirdTransfersAccounts>, layout: ITableStructure<IThirdTransfersAccounts>, iconKey: string) {
    const {item} = account;

    const accountPosition = layout.items.findIndex((account) => account.account === item.account);

    if (accountPosition === -1) return;

    layout.items = [
      ...layout.items.slice(0, accountPosition),
      {
        ...item,
        [ICON_IN_TABLE_KEY]: iconKey
      },
      ...layout.items.slice(accountPosition + 1)
    ]
  }

  mapAccountsIcon(accounts: IThirdTransfersAccounts[], iconValue: string) {
    return accounts.map(account => ({
      ...account,
      [ICON_IN_TABLE_KEY]: iconValue
    })) as any;
  }

  refreshTableData(): void {
    this.transferThirdService
      .getAssociatedThirdAccounts()
      .subscribe({
        next: (associatedThirdAccounts) => {
          this.getAssociatedThirdAccounts(associatedThirdAccounts, false);
          if (!associatedThirdAccounts) {
            return
          }
          this.searchByDropDown(this.form.get(AttributeThirdTransferTable.SELECT_TYPE_FILTER)?.value)
          this.searchAccount(this.form.get(AttributeThirdTransferTable.FILTER)?.value)
        },
        error: (error) => {
          this.showAlert('error', error.error.message ?? 'error_getting_associated_third_accounts_favorite');
        },
        complete: () => {
          this.util.hidePulseLoader()
        }
      });
  }

  /**
   * @return Method in charge validate if
   * the general alert should be shown
   */
  validateThirdTransferSchedule() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
  }

  validationAlert(): boolean {
    return !!(this.typeAlert && this.messageAlert);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hideAlert() {
    this.typeAlert = undefined;
    this.messageAlert = undefined;
  }

  hasData(table: ITableStructure<IThirdTransfersAccounts>): boolean {
    return table.items.length > 0;
  }

  /*=====ALERTA EN FAVORITOS=======*/
  validationTableFavoriteAccount(): boolean {
    return this.isInitialState || this.hasData(this.favoriteAccountsLayout)
  }

  validationAlertFavoriteAccount(): boolean {
    const isShowAlert: boolean = this.typeAlertFavoriteAccount != undefined && this.messageAlertFavoriteAccount != undefined;
    const isEmptyListAccounts = !this.hasData(this.favoriteAccountsLayout);

    return (isShowAlert && isEmptyListAccounts) && !this.isInitialState;
  }

  showAlertFavoriteAccount(type?: string, message?: string): void {
    this.typeAlertFavoriteAccount = type;
    this.messageAlertFavoriteAccount = message;
  }

  /*=====ALERTA EN TABLA=====*/

  validationTableAccount(): boolean {

    if (this.isInitialState) {
      return true
    }

    return this.hasData(this.thirdAccountsLayout)
  }

  validationAlertAccount(): boolean {
    const isShowAlert: boolean = this.typeAlertThirdAccounts != undefined && this.messageAlertThirdAccounts != undefined;
    const isEmptyListAccounts = !this.hasData(this.thirdAccountsLayout);

    return (isShowAlert && isEmptyListAccounts) && !this.isInitialState;
  }

  showAlertAccount(type: string, message: string): void {
    this.typeAlertThirdAccounts = type;
    this.messageAlertThirdAccounts = message;
  }

}
