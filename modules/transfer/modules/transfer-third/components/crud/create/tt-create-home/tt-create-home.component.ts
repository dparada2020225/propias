import {Component, OnInit} from '@angular/core';
import {AdfFormBuilderService, IDataSelect, ILayout} from '@adf/components';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AccountToSmartCoreBuilder, CreditToBuilder, OperationBuilder, TransactionBuilder} from '@adf/security';
import {TTDCRUDManagerService} from '../../../../services/definition/crud/manager/ttd-crud-manager.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {TransferThirdService} from '../../../../services/transaction/transfer-third.service';
import {SmartCoreService} from 'src/app/service/common/smart-core.service';
import {UtilService} from 'src/app/service/common/util.service';
import {AttributeFormCrud} from '../../../../enums/third-transfer-control-name.enum';
import {CreateThirdBuilder, ICreateThird} from '../../../../interfaces/crud/create-third-interface';
import {
  EThirdTransferNavigateParameters,
  EThirdTransferUrlNavigationCollection
} from '../../../../enums/third-transfer-navigate-parameters.enum';
import {IGetThirdTransferResponse} from '../../../../interfaces/third-transfer-service';
import typeAccount from '../../../../data/type-accounts.json';
import {environment} from 'src/environments/environment';
import {EProfile} from 'src/app/enums/profile.enum';

@Component({
  selector: 'byte-tt-create-home',
  templateUrl: './tt-create-home.component.html',
  styleUrls: ['./tt-create-home.component.scss'],
})
export class TtCreateHomeComponent implements OnInit {
  typeAlert: string | null = null;
  messageAlert: string | null = null;

  layoutConsulting!: ILayout;
  consultingForm!: FormGroup;
  consultingSelectOptions: IDataSelect[] = [];

  private profile = environment.profile;
  typeProfile = EProfile.SALVADOR

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get classContainer() {
    const classNameContainer = {
      [EProfile.SALVADOR]: 'tooltip-sv'
    }
    return classNameContainer[this.profile] || '';

  }

  get classFormLayout() {
    const className = {
      [EProfile.SALVADOR]: 'layout-bisv'
    }
    return className[this.profile] || '';
  }

  get classButtonContainer() {

    const className = {
      [EProfile.SALVADOR]: 'no-line_sv hover_button-primary-sv button-bisv'
    }

    return className[this.profile] || '';

  }

  constructor(
    private router: Router,
    private crudServiceManager: TTDCRUDManagerService,
    private crudFormBuilder: AdfFormBuilderService,
    private parameterManagement: ParameterManagementService,
    private transferThirdService: TransferThirdService,
    private smartCore: SmartCoreService,
    private util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.consultingFormDefinition();
  }

  /**
   * @return Method in charge of calling the
   * definition and creating the form for
   * the first account association screen
   */
  consultingFormDefinition(): void {
    this.layoutConsulting = this.crudServiceManager.buildConsultingLayoutTTC();
    this.consultingForm = this.crudFormBuilder.formDefinition(this.layoutConsulting.attributes);
    this.getTypeAccount();
  }

  getTypeAccount(): void {
    const typeAccountSelect: IDataSelect = {
      controlName: AttributeFormCrud.TYPE_ACCOUNT,
      data: typeAccount[this.profile || EProfile.HONDURAS],
    };
    this.consultingSelectOptions.push(typeAccountSelect);
  }

  /**
   * @return Method that obtains the data of the account
   * to be associated, calls the constructor and creates
   * the form of the second screen
   */
  getAccountToAdd() {
    this.util.showLoader()
    const account = this.consultingForm?.getRawValue().numberAccount;

    this.transferThirdService.getThird(account).subscribe({
      next: (result) => {
        const accountThird = new CreateThirdBuilder()
          .account(result?.account ?? '')
          .currency(this.util.getISOCurrency(result?.currency ?? ''))
          .alias(result?.name ?? '')
          .type(this.util.getProductName(+result?.productType ?? 0))
          .email('')
          .build();

        this.addAccountCallSmartCore(accountThird);

        if (result.productType !== this.consultingForm.get(AttributeFormCrud.TYPE_ACCOUNT)?.value) {
          this.util.hideLoader();
          this.showAlert('error', 'error:third_party_account:different_type_account');
          return;
        }

        this.parameterManagement.sendParameters({
          navigationProtectedParameter: EThirdTransferNavigateParameters.CRUD_CREATE_CONFIRM,
          navigateStateParameters: {
            ...result,
          } as IGetThirdTransferResponse,
        });

        this.router.navigate(['/transfer/third/create-confirm']).finally(() => this.util.hideLoader());
      },
      error: (error) => {
        this.util.hideLoader();
        this.showAlert('error', error?.error?.message || 'fatal-error:timeout');
      },
    });
  }


  addAccountCallSmartCore(createThird: ICreateThird) {
    const transaction = new TransactionBuilder().category('add accounts').type('third parties').build();

    const creditTo = new CreditToBuilder().currency(createThird.currency).build();

    const accountTo = new AccountToSmartCoreBuilder().client(createThird.alias).accountNumber(createThird.account).build();

    const operation = new OperationBuilder().transaction(transaction).creditTo(creditTo).accountTo(accountTo).build();

    this.smartCore.personalizationOperation(operation);
  }

  nextStep() {
    if (!this.consultingForm.valid) {
      this.consultingForm.markAllAsTouched();
      return;
    }

    this.getAccountToAdd();
  }

  backStep() {

    const mapNavigation = {
      [EProfile.SALVADOR]: EThirdTransferUrlNavigationCollection.HOMESV,
      [EProfile.HONDURAS]: EThirdTransferUrlNavigationCollection.HOME,
    }

    this.resetStorage();
    this.router.navigate([mapNavigation[this.profile] || EThirdTransferUrlNavigationCollection.HOME]).then(() => {
    });
  }

  resetStorage() {
    this.parameterManagement.sendParameters({
      navigationProtectedParameter: null,
    });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = null;
    this.messageAlert = null;
  }
}
