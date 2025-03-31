import {
  AdfAlertModalComponent,
  AdfFormBuilderService,
  IDataSelect,
  ILayout,
  ILoadItem,
  ITableStructure
} from '@adf/components';
import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs';
import {EProfile} from 'src/app/enums/profile.enum';
import {IFlowError} from 'src/app/models/error.interface';
import {IIsSchedule} from 'src/app/models/isSchedule.interface';
import {TableOption} from 'src/app/modules/transfer/interface/table.enum';
import {IThirdTransfersAccounts} from 'src/app/modules/transfer/interface/transfer-data-interface';
import {UtilService} from 'src/app/service/common/util.service';
import {ValidationTriggerTimeService} from 'src/app/service/common/validation-trigger-time.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {environment} from 'src/environments/environment';
import {UtilWorkFlowService} from '../../../../../../service/common/util-work-flow.service';
import {AttributeThirdTransferTable} from '../../enums/third-transfer-control-name.enum';
import {
  EThirdCrudUrlNavigationCollection,
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection,
} from '../../enums/third-transfer-navigate-parameters.enum';
import {IThirdTransferTransactionResponse} from '../../interfaces/third-transfer-definition.interface';
import {
  IThirdTransferDeleteState,
  IThirdTransferTransactionState,
  IThirdTransferUpdateState,
} from '../../interfaces/third-transfer-persistence.interface';
import {TtdTableManagerService} from '../../services/definition/table/manager/ttd-table-manager.service';
import {TransferThirdService} from '../../services/transaction/transfer-third.service';
import {ITTRDeleteAccountRequest} from "../../interfaces/crud/delete-third-interface";

