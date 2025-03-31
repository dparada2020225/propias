import {Injectable} from '@angular/core';
import {SPPView} from "../../enums/pmp-view.enum";
import {
  IloadParticipant,
  PayrollLoadParticipantsParameters
} from '../../interfaces/pmp-state.interface';
import {ParameterManagementService} from "../../../../../service/navegation-parameters/parameter-management.service";
import {UtilService} from "../../../../../service/common/util.service";

@Injectable({
  providedIn: 'root'
})
export class SpplBuilddataTransactionService {

  private readonly TYPE: number = 1;
  private readonly DETAILS: string = "pago planilla";

  constructor(
    private parameterManagerService: ParameterManagementService,
    private util: UtilService,
  ) { }


  buildDataToLoadPayroll(parameters: PayrollLoadParticipantsParameters):IloadParticipant[] {
    const {
      registers,
      accountsValidated,
      currentView,
      fileParsed,
    } = parameters;

    return accountsValidated.map((account, index) => {
      const { account: accountNumber, accountName, status } = account;
      const dataSource = currentView === SPPView.MANUAL ? registers : fileParsed?.accounts;
      const dataExtra = dataSource.find(e => e.accountNumber === accountNumber);
      const email:string = dataExtra?.email ?? "";
      const amount:string = dataExtra?.amount || "0";
      const dateCreation = this.util.getDate();

      return {
        company: this.parameterManagerService.getParameter('userInfo')?.customerCode,
        type: this.TYPE,
        correlative: index + 1,
        targetAccount: accountNumber,
        accountName,
        email,
        details: this.DETAILS,
        targetAmount: this.util.parseAmountStringToNumber(amount),
        statusAccount: status,
        dateCreation
      }
    })

  }




}
