import {
  AdfFormatService,
  AdfFormBuilderService,
  ILayout,
  ILoadItem,
  ITableStructure
} from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { FlowErrorBuilder, IFlowError } from 'src/app/models/error.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IThirdTransfersAccounts } from '../../../../../transfer/interface/transfer-data-interface';
import { EPaymentLoansFlowView } from '../../enum/navigate-protection-parameter.enum';
import {
  AttributeOwnLoansTable,
} from '../../enum/own-third-party-loans-control-name.enum';
import { TableThirdPartyLoansOption } from '../../enum/table-third-party-loans.enum';
import {
  IOwnLoansPagination,
  IThirdPartyLoanAssociate
} from '../../interfaces/crud/crud-third-party-loans-interface';
import { TpldTableManagerService } from '../../services/definition/table/tpld-table-manager.service';
import { TpleThirdPartyLoansService } from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';
import { OwnLoansService } from '../../services/transaction/own-loans.service';
import { ThirdPartyLoansService } from '../../services/transaction/third-party-loans.service';
import { GoToBalanceService } from '../../utils/go-to-balance.service';

@Component({
  selector: 'byte-payment-home-all-loans',
  templateUrl: './payment-own-third-party-loans.component.html',
  styleUrls: ['./payment-own-third-party-loans.component.scss'],
})
export class PaymentOwnThirdPartyLoansComponent implements OnInit {
  //Form
  filterLayout!: ILayout;
  filterForm!: FormGroup;

  //Table
  thirdLoansAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  ownLoansAccountsLayout!: ITableStructure<IThirdTransfersAccounts>;
  selectedAccount!: ILoadItem<IThirdPartyLoanAssociate>;

  //DataTable search
  thirdAccounts: any = [];
  ownAccounts: any = [];
  clonOwnAccounts: any = [];
  showOwnsLoansTable: boolean = false;
  showThirdLoansTable: boolean = false;
  thirdAccountsIsEmpty: boolean = false;
  emptyAlert: boolean = false;

  //Alert
  typeAlertOwnsLoansAccount!: string;
  messageAlertOwnsLoansAccount!: string;
  typeAlert: string | null = null;
  messageAlert: string | null = null;
  isScrollable = true;
  isScrollableTableOwns: boolean = true;
  isLoading: boolean = false;
  thirdLoansEmpty: boolean = false;

  menuOptionsLicenses: string[] = [];


  constructor(
    private tableManagerService: TpldTableManagerService,
    private tplFormBuilder: AdfFormBuilderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private thirdPartyLoansService: ThirdPartyLoansService,
    private parameterManagementService: ParameterManagementService,
    private util: UtilService,
    private formatService: AdfFormatService,
    private goToBalanceService: GoToBalanceService,
    private paymentThirdPartyLoans: OwnLoansService,
    private tplExecutionService: TpleThirdPartyLoansService,
  ) { }

  ngOnInit(): void {
    this.getPermissionsMenuTPL();
  }

  initDefinition(options: string[]) {
    this.thirdLoansAccountsLayout = this.tableManagerService.buildThirdLoanTable(options);
    this.ownLoansAccountsLayout = this.tableManagerService.buildOwnThirdLoanTable();
    this.filterLayoutDefinition();
    this.getThirdLoansData();
    this.getOwnLoansAccounts();
    this.util.hideLoader();
  }

  getPermissionsMenuTPL() {

    const menuOptions = this.route.snapshot.data?.['menuOptionsTPL']
    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);


    if (menuOptions.hasOwnProperty('error')) {
      this.showAlert('error', (menuOptions as IFlowError).message);
      this.initDefinition(this.menuOptionsLicenses);
      return;
    }

