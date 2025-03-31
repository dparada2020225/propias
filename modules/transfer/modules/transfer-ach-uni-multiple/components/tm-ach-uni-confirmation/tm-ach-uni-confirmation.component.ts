import { Component, OnInit } from '@angular/core';
import { AdfFormatService, IDataReading, ITableStructure } from '@adf/components';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilService } from 'src/app/service/common/util.service';
import { Router } from '@angular/router';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { HandleTokenRequestService } from 'src/app/service/common/handle-token-request.service';
import { PROTECTED_PARAMETER_STATE } from 'src/app/enums/common-value.enum';
import { ITMAchUniAchAccount } from '../../interfaces/ach-uni-table.interface';
import { TmAchUniVoucherService } from '../../services/definition/tm-ach-uni-voucher.service';
import { ETmAchUniProtectedNavigation, ETmAchUniUrlCollection } from '../../enum/ach-uni-url-collection';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { TmAchUniVoucherDataService } from '../../services/execution/tm-ach-uni-voucher.service';
import { CorrelativeResponse } from '../../interfaces/ach-uni-voucher-definition.interface';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { IUserInfo } from 'src/app/models/user-info.interface';

import { from, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { ITMAchUniFileValidationResponse } from '../../interfaces/ach-uni-load-file.interface';
import { ITMAchUniCreditTransaction, ITMAchUniResponse, ITMAchUniTransactionRequest, ITMUploadUniTrfRequest } from '../../interfaces/ach-uni-tm-transaction';
import { TmAchUniTransactionService } from '../../services/transaction/tm-ach-uni-transaction.service';
import { IACHTransactionResponse } from '../../../transfer-ach/interfaces/ach-transfer.interface';
import { StBisvService } from 'src/app/modules/transaction-manager/modules/signature-tracking/services/transaction/st-bisv.service';
import { ITransactionSuccessResponse } from 'src/app/models/utils-transaction.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-tm-ach-uni-confirmation',
  templateUrl: './tm-ach-uni-confirmation.component.html',
  styleUrls: ['./tm-ach-uni-confirmation.component.scss']
})
export class TmAchUniConfirmationComponent implements OnInit {

  typeAlert: string | null = null;
  messageAlert: string | null = null;

  voucherLayout!: IDataReading;
  tableStructure!: ITableStructure;

  sourceAccountSelected!: IAccount;
  credits = 0;
  total = '';
  currency = '';

  correlative!: string;
  fileResponse: ITMAchUniFileValidationResponse | undefined = undefined;
  get customShow() {
    return this.typeAlert && this.messageAlert ? 'custom_show' : '';
  }

  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  get userVirtualScrollInTable() {
    return this.tableStructure.items.length > 8
  }

  constructor(
    private utils: UtilService,
    private router: Router,
    private tmAchUniVoucherDefinitionService: TmAchUniVoucherService,
    private parameterManagement: ParameterManagementService,
    private modalService: NgbModal,
    private utilsTransaction: UtilTransactionService,
    private adfFormat: AdfFormatService,
    private handleTokenRequest: HandleTokenRequestService,
    private tmAchUniVoucherService: TmAchUniVoucherDataService,
    private transferAchUniMultiple: TmAchUniTransactionService,
    private serviceNotify: StBisvService,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe({
      next: () => {
        const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

        this.tableStructure = this.tmAchUniVoucherDefinitionService.buildTableLayout({
          accounts: state.targetAccountListFromFile,
        });
      }
    })
  }

  ngOnInit(): void {
    this.initState();
    this.initDefinition();
    this.utils.hideLoader();
  }

