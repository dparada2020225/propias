import { Injectable } from '@angular/core';
import { AtdCreateFormService } from './atd-create-form.service';
import { AtdCreateVoucherService } from './atd-create-voucher.service';
import { IATDCrudCreateConfirmation, IATDCrudCreateVoucher } from '../../../../interfaces/crud/crud-create.interface';
import { ICrudAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { CreateAchBuilder } from '../../../../interfaces/create-account-ach-interface';
import { AtdCreateConfirmService } from './atd-create-confirm.service';

@Injectable({
  providedIn: 'root'
})
export class AtdCreateManagerService {

  constructor(
    private createFormDefinition: AtdCreateFormService,
    private createVoucherDefinition: AtdCreateVoucherService,
    private createConfirmationDefinition: AtdCreateConfirmService,
  ) { }

  buildFormLayoutForNaturalClient() {
    return this.createFormDefinition.buildCreateLayoutForNaturalClient();
  }

  buildFormLayoutForLegalClient() {
    return this.createFormDefinition.buildCreateLayoutForLegalClient();
  }

  buildVoucherForNaturalClient(properties: IATDCrudCreateVoucher) {
    return this.createVoucherDefinition.buildConfirmationVoucherCreateForNaturalClient(properties);
  }

  buildVoucherForLegalClient(properties: IATDCrudCreateVoucher) {
    return this.createVoucherDefinition.buildConfirmationVoucherCreateForLegalClient(properties);
  }

  buildConfirmationVoucherForNaturalClient(properties: IATDCrudCreateConfirmation) {
    return this.createConfirmationDefinition.buildVoucherForNaturalClient(properties);
  }

  buildConfirmationVoucherForLegalClient(properties: IATDCrudCreateConfirmation) {
    return this.createConfirmationDefinition.buildVoucherForLegalClient(properties);
  }

  buildDataToCreateAccount(formValues: ICrudAchForm) {
    return new CreateAchBuilder()
      .clientType(formValues?.typeClient ?? 'undefined')
      .bank(Number(formValues?.bankName ?? 0))
      .account(formValues?.numberAccount ?? 'undefined')
      .name(formValues?.name ?? 'undefined')
      .currency(formValues?.currency ?? 'undefined')
      .email(formValues?.email ?? 'undefined')
      .type(formValues?.typeAccount)
      .alias(formValues?.alias ?? 'undefined')
      .useAnyCurrency(false)
      .clientId(formValues?.identifyBeneficiary ?? formValues?.companyIdentifier)
      .build();
  }

}
