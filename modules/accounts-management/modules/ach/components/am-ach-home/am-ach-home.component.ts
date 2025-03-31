import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { V3IAchAccount } from '../../../../../transfer/modules/transfer-ach/interfaces/ach-account-interface';
import { TableOption } from '../../../../../transfer/interface/table.enum';
import { ILoadItem, ITableStructure } from '@adf/components';
import { MadAchTableService } from '../../services/definition/mad-ach-table.service';
import { AmAchUtilsService } from '../../services/utils/am-ach-utils.service';
import { AcAchTransactionService } from '../../services/transaction/ac-ach-transaction.service';
import { finalize } from 'rxjs/operators';
import { AMAchUrlCollection } from '../../enum/url-collection.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { AmACHRouteProtected } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-ach-home',
  templateUrl: './am-ach-home.component.html',
  styleUrls: ['./am-ach-home.component.scss']
})
export class AmAchHomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  favoriteAccountTableLayout!: ITableStructure<V3IAchAccount>;
  associatedAccountTableLayout!: ITableStructure<V3IAchAccount>;

  associatedAccounts: V3IAchAccount[] = [];
  favoriteAccounts: V3IAchAccount[] = [];
  menuOptionsLicenses: string[] = [];

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowCreateButton() {
    return this.menuOptionsLicenses.includes(TableOption.CREATE);
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
    private tableManager: MadAchTableService,
    private achUtils: AmAchUtilsService,
    private transactionService: AcAchTransactionService,
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

  getTargetAccountList(accountListLoaded?: Array<V3IAchAccount>, fromRoute: boolean = true) {
    const associatedAccountListResponse = !fromRoute ? accountListLoaded : this.activatedRouter.snapshot.data['associatedAccounts'];
    if (associatedAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (associatedAccountListResponse as IFlowError).message);
      return;
    }

    this.favoriteAccounts = [];
    this.associatedAccounts = [];

    associatedAccountListResponse.forEach((account: V3IAchAccount) => {
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
      [PROTECTED_PARAMETER_STATE]: undefined,
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.CREATE,
    });
    this.router.navigate([AMAchUrlCollection.CREATE]).finally(() => {});
  }

  getTableActionFavoriteAccounts(favoriteAccountTemp: any) {
    const favoriteAccountItem = favoriteAccountTemp as ILoadItem<V3IAchAccount>;

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
    const accountSelected = accountTemp as ILoadItem<V3IAchAccount>;

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

  handleRemoveAccountFromFavorite(account: ILoadItem<V3IAchAccount>) {

    const { item } = account;

    this.utils.showPulseLoader();
    this.favoriteAccountTableLayout = this.achUtils.setLoadingAnimationToRemoveFromFavorite({
      account,
      layout: this.favoriteAccountTableLayout,
    });

    this.transactionService.deleteFavorite(item.account)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
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
          this.showAlert('error', 'error_delete_favorite_account')
          setTimeout(() => {
            this.hideAlert();
          }, 5000)
        }
      });

  }

  handleAddAccountToFavorite(account: ILoadItem<V3IAchAccount>) {
    const {item} = account;

    this.utils.showPulseLoader();
    this.associatedAccountTableLayout = this.achUtils.setLoadingAnimationToAccountToAddFavorite({
      account,
      layout: this.associatedAccountTableLayout,
    });

    this.transactionService.addFavorite(item)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
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
          this.showAlert('error', 'error_add_favorite_account')

          setTimeout(() => {
            this.hideAlert();
          }, 5000)

        },
      });
  }

  handleViewAccountDetail(account: ILoadItem<V3IAchAccount>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.DETAIL,
    });

    this.router.navigate([AMAchUrlCollection.DETAIL]).finally(() => this.utils.hideLoader());
  }

  handleUpdateAccount(account: ILoadItem<V3IAchAccount>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.UPDATE,
    });

    this.router.navigate([AMAchUrlCollection.UPDATE]).finally(() => this.utils.hideLoader());
  }

  handleDeleteAccount(account: ILoadItem<V3IAchAccount>) {
    this.utils.showLoader();

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: account.item,
      },
      [PROTECTED_PARAMETER_ROUTE]: AmACHRouteProtected.REMOVE,
    });

    this.router.navigate([AMAchUrlCollection.DELETE]).finally(() => this.utils.hideLoader());
  }

  refreshTableData(): void {
    this.transactionService
      .associatedAccounts()
      .subscribe({
        next: (accountList) => {
          const achAccountList = accountList;
          achAccountList.forEach(account => {
            if(account.status === 'A'){
              account.status = 'ACTIVA';
            }
            if(account.status === 'I'){
              account.status = 'INACTIVA';
            }
          });
          this.getTargetAccountList(achAccountList, false);
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