@Component({
  selector: 'byte-transfer-third-home',
  templateUrl: './transfer-third-home.component.html',
  styleUrls: ['./transfer-third-home.component.scss'],
})
export class TransferThirdHomeComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = [];
  menuOptionsLicenses: string[] = [];

  associatedThirdFavoriteAccounts: IThirdTransfersAccounts[] = [];
  associatedThirdAccounts: IThirdTransfersAccounts[] = [];

  favoriteAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  thirdAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  selectedAccount!: ILoadItem<IThirdTransfersAccounts>;

  typeAlert: string | undefined;
  messageAlert!: string | undefined;

  propertiesToSearch: string[] = ['name', 'alias', 'account'];
  valueToSearch: string = '';
  queryToSearchInput: string = '';

  typeAlertFavoriteAccount!: string | undefined;
  messageAlertFavoriteAccount!: string | undefined;
  typeAlertThirdAccounts!: string;
  messageAlertThirdAccounts!: string;
  typeProfile: string = environment.profile;
  profileSv: EProfile = EProfile.SALVADOR;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowCreateButton() {
    return this.menuOptionsLicenses?.includes(TableOption.CREATE);
  }

  get isShowDividerTable() {
    return this.favoriteAccountsLayout.items.length > 0 && this.thirdAccountsLayout.items.length > 0;
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
  ) {
  }

  ngOnInit(): void {
    this.getMenuOptionsLicenses();
    this.initDefinition();
    this.validateThirdTransferSchedule();
    this.getAssociatedThirdAccounts();
    this.util.hideLoader();
  }

  getMenuOptionsLicenses() {
    const menuOptions = this.activatedRoute.snapshot.data['menuOptionsLicenses'];

    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      return;
    }

    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);
  }

  validateThirdTransferSchedule() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(environment.profile, schedule);
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

  changeDataFormFilter() {
    this.form.get(AttributeThirdTransferTable.FILTER)?.valueChanges.subscribe((data) => {
      this.searchAccount(data);
    });
  }

  /**
   * @return Method to search accounts
   * on list of favorites or normal accounts
   * by name or number accounts
   */

  searchAccount(value: string) {
    const UpperValue: string = value.toUpperCase();
    if (value) {
      this.favoriteAccountsLayout.items = this.filterAccountList(this.associatedThirdFavoriteAccounts, UpperValue);
      this.thirdAccountsLayout.items = this.filterAccountList(this.associatedThirdAccounts, UpperValue);

      if (this.favoriteAccountsLayout.items.length <= 0 && this.thirdAccountsLayout.items.length <= 0) {
        this.showAlertFavoriteAccount('warning', 'no_matches_found');
      }
    } else {
      this.favoriteAccountsLayout.items = this.associatedThirdFavoriteAccounts;
      this.thirdAccountsLayout.items = this.associatedThirdAccounts;
    }
  }

  /**
   * @return Method to search on an array list
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


  getAssociatedThirdAccounts(associatedThirdAccounts?: any): void {
    const responseValidation = associatedThirdAccounts ?? this.activatedRoute.snapshot.data['associatedThirdAccounts'];
    if (responseValidation.hasOwnProperty('error')) {
      this.showAlertAccount('error', responseValidation.message);
      return;
    }

    const associatedAccounts: IThirdTransfersAccounts[] = responseValidation;

    if (associatedAccounts.length <= 0) {
      this.showAlertAccount('warning', 'empty_ach_accounts');
    }

    if (associatedAccounts && associatedAccounts.length > 0) {
      this.associatedThirdFavoriteAccounts = [];
      this.associatedThirdAccounts = [];


      associatedAccounts.forEach((account) => {

        if (account.favorite) {
          account = {...account, productLabel: this.util.getLabelProduct(+account?.type || 0).toLocaleUpperCase()};
          this.associatedThirdFavoriteAccounts.push(account);
        } else {
          account = {...account, productLabel: this.util.getLabelProduct(+account?.type || 0).toLocaleUpperCase()};
          this.associatedThirdAccounts.push(account);
        }
      });
    }

    this.thirdAccountsLayout.items = this.associatedThirdAccounts.length > 0 ? this.associatedThirdAccounts : [];
    this.favoriteAccountsLayout.items = this.associatedThirdFavoriteAccounts.length > 0 ? this.associatedThirdFavoriteAccounts : [];
  }

  refreshTableData(): void {
    this.util.showLoader();

    this.transferThirdService
      .getAssociatedThirdAccounts()
      .pipe(finalize(() => this.util.hideLoader()))
      .subscribe({
        next: (associatedThirdAccounts) => {
          this.getAssociatedThirdAccounts(associatedThirdAccounts);
        },
        error: (error) => {
          this.showAlertAccount('error', error.error.message ?? 'error_getting_associated_third_accounts_favorite');
        },
      });
  }

  /**
   * @return Method that obtains the selected
   * action in the associated accounts
   * table of favorites
   */
  getActionFavoriteTable(selectAccountTemp: any) {
    const selectAccount: ILoadItem<IThirdTransfersAccounts> = selectAccountTemp as ILoadItem<IThirdTransfersAccounts>;
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    console.log(selectAccount);

    switch (selectAccount.action) {
      case TableOption.TRANSFER:
        this.goToTransferFlow(selectAccount?.item);
        break;
      case TableOption.DELETE_FAVORITE:
        this.openDeleteModalFavorite(selectAccount);
        break;
    }
  }

  /**
   * @return Method that obtains the selected
   * action in the associated accounts table
   */
  getActionTable(selectAccountTemp: any) {
    const selectAccount: ILoadItem<IThirdTransfersAccounts> = selectAccountTemp as ILoadItem<IThirdTransfersAccounts>;
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    switch (selectAccount.action) {
      case TableOption.UPDATE:
        this.goToUpdateFlow(selectAccount.item);
        break;
      case TableOption.TRANSFER:
        this.goToTransferFlow(selectAccount?.item);
        break;
      case TableOption.DELETE:
        this.openDeleteModal(selectAccount);
        break;
    }
  }


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
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.utilWorkflow.buildDeleteAchAlert();

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.handleExecuteDeleteAccount(selectAccount);

      })
      .catch((error) => error);
  }

  openDeleteModalFavorite(selectAccount: ILoadItem<IThirdTransfersAccounts>) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.utilWorkflow.buildDeleteFavoriteAlert();

    modal.result
      .then((isConfirm) => {
        if (!isConfirm) {
          return;
        }

        this.handleExecuteDeleteFavorite(selectAccount);
      })
      .catch((error) => error);
  }

  handleExecuteDeleteFavorite(selectAccount: ILoadItem<IThirdTransfersAccounts>) {
    this.util.showLoader();

    this.transferThirdService
      .deleteFavorite(selectAccount?.item?.account)
      .pipe(
        finalize(() => {
          this.util.hideLoader();
          this.refreshTableData();
        })
      )
      .subscribe({
        next: () => {
        },
        error: () => {
          this.showAlert('error', 'failed_delete_account');
        },
      });
  }

  handleExecuteDeleteAccount(selectAccount: ILoadItem<IThirdTransfersAccounts>) {
    this.util.showLoader();

    const dto: ITTRDeleteAccountRequest = {
      numberAccount: selectAccount?.item?.account,
      isTokenRequired: false
    }

    this.transferThirdService.delete(dto).subscribe({
      next: (data) => {
        this.goToDeleteFlow(data?.body, selectAccount?.item);
      },
      error: () => {
        this.showAlert('error', 'failed_delete_account');
      },
    });
  }

  goToDeleteFlow(transactionResponse: IThirdTransferTransactionResponse, selectedAccount: IThirdTransfersAccounts) {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_DELETE,
      navigateStateParameters: {
        accountToDelete: selectedAccount,
        transactionResponse,
      } as IThirdTransferDeleteState,
    });

    this.router.navigate([EThirdCrudUrlNavigationCollection.DELETE]).finally(() => this.util.hideLoader());
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

  /*
   * @return Method in charge validate if the
   * alert of the table of associated accounts
   * should be shown (Favorite)
   * */
  validationAlertFavoriteAccount(): boolean {
    const isShowAlert: boolean = this.typeAlertFavoriteAccount != undefined && this.messageAlertFavoriteAccount != undefined;
    const isEmptyListAccounts = this.favoriteAccountsLayout.items.length <= 0 && this.thirdAccountsLayout.items.length <= 0;

    return isShowAlert && isEmptyListAccounts;
  }

  /**
   * @return Method in charge validate if the
   * table of associated accounts should
   * be displayed (Favorite)
   */
  validationTableFavoriteAccount(): boolean {
    return this.associatedThirdFavoriteAccounts.length > 0 || this.validationAlertFavoriteAccount();
  }

  /**
   * @return Method in charge validate if the
   * alert of the table of associated accounts
   * should be shown
   */
  validationAlertAccount(): boolean {
    return !!(this.typeAlertThirdAccounts && this.messageAlertThirdAccounts);
  }

  /**
   * @return Method in charge validate if the
   * table of associated accounts should
   * be displayed
   */
  validationTableAccount(): boolean {
    return this.associatedThirdAccounts.length > 0 || this.validationAlertAccount();
  }

  /**
   * @return Method in charge validate if
   * the general alert should be shown
   */
  validationAlert(): boolean {
    return !!(this.typeAlert && this.messageAlert);
  }

  showAlertAccount(type: string, message: string): void {
    this.typeAlertThirdAccounts = type;
    this.messageAlertThirdAccounts = message;
  }

  showAlertFavoriteAccount(type?: string, message?: string): void {
    this.typeAlertFavoriteAccount = type;
    this.messageAlertFavoriteAccount = message;
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
    });
  }
}