    this.initDefinition(this.menuOptionsLicenses);

  };

  filterLayoutDefinition() {
    this.filterLayout = this.tableManagerService.buildFilterForm({
      title: 'payments_loans',
      subtitle: 'my_loans',
    });

    this.filterForm = this.tplFormBuilder.formDefinition(this.filterLayout.attributes);
    this.getDataFilter();
  }

  //**GET THIRD LOANS PARTY DATA */
  getThirdLoansData() {
    const thirdPartyLoansResponse = this.route.snapshot.data?.['associatedThirdAccounts'];
    const dataThirdPartyLoans: Array<IThirdPartyLoanAssociate> = this.route.snapshot.data?.['associatedThirdAccounts'];

    if (dataThirdPartyLoans.hasOwnProperty('error')) {
      this.thirdAccountsIsEmpty = true;
      this.emptyAlert = true;
      this.showAlertOwnsLoansAccount('error', thirdPartyLoansResponse?.message);
      console.log(thirdPartyLoansResponse?.message);
      return;
    }


    this.thirdAccounts = this.tplExecutionService.parseThirdPartyLoans(dataThirdPartyLoans);
    this.showThirdLoansTable = this.thirdAccounts.length > 0;
    this.thirdLoansAccountsLayout.items = this.thirdAccounts;
    this.isScrollable = (this.thirdAccounts ?? []).length >= 50;
  }

  getOwnLoansAccounts() {
    const ownLoansAccounts = this.route.snapshot.data?.['associatedOwnLoansAccounts'];
    const dataOwnLoansAccounts: IOwnLoansPagination[] = this.route.snapshot.data?.['associatedOwnLoansAccounts'];

    if (dataOwnLoansAccounts.hasOwnProperty('error')) {
      this.showAlertOwnsLoansAccount('error', ownLoansAccounts?.message);
      return;
    }

    this.ownAccounts = this.parseLoansOwns(dataOwnLoansAccounts);
    this.isScrollableTableOwns  = this.ownAccounts.length >= 50;
    this.clonOwnAccounts = [...this.ownAccounts];
    this.ownLoansAccountsLayout.items = this.ownAccounts;
    this.showOwnsLoansTable = this.ownAccounts.length > 0;
  }


  getActionTableThirdLoans(selectLoan: any) {
    switch (selectLoan.action) {
      case TableThirdPartyLoansOption.DELETE:
        this.handleDeleteThirdPartyLoan(selectLoan);
        break;
      case TableThirdPartyLoansOption.PAYMENT:
        this.tplExecutionService.gotToPayment(selectLoan.item, EPaymentLoansFlowView.ALL_LOANS);
        break;
      case TableThirdPartyLoansOption.UPDATE:
        this.tplExecutionService.handleUpdateThirdPartyLoan(selectLoan.item, EPaymentLoansFlowView.ALL_LOANS);
        break;
    }
  }

  handleDeleteThirdPartyLoan(selectLoan:  ILoadItem<IThirdPartyLoanAssociate>) {
    this.tplExecutionService.openDeleteModal(selectLoan, EPaymentLoansFlowView.ALL_LOANS);
    this.tplExecutionService.messageAlert.subscribe(message => {
      this.showAlert('error', message);
    });
  }

  getActionTableOwnsLoans(selectAccount: any) {
    switch (selectAccount.action) {
      case TableThirdPartyLoansOption.PAYMENT:
        this.router.navigate(['/loan-payment']).then(() => {});
        break;
      case TableThirdPartyLoansOption.ACCOUNT_STATEMENT:
        this.router.navigate(['/account-statement']).then(() => {});
        break;
      case TableThirdPartyLoansOption.CONSULT:
        this.goToBalanceService.goToBalance(selectAccount.item.identifier!);
        break;
    }
  }

  /**
   * @return Method in charge of obtaining
   * alert message and type of alert, from
   * the table of associated accounts (Favorite)
   */
  showAlertOwnsLoansAccount(type: string, message: string): void {
    this.typeAlertOwnsLoansAccount = type;
    this.messageAlertOwnsLoansAccount = message;
  }

  /**
   * @return Method to get number loans or name
   * from filter search advance and call
   * method Search.
   */
  getDataFilter(): void {
    this.filterForm?.get(AttributeOwnLoansTable.FILTER)?.valueChanges.pipe(distinctUntilChanged(), debounceTime(1000))
      .subscribe((data) => {
        this.filterPagination(data);
      });
  }

  filterPagination(query: string) {
    this.util.showPulseLoader();

    const thirdLoans = this.handleSearchByPaginationThird(query);
    const ownsLoans = this.handleSearchByPaginationOwns(query);

    forkJoin([ownsLoans, thirdLoans])
      .pipe(finalize(() => this.util.hidePulseLoader()))
      .subscribe((data) => {
        this.clearOwnsLoans(data[0] as IOwnLoansPagination[] ?? []);
        this.clearThirdLoans(data[1] as IThirdPartyLoanAssociate[] ?? []);
        this.dontFound(data[0] as IOwnLoansPagination[] ?? [], data[1] as IThirdPartyLoanAssociate[] ?? []);
      });
  }

  clearThirdLoans(data: IThirdPartyLoanAssociate[]) {
    if (data.length <= 0) {
      this.showThirdLoansTable = false;
      console.log(data);
      this.thirdLoansEmpty = true;
      return;
    }

    const thirdLoans = this.parseLoans(data);
    this.showThirdLoansTable = true;
    this.thirdAccounts = thirdLoans;
    this.thirdLoansAccountsLayout.items = this.thirdAccounts;
    this.isScrollable = data.length >= 50;

  }

  clearOwnsLoans(data: IOwnLoansPagination[]) {
    if (data.length <= 0) {
      this.showOwnsLoansTable = false;
      this.thirdLoansEmpty = true;
      return;
    }


    this.showOwnsLoansTable = true;
    this.ownAccounts = this.parseLoansOwns([...data]);
    this.ownLoansAccountsLayout.items = this.ownAccounts;
    this.isScrollableTableOwns = data.length >= 50;
  }

  handleSearchByPaginationThird(query: string) {
    const identifier = '';
    const currency = '';
    const action = '+';
    const valueToSearch = query.toUpperCase();

    return this.thirdPartyLoansService.getThirdPartyLoansAccount({
      loanToLocate: identifier,
      currency: currency,
      action: action,
      advancedFilter: `${valueToSearch}`,
    }).pipe(
      catchError((error) =>
        of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error getting third loans')
            .status(error?.status)
            .build()
        )
      )
    );
  }

  handleSearchByPaginationOwns(query: string) {
    const identifier = '';
    const currency = '';
    const action = '+';
    const valueToSearch = query.toUpperCase();

    return this.paymentThirdPartyLoans.getOwnsLoans({
      loanToLocate: identifier,
      currency: currency,
      action: action,
      advancedFilter: `${valueToSearch}`,
    }).pipe(
      catchError((error) =>
        of(
          new FlowErrorBuilder()
            .error(error?.error)
            .message(error?.error?.message ?? 'error getting owns loans')
            .status(error?.status)
            .build()
        )
      )
    );
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }

  dontFound(thirdLoans: IOwnLoansPagination[], ownsLoans: IThirdPartyLoanAssociate[]) {
    if (thirdLoans.length <= 0 && ownsLoans.length <= 0) {
      this.emptyAlert = true;
      this.showAlertOwnsLoansAccount('warning', 'no_matches_found');
    } else if (thirdLoans.length > 0 && ownsLoans.length > 0) {
      this.emptyAlert = false;
    }

    console.log(this.emptyAlert);
  }

  getAccounts() {
    if (!this.isScrollable) {
      return;
    }

    this.getLoans();
  }

  getOwnsLoans() {
    if (!this.isScrollableTableOwns) {
      return;
    }

    this.getOwnLoanList();
  }

  getOwnLoanList() {
    this.util.showPulseLoader();
    const lastLoanTransaction = this.thirdAccounts[this.thirdAccounts.length - 1];

    const identifier = lastLoanTransaction?.identifier;
    const currency = lastLoanTransaction?.currencyCode;
    const action = '+';
    const advancedFilter = this.filterForm.getRawValue().filter;

    this.paymentThirdPartyLoans
      .getOwnsLoans({
        loanToLocate: identifier,
        currency: currency,
        action: action,
        advancedFilter: advancedFilter,
      })
      .pipe(finalize(() => this.util.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          this.isScrollableTableOwns = (response ?? []).length > 50;
          this.ownAccounts = [...this.ownAccounts, ...this.parseLoansOwns(response)];
          this.ownLoansAccountsLayout.items = this.ownAccounts;
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'fatal-error:get_third_party_loans');
          this.removeAlert();
          this.scrollToTop();
        }
      });
  }

  getLoans() {
    this.util.showPulseLoader();
    const lastLoanTransaction = this.thirdAccounts[this.thirdAccounts.length - 1];

    const identifier = lastLoanTransaction?.identifier;
    const currency = lastLoanTransaction?.currencyCode;
    const action = '+';
    const advancedFilter = this.filterForm.getRawValue().filter;

    this.thirdPartyLoansService
      .getThirdPartyLoansAccount({
        loanToLocate: identifier,
        currency: currency,
        action: action,
        advancedFilter: advancedFilter,
      })
      .pipe(finalize(() => this.util.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          this.isScrollable = (response ?? []).length > 50;
          this.thirdAccounts = [...this.thirdAccounts, ...this.parseLoans(response)];
          this.thirdLoansAccountsLayout.items = this.thirdAccounts;
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'fatal-error:get_third_party_loans');
          this.removeAlert();
          this.scrollToTop();
        }
      });
  }

  parseLoans(loanList: IThirdPartyLoanAssociate[]) {
    return loanList.map((loan) => ({
      ...loan,
      currencyCode: this.util.getCurrencySymbolToIso(loan?.currencyCode ?? 'UNDEFINED'),
    }));
  }

  parseLoansOwns(ownsLoans: IOwnLoansPagination[]) {
    return ownsLoans.map((loan) => ({
      name: loan.clientName,
      identifier: loan.loanNumber,
      currency: this.util.getCurrencySymbolToIso(loan?.currencyCode ?? 'UNDEFINED'),
      totalAmount: this.formatService.formatAmount(loan.amountGranted!.trim() ?? ''),
    }));
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  removeAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
