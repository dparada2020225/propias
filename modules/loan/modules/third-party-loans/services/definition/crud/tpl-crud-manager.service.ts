import { Injectable } from '@angular/core';
import { CtpldFormService } from './create/ctpld-form.service';
import { TplCreateFormService } from './create/tpl-create-form.service';
import { TplUpdateService } from './update/tpl-update.service';
import { TpldPaymentFormService } from '../payment/tpld-payment-form.service';
import { IConsultThirdPartyLoan, IThirdPartyLoanAssociate } from '../../../interfaces/crud/crud-third-party-loans-interface';
import { TpldConfirmService } from '../confirm-screen/tpld-confirm.service';
import { IHeadBandLayout } from '../../../../../../../models/util-work-flow.interface';

@Injectable({
  providedIn: 'root'
})
export class TplCrudManagerService {
  constructor(
    private consultLoansService: CtpldFormService,
    private createThirdPartyLoans: TplCreateFormService,
    private updateThirdPartyLoans: TplUpdateService,
    private paymentThirdPartyLoans: TpldPaymentFormService,
    private confirmationThirdPartyLoans: TpldConfirmService,

  ) { }

  builderConsultLoansForm() {
    return this.consultLoansService.buildConsultLoansLayout();
  }

  builderCreateLoansForm(numberLoan: string, thirdPartyLoanData: IConsultThirdPartyLoan) {
    return this.createThirdPartyLoans.buildCreateAccountLayout(numberLoan, thirdPartyLoanData);
  }

  builderUpdateLoansForm(accountTPL: IThirdPartyLoanAssociate) {
    return this.updateThirdPartyLoans.buildUpdateAccountLayout(accountTPL);
  }

  buildDebitedAccountSelect(account: any) {
    return this.paymentThirdPartyLoans.buildDebitedAccountSelectAttributes(account);
  }

  buildConfirmationLayout(confirmationType: any) {
    return this.confirmationThirdPartyLoans.builderLayoutConfirmation(confirmationType);
  }


  buildHeadBandLayout(userData: IHeadBandLayout) {
    return this.confirmationThirdPartyLoans.getHeadBandLayout(userData);
  }

}
