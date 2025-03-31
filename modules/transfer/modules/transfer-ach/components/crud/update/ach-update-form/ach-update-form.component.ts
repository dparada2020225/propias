import { Component, OnInit } from '@angular/core';
import { AdfFormBuilderService, IDataSelect, ILayout, ITableStructure } from '@adf/components';
import { FormGroup } from '@angular/forms';
import { AttributeFormCrudAch, ECrudAchTypeClient } from '../../../../enum/ach-crud-control-name.enum';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IAchFormStorageLayout, IAchUpdateFormValues, IAchUpdateStorageLayout } from '../../../../interfaces/ach-transfer.interface';
import { AtdCrudManagerService } from '../../../../services/definition/crud/atd-crud-manager.service';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import updateOptionsJson from '../../../../data/ach-update.json';
import { EACHCrudUrlNavigationCollection, EACHNavigationParameters } from '../../../../enum/navigation-parameter.enum';
import { AtdTableManagerService } from '../../../../services/definition/table/atd-table-manager.service';
import { EACHStatusAccount } from '../../../../enum/transfer-ach.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../../../../../service/common/util.service';

@Component({
  selector: 'byte-ach-update-form',
  templateUrl: './ach-update-form.component.html',
  styleUrls: ['./ach-update-form.component.scss'],
})
export class AchUpdateFormComponent implements OnInit {
  formLayout!: ILayout;
  form!: FormGroup;
  optionsList: IDataSelect[] = updateOptionsJson;

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  accountSelected!: IAchAccount;
  tableModifyDefinition: ITableStructure | null = null;

  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  constructor(
    private location: Location,
    private router: Router,
    private crudManagerDefinition: AtdCrudManagerService,
    private persistStepStateService: ParameterManagementService,
    private adfFormBuilder: AdfFormBuilderService,
    private tableManagerDefinition: AtdTableManagerService,
    private utils: UtilService,
  ) {}

  ngOnInit(): void {
    this.initDefinition();
    this.modifyTableDefinition();
    this.setCurrentAccountValues();
    this.persistsFormValues();
  }

  initDefinition() {
    const updateForm: IAchFormStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');
    const typeForm = updateForm.accountSelected?.clientType;
    this.accountSelected = updateForm?.accountSelected as IAchAccount;

    switch (typeForm) {
      case ECrudAchTypeClient.NATURAL:
        this.formDefinitionForNaturalClient(updateForm.accountSelected as IAchAccount);
        break;
      case ECrudAchTypeClient.LEGAL:
        this.formDefinitionForLegalClient(updateForm.accountSelected as IAchAccount);
        break;
      default:
        this.formDefinitionForNaturalClient(updateForm.accountSelected as IAchAccount);
        break;
    }
  }

  setCurrentAccountValues() {
    const updateForm: IAchFormStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    if (!updateForm?.formValues) {
      this.form.patchValue({
        alias: this.accountSelected?.alias,
        email: this.accountSelected?.email,
        name: this.accountSelected?.name,
        status: EACHStatusAccount[this.accountSelected?.status] || '',
      });



      if (updateForm?.typeClient === ECrudAchTypeClient.NATURAL) {
        this.form.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.setValue(this.accountSelected?.documentNumber);
      } else if (updateForm?.typeClient === ECrudAchTypeClient.LEGAL) {
        this.form.get(AttributeFormCrudAch.COMPANY_IDENTIFIER)?.setValue(this.accountSelected?.documentNumber);
      }
    }
  }

  persistsFormValues() {
    const updateForm: IAchFormStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    if (updateForm && updateForm?.formValues) {
      const formValues = updateForm?.formValues as IAchUpdateFormValues;

      this.form.patchValue({
        alias: formValues?.alias,
        email: formValues?.email,
        name: formValues?.name,
        status: formValues?.status,
      });

      if (updateForm?.typeClient === ECrudAchTypeClient.NATURAL) {
        this.form.get(AttributeFormCrudAch.IDENTIFY_BENEFICIARY)?.setValue(formValues?.identifyBeneficiary);
      } else if (updateForm?.typeClient === ECrudAchTypeClient.LEGAL) {
        this.form.get(AttributeFormCrudAch.COMPANY_IDENTIFIER)?.setValue(formValues?.companyIdentifier);
      }
    }
  }

  modifyTableDefinition() {
    this.tableModifyDefinition = this.tableManagerDefinition.buildModifyHistoryTable(this.accountSelected);
  }

  formDefinitionForNaturalClient(selectedAccount: IAchAccount) {
    this.formLayout = this.crudManagerDefinition.buildFormUpdateForNaturalClient(selectedAccount);
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
  }

  formDefinitionForLegalClient(selectedAccount: IAchAccount) {
    this.formLayout = this.crudManagerDefinition.buildFormUpdateForLegalClient(selectedAccount);
    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
  }

  nextStep() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.goToVoucher();
  }

  lastStep() {
    this.location.back();
    this.resetStorage();
  }

  goToVoucher() {
    this.utils.showLoader();
    const updateForm: IAchUpdateStorageLayout = this.persistStepStateService.getParameter('achUpdateForm');

    this.persistStepStateService.sendParameters({
      achUpdateForm: {
        formValues: this.form.value,
        typeClient: updateForm?.accountSelected?.clientType,
        accountSelected: updateForm?.accountSelected,
      } as IAchUpdateStorageLayout,
    });

    this.saveNavigationProtectedParameter();

    this.router.navigate([EACHCrudUrlNavigationCollection.UPDATE_VOUCHER]).finally(() => {
      this.utils.hideLoader();
    });
  }

  saveNavigationProtectedParameter() {
    this.persistStepStateService.sendParameters({
      navigationProtectedParameter: EACHNavigationParameters.CRUD_UPDATE_VOUCHER,
    });
  }

  resetStorage() {
    this.persistStepStateService.sendParameters({
      achUpdateForm: null,
      navigationProtectedParameter: null,
    });
  }
}
