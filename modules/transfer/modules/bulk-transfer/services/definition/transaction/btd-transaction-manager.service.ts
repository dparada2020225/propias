import { Injectable } from '@angular/core';
import {
  IBulkTransferModal, IHeadingFile,
  IParametersToExecutePreTransfer,
  IParametersToExecuteTransaction,
  IPreRequestBulkTRequest
} from '../../../models/bulk-transfer.interface';
import { BtdVoucherService } from './btd-voucher.service';
import { BtdModalService } from './btd-modal.service';
import { IBulkTransferVoucherDefinitionParameters } from '../../../interfaces/btd-voucher.interface';
import { BtdFormService } from './btd-form.service';
import { BtdConfirmService } from './btd-confirm.service';
import { IAccount } from '../../../../../../../models/account.inteface';
import {
  ACHTargetAccountBuilder
} from '../../../../transfer-ach/interfaces/ach-transaction.interface';
import { BulkTransactionBuilder } from '../../../models/bul-transaction.interface';
import { IAChBulkTransferAccount } from '../../../../transfer-ach/interfaces/ach-account-interface';
import { Product } from '../../../../../../../enums/product.enum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { EPaymentType } from '../../../../../../../enums/payment-type.enum';
import { AtdUtilService } from '../../../../transfer-ach/services/atd-util.service';


@Injectable({
  providedIn: 'root'
})
export class BtdTransactionManagerService {

  constructor(
    private voucherDefinition: BtdVoucherService,
    private modalDefinition: BtdModalService,
    private formDefinition: BtdFormService,
    private confirmScreenDefinition: BtdConfirmService,
    private parameterManagementService: ParameterManagementService,
    private achUtils: AtdUtilService,
  ) { }

  buildFormLayout(isShowFullForm = false) {
    return this.formDefinition.buildFormLayout(isShowFullForm);

  }

  buildConfirmScreenLayout(userAccount: IAccount , headingFile: IHeadingFile, title: string = 'transfers_other_banks', subtitle: string = 'upload_files') {
    return this.confirmScreenDefinition.buildTransferLayoutVoucherSample(userAccount, headingFile, title, subtitle);
  }

  buildVoucherLayout(parameters: IBulkTransferVoucherDefinitionParameters) {
    return this.voucherDefinition.buildTransferLayoutVoucherConfirmation(parameters);
  }

  buildModalLayout(modalProperties: IBulkTransferModal) {
    return this.modalDefinition.builderLayoutVoucherModal(modalProperties);
  }

  dataToExecuteTransaction(parameters: IParametersToExecuteTransaction) {
    const { lote, sourceAccount, targetAccounts, formatRegister, fileName, formValues } = parameters ?? {};
    const idClient = this.parameterManagementService.getParameter('userInfo')?.customerCode;
    const schedule = formValues?.schedule ? this.buildScheduleParameter(formValues?.date, formValues?.hour) : '';

    const currentSourceAccount = this.achUtils.getDataSourceAccountToExecuteTransaction(sourceAccount);

    return new BulkTransactionBuilder()
      .lot(lote?.correlative)
      .cif(idClient)
      .paymentType(EPaymentType.MASSIVE_TRANSFER)
      .formatRegister(formatRegister)
      .currency(sourceAccount?.currency)
      .scheduleDate(schedule as never)
      .fileName(fileName)
      .source(currentSourceAccount.sourceAccount)
      .target(this.parseAchAccount(targetAccounts))
      .build();
  }

  dataToExecutePreTransfer(parameters: IParametersToExecutePreTransfer) {
    const { sourceAccount, transactionDetail, loteCode } = parameters ?? {};

    const sourceProduct = ('0' + sourceAccount?.product).slice(-2);
    const sourceSubProduct = ('0' + (sourceAccount?.subproduct ?? sourceAccount?.subProduct)).slice(-2);

    return {
      sourceAccount: sourceAccount?.account,
      sourceProductType: sourceProduct,
      sourceSubProductType: sourceSubProduct,
      sourceCurrency: sourceAccount?.currency,
      amount: transactionDetail?.totalAmount,
      numberOfCredits: String(transactionDetail?.credits),
      lotCode: loteCode,
    } as IPreRequestBulkTRequest;
  }

  private parseAchAccount(account: IAChBulkTransferAccount[]){

    return account.map((acc) => (
      new ACHTargetAccountBuilder()
        .bankId(acc?.routeCode) // settings
        .identification(acc?.documentNumber)
        .name(acc?.name)
        .email(acc?.email)
        .account(acc?.account)
        .accountProduct(Product[acc?.type])
        .id(this.achUtils.getBankRouteForSourceAccount(acc.currency))
        .amount(acc?.currentAmount)
        .internalProduct(acc?.internalProduct) // settings
        .targetBankCode(acc?.bank)
        .build()
    ));
  }

  private buildScheduleParameter(date: NgbDate, hour: string) {
    if (!date && !hour) { return null; }

    const day = ('0' + date?.day).slice(-2);
    const month = ('0' + date?.month).slice(-2);

    return `${day}${month}${date?.year}${hour}`;
  }
}
