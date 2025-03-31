import { AdfFormBuilderService, ILayout, ILoadItem, ITableStructure } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, finalize } from 'rxjs/operators';
import { IFlowError } from 'src/app/models/error.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import {
  ENavigateProtectionParameter,
  EPaymentLoansFlowView,
  ETPLPaymentCRUDUrlNavigationCollection
} from '../../enum/navigate-protection-parameter.enum';
import { AttributeOwnLoansTable } from '../../enum/own-third-party-loans-control-name.enum';
import { TableThirdPartyLoansOption } from '../../enum/table-third-party-loans.enum';
import {
  IThirdPartyLoanAssociate,
} from '../../interfaces/crud/crud-third-party-loans-interface';
import { ILoanAccount } from '../../interfaces/payment-third-party-loans-interface';
import { TpldTableManagerService } from '../../services/definition/table/tpld-table-manager.service';
import {
  TpleThirdPartyLoansService
} from '../../services/execution/third-party-loan-payment/tple-third-party-loans.service';


@Component({
  selector: 'byte-payments-home-third-party-loans',
  templateUrl: './payments-third-party-loans.component.html',
  styleUrls: ['./payments-third-party-loans.component.scss'],
})
export class PaymentsThirdPartyLoansComponent implements OnInit {
  // Form
  filterLayout!: ILayout;
  filterForm!: FormGroup;

  // Table
  thirdLoansAccountsLayout!: ITableStructure<ILoanAccount>;
  selectedAccount!: ILoadItem<IThirdPartyLoanAssociate>;

  // DataTable search
  thirdAccounts: any = [];
  showThirdLoansTable: boolean = true;
  showTitleTable: boolean = false;
  thirdAccountsIsEmpty: boolean = false;


  showMessageAlert: boolean = true;
  showMessageAlertUp: boolean = false;

  typeAlert!: string;
  messageAlert!: string;

  typeAlertUp!: string;
  messageAlertUp!: string;

  isScrollable = true;
  isLoading = false;

  menuOptionsLicenses: string[] = [];
  btnCreateActive: boolean = true;

  constructor(
    private tableManagerService: TpldTableManagerService,
    private tplFormBuilder: AdfFormBuilderService,
    private route: ActivatedRoute,
    private router: Router,
    private parameterManagementService: ParameterManagementService,
    private util: UtilService,
    private tplExecutionService: TpleThirdPartyLoansService,
  ) { }

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get showCreateButton() {
    return this.menuOptionsLicenses.includes(TableThirdPartyLoansOption.CREATE);
  }

  ngOnInit(): void {
    this.getPermissionsMenu();
  }

  getPermissionsMenu() {

    const menuOptions = this.route.snapshot.data?.['menuOptions']
    this.menuOptionsLicenses = this.util.getLicensesTransactions(menuOptions);

    if (menuOptions.hasOwnProperty('error')) {
      this.showMessageAlertUp = true;
      this.showAlertUp('error', (menuOptions as IFlowError).message);
      this.initDefinition(this.menuOptionsLicenses);
      return;
    }

    this.initDefinition(this.menuOptionsLicenses);

  }

  initDefinition(options: string[]) {
    this.thirdLoansAccountsLayout = this.tableManagerService.buildThirdLoanTable(options);
    this.filterLayoutDefinition();
    this.getThirdPartyLoans();
    this.util.hideLoader();
  }



  filterLayoutDefinition() {
    this.filterLayout = this.tableManagerService.buildFilterForm({
      title: 'loan-administration',
      subtitle: 'my-loans-to-third-parties',
    });

    this.filterForm = this.tplFormBuilder.formDefinition(this.filterLayout.attributes);

    this.getDataFilter();
  }

  getThirdPartyLoans() {
    const thirdPartyLoansResponse = this.route.snapshot.data?.['associatedThirdAccounts'];

    if (thirdPartyLoansResponse.hasOwnProperty('error')) {
      this.thirdAccountsIsEmpty = true;
      this.showAlert('error', thirdPartyLoansResponse?.message);
      return;
    }

    const dataThirdPartyLoans: IThirdPartyLoanAssociate[] = thirdPartyLoansResponse;

    this.thirdAccounts = this.tplExecutionService.parseThirdPartyLoans(dataThirdPartyLoans);
    this.isScrollable = this.thirdAccounts.length >= 50;
    this.thirdLoansAccountsLayout.items = this.thirdAccounts;
    if (this.thirdLoansAccountsLayout.items) {
      this.showTitleTable = true;
    }
  }