  initState() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    this.fileResponse = state.fileResponse;
    this.sourceAccountSelected = state.sourceAccountSelected;
    this.calcSummary();
  }

  calcSummary() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    const accounts: Array<ITMAchUniAchAccount> = state.targetAccountListFromFile;
    this.credits = accounts.length;
    this.currency = this.sourceAccountSelected.currency;
    const calcTotal = accounts.reduce((acc, register) => acc + this.utils.parseNumberAsFloat(register.dataFromFile.amount), 0);
    this.total = this.adfFormat.formatAmount(calcTotal.toFixed(2)) + '';
  }

  initDefinition() {
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);

    this.voucherLayout = this.tmAchUniVoucherDefinitionService.buildVoucherConfirmationLayout({
      sourceAccount: this.sourceAccountSelected,
    });

    this.tableStructure = this.tmAchUniVoucherDefinitionService.buildTableLayout({
      accounts: state.targetAccountListFromFile,
    });
  }

  showAlert(typeAlert: string, message: string) {
    this.typeAlert = typeAlert;
    this.messageAlert = message;
  }

  previous() {
    this.utils.showLoader();
    this.router.navigate([ETmAchUniUrlCollection.HOME]).finally(() => {});
  }

  nextStep() {
    this.handleExecuteTransaction();
  }

  handleExecuteTransaction() {
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    }

    this.executeTransaction().subscribe({
        next: (response) => {
          this.handleResponseTransaction(response);
        }
      })
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.typeTransaction = ERequestTypeTransaction.ACH_TRANSFER;
    modal.componentInstance.executeService = (token: string) => this.executeTransaction(token);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result as Promise<any>).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

  executeTransaction(token?: string) {
    this.utils.showLoader();
    return from(this.tmAchUniVoucherService.getCorrelative()).pipe(
      switchMap((response: CorrelativeResponse) => {
        if(response.responseCode === '0'){
          const correlative = response.correlative;
          const fileName = this.getFileName(correlative);
          const fileData = this.generateTMAchUniData();
          const mimeType = 'application/octet-stream';
          const formData = this.buildPositionalFile(btoa(fileData), fileName, mimeType);

          const request: ITMUploadUniTrfRequest = {
            uploadFile: formData
          }
          return this.tmAchUniVoucherService.fileTransferFTP(request).pipe(
            tap(response => {}),
            switchMap(() => this.executeTranfer(fileName, correlative, token))
          );
        }else{
          this.showAlert('error', response.errorMessage);
          this.utils.hideLoader();
          return of(null);
        }
      })
    )
  }

  executeTranfer(fileName: string, correlative: string, token?: string) {
    const userInfo: IUserInfo = this.parameterManagement.getParameter('userInfo');
    const clientType = this.parameterManagement.getParameter('clientType');
    const date: Date = new Date();
    const request: ITMAchUniTransactionRequest = {
      serviceType: 'UNI',
      clientNumber: userInfo.customerCode,
      creditCount: String(this.credits),
      amount: this.utils.parseAmountStringToNumber(String(this.total)).toString(),
      currency: this.currency,
      authorization: correlative,
      sourceAccountNumber: this.sourceAccountSelected.account,
      fileName: fileName,
      date: date.toISOString(),
      sourceAccountProduct: String(this.sourceAccountSelected.product),
      sourceAccountName: this.sourceAccountSelected.name,
      clientType: clientType,
      omitASTransaction: false,
      credits: this.getCreditsToRequest(this.fileResponse?.fileLoaded?.accounts ? this.fileResponse?.fileLoaded?.accounts : [])
    }

    return this.transferAchUniMultiple.executeMultipleTransfer(request, this.isTokenRequired, token).pipe(
      map(response => this.utilsTransaction.handleResponseTransaction<ITransactionSuccessResponse>(response)),
      tap((res: ITransactionSuccessResponse) => {
        if(res.data.responseCode === "0"){
          const parameters = {
            lot: this.padToSevenDigits(res.data.lotNumber),
            accountDebit: this.sourceAccountSelected.account,
            accountDebitName: this.sourceAccountSelected.name,
            creditsQuantity: String(this.getCreditsToRequest(this.fileResponse?.fileLoaded?.accounts ? this.fileResponse?.fileLoaded?.accounts : []).length) ?? '',
            currency: this.sourceAccountSelected?.currency,
            totalCreditAmount: String(this.sumAmounts(this.fileResponse?.fileLoaded?.accounts ?? []) ?? 0)
          };
          console.log('parameters not: ', parameters);
          this.serviceNotify.achMassiveNotify(parameters).subscribe({
            next: (response) => {
              console.log('Notificación enviada correctamente', response);
            },
            error: (err) => {
              console.error('Error al enviar notificación', err);
            }
          });
        }
      }),
      catchError(error => of(this.utilsTransaction.handleErrorTransaction<IACHTransactionResponse>(error))),
    );
  }

  getCreditsToRequest(listAccounts: Array<ITMAchUniAchAccount>): ITMAchUniCreditTransaction[] {

    if(listAccounts.length > 0){
      return listAccounts.map((account: ITMAchUniAchAccount) => {
        const data = account.dataFromFile;
        return {
          bankCode: data.bankCode,
          product: data.product,
          currency: data.currency,
          accountNumber: data.accountNumber,
          amount: String(data.amount),
          description: data.description,
          lineNumber: data.lineNumber,
          serviceType: 'UNI',
          targetType: account.clientType,
          email: account.email
        };
      });
    }else{
      return [];
    }
  }

  buildPositionalFile(base64String: string, filename: string, mimeType: string): FormData {
    const formData = new FormData();

    // Convert the base64 string to a Blob
    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    // Append the Blob to the FormData object
    formData.append('uploadFile', blob, filename);
    formData.append('originalFilename', filename);

    return formData;
  };

  generateTMAchUniData(): string {
    const accounts: Array<ITMAchUniAchAccount> | undefined= this.fileResponse?.fileLoaded?.accounts;
    let data = '';

    if(accounts && accounts?.length > 0) {
      accounts.forEach((account: ITMAchUniAchAccount) => {

        const bankCode: string = this.fixZeros(account.dataFromFile.bankCode, 4, true, false);
        const productCode: string = this.fixZeros(account.dataFromFile.product, 2, true, false);
        const currency: string = this.fix(this.replaceInvalid(account.dataFromFile.currency), 3, false, false);
        const accountNumber: string = this.fix(account.dataFromFile.accountNumber, 17, false, false);
        const amount = this.fix(account.dataFromFile.amount, 13, true, true);
        const description = this.fix((!this.isEmpty(account.dataFromFile.description) ? account.dataFromFile.description : ''), 60, false, false);

        data += `${bankCode}${productCode}${currency}${accountNumber}${amount}${description}\r\n`;
      });
    }
    return data;
  }

  checkForBlanks(str: string): string {
    return (str === null || str.trim().length === 0) ? "0" : str;
  }

  isEmpty(str: string): boolean {
    return (str === undefined || str === null || str.trim().length === 0);
  }

  fixField(value: string, length: number, isNumber: boolean, decimals: boolean): string {
    if (isNumber) {
      let tmp = Number(value).toString();
      if (decimals) {
        const idx = tmp.indexOf(".");
        tmp = idx !== -1 ? tmp.substring(0, idx) + tmp.substring(idx + 1) : tmp;
      }
      const ZEROS = "00000000000000000000";
      return tmp.length > length ? tmp.substring(tmp.length - length) : ZEROS.substring(0, length - tmp.length) + tmp;
    } else {
      return value.length > length ? value.substring(0, length) : value + " ".repeat(length - value.length);
    }
  }

  fix(value: string, length: number, isNumber: boolean, decimals: boolean): string {
    let SPACES = "                                                                                                                                                                                           ";
    if (isNumber) {
      let tmp = this.formatNumber(Number(value));
      const idx = tmp.indexOf(".");
      if (decimals) tmp = tmp.substring(0, idx) + tmp.substring(idx + 1);
      else tmp = tmp.substring(0, idx);
      value = tmp;
      const ZEROS = "00000000000000000000";
      if (value.length > length) {
        return value.substring(value.length - length);
      } else return ZEROS.substring(0, length - value.length) + value;
    } else {
      if (value.length > length) {
        return value.substring(0, length);
      } else {
        return value + SPACES.substring(0, length - value.length);
      }
    }
  }

  fixZeros(value: string, length: number, isNumber: boolean, decimals: boolean): string {
    let SPACES = "                                                                                                                                                                                           ";
    if (isNumber) {
      let tmp = this.formatNumber(Number(value));
      const idx = tmp.indexOf(".");
      if (decimals) tmp = tmp.substring(0, idx) + tmp.substring(idx + 1);
      else tmp = tmp.substring(0, idx);
      value = tmp;
      const ZEROS = "00000000000000000000";
      if (value.length > length) {
        return value.substring(value.length - length);
      } else return ZEROS.substring(0, length - value.length) + value;
    } else {
      if (value.length > length) {
        return value.substring(0, length);
      } else {
        return value + SPACES.substring(0, length - value.length);
      }
    }
  }

  replaceInvalid(txt: string): string {
    txt = txt.replace("<E1>", "a");
    txt = txt.replace("<E9>", "e");
    txt = txt.replace("<ED>", "i");
    txt = txt.replace("<F3>", "o");
    txt = txt.replace("<FA>", "u");
    txt = txt.replace("<C1>", "A");
    txt = txt.replace("<C9>", "E");
    txt = txt.replace("<CD>", "I");
    txt = txt.replace("<D3>", "O");
    txt = txt.replace("<DA>", "U");
    txt = txt.replace("<D1>", "N");
    txt = txt.replace("<F1>", "n");
    return txt;
  }

  formatNumber(num: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 11,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    });

    return formatter.format(num);
  }

  getFileName(correlative: string): string{
    const formattedRef = this.fixField(correlative, 7, false, false);
    return `U${formattedRef}.txt`;
  }


  handleResponseTransaction(ttrRes: any) {
    if (ttrRes.status !== 200 && ttrRes.status !== 39) {
      this.showAlert('error', ttrRes.message);
      this.utils.hideLoader();
      this.utils.scrollToTop();
      return;
  }

    const response = ttrRes.data;
    const state = this.parameterManagement.getParameter(PROTECTED_PARAMETER_STATE);
    const resultToVoucher: ITMAchUniResponse = {
      responseCode: String(response.responseCode),
      errorMessage: response?.errorMessage ? response.errorMessage : '',
      reference: response.reference,
      date: this.formatDateToCustomString(new Date()),
      lotNumber: response.lotNumber,
    };

    this.parameterManagement.sendParameters({
      navigateStateParameters: {
        ...state,
        transactionResponse: resultToVoucher
      },
      navigationProtectedParameter: ETmAchUniProtectedNavigation.VOUCHER,
    });

    this.router.navigate([ETmAchUniUrlCollection.VOUCHER]).finally(() => this.utils.hideLoader());
  }

  formatDateToCustomString(date: Date): string {
    const pad = (num: number): string => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear().toString();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  }


  sumAmounts(accounts: any[]): string {
    let totalAmount: number = 0;
    for (const account of accounts) {
      totalAmount += Number(account.dataFromFile.amount);
    }
    return Number(totalAmount).toFixed(2);
  }

  padToSevenDigits(input: string): string {
    return input.padStart(7, '0');
  }


}
