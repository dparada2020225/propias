import { Injectable } from '@angular/core';
import { Tm365TransactionService } from '../transaction/tm365-transaction.service';
import { LoadSheetFileService } from '../../../../../../service/common/load-sheet-file.service';
import { concatMap, from, of } from 'rxjs';
import {
  ITM365HomeState, ITM365TransferExecuted,
  ITM365TransferWithCorrelative,
  ITM365TransferWithFileTransfer
} from '../../interfaces/state.interface';
import { Tm365LoadFileService } from './tm365-load-file.service';
import { map } from 'rxjs/operators';
import { UtilService } from '../../../../../../service/common/util.service';
import { ETMACHTypeTransaction } from '../../../../../transaction-manager/modules/ach/enum/form-control-name.enum';
import { ITMAchUniTransactionRequest } from '../../../transfer-ach-uni-multiple/interfaces/ach-uni-tm-transaction';
import { IUserInfo } from '../../../../../../models/user-info.interface';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';

@Injectable({
  providedIn: 'root'
})
export class Tm365TransferService {


  constructor(
    private transferService: Tm365TransactionService,
    private loadSheetFile: LoadSheetFileService,
    private loadFileService: Tm365LoadFileService,
    private utils: UtilService,
    private parameterManagement: ParameterManagementService,
  ) { }

  execute(parameters: ITM365HomeState) {
    return this.manageExecuteTransaction(parameters);
  }

  private manageExecuteTransaction(parameters: ITM365HomeState) {
    return this.getCorrelative().pipe(
      concatMap((response) => this.getFileToUpload({
        ...parameters,
        correlative: response.correlative,
      })),
      concatMap((response) => this.sendFileTransfer({
        ...parameters,
        correlative: response.correlative,
        fileToUpLoad: response.file,
      })),
    );
  }

  private getCorrelative() {
    return this.transferService.getCorrelative();
  }

  private sendFileTransfer(parameters: ITM365TransferWithFileTransfer) {
    const { fileToUpLoad } = parameters;

    return this.transferService.fileTransfer(fileToUpLoad).pipe(
      concatMap(() => this.transfer(parameters)),
      concatMap((response) => this.notify({
        ...parameters,
        serviceResponse: response,
      })),
    );
  }


  private getFileToUpload(parameters: ITM365TransferWithCorrelative) {
    const { correlative } = parameters;

    const file = this.buildFile(parameters);

    return from(file)
      .pipe(map((response) => {
        return {
          file: response,
          correlative,
        }
      }));
  }

  private async buildFile(parameters: ITM365TransferWithCorrelative) {
    const { formValues, targetAccountListFromFile, correlative } = parameters;

    const registersInFileToTextStructure = this.loadFileService.buildFileToUpload({
      formValues,
      fileParsed: targetAccountListFromFile,
    });


    this.utils.testDownLoadCSVFileToUpload(registersInFileToTextStructure);

    const fileName = this.loadSheetFile.buildFileNameWithCorrelative(correlative.toString(), 'M', '.txt');

    return this.loadSheetFile.createFileToUpload({
      fileStructure: registersInFileToTextStructure,
      fileName: fileName,
      typeFile: 'plain',
    });
  }

  private transfer(parameters: ITM365TransferWithFileTransfer) {
    const { sourceAccountSelected, formValues, correlative } = parameters;
    const fileName = this.loadSheetFile.buildFileNameWithCorrelative(correlative.toString(), 'M', '.txt');

    return this.transferService.transfer({
      lotNumber: correlative,
      sourceAccount: sourceAccountSelected.account,
      sourceCurrency: sourceAccountSelected.currency,
      transfersQuantity: formValues.credits,
      totalAmountLot: formValues.amount,
      channelType: ETMACHTypeTransaction.NORMAL_365,
      fileName,
    }).pipe(
      concatMap(() => this.executeTransfer(parameters)),
    )
  }

  private executeTransfer(parameters: ITM365TransferWithFileTransfer) {
    const { isTokenRequired, token } = parameters;
    return this.transferService.executeMultipleTransfer(this.buildBodyRequestToExecuteTrasnfer(parameters), isTokenRequired, token);
  }

  private buildBodyRequestToExecuteTrasnfer(parameters: ITM365TransferWithFileTransfer) {
    const { formValues, sourceAccountSelected, correlative } = parameters;
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const date: Date = new Date();
    const fileName = this.loadSheetFile.buildFileNameWithCorrelative(correlative.toString(), 'M', '.txt');

    return {
      clientNumber: userInfo.customerCode,
      creditCount: String(formValues.credits),
      amount: String(formValues.amount),
      currency: sourceAccountSelected.currency,
      authorization: correlative,
      sourceAccountNumber: sourceAccountSelected.account,
      fileName: fileName,
      date: date.toISOString(),
      sourceAccountProduct: String(sourceAccountSelected.product),
      sourceAccountName: sourceAccountSelected.name,
      clientType: clientType,
      omitASTransaction: true,
      credits: this.getCreditsToTransfer(parameters),
    } as ITMAchUniTransactionRequest
  }

  private getCreditsToTransfer(parameters: ITM365TransferWithFileTransfer) {
    const { targetAccountListFromFile } = parameters;
    return targetAccountListFromFile.map((register, idx) => {
      return {
        bankCode: register.bankCode,
        product: register.product,
        currency: register.currency,
        accountNumber: register.account,
        amount: String(register.amount),
        description: register.comment,
        lineNumber: idx + 1,
        serviceType: ETMACHTypeTransaction.NORMAL_365,
        email: register.email,
        targetType: register.typeClient.toUpperCase(),
      }
    });
  }

  private notify(parameters: ITM365TransferExecuted) {
    return of(parameters.serviceResponse);
  }
}