  getActionTable(selectLoan: any) {
    this.selectedAccount = selectLoan;

    switch (selectLoan.action) {
      case TableThirdPartyLoansOption.DELETE:
        this.handleDeleteLoan();
        break;
      case TableThirdPartyLoansOption.UPDATE:
        this.tplExecutionService.handleUpdateThirdPartyLoan(selectLoan.item, EPaymentLoansFlowView.THIRD_PARTY_LOANS);
        break;
      case TableThirdPartyLoansOption.PAYMENT:
        this.tplExecutionService.gotToPayment(selectLoan.item, EPaymentLoansFlowView.THIRD_PARTY_LOANS);
        break;
    }
  }

  handleDeleteLoan() {
    this.tplExecutionService.openDeleteModal(this.selectedAccount, EPaymentLoansFlowView.THIRD_PARTY_LOANS);
    this.tplExecutionService.messageAlert.subscribe(message => {
      this.showAlert('error', message);
    });
  }

  getThirdPartyLoansByInfinityScroll() {
    if (!this.isScrollable) {
      return;
    }

    this.getLoans();
  }

  getLoans() {
    const lastLoanTransaction = this.thirdAccounts[this.thirdAccounts.length - 1];

    const identifier = lastLoanTransaction?.identifier;
    const currency = lastLoanTransaction?.currencyCode;
    const action = '+';
    const advancedFilter = this.filterForm.getRawValue().filter;

    this.tplExecutionService.getThirdPartyLoans({
      loanToLocate: identifier,
      currency: currency,
      action,
      advancedFilter,
    })
      .subscribe({
        next: (response) => {
          this.isScrollable = (response ?? []).length >= 50;
          this.thirdAccounts = [...this.thirdAccounts, ...this.tplExecutionService.parseThirdPartyLoans(response)];
          this.thirdLoansAccountsLayout.items = this.thirdAccounts;
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'fatal-error:get_third_party_loans');
          this.removeAlert();
          this.scrollToTop();
        },
      });
  }

  /**
   * @return Method to get number loans or name
   * from filter search advance and call
   * method Search.
   */
  getDataFilter(): void {
    this.filterForm?.get(AttributeOwnLoansTable.FILTER)?.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(1000))
      .subscribe((data) => {
        this.handleSearchByPagination(data);
      });
  }

  handleSearchByPagination(query: string) {
    this.util.showPulseLoader();
    this.isLoading = true;

    const identifier = '';
    const currency = '';
    const action = '+';
    const valueToSearch = query.toUpperCase();

    this.tplExecutionService.getThirdPartyLoans({
      loanToLocate: identifier,
      currency: currency,
      action,
      advancedFilter: valueToSearch,
    })
      .pipe(
        finalize(() => {
          this.util.hidePulseLoader();
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if ((response ?? []).length <= 0) {
            this.showTitleTable = false;
            this.showThirdLoansTable = false;
            this.showMessageAlert = true;
            this.showAlert('warning', 'no_matches_found');
            return;
          }
          this.showTitleTable = true;
          this.showThirdLoansTable = true;
          this.showMessageAlert = false;
          this.thirdAccounts = [...this.tplExecutionService.parseThirdPartyLoans(response)];
          this.thirdLoansAccountsLayout.items = this.thirdAccounts;
          this.isScrollable = response.length >= 50;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.thirdAccounts = [];
          this.thirdLoansAccountsLayout.items = this.thirdAccounts;
          this.showAlert('error', error?.error?.message ?? 'fatal-error:cannot_get_loan_by_filter');
          this.util.hidePulseLoader();
          this.removeAlert();
          this.scrollToTop();
        }
      });
  }

  removeAlert() {
    of(true)
      .pipe(delay(10000))
      .subscribe(() => {
        this.hiddenAlert();
      });
  }

  next(): void {
    this.util.showLoader();
    this.parameterManagementService.sendParameters({ navigationProtectedParameter: ENavigateProtectionParameter.CONSULT });

    this.router.navigate([ETPLPaymentCRUDUrlNavigationCollection.CONSULT]).finally(() => this.util.hideLoader());
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  scrollToTop() {
    this.util.scrollToTop();
  }

  hiddenAlert() {
    this.typeAlert = null!;
    this.messageAlert = null!;
  }

  showAlertUp(type: string, message: string) {
    this.typeAlertUp = type;
    this.messageAlertUp = message;
  }

  hiddenAlertUp() {
    this.typeAlertUp = null!;
    this.messageAlertUp = null!;
  }
}
