import { Injectable } from '@angular/core';
import { AtdCreateManagerService } from './create/atd-create-manager.service';
import { IATDCrudCreateConfirmation, IATDCrudCreateVoucher } from '../../../interfaces/crud/crud-create.interface';
import { AtdUpdateManagerService } from './update/atd-update-manager.service';
import { IAchAccount } from '../../../interfaces/ach-account-interface';
import { IUpdateAchForm } from '../../../interfaces/crud/crud-form.interface';
import { IAtdConfirmationVoucher } from '../../../interfaces/crud/update.interface';
import { IACHUpdateAccountToTransaction } from '../../../interfaces/ach-transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class AtdCrudManagerService {

  constructor(
    private createManagerDefinition: AtdCreateManagerService,
    private updateManagerDefinition: AtdUpdateManagerService,
  ) { }

  buildCreateFormForNaturalClient() {
    return this.createManagerDefinition.buildFormLayoutForNaturalClient();
  }

  buildCreateFormForLegalClient() {
    return this.createManagerDefinition.buildFormLayoutForLegalClient();
  }

  buildVoucherForNaturalClient(properties: IATDCrudCreateVoucher) {
    return this.createManagerDefinition.buildVoucherForNaturalClient(properties);
  }

  buildVoucherForLegalClient(properties: IATDCrudCreateVoucher) {
    return this.createManagerDefinition.buildVoucherForLegalClient(properties);
  }

  buildConfirmationVoucherForNaturalClient(properties: IATDCrudCreateConfirmation) {
    return this.createManagerDefinition.buildConfirmationVoucherForNaturalClient(properties);
  }

  buildConfirmationVoucherForLegalClient(properties: IATDCrudCreateConfirmation) {
    return this.createManagerDefinition.buildConfirmationVoucherForLegalClient(properties);
  }

  buildFormUpdateForNaturalClient(accountToUpdate: IAchAccount) {
    return this.updateManagerDefinition.buildUpdateFormForNaturalClient(accountToUpdate);
  }

  buildFormUpdateForLegalClient(accountToUpdate: IAchAccount) {
    return this.updateManagerDefinition.buildUpdateFormForLegalClient(accountToUpdate);
  }

  buildUpdateVoucherForNaturalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    return this.updateManagerDefinition.buildVoucherForNaturalClient(selectedAccount, formValues);
  }

  buildUpdateVoucherForLegalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    return this.updateManagerDefinition.buildVoucherForLegalClient(selectedAccount, formValues);
  }

  buildUpdateConfirmationNaturalClient(voucherProperties: IAtdConfirmationVoucher) {
    return this.updateManagerDefinition.buildConfirmationVoucherForNaturalClient(voucherProperties);
  }

  buildUpdateConfirmationLegalClient(voucherProperties: IAtdConfirmationVoucher) {
    return this.updateManagerDefinition.buildConfirmationVoucherForLegalClient(voucherProperties);
  }

  builderDataToUpdate(parameters: IACHUpdateAccountToTransaction) {
    return this.updateManagerDefinition.buildDataToUpdateAccount(parameters);
  }
}
