import {
  AdfAlertModalComponent,
  AdfFormBuilderService,
  IDataSelect,
  ILayout,
  ILoadItem, IPossibleValue,
  ITableStructure
} from '@adf/components';
import { Component, OnInit } from '@angular/core';
import {
  EACHCrudUrlNavigationCollection,
  EACHNavigationParameters,
  EACHTransferUrlNavigationCollection
} from '../../enum/navigation-parameter.enum';
import { IAchAccount } from '../../interfaces/ach-account-interface';
import {
  EAchTypeTransfer,
  IAchDeleteStorageLayout,
  IAchFormStorageLayout,
  IAchUpdateStorageLayout,
} from '../../interfaces/ach-transfer.interface';
import { IAchCrudTransactionResponse } from '../../interfaces/crud/crud-create.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ECrudAchTypeClient } from '../../enum/ach-crud-control-name.enum';
import { TableOption } from 'src/app/modules/transfer/interface/table.enum';
import { IFlowError } from 'src/app/models/error.interface';
import { Product } from '../../../../../../enums/product.enum';
import { AttributeFormTransferAch } from '../../enum/ach-transfer-control-name.enum';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { AtdUtilService } from '../../services/atd-util.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AtdTableManagerService } from '../../services/definition/table/atd-table-manager.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransferACHService } from '../../services/transaction/transfer-ach.service';
import { IMassiveMessage } from '../../interfaces/ach-transaction.interface';
import { FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'byte-ach-home',
  templateUrl: './ach-home.component.html',
  styleUrls: ['./ach-home.component.scss'],
  animations: [
    trigger('inOut', [
      transition('void => *', [
        style({ opacity: 0 }), // initial styles
        animate(
          '500ms',
          style({ opacity: 1 }) // final style after the transition has finished
        ),
      ]),
      transition('* => void', [
        animate(
          '500ms',
          style({ opacity: 0 }) // we asume the initial style will always be opacity: 1
        ),
      ]),
    ]),
  ],
})
export class AchHomeComponent implements OnInit {
  favoriteAccountTableLayout: ITableStructure<IAchAccount> | null = null;
  associatedAccountTableLayout: ITableStructure<IAchAccount> | null = null;

  associatedAccounts: IAchAccount[] = [];
  favoriteAccounts: IAchAccount[] = [];

  filterLayout!: ILayout;
  filterForm!: FormGroup;

  optionsList: IDataSelect[] = [];

  filterOptions: IDataSelect[] = [];
  accountDebited: IAchAccount | null = null;

  typeAlertTable: string = '';
  messageAlertTable: string = '';

  typeAlert: string = '';
  messageAlert: string = '';
  messageInfoAlert = 'info_ach_message';

  valueToSearch: string = '';
  queryToSearchInput: string = '';
  propertiesToSearchByInput: string[] = ['alias', 'account', 'name'];
  menuOptionsLicenses: string[] = [];

  alertShow: IMassiveMessage | null = null;
  profile = this.util.getProfile();

  get customShow() {
    return (this.typeAlert && this.messageAlert) || this.messageInfoAlert ? 'custom_show' : '';
  }

  get validationAlertTable(): boolean {
    const isShowAlert = this.typeAlertTable !== '' && this.messageAlertTable !== '';
    const isEmptyListAccounts =
      (this.favoriteAccountTableLayout as ITableStructure).items.length <= 0 &&
      (this.associatedAccountTableLayout as ITableStructure).items.length <= 0;

    return isShowAlert && isEmptyListAccounts;
  }

  get isShowAssociatedTableAccounts() {
    return this.associatedAccounts.length > 0 || this.validationAlertTable;
  }

  get isShowFavoriteTableAccounts() {
    return this.favoriteAccounts.length > 0 || this.validationAlertTable;
  }

  get isShowCreateButton() {
    return this.menuOptionsLicenses.includes(TableOption.CREATE);
  }

  get isShowDividerTable() {
    return (
      (this.favoriteAccountTableLayout as ITableStructure).items.length > 0 &&
      (this.associatedAccountTableLayout as ITableStructure).items.length > 0
    );
  }

