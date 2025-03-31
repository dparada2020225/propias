import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.scss'],
})
export class AccountSelectorComponent implements OnInit {
  @Input() service!: string;
  @Input() entryType!: string;
  @Input() account!: string;
  @Input() control!: FormControl;
  @Input() returnOriginal!: boolean;

  @Output() onChangeAccount: EventEmitter<any> = new EventEmitter<any>();

  accounts: Array<any> = [];
  originalAccounts: Array<any> = [];
  showAlert = false;
  messageAlert = 'no-content-message';

  // product
  private _product!: string;

  @Input()
  set product(product: string) {
    this._product = product;
  }

  get product(): string {
    return this._product;
  }

  // isLoading

  private _isLoading!: boolean;

  @Input()
  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  @Output() isLoadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private statementsService: StatementsService,
    private parameterManagement: ParameterManagementService,
    private spinner: NgxSpinnerService
  ) {
    this.isLoadingChange.emit(true);
  }

  ngOnInit(): void {
    this.showSpinner();
    this.updateAccounts();
  }

  updateAccounts() {
    if (!this.service) {
      this.isLoadingChange.emit(false);
      return;
    }

    if (!this.product) {
      this.product = this.parameterManagement.getParameter('product');
    }

    this.getAccounts();
  }

  getAccounts() {
    this.statementsService.getAccounts(this.service, this.entryType, this.product)
      .pipe(finalize(() => this.isLoadingChange.emit(false)))
      .subscribe({
        next: (response: any) => {
          if (!response) {
            this.showAlert = true;
            this.hideSpinner();
            return;
          }

          this.originalAccounts = response;
          this.parseAccounts(response);
        },
        error: (error: HttpErrorResponse) => {
          this.hideSpinner();
        }
      })
  }

  parseAccounts(response: any[]) {
    let found = false;

    this.accounts = response.map(account => {
      if (this.account && this.account === account.account) {
        found = true;
      }
      return {
        name: account.alias ? account.alias.toUpperCase() : account.account,
        value: account.account,
      }
    });

    setTimeout(() => {
      let accountToEmit: string | undefined = undefined;

      if (found) {
        accountToEmit = this.account;
      } else if (this.accounts.length) {
        accountToEmit = this.accounts[0].value;
      }

      this.control.setValue(accountToEmit);
      this.onChange(accountToEmit);
    });

    this.showAlert = false;
  }





  showSpinner() {
    this.spinner.show('main-spinner');
  }

  hideSpinner() {
    this.spinner.hide('main-spinner');
  }

  onChange($event: any) {
    if (this.returnOriginal) {
      let originalAccount = this.originalAccounts.find((element) => {
        return $event === element.account;
      });

      this.onChangeAccount.emit(originalAccount);
    } else {
      this.onChangeAccount.emit($event);
    }
  }
}
