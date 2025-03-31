import {Injectable} from '@angular/core';
import {PmpeFileValidationsService} from "./pmpe-file-validations.service";
import {LoadSheetFileService} from "../../../../../service/common/load-sheet-file.service";
import {
  IPayPayroll,
  IPayrollSaveRequest,
  IRecordPayroll
} from "../../interfaces/pmp-payment-home.interface";
import {environment} from "../../../../../../environments/environment";
import {ParameterManagementService} from "../../../../../service/navegation-parameters/parameter-management.service";
import {UtilService} from "../../../../../service/common/util.service";
import {IUserInfo} from "../../../../../models/user-info.interface";
import {
  PayrollManagerPaymentExecuteParameters,
  PayrollPaymentSendFileParameters
} from '../../interfaces/pmp-payed-payroll.interface';

@Injectable({
  providedIn: 'root'
})
export class PmpeBuilddataService {

  private readonly STATUS_PAYROLL: string = "I";
  private readonly TYPE_PAYROLL: number = 1;



  constructor(
    private paymentOfPayrollFileValidations: PmpeFileValidationsService,
    private loadSheetFile: LoadSheetFileService,
    private parameterManager: ParameterManagementService,
    private util: UtilService,
  ) { }


  async buildFile(parameters: PayrollPaymentSendFileParameters) {
    const { paymentDetail, fileName} = parameters;

    const registersParsed = paymentDetail.participants.map(register => {
      return {
        accountNumber: register.targetAccount,
        amount: String(register.targetAmount),
        email: this.util.fillStrings(register.email ?? '', ' ', 50),
      }
    })

    const registersInFileToTextStructure = this.paymentOfPayrollFileValidations.buildStructureFileRequestBISV({
      fileRegisters: registersParsed,
    })

    const fileNameBuild = this.loadSheetFile.buildFileNameWithWebPatternPayPayroll('txt', fileName);
    const formData = await this.loadSheetFile.createFileToUpload({
      fileStructure: registersInFileToTextStructure,
      fileName: fileNameBuild,
      typeFile: 'plain',
    });

    return {
      formData
    }
  }

  generateDataToPayPayroll(parameters: PayrollManagerPaymentExecuteParameters):IPayPayroll{
    const { paymentDetail, sourceAccountSelected } = parameters;
    const amountToBeDebit = String(paymentDetail.participants.reduce((sum, account) => sum + account.targetAmount, 0));
    const lengthAccountsToDebit = paymentDetail?.participants?.length || 0;
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

    const dateTosaveAccount = this.util.getDate();
    const sourceAccount:string = sourceAccountSelected.account;
    const accountsQuantity:string = String(lengthAccountsToDebit);
    const signatureType:string = userInfo?.signatureType || 'A';
    const principalClient: string = userInfo?.customerCode || '0';
    const appliesPayrollsSameDay:string = "N";
    const username = this.util.getUserName();

    const records:IRecordPayroll[] = paymentDetail.participants.map((account, index) => {
      return {
        company: account?.company || 0,
        type: this.TYPE_PAYROLL,
        nameAccountReal: account.accountName,
        email: account?.email ?? "",
        detail: 'Salary payment',
        accountStatus: account.statusAccount,
        correlative: index + 1,
        targetAccount: account.targetAccount,
        accountName: account?.accountName ?? "",
        targetAmount: account.targetAmount
      };
    });

    const payrollSaveRequest:IPayrollSaveRequest = {
      company: userInfo?.customerCode,
      currency: environment.currency,
      statusRecord: this.STATUS_PAYROLL,
      type: this.TYPE_PAYROLL,
      userCreation: username,
      userModification: username,
      dateCreation: dateTosaveAccount,
      dateModification: dateTosaveAccount,
      status: this.STATUS_PAYROLL,
      sourceAccount: sourceAccountSelected?.account || "",
      sourceAmount: this.util.parseAmountStringToNumber(amountToBeDebit),
      debits: lengthAccountsToDebit,
      records
    }


    return{
      sourceAccount,
      accountsQuantity,
      amount: this.util.parseAmountStringToNumber(amountToBeDebit),
      signatureType,
      principalClient,
      appliesPayrollsSameDay,
      payrollSaveRequest
    }
  }

}
