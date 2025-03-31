import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { IAccount } from '../../../../../../models/account.inteface';
import { UtilService } from '../../../../../../service/common/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { T365mFormService } from '../../services/definition/t365m-form.service';
import { IFlowError } from '../../../../../../models/error.interface';
import { EAC365MFormControl } from '../../enum/form-control-name.enum';
import { ET365MUrlCollection } from '../../enum/url-collection.enum';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { PROTECTED_PARAMETER_ROUTE, PROTECTED_PARAMETER_STATE } from '../../../../../../enums/common-value.enum';
import { IS365AffiliationAccountList } from '../../interfaces/affiliation.interface';
import { IT365UpdateHomeState } from '../../interfaces/state.interface';
import { M365MembershipProtectedParameters } from '../../enum/route-protected.enum';

@Component({
  selector: 'byte-am-t365m-home',
  templateUrl: './am-t365m-home.component.html',
  styleUrls: ['./am-t365m-home.component.scss']
})
export class AmT365mHomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  formLayout!: ILayout;
  form!: FormGroup;
  selectOptions: IDataSelect[] = [];

  sourceAccountList: Array<IAccount> = [];

  sourceAccountSelected: IAccount | undefined = undefined;
  affiliation: IS365AffiliationAccountList = [];
  nextButtonMessage = 't.continue';

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isShowDisaffiliateButton() {
    if (this.affiliation.length <= 0) return false;

    const affiliation = this.affiliation[0];
    return affiliation.hasOwnProperty('account');
  }

  get disaffiliationButtonClassName() {
    return this.isShowDisaffiliateButton ? 'show' : '';
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private formDefinition: T365mFormService,
    private adfFormDefinition: AdfFormBuilderService,
    private activatedRouter: ActivatedRoute,
    private parameterManagement: ParameterManagementService,
  ) { }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    this.getSourceAccountList();
    this.getAffiliation();
  }

  getSourceAccountList() {
    const sourceAccountListResponse = this.activatedRouter.snapshot.data['sourceAccountList'];

    if (sourceAccountListResponse.hasOwnProperty('error')) {
      this.showAlert('error', (sourceAccountListResponse as IFlowError).message);
      return;
    }

    this.sourceAccountList = sourceAccountListResponse;
  }

  getAffiliation() {
    const affiliationResponse = this.activatedRouter.snapshot.data['affiliation'];

    if (affiliationResponse.hasOwnProperty('error')) {
      const baseMessage = 'Cliente no tiene Telefono registrado';
      const errorMessage = (affiliationResponse as IFlowError).message;
      const status = errorMessage?.includes(baseMessage) ? 'info' : 'error';
      this.showAlert(status, errorMessage);
      this.affiliation = [];
      return;
    }

    this.affiliation = affiliationResponse;
  }

  initDefinition() {
    this.formLayout = this.formDefinition.buildFormLayout();
    this.form = this.adfFormDefinition.formDefinition(this.formLayout.attributes);

    this.buildFormOptions();
    this.manageSetAffiliateData();
    this.changeForm();
  }

  manageSetAffiliateData() {
    if (this.affiliation.length <= 0) return;

    const affiliation = this.affiliation[0];
    if (!affiliation.hasOwnProperty('account')) return;

    this.nextButtonMessage = 'ac:365membership:label_update';
    this.form.patchValue({
      account: affiliation.account,
      numberPhone: affiliation.name,
    });
  }

  changeForm() {
    this.form.get(EAC365MFormControl.ACCOUNT)?.valueChanges.subscribe({
      next: (value) => this.handleChangeSourceAccount(value),
    });
  }

  handleChangeSourceAccount(value: string) {
    this.sourceAccountSelected = this.sourceAccountList.find((accountTemp) => accountTemp.account === value);
  }

  buildFormOptions() {
    const sourceAccountOptions = this.buildOptionsForSourceAccount();

    this.selectOptions = [sourceAccountOptions];
  }

  buildOptionsForSourceAccount() {
    const options = this.sourceAccountList.map(account => {
      const acronym = this.utils.getProductAcronym(account.product);

      return {
        name: `${acronym} - ${account.account}`,
        value: account.account,
      }
    });

    return {
      controlName: EAC365MFormControl.ACCOUNT,
      data: options,
    }
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate(['home']).finally(() => {});
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    if (this.affiliation.length > 0) {
      const affiliation = this.affiliation[0];
      this.parameterManagement.sendParameters({
        [PROTECTED_PARAMETER_STATE]: {
          account: this.sourceAccountSelected,
          formValues: this.form.value,
          affiliation,
        } as IT365UpdateHomeState,
        [PROTECTED_PARAMETER_ROUTE]: M365MembershipProtectedParameters.UPDATE,
      });

      this.router.navigate([ET365MUrlCollection.UPDATE]).finally(() => this.utils.hideLoader());
      return;
    }

    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: this.sourceAccountSelected,
        formValues: this.form.value,
      },
      [PROTECTED_PARAMETER_ROUTE]: M365MembershipProtectedParameters.AFFILIATE,
    });

    this.router.navigate([ET365MUrlCollection.AFFILIATE]).finally(() => this.utils.hideLoader());
  }

  navigateToDisaffiliateFlow() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.utils.showLoader();
    const affiliation = this.affiliation[0];
    this.parameterManagement.sendParameters({
      [PROTECTED_PARAMETER_STATE]: {
        account: this.sourceAccountSelected,
        formValues: {
          account: this.sourceAccountSelected?.account,
          numberPhone: affiliation.name,
        },
      },
      [PROTECTED_PARAMETER_ROUTE]: M365MembershipProtectedParameters.DISAFFILIATE,
    });

    this.router.navigate([ET365MUrlCollection.DISAFFILIATE]).finally(() => this.utils.hideLoader());
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