  constructor(
    private formBuilderService: AdfFormBuilderService,
    private modalService: NgbModal,
    private tableManager: AtdTableManagerService,
    private activatedRoute: ActivatedRoute,
    private persistStepStateService: ParameterManagementService,
    private tableManagerDefinition: AtdTableManagerService,
    private router: Router,
    private achTransaction: TransferACHService,
    private util: UtilService,
    private achUtil: AtdUtilService,
    private validationTriggerTime: ValidationTriggerTimeService
  ) {}

  ngOnInit(): void {
    this.getMenuOptionsLicenses();
    this.validationRangeTriggerTime();
    this.getAssociatedAccounts();
    this.initDefinition();
    this.resetStorage();
    this.util.hideLoader();
  }

  receiverMessage() {
    this.alertShow = this.activatedRoute.snapshot.data['commissionMessages'] ?? {};
    return `${(this.alertShow as IMassiveMessage)?.message2}`;
  }

  validationRangeTriggerTime() {
    const schedule: IIsSchedule | IFlowError = this.activatedRoute.snapshot.data['scheduleService'];

    this.validationTriggerTime.validate(this.profile, schedule);
  }

  /* ========================= INIT DEFINITION  ========================== */

  initDefinition() {
    this.favoriteAccountTableLayout = this.tableManager.buildFavoriteTable(this.favoriteAccounts, this.menuOptionsLicenses);
    this.associatedAccountTableLayout = this.tableManager.buildAssociateTable(this.associatedAccounts, this.menuOptionsLicenses);
    this.filterLayoutDefinition();
  }

  filterLayoutDefinition() {
    this.filterLayout = this.tableManager.buildFilterForm();
    this.filterForm = this.formBuilderService.formDefinition(this.filterLayout.attributes);
    this.changeForm();
  }

  changeForm() {
    this.filterForm.get(AttributeFormTransferAch.SELECT_TYPE_FILTER)?.valueChanges.subscribe((data) => {
      if (this.favoriteAccounts.length > 0 || this.associatedAccounts.length > 0) {
        this.handleSearchByDropDow(data);
      }
    });

    this.filterForm.get(AttributeFormTransferAch.FILTER_SEARCH)?.valueChanges.subscribe((data) => {
      if (this.favoriteAccounts.length > 0 || this.associatedAccounts.length > 0) {
        this.handleSearchByInput(data);
      }
    });
  }

  /* ========================= INIT DEFINITION  ========================== */

  /* ========================= SEARCH  ========================== */

  handleSearchByInput(data: string) {
    this.queryToSearchInput = data;
    const { associated, favorites } = this.searchByDropDown(this.valueToSearch);

    const filterAssociated = this.util.searchByMultipleAttributes<IAchAccount>(associated, data, this.propertiesToSearchByInput);
    const filterFavorite = this.util.searchByMultipleAttributes<IAchAccount>(favorites, data, this.propertiesToSearchByInput);

    (this.associatedAccountTableLayout as ITableStructure).items = [...this.achUtil
      .parsedAccounts(filterAssociated)]
      .sort(this.achUtil.compareAccountsToSort);
    (this.favoriteAccountTableLayout as ITableStructure).items = [...this.achUtil
      .parsedAccounts(filterFavorite)]
      .sort(this.achUtil.compareAccountsToSort);

    if (
      (this.associatedAccountTableLayout as ITableStructure).items.length <= 0 &&
      (this.favoriteAccountTableLayout as ITableStructure).items.length <= 0
    ) {
      this.showAlertTable('warning', 'no_matches_found');
    }
  }

  handleSearchByDropDow(data: string) {
    const { associated, favorites } = this.searchByDropDown(data) ?? {};

    const accountAssociated = this.achUtil.parsedAccounts(associated);
    const accountFavorites = this.achUtil.parsedAccounts(favorites);

    (this.associatedAccountTableLayout as ITableStructure).items = [...accountAssociated].sort(this.achUtil.compareAccountsToSort);
    (this.favoriteAccountTableLayout as ITableStructure).items = [...accountFavorites].sort(this.achUtil.compareAccountsToSort);

    if (
      (this.associatedAccountTableLayout as ITableStructure).items.length <= 0 &&
      (this.favoriteAccountTableLayout as ITableStructure).items.length <= 0
    ) {
      this.showAlertTable('warning', 'no_matches_found');
    }
  }

