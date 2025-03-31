import { Component, OnInit } from '@angular/core';
import { ILoadItem, ITableStructure } from '@adf/components';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { finalize } from 'rxjs/operators';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { AM365Account, AM365AccountList } from '../../interfaces/associated-account.interface';
import { AM365UrlCollection } from '../../enum/url-collection.enum';
import { AmM365TransactionService } from '../../services/transaction/am-m365-transaction.service';
import { AmdM365TableService } from '../../services/definition/amd-m365-table.service';
import { AmM365UtilsService } from '../../services/utils/am-m365-utils.service';
import { M365RouteProtectedParameters } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-m365-home',
  templateUrl: './am-m365-home.component.html',
  styleUrls: ['./am-m365-home.component.scss']
})
export class AmM365HomeComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  favoriteAccountTableLayout!: ITableStructure<AM365Account>;
  associatedAccountTableLayout!: ITableStructure<AM365Account>;

  associatedAccounts: AM365AccountList = [];
  favoriteAccounts: AM365AccountList = [];
  menuOptionsLicenses: string[] = [];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowCreateButton() {
    return true;
    // return this.menuOptionsLicenses.includes(TableOption.CREATE);
  }

  get isShowFavoriteTableAccount() {
    return this.favoriteAccounts.length > 0;
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
    private tableManager: AmdM365TableService,
    private utils365: AmM365UtilsService,
    private transactionService: AmM365TransactionService,
    private parameterManagement: ParameterManagementService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getTargetAccountList();
    this.getMenuOptionsLicenses();
  }

  getTargetAccountList(accountListLoaded?: AM365AccountList, fromRoute: boolean = true) {
    const associatedAccountListResponse = !fromRoute ? accountListLoaded : this.activatedRouter.snapshot.data['associatedAccounts'];

    if (associatedAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (associatedAccountListResponse as IFlowError).message);
      return;
    }

    this.favoriteAccounts = [];
    this.associatedAccounts = [];
    associatedAccountListResponse.forEach((account: AM365Account) => {
      if (account.favorite) {
        this.favoriteAccounts.push(account);
      } else {
        this.associatedAccounts.push(account);
      }
    });
  }

  getMenuOptionsLicenses() {
    const menuOptions = this.activatedRouter.snapshot.data['menuOptionsLicenses'];

    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      return;
    }

    this.menuOptionsLicenses = this.utils.getLicensesTransactions(menuOptions);
  }

  initDefinition() {
    this.favoriteAccountTableLayout = this.tableManager.builderFavoriteAccountTableLayout(this.favoriteAccounts, this.menuOptionsLicenses);
    this.associatedAccountTableLayout = this.tableManager.builderAssociateAccountTableLayout(this.associatedAccounts, this.menuOptionsLicenses);
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  navigateToCreateAccount() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.CREATE,
    });
    this.router.navigate([AM365UrlCollection.CREATE]).finally(() => {});
  }

  getTableActionFavoriteAccounts(favoriteAccountTemp: any) {
    const favoriteAccountItem = favoriteAccountTemp as ILoadItem<AM365Account>;

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
    const accountSelected = accountTemp as ILoadItem<AM365Account>;

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

  handleRemoveAccountFromFavorite(account: ILoadItem<AM365Account>) {
    const { item } = account;

    this.utils.showPulseLoader();
    this.favoriteAccountTableLayout = this.utils365.setLoadingAnimationToRemoveFromFavorite({
      account,
      layout: this.favoriteAccountTableLayout,
    });

    this.transactionService.deleteFavorite({
      account: item.account,
      })
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.favoriteAccountTableLayout = this.utils365.removeLoadingAnimationFromAccountFavorite({
            account,
            layout: this.favoriteAccountTableLayout,
          });

          this.utils.scrollToTop();
          this.showAlert('error', 'error_delete_favorite_account');
          this.utils.hidePulseLoader();
          setTimeout(() => {
            this.hideAlert();
          }, 5000)
        }
      });
  }

  handleAddAccountToFavorite(account: ILoadItem<AM365Account>) {
    const { item } = account;

    this.utils.showPulseLoader();
    this.associatedAccountTableLayout = this.utils365.setLoadingAnimationToAccountToAddFavorite({
      account,
      layout: this.associatedAccountTableLayout,
    });

    this.transactionService.addFavorite(  {
        account: item.account,
        name: String(item.bank).padStart(4, '0'),
        properties: {
          bank: item.bank,
        }
      })
      .subscribe({
        next: () => {
          this.refreshTableData();
        },
        error: () => {
          this.associatedAccountTableLayout = this.utils365.removeLoadingAnimationFromAccount({
            account,
            layout: this.associatedAccountTableLayout
          });

          this.utils.scrollToTop();
          this.utils.hidePulseLoader();
          this.showAlert('error', 'error_add_favorite_account');

          setTimeout(() => {
            this.hideAlert();
          }, 5000)

        },
      });
  }

  handleViewAccountDetail(account: ILoadItem<AM365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.DETAIL,
    });

    this.router.navigate([AM365UrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
  }

  handleUpdateAccount(account: ILoadItem<AM365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.UPDATE,
    });

    this.router.navigate([AM365UrlCollection.UPDATE]).finally(() => this.utils.hideLoader());
  }

  handleDeleteAccount(account: ILoadItem<AM365Account>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: M365RouteProtectedParameters.DELETE,
    });

    this.router.navigate([AM365UrlCollection.DELETE]).finally(() => this.utils.hideLoader());
  }

  refreshTableData(): void {
    this.transactionService
      .getAssociatedAccount()
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
