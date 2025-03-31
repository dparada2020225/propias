import { Component, OnInit } from '@angular/core';
import { ILoadItem, ITableStructure } from '@adf/components';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { AmdS365TableService } from '../../services/definition/amd-s365-table.service';
import { TAMS365AccountList } from '../../interfaces/s365-account.interface';
import { AMS365UrlCollection } from '../../enum/url-collection.enum';
import { IAMS365Account } from '../../../../interfaces/am-account-list.interface';
import { finalize } from 'rxjs/operators';
import { AmS365SipaUtilsService } from '../../services/utils/am-s365-sipa-utils.service';
import { AmS365TransactionService } from '../../services/transaction/am-s365-transaction.service';
import { EAMS365RouteProtected } from '../../enum/route-protected.enum';
import { ET365TermCondition, IT365TermAndConditionResponse } from '../../../../interfaces/terms-condition.interface';

@Component({
  selector: 'byte-am-s365-home',
  templateUrl: './am-s365-home.component.html',
  styleUrls: ['./am-s365-home.component.scss']
})
export class AmS365HomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  associatedAccountTableLayout!: ITableStructure<IAMS365Account>;
  favoriteAccountTableLayout!: ITableStructure<IAMS365Account>;

  associatedAccounts: TAMS365AccountList = [];
  favoriteAccounts: TAMS365AccountList = [];
  menuOptionsLicenses: string[] = [];

  isShowFavoriteWidget = false;
  isTermsAccepted = false;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowCreateButton() {
    return true;
    // NOTE: return this.menuOptionsLicenses.includes(TableOption.CREATE);
  }

  get isShowAssociatedTableAccounts() {
    return this.associatedAccounts.length > 0;
  }

  get userVirtualScrollInTableAssociated() {
    return this.associatedAccountTableLayout.items.length > 8;
  }

  get userVirtualScrollInTableFavorites() {
    return this.favoriteAccountTableLayout.items.length > 8;
  }


  constructor(
    private router: Router,
    private utils: UtilService,
    private activatedRouter: ActivatedRoute,
    private tableManager: AmdS365TableService,
    private parameterManagement: ParameterManagementService,
    private achUtils: AmS365SipaUtilsService,
    private transactionService: AmS365TransactionService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getTargetAccountList();
    this.getMenuOptionsLicenses();
    this.getTermAndConditions();
  }

  getTargetAccountList(accountListLoaded?: TAMS365AccountList, fromRoute: boolean = true) {
    const associatedAccountListResponse = !fromRoute ? accountListLoaded : this.activatedRouter.snapshot.data['associatedAccountList'];

    if (associatedAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (associatedAccountListResponse as IFlowError).message);
      return;
    }

    this.favoriteAccounts = [];
    this.associatedAccounts = [];
    const accountReceived = associatedAccountListResponse as TAMS365AccountList;

    if (this.isShowFavoriteWidget) {
      accountReceived.forEach((account) => {
        if (account.favorite) {
          this.favoriteAccounts.push(account);
        } else {
          this.associatedAccounts.push(account);
        }
      });
      return;
    }

    this.associatedAccounts = accountReceived;
  }

  getMenuOptionsLicenses() {
    const menuOptions = this.activatedRouter.snapshot.data['menuOptionsLicenses'];

    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      return;
    }

    this.menuOptionsLicenses = this.utils.getLicensesTransactions(menuOptions);
  }

  getTermAndConditions() {
    const termsResponse = this.activatedRouter.snapshot.data['termsAndCondition'];

    if (termsResponse.hasOwnProperty('error')) {
      this.showAlert('error', (termsResponse as IFlowError).message);
      return;
    }

    const terms = termsResponse as IT365TermAndConditionResponse;
    this.isTermsAccepted = terms.result === ET365TermCondition.YES;
  }

  initDefinition() {
    this.associatedAccountTableLayout = this.tableManager
      .builderAssociateAccountTableLayout(this.associatedAccounts, this.menuOptionsLicenses, this.isShowFavoriteWidget);

    this.favoriteAccountTableLayout = this.tableManager
      .builderFavoriteAccountTableLayout(this.favoriteAccounts, this.menuOptionsLicenses, this.isShowFavoriteWidget);
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
      [PROTECTED_PARAMETER_STATE]: null,
    });

    this.router.navigate(['home']).finally(() => {});
  }

  navigateToCreateAccount() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.ADD,
    });

    this.router.navigate([AMS365UrlCollection.CREATE]).finally(() => {});
  }

  getTableActionFavoriteAccounts(favoriteAccountTemp: any) {
    const favoriteAccountItem = favoriteAccountTemp as ILoadItem<IAMS365Account>;

    const actionMapped = {
      [TableOption.DELETE_FAVORITE]: () => this.handleRemoveAccountFromFavorite(favoriteAccountItem),
      [TableOption.READ]: () => this.handleViewAccountDetail(favoriteAccountItem),
      [TableOption.UPDATE]: () => this.handleUpdateAccount(favoriteAccountItem),
      [TableOption.DELETE]: () => this.handleDeleteAccount(favoriteAccountItem),
    }

    const action = actionMapped[favoriteAccountItem.action as string];
    if (!action) return;

    action();
  }

  getTableActionAssociatedAccounts(accountTemp: any) {
    const accountSelected = accountTemp as ILoadItem<IAMS365Account>;

    const actionMapped = {
      [TableOption.ADD_FAVORITE]: () => this.handleAddAccountToFavorite(accountSelected),
      [TableOption.READ]: () => this.handleViewAccountDetail(accountSelected),
      [TableOption.UPDATE]: () => this.handleUpdateAccount(accountSelected),
      [TableOption.DELETE]: () => this.handleDeleteAccount(accountSelected),
    }

    const action = actionMapped[accountSelected.action as string];
    if (!action) return;

    action();
  }

  handleRemoveAccountFromFavorite(account: ILoadItem<IAMS365Account>) {
    const { item } = account;

    this.utils.showPulseLoader();
    this.favoriteAccountTableLayout = this.achUtils.setLoadingAnimationToRemoveFromFavorite({
      account,
      layout: this.favoriteAccountTableLayout,
    });

    this.transactionService.deleteFavorite({
      account: item.account,
      properties: {
        bank: item.bank,
        country: item.country,
      },
      })
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.favoriteAccountTableLayout = this.achUtils.removeLoadingAnimationFromAccountFavorite({
            account,
            layout: this.favoriteAccountTableLayout,
          });

          this.utils.scrollToTop();
          this.utils.hidePulseLoader();
          this.showAlert('error', 'error_delete_favorite_account')
          setTimeout(() => {
            this.hideAlert();
          }, 5000)
        }
      });

  }

  handleAddAccountToFavorite(account: ILoadItem<IAMS365Account>) {
    const {item} = account;

    this.utils.showPulseLoader();
    this.associatedAccountTableLayout = this.achUtils.setLoadingAnimationToAccountToAddFavorite({
      account,
      layout: this.associatedAccountTableLayout,
    });

    this.transactionService.addFavorite({
        account: item.account,
        properties: {
          bank: item.bank,
          country: item.country,
        },
      })
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.associatedAccountTableLayout = this.achUtils.removeLoadingAnimationFromAccount({
            account,
            layout: this.associatedAccountTableLayout
          });

          this.utils.scrollToTop();
          this.utils.hidePulseLoader();
          this.showAlert('error', 'error_add_favorite_account')

          setTimeout(() => {
            this.hideAlert();
          }, 5000)

        },
      });
  }

  handleViewAccountDetail(account: ILoadItem<IAMS365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      }
    });

    this.router.navigate([AMS365UrlCollection.VIEW_DETAIL]).finally(() => this.utils.hideLoader());
  }

  handleUpdateAccount(account: ILoadItem<IAMS365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.UPDATE,
    });

    this.router.navigate([AMS365UrlCollection.UPDATE]).finally(() => this.utils.hideLoader());
  }

  handleDeleteAccount(account: ILoadItem<IAMS365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.REMOVE,
    });

    this.router.navigate([AMS365UrlCollection.DELETE]).finally(() => this.utils.hideLoader());
  }

  refreshTableData(): void {
    this.transactionService
      .getAccounts()
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (accountList) => {
          this.getTargetAccountList(accountList, false);
          this.initDefinition();
        },
        error: (error) => {
          this.showAlert('error', error.error.message ?? 'error_getting_associated_third_accounts_favorite');
        }
      });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hideAlert() {
    this.typeAlert = '';
    this.messageAlert = '';
  }

}
