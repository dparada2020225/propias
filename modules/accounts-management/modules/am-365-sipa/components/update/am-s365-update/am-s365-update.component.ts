import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { AmdS365CreateFormService } from '../../../services/definition/amd-s365-create-form.service';
import { TranslateService } from '@ngx-translate/core';
import { IFlowError } from '../../../../../../../models/error.interface';
import { EAMS365FormControl } from '../../../enum/form-control.enum';
import typeClientJson from '../../../data/type-client.json';
import countryListJson from '../../../data/country-list.json';
import { AMS365UrlCollection } from '../../../enum/url-collection.enum';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { IAMS365AddHomeState, IAMS365DetailState } from '../../../interfaces/state.interface';
import { IAMS365Country, TAMS365ListOfCountry } from '../../../interfaces/s365-catalogs.interface';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AmS365TransactionService } from '../../../services/transaction/am-s365-transaction.service';
import { EAMS365RouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-s365-update',
  templateUrl: './am-s365-update.component.html',
  styleUrls: ['./am-s365-update.component.scss']
})
export class AmS365UpdateComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  countries: TAMS365ListOfCountry = [];
  banks: TAMS365ListOfCountry = [];
  products: TAMS365ListOfCountry = [];

  productSelected: IAMS365Country | undefined = undefined;
  bankSelected: IAMS365Country | undefined = undefined;
  typeClientSelected: any = undefined;
  countrySelected: IAMS365Country | undefined = undefined;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private parameterManagement: ParameterManagementService,
    private adfFormBuilderService: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private formDefinition: AmdS365CreateFormService,
    private translate: TranslateService,
    private transactionService: AmS365TransactionService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
  }

  initState() {
    this.getListOfCountry();
  }

  getListOfCountry() {
    const countries = this.activatedRouter.snapshot.data['banks'];

    if (countries.hasOwnProperty('error')) {
      this.showAlert('error', (countries as IFlowError).message);
      return;
    }

    this.countries = countries;
  }

  initDefinition() {
    this.initFormDefinition();
  }

  initFormDefinition() {
    this.formLayout = this.formDefinition.buildFormLayout();
    this.form = this.adfFormBuilderService.formDefinition(this.formLayout.attributes);

    this.buildFormOptions();
    this.manageSetDefaultValues();
    this.manageSetDataPersist();
    this.changeForm();
  }

  manageSetDefaultValues() {
    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);

    if (state.formValues) return;
    const { account } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    const clientType = this.utils.getClientTypeKeyFromValue(account.clientType);

    this.form.patchValue({
      typeClient: clientType,
      name: account.name,
      documentNumber: account.documentNumber,
      address: account.address,
      city: account.city,
      country: account.country,
      account: account.account,
    });

    this.form.get(EAMS365FormControl.TYPE_CLIENT)?.disable();
    this.form.get(EAMS365FormControl.IDENTIFY_NUMBER)?.disable();
    this.form.get(EAMS365FormControl.COUNTRY)?.disable();
    this.form.get(EAMS365FormControl.NUMBER_ACCOUNT)?.disable();
  }

  manageSetDataPersist() {
    const state = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);

    if (!state.formValues) return;
    const { account, formValues } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    const clientType = this.utils.getClientTypeKeyFromValue(account.clientType);

    this.form.patchValue({
      typeClient: clientType,
      name: formValues?.name,
      documentNumber: account.documentNumber,
      address: formValues?.address,
      city: formValues?.city,
      country: account.country,
      account: account.account,
    });

    this.form.get(EAMS365FormControl.TYPE_CLIENT)?.disable();
    this.form.get(EAMS365FormControl.IDENTIFY_NUMBER)?.disable();
    this.form.get(EAMS365FormControl.COUNTRY)?.disable();
    this.form.get(EAMS365FormControl.NUMBER_ACCOUNT)?.disable();
  }

  buildFormOptions() {
    const typeClientOption = this.buildTypeClientOptions();
    const countryList = this.buildCountryOptions();

    this.selectOptions = [countryList, typeClientOption];
  }

  buildBankOptions(banks: TAMS365ListOfCountry) {

    const bankOptions = banks.map(bank => {
      return {
        name: bank.description,
        value: bank.code + '',
      }
    });

    bankOptions.unshift({
      name: 'label_select_and_option',
      value: '',
    });

    const option = {
      controlName: EAMS365FormControl.BANK,
      data: bankOptions,
    } as IDataSelect;

    this.selectOptions = [ ...this.selectOptions, option ];
  }

  buildTypeAccountOptions(products: TAMS365ListOfCountry) {
    const productList = products.map(product => {
      return {
        name: product.description,
        value: product.code + '',
      }
    });

    productList.unshift({
      name: 'label_select_and_option',
      value: '',
    });

    const option = {
      controlName: EAMS365FormControl.PRODUCT,
      data: productList,
    } as IDataSelect;

    this.selectOptions = [ ...this.selectOptions, option ];
  }

  changeForm() {
    this.form.get(EAMS365FormControl.BANK)?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe({
      next: (value: string) => {
        this.manageGetListOfProduct(value);
      }
    });

    this.form.get(EAMS365FormControl.PRODUCT)?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (value: string) => {
          this.productSelected = this.products.find(product => product.code === value);
        }
      });

    this.form.get(EAMS365FormControl.COUNTRY)?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (value: string) => {
          this.manageGetListOfBank(value);
        }
      });
  }

  buildTypeClientOptions() {
    const typeClientList = typeClientJson.map(client => {
      return {
        name: String(this.translate.instant(client.name)).toUpperCase(),
        value: client.value + '',
      }
    });

    return {
      controlName: EAMS365FormControl.TYPE_CLIENT,
      data: typeClientList,
    } as IDataSelect;
  }

  buildCountryOptions() {
    const countryList = this.countries.map(client => {
      return {
        name: client.description,
        value: client.code,
      }
    });

    return {
      controlName: EAMS365FormControl.COUNTRY,
      data: countryList,
    } as IDataSelect;
  }

  manageGetListOfBank(value: string) {
    this.countrySelected = this.countries.find(country => country.code === value);
    this.transactionService.getListOfBanks(value)
      .subscribe({
        next: (response) => {
          this.banks = response ?? [];
          this.buildBankOptions(this.banks);
          this.setPersistenceValueForDependedValue(EAMS365FormControl.BANK, 'bank');
          this.form.get(EAMS365FormControl.BANK)?.disable();
        },
        error: (error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
          this.utils.scrollToTop();
        }
      });
  }

  manageGetListOfProduct(value: string) {
    this.bankSelected = this.banks.find(bank => bank.code === value);
    const countryCode = this.countrySelected?.code ?? '';
    this.transactionService.getListOfProduct(countryCode, value)
      .subscribe({
        next: (response) => {
          this.utils.hideLoader();
          this.products = response ?? [];
          this.buildTypeAccountOptions(this.products);
          this.setPersistenceValueForDependedValue(EAMS365FormControl.PRODUCT, 'product');
          this.form.get(EAMS365FormControl.PRODUCT)?.disable();
        },
        error: (error: HttpErrorResponse) => {
          this.utils.hideLoader();
          this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
          this.utils.scrollToTop();
        }
      });
  }

  setPersistenceValueForDependedValue(field: string, key: string) {
    const state = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);
    if (!state) return;

    const { account } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);
    this.form.get(field)?.setValue(account[key]);
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: null,
      [PROTECTED_PARAMETER_ROUTE]: null,
    });

    this.router.navigate([AMS365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { account } = this.parameterManagement.getParameter<IAMS365DetailState>(PROTECTED_PARAMETER_STATE);

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        account,
      },
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.UPDATE_CONFIRMATION,
    });

    this.router.navigate([AMS365UrlCollection.UPDATE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }
}