  searchByDropDown(data: string) {
    const dataSplit = data.split('-');
    this.valueToSearch = data;

    if (!dataSplit[0]) {
      return {
        associated: this.util.searchByMultipleAttributes<IAchAccount>(
          this.associatedAccounts,
          this.queryToSearchInput,
          this.propertiesToSearchByInput
        ),
        favorites: this.util.searchByMultipleAttributes<IAchAccount>(
          this.favoriteAccounts,
          this.queryToSearchInput,
          this.propertiesToSearchByInput
        ),
      };
    }

    const query = dataSplit[0].trim();
    const propertyToSearch = dataSplit[1].trim();

    const filterAssociated = this.util.searchByMultipleAttributes<IAchAccount>(this.associatedAccounts, query, [propertyToSearch]);
    const filterFavorite = this.util.searchByMultipleAttributes<IAchAccount>(this.favoriteAccounts, query, [propertyToSearch]);

    const filterAssociatedByQuery = this.util.searchByMultipleAttributes<IAchAccount>(
      filterAssociated,
      this.queryToSearchInput,
      this.propertiesToSearchByInput
    );
    const filterFavoriteByQuery = this.util.searchByMultipleAttributes<IAchAccount>(
      filterFavorite,
      this.queryToSearchInput,
      this.propertiesToSearchByInput
    );

    return {
      associated: filterAssociatedByQuery,
      favorites: filterFavoriteByQuery,
    };
  }

  /* ========================= SEARCH  ========================== */

  /* ========================= GET INITIAL DATA FROM RESOLVER ========================== */

  getAssociatedAccounts(accountRefreshed?: IAchAccount[]) {
    const responseFromResolver = accountRefreshed ?? this.activatedRoute.snapshot.data['associatedAccounts'];

    if (responseFromResolver.hasOwnProperty('error')) {
      this.showAlert('error', (responseFromResolver as IFlowError).message);
      this.showAlertTable('warning', 'empty_ach_accounts');

      return;
    }

    const associatedAccounts: IAchAccount[] = responseFromResolver;
    this.getFilters(associatedAccounts);

    this.associatedAccounts = [];
    this.favoriteAccounts = [];

    associatedAccounts.forEach((account) => {
      if (account.favorite) {
        this.favoriteAccounts.push(account);
      } else {
        this.associatedAccounts.push(account);
      }
    });

    if (accountRefreshed) {
      this.associatedAccountTableLayout = this.tableManager.buildAssociateTable(this.associatedAccounts, this.menuOptionsLicenses);
      this.favoriteAccountTableLayout = this.tableManager.buildFavoriteTable(this.favoriteAccounts, this.menuOptionsLicenses);
    }

    if (this.favoriteAccounts.length <= 0 && this.associatedAccounts.length <= 0) {
      this.showAlertTable('warning', 'empty_ach_accounts');
    }
  }

  getFilters(associatedAccounts: IAchAccount[]) {
    const uniqueCurrencies = new Set<string>();
    const uniqueTypeAccounts = new Set<string>();
    const uniqueBanksName = new Set<string>();

    associatedAccounts.forEach((account) => {
      if (account?.type && account?.currency && account?.bankName) {
        uniqueTypeAccounts.add(account?.type || 'undefined');
        uniqueCurrencies.add(account.currency || 'undefined');
        uniqueBanksName.add(account.bankName || 'undefined');
      }
    });

    const currencyList = Array.from(uniqueCurrencies);
    const accountTypeList = Array.from(uniqueTypeAccounts);
    const bankNameList = Array.from(uniqueBanksName);

    const currencyListSelect = this.buildFilterDataSelect(currencyList, 'currency');
    const accountTypeListSelect = this.buildFilterDataSelect(accountTypeList, 'type');
    const bankNameListSelect = this.buildFilterDataSelect(bankNameList, 'bankName');

    const filterDataSelect: IDataSelect = {
      controlName: 'typeFilter',
      data: currencyListSelect.concat(accountTypeListSelect).concat(bankNameListSelect),
    };

    this.filterOptions = [filterDataSelect];
  }

