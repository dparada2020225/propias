import { Injectable } from '@angular/core';
import { AtdUpdateFormService } from './atd-update-form.service';
import { IAchAccount } from '../../../../interfaces/ach-account-interface';
import { IUpdateAchForm } from '../../../../interfaces/crud/crud-form.interface';
import { AtdUpdateVoucherService } from './atd-update-voucher.service';
import { UpdateAchBuilder } from '../../../../interfaces/update-account-ach-interface';
import { AtdUpdateConfirmService } from './atd-update-confirm.service';
import { IAtdConfirmationVoucher } from '../../../../interfaces/crud/update.interface';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IACHUpdateAccountToTransaction } from '../../../../interfaces/ach-transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class AtdUpdateManagerService {
  constructor(
    private updateFormDefinition: AtdUpdateFormService,
    private voucherDefinition: AtdUpdateVoucherService,
    private confirmationDefinition: AtdUpdateConfirmService,
    private parameterManagementService: ParameterManagementService,
  ) {}

  buildUpdateFormForNaturalClient(accountToUpdate: IAchAccount) {
    return this.updateFormDefinition.buildUpdateLayoutAccountNaturalClient(accountToUpdate);
  }

  buildUpdateFormForLegalClient(accountToUpdate: IAchAccount) {
    return this.updateFormDefinition.buildUpdateLayoutAccountLegalClient(accountToUpdate);
  }

  buildVoucherForNaturalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    return this.voucherDefinition.buildUpdateSampleVoucherForNaturalClient(selectedAccount, formValues);
  }

  buildVoucherForLegalClient(selectedAccount: IAchAccount, formValues: IUpdateAchForm) {
    return this.voucherDefinition.buildUpdateSampleVoucherForLegalClient(selectedAccount, formValues);
  }

  buildConfirmationVoucherForNaturalClient(voucherProperties: IAtdConfirmationVoucher) {
    return this.confirmationDefinition.buildVoucherConfirmationUpdateNaturalClient(voucherProperties);
  }

  buildConfirmationVoucherForLegalClient(voucherProperties: IAtdConfirmationVoucher) {
    return this.confirmationDefinition.buildVoucherConfirmationUpdateLegalClient(voucherProperties);
  }

  buildDataToUpdateAccount(parameters: IACHUpdateAccountToTransaction) {
    const { selectedAccount, formValues } = parameters;
    const clientCode = this.parameterManagementService.getParameter('userInfo')?.customerCode;

    return new UpdateAchBuilder()
      .clientType(selectedAccount?.clientType)
      .name(formValues?.name)
      .currency(selectedAccount?.currency)
      .email(formValues?.email)
      .type(selectedAccount?.type)
      .clientId(clientCode)
      .alias(formValues?.alias)
      .accountStatus(formValues?.status)
      .clientId(formValues?.identifyBeneficiary ?? formValues?.companyIdentifier)
      .build();
  }
}
