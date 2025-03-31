import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { UtilService } from '../../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ParameterManagementService
} from '../../../../../../../service/navegation-parameters/parameter-management.service';
import { IFlowError } from '../../../../../../../models/error.interface';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../../enums/common-value.enum';
import { AmdS365CreateFormService } from '../../../services/definition/amd-s365-create-form.service';
import { AMS365UrlCollection } from '../../../enum/url-collection.enum';
import { EAMS365FormControl } from '../../../enum/form-control.enum';
import typeClientJson from '../../../data/type-client.json';
import { TranslateService } from '@ngx-translate/core';
import { IAMS365Country, TAMS365ListOfCountry } from '../../../interfaces/s365-catalogs.interface';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { AmS365TransactionService } from '../../../services/transaction/am-s365-transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IAMS365AddHomeState } from '../../../interfaces/state.interface';
import { EAMS365RouteProtected } from '../../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-s365-add',
  templateUrl: './am-s365-add.component.html',
  styleUrls: ['./am-s365-add.component.scss']
})
export class AmS365AddComponent implements OnInit {
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
    this.utils.hideLoader();
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
    this.setPersistenceForm();
    this.changeForm();
  }

  setPersistenceForm() {
    const state = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);
    if (!state) return;
    const { formValues } = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);

    this.form.patchValue({
      typeClient: formValues.typeClient,
      name: formValues.name,
      documentNumber: formValues.documentNumber,
      address: formValues.address,
      city: formValues.city,
      account: formValues.account,
    });

    this.form.get(EAMS365FormControl.COUNTRY)?.setValue(formValues.country);
  }

  setPersistenceValueForDependedValue(field: string, key: string) {
    const state = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);
    if (!state) return;

    const { formValues } = this.parameterManagement.getParameter<IAMS365AddHomeState>(PROTECTED_PARAMETER_STATE);

    this.form.get(field)?.setValue(formValues[key]);
  }

  buildFormOptions() {
    const typeClientOption = this.buildTypeClientOptions();
    const countryList = this.buildCountryOptions();

    this.selectOptions = [countryList, typeClientOption];
  }

  buildBankOptions(banks: TAMS365ListOfCountry) {
    const isBankInclude = this.selectOptions.some(a => a.controlName === EAMS365FormControl.BANK);

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

    if (isBankInclude) {
      this.selectOptions = this.selectOptions.map(a => {
        if (a.controlName === EAMS365FormControl.BANK) {
          return {
            ...a,
            data: bankOptions,
          }
        }

        return a;
      });

      return;
    }

    const option = {
      controlName: EAMS365FormControl.BANK,
      data: bankOptions,
    } as IDataSelect;

    this.selectOptions = [ ...this.selectOptions, option ];
  }

  buildTypeAccountOptions(products: TAMS365ListOfCountry) {
    const isProductIncluded = this.selectOptions.some(a => a.controlName === EAMS365FormControl.PRODUCT);

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

    if (isProductIncluded) {
      this.selectOptions = this.selectOptions.map(a => {
        if (a.controlName === EAMS365FormControl.PRODUCT) {
          return {
            ...a,
            data: productList,
          }
        }

        return a;
      });

      return;
    }

    const option = {
      controlName: EAMS365FormControl.PRODUCT,
      data: productList,
    } as IDataSelect;

    this.selectOptions = [ ...this.selectOptions, option ];
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

  changeForm() {
    this.form.get(EAMS365FormControl.TYPE_CLIENT)?.valueChanges.subscribe({
      next: (value: string) => {
        this.typeClientSelected = typeClientJson.find(client => client.value === value);
      }
    });

    this.form.get(EAMS365FormControl.BANK)?.valueChanges.subscribe({
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

  manageGetListOfBank(value: string) {
    this.resetStateOnCountryChange();
    this.countrySelected = this.countries.find(country => country.code === value);
    if (!this.countrySelected) return;

    this.utils.showPulseLoader();
    this.transactionService.getListOfBanks(value)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          this.banks = response ?? [];
          this.buildBankOptions(this.banks);
          this.setPersistenceValueForDependedValue(EAMS365FormControl.BANK, 'bank');
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
          this.utils.scrollToTop();
        }
      });
  }

  resetStateOnCountryChange() {
    this.bankSelected = undefined;
    this.productSelected = undefined;
    this.form.get(EAMS365FormControl.BANK)?.setValue('');
    this.form.get(EAMS365FormControl.PRODUCT)?.setValue('');

    this.selectOptions = this.selectOptions.map(register => {
      if (register.controlName === EAMS365FormControl.PRODUCT || register.controlName === EAMS365FormControl.BANK) {
        return {
          ...register,
          data: [],
        }
      }
      return register;
    });
  }

  resetStateOnBankChange() {
    this.productSelected = undefined;
    this.form.get(EAMS365FormControl.PRODUCT)?.setValue('');

    this.selectOptions = this.selectOptions.map(register => {
      if (register.controlName === EAMS365FormControl.PRODUCT) {
        return {
          ...register,
          data: [],
        }
      }
      return register;
    });
  }

  manageGetListOfProduct(value: string) {
    this.resetStateOnBankChange();

    this.bankSelected = this.banks.find(bank => bank.code === value);
    if (!this.bankSelected) return;

    this.utils.showPulseLoader();
    const countryCode = this.countrySelected?.code ?? '';
    this.transactionService.getListOfProduct(countryCode, value)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (response) => {
          this.products = response ?? [];
          this.buildTypeAccountOptions(this.products);
          this.setPersistenceValueForDependedValue(EAMS365FormControl.PRODUCT, 'product');
        },
        error: (error: HttpErrorResponse) => {
          this.showAlert('error', error?.error?.message ?? 'error:st-missing-connection');
          this.utils.scrollToTop();
        }
      });
  }

  previous() {
    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_ROUTE]: null,
      [PROTECTED_PARAMETER_STATE]: null,
    });

    this.router.navigate([AMS365UrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        formValues: this.form.value,
        productSelected: this.productSelected,
        bankSelected: this.bankSelected,
        typeClientSelected: this.typeClientSelected,
        countrySelected: this.countrySelected,
      } as IAMS365AddHomeState,
      [PROTECTED_PARAMETER_ROUTE]: EAMS365RouteProtected.ADD_CONFIRMATION,
    });

    this.router.navigate([AMS365UrlCollection.CREATE_CONFIRMATION]).finally(() => {});
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