  buildFilterDataSelect(items: string[], typeFilter: string): IPossibleValue[] {
    return items.map(item => {
      if (typeFilter === 'currency') return this.getCurrencies(item);
      if (typeFilter === 'bankName') return this.getBankName(item);
      return this.getTypeAccounts(item);
    });
  }

  getCurrencies(currency: string) {
    return {
      name: this.util.getLabelCurrency(currency),
      value: `${currency.toLowerCase()} - currency`,
    }
  }

  getTypeAccounts(type: string) {
    return {
      name: this.util.getLabelProduct(Number(Product[type])),
      value: `${type} - type`,
    }
  }

  getBankName(bankName: string) {
    return {
      name: bankName,
      value: `${bankName} - bankName`,
    };
  }

  getMenuOptionsLicenses() {
    const menuOptions = this.activatedRoute.snapshot.data['menuOptionsLicenses'];
    if (!menuOptions || menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError)?.message ?? 'error');
      return;
    }

    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);

  }

  /* ========================= GET INITIAL DATA FROM RESOLVER ========================== */

  /* ========================= HANDLERS TABLE ACTION ========================== */

  getTableActionAssociatedAccounts(selectedAccountTemp: any) {
    const selectedAccount = selectedAccountTemp as ILoadItem<IAchAccount>;

    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    switch (selectedAccount.action) {
      case TableOption.TRANSFER:
        this.goToTransferFlow(selectedAccount);
        break;
      case TableOption.DELETE:
        this.openModalDeleteAssociatedAccount(selectedAccount);
        break;
      case TableOption.UPDATE:
        this.goToUpdateFlow(selectedAccount);
        break;
    }
  }

  getTableActionFavoriteAccounts(selectedAccountTemp: any) {
    const selectedAccount = selectedAccountTemp as ILoadItem<IAchAccount>;

    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    switch (selectedAccount.action) {
      case TableOption.TRANSFER:
        this.goToTransferFlow(selectedAccount);
        break;
      case TableOption.DELETE_FAVORITE:
        this.openModalDeleteFavoriteAccount(selectedAccount?.item);
        break;
    }
  }

  getClientCode(): string {
    return this.persistStepStateService.getParameter('userInfo')?.customerCode;
  }

  refreshTable() {
    this.util.showLoader();

    this.achTransaction
      .associatedAccounts(this.getClientCode())
      .pipe(finalize(() => this.util.hideLoader()))
      .subscribe({
        next: (associatedAccounts) => {
          this.getAssociatedAccounts(associatedAccounts);
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error_getting_associated_third_accounts_favorite');
        },
      });
  }

  /* ========================= HANDLERS TABLE ACTION ========================== */

  /* ========================= TRANSACTION OPERATION ========================== */

  goToTransferFlow(selectedAccount: ILoadItem<IAchAccount>) {
    this.util.showLoader();

    const transferState: IAchFormStorageLayout = this.persistStepStateService.getParameter('navigateStateParameters');

    const propertiesToTransferFormStep: IAchFormStorageLayout = {
      accountSelected: selectedAccount.item,
      formValues: transferState?.formValues ? transferState.formValues : undefined,
    };

    this.persistStepStateService.sendParameters({
      navigateStateParameters: propertiesToTransferFormStep,
    });

    this.saveNavigationProtectedParameter();

    this.router.navigate([EACHTransferUrlNavigationCollection.HOME_TRANSACTION]).finally(() => {
      this.util.hideLoader();
    });
  }


  /* ========================= TRANSACTION OPERATION ========================== */

  /* ========================= CREATE OPERATION ========================== */

  goToAddAccountFlow() {
    if (!this.validationTriggerTime.isAvailableSchedule) {
      this.validationTriggerTime.openModal();
      return;
    }

    this.util.showLoader();
    this.router.navigate([EACHCrudUrlNavigationCollection.CREATE_HOME]).finally(() => {
      this.util.hideLoader();
    });
  }

  /* ========================= CREATE OPERATION ========================== */

  /* ========================= UPDATE OPERATION ========================== */

  goToUpdateFlow(selectedAccount: ILoadItem<IAchAccount>) {
    this.util.showLoader();

    const propertiesToUpdateFormStep: IAchUpdateStorageLayout = {
      typeTransfer: EAchTypeTransfer.CRUD,
      typeClient: selectedAccount.item?.clientType as ECrudAchTypeClient,
      accountSelected: selectedAccount.item,
      action: selectedAccount.action as string,
      transactionResponse: null,
    };

    this.persistStepStateService.sendParameters({
      achUpdateForm: propertiesToUpdateFormStep,
      navigationProtectedParameter: EACHNavigationParameters.CRUD_UPDATE_FORM,
    });

    this.router.navigate([EACHCrudUrlNavigationCollection.UPDATE_HOME]).finally(() => {
      this.util.hideLoader();
    });
  }

  /* ========================= UPDATE OPERATION ========================== */

  /* ========================= DELETE OPERATION ========================== */

  executeDeleteFavoriteAccount(numberAccount: string) {
    this.util.showLoader();

    this.achTransaction
      .deleteFavorite(numberAccount)
      .pipe(
        finalize(() => {
          this.util.hideLoader();
          this.refreshTable();
        })
      )
      .subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'failed_delete_account');
        },
      });
  }

  executeDeleteAssociatedAccount(selectedAccount: ILoadItem<IAchAccount>) {
    this.util.showLoader();
    const bankId = selectedAccount.item.bank;
    const accountToDelete = selectedAccount.item.account;

    this.achTransaction.deleteAccountAch(bankId, accountToDelete).subscribe({
      next: (accountDeletedResponse) => {
        this.goToDeleteFlow(selectedAccount, accountDeletedResponse);
      },
      error: (error: HttpErrorResponse) => {
        this.showAlert('error', error?.error?.message ?? 'error:delete_ach_account');
      },
    });
  }

  goToDeleteFlow(selectedAccount: ILoadItem<IAchAccount>, transactionResponse: IAchCrudTransactionResponse) {
    const propertiesToDeleteStep: IAchDeleteStorageLayout = {
      typeTransfer: EAchTypeTransfer.TRANSACTION,
      accountSelected: selectedAccount.item,
      action: selectedAccount.action as string,
      transactionResponse,
    };

    this.persistStepStateService.sendParameters({
      achDeleteState: propertiesToDeleteStep,
      navigationProtectedParameter: EACHNavigationParameters.CRUD_DELETE,
    });

    this.router.navigate([EACHCrudUrlNavigationCollection.DELETE]).finally(() => {
      this.util.hideLoader();
    });
  }

  openModalDeleteFavoriteAccount(accountToDelete: IAchAccount) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${this.profile || 'byte-theme'} alert-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.tableManagerDefinition.buildDeleteFavoriteAlert();

    modal.result
      .then((isResult: boolean) => {
        if (!isResult) {
          return;
        }

        this.executeDeleteFavoriteAccount(accountToDelete?.account);
      })
      .catch((error) => error);
  }

  openModalDeleteAssociatedAccount(selectedAccount: ILoadItem<IAchAccount>) {
    const modal = this.modalService.open(AdfAlertModalComponent, {
      centered: true,
      windowClass: `${this.profile || 'byte-theme'} alert-modal`,
      size: 'lg',
    });

    modal.dismissed.subscribe(() => {
      return;
    });

    modal.componentInstance.data = this.tableManagerDefinition.buildDeleteAssociatedAlert();

    modal.result.then((isResult: boolean) => {
      if (!isResult) {
        return;
      }

      this.executeDeleteAssociatedAccount(selectedAccount);
    });
  }

  /* ========================= DELETE OPERATION ========================== */

  /* ========================= UTILITIES ========================== */

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.TRANSFER_FORM,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  showAlertTable(type: string, message: string) {
    this.typeAlertTable = type;
    this.messageAlertTable = message;
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: null,
      achCrudState: null,
      achUpdateForm: null,
      achDeleteState: null,
    });
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  /* ========================= UTILITIES ========================== */
}
