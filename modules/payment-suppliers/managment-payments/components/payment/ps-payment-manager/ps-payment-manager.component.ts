import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAccount } from 'src/app/models/account.inteface';
import { UtilService } from 'src/app/service/common/util.service';
import { SpFormAttributes } from '../../../interfaces/ps-form.interface';
import { IGetDataSupplier, PSParticipant } from '../../../interfaces/ps-payment-home.interface';
import { AdfFormatService, AdfFormBuilderService, IDataSelect, ILayout, IPossibleValue, ITableStructure } from '@adf/components';
import { SPRoutes } from '../../../enums/ps-routes.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SpLoadSupplierTransactionService } from '../../../execution/sp-loadSupplier-transaction.service';
import { SppFormService } from '../../../definitions/payment/spp-form.service';
import { SPPTableService } from '../../../definitions/payment/spp-table.service';
import { IUserInfo } from 'src/app/models/user-info.interface';
import { ITMUploadUniTrfRequest } from 'src/app/modules/transfer/modules/transfer-ach-uni-multiple/interfaces/ach-uni-tm-transaction';
import { environment } from 'src/environments/environment';
import { PaymentOfSupplierRouteProtectedParameter } from '../../../enums/ps-protected-parameter.enum';
import { HandleTokenRequestService } from 'src/app/service/common/handle-token-request.service';
import { ModalTokenComponent } from 'src/app/view/private/token/modal-token/modal-token.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { catchError, concatMap, map, Observable, of, switchMap, tap } from 'rxjs';
import { UtilTransactionService } from 'src/app/service/common/util-transaction.service';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-ps-payment-manager',
  templateUrl: './ps-payment-manager.component.html',
  styleUrls: ['./ps-payment-manager.component.scss']
})
export class PsPaymentManagerComponent extends OnResize  {
  typeMessage = '';
  message = '';
  cuentaSeleccionada
  amount = ''
  paymentDetail!: IGetDataSupplier;
  formLayout!: ILayout;
  form!: FormGroup;
  formSelectOptions: Array<IDataSelect> = [];
  sourceAccountList: Array<IAccount> = [];
  tableLayout!: ITableStructure;
  sourceAccountSelected!: IAccount;

  constructor(
    private utils: UtilService,
    private serviceTransactions: SpLoadSupplierTransactionService,
    private formDefinitionService: SppFormService,
    private adfFormBuilder: AdfFormBuilderService,
    private activatedRoute: ActivatedRoute,
    private tableDefinition: SPPTableService,
    private parameterManager: ParameterManagementService,
    private router: Router,
    private adfFormatService: AdfFormatService,
    private cdr: ChangeDetectorRef,
    private handleTokenRequest: HandleTokenRequestService,
    private modalService: NgbModal,
    private utilTransaction: UtilTransactionService,
    private translate: TranslateService
  ) {
    super()
   }

  get customShow() {
    return this.message && this.typeMessage ? 'custom_show' : '';
  }
  get isTokenRequired() {
    return this.handleTokenRequest.isTokenRequired();
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() =>{
      this.launchView();
      this.getSourceAccountList();
        });
    this.getSuppliersDetail();
    this.getSourceAccountList();
  }

  getSourceAccountList() {
    const response = this.activatedRoute.snapshot.data['sourceAccounts'];
    if (response.hasOwnProperty('error')) {
      this.showAlert('error', response.error.message);
      return;
    }

    this.sourceAccountList = response;
  }

  getSuppliersDetail() {
    const idClient = this.parameterManager.getParameter('userInfo')?.customerCode;
    this.serviceTransactions.getSupplierToPayment(idClient)
      .subscribe({
        next: (res:IGetDataSupplier) => {
          if ( res) {
            this.paymentDetail = res;
            this.launchView();
          } else {

          const message = 'ps:label_no_ps';
          const type = 'info';

          this.utils.hideLoader()
          this.launchView();
          this.showAlert(type, message);
          }

        },
        error: (error: HttpErrorResponse) => {
          const message = error?.error?.code === '1' ? 'ps:label_no_ps' : error.message;
          const type = error?.error?.code === '1' ? 'info' : 'error';


          this.utils.hideLoader()

          this.launchView();
          this.showAlert(type, message);
        }
      })
  }

  launchView() {
    this.formDefinition();
    this.buildPaymentTable();
  }

  buildPaymentTable() {
    const parseList = this.parseDetailList()
    this.tableLayout = this.tableDefinition.buildTable(parseList ?? []);
    this.utils.hideLoader()

  }

  parseDetailList(){

    if ( this.paymentDetail?.details) {
      for ( const detail of this.paymentDetail?.details) {
        if (this.translate.currentLang === 'es') {
          if (detail.estadoCuenta === 'Inactive') {
            detail.estadoCuenta = 'Inactiva';
          }
          if (detail.estadoCuenta === 'Blocked') {
           detail.estadoCuenta = 'Bloqueada';
          }
          if (detail.estadoCuenta === 'Cancelled') {
            detail.estadoCuenta = 'Cancelada';
          }
          if (detail.estadoCuenta === 'Active') {
            detail.estadoCuenta = 'Activa';
          }

        } else if (this.translate.currentLang === 'en') {

          if (detail.estadoCuenta === 'Inactiva') {
            detail.estadoCuenta = 'Inactive';
          }
          if (detail.estadoCuenta === 'Bloqueada') {
            detail.estadoCuenta = 'Blocked';
          }
          if (detail.estadoCuenta === 'Cancelada') {
            detail.estadoCuenta = 'Cancelled';
          }
          if (detail.estadoCuenta === 'Activa') {
            detail.estadoCuenta = 'Active';
          }

        }
        const parseAmount = `${this.adfFormatService.formatAmount(detail.montoDestino)}`
          detail.montoDestino =  parseAmount
      }
      this.cdr.detectChanges();
      return this.paymentDetail?.details

    }

    return this.paymentDetail?.details
  }
  buildSelectOptions() {
    const options = this.selectFormatting(this.sourceAccountList);

    const fundationAccountOptions: IDataSelect = {
      controlName: SpFormAttributes.SOURCE_ACCOUNT,
      data: options
    };

    this.formSelectOptions = [...this.formSelectOptions, fundationAccountOptions];
  }

  genFileNameProvee(ref: any): string {
    const formattedRef = this.fixField(ref, 7, true, false);
    return `J${formattedRef}.txt`;
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
    }}
    formatNumber(num: number): string {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumIntegerDigits: 11,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      });
  
      const a = formatter.format(num);
      return formatter.format(num);
    }
    fix(value: string, length: number, isNumber: boolean, decimals: boolean): string {
      let SPACES = "                                                                                                                                                                                           ";
      if (isNumber) {
        value = value.replace(/,/g, '');
        let tmp = this.formatNumber(Number(value));
        const idx = tmp.indexOf(".");
        if (decimals) tmp = tmp.substring(0, idx) + tmp.substring(idx + 1);
        //else tmp = tmp.substring(0, idx);
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
    
    isEmpty(str: string): boolean {
      return (str === undefined || str === null || str.trim().length === 0);
    }

    generatePagProData(): string {
      let data = '';
      this.paymentDetail?.details.forEach((supplier) => {
        const supplierCode = this.fixField(this.replaceInvalid(supplier.cuentaDestino), 12, false, false);
        const amount = this.fix(supplier.montoDestino, 13, true, true);
        const email = this.fix((!this.isEmpty(supplier.correo ?? '') ? supplier.correo ?? '' : ''), 50, false, false);
        const detalle = this.fix((!this.isEmpty(supplier.detalle ?? '') ? supplier.detalle ?? '' : ''), 40, false, false);

        data += `${supplierCode}${amount}0${email}${detalle}\r\n`;
      });
      return data;
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
    createMultipartFileRequest(base64String: string, filename: string, mimeType: string): FormData {
      const formData = new FormData();

      const binaryString = window.atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });

      formData.append('uploadFile', blob, filename);
      formData.append('originalFilename', filename);

      return formData;
    }
    nextStep() {
      this.utils.showLoader();

      return this.serviceTransactions.generateCorrelative().pipe(
        switchMap((authorization) => {
          const fileName = this.genFileNameProvee(authorization.correlative);
          const fileData = this.generatePagProData();
          const mimeType = 'application/octet-stream';
          const formData = this.createMultipartFileRequest(btoa(fileData), fileName, mimeType);

          //console.log(fileData)
          const request: ITMUploadUniTrfRequest = { uploadFile: formData };
          return this.serviceTransactions.fileTransferFTP(request).pipe(
            map(() => authorization),
            catchError((error) => {
              this.showAlert('error', error);
              this.utils.hideLoader();
              return of(null);
            })
          );
        }),
        catchError(() => {
          this.utils.hideLoader();
          return of(null);
        })
      );
    }

    payLot(correlative: any): Observable<any> {
      const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');

      try {
        this.cuentaSeleccionada = this.sourceAccountList.find(
          cuenta => cuenta.account === this.form.get(SpFormAttributes.SOURCE_ACCOUNT)?.value
        );

        const header: any = {
          tipo: 2,
          cuentaOrigen: this.form.get(SpFormAttributes.SOURCE_ACCOUNT)?.value,
          debitos: this.paymentDetail?.details.length,
          montoOrigen: +this.amount,
          usuarioCreacion: userInfo.username,
          empresa: +userInfo.customerCode,
          fechaCreacion: new Date(),
          archivoFisico: this.genFileNameProvee(correlative),
          moneda: environment.currency,
          statusRegistro: 'I',
          status: 'I',
          codigoPlanilla: correlative,
          signatureType: userInfo.signatureType,
          aliasCuentaOrigen: this.cuentaSeleccionada?.alias,
          nombreCuentaOrigen: this.cuentaSeleccionada?.name,
          aplicaPlanillas: 'N',
          omitTransaction: "false"
        };

        const participantes: any[] = this.paymentDetail?.details.map((r, index) => (
          {
          tipo: 2,
          cuentaDestino: r.cuentaDestino,
          nombreCuenta: r.nombreCuenta,
          nombreCuentaReal: r.nombreCuenta,
          correo: r.correo,
          montoDestino: parseFloat(r.montoDestino.replace(/,/g, '')),
          detalle: r.detalle,
          statusCuenta: r.estadoCuenta,
          empresa: +userInfo.customerCode,
          codigoPlantilla: correlative,
          correlativo: index
        }
      )
      );

        header.detalles = participantes;
        return of(header);
      } catch (e) {
        this.utils.hideLoader();
        throw e;
      }
    }



  execute(){
    if (this.isTokenRequired) {
      this.openTokenModal();
      return;
    } else {
      this.executePayment()

    }
  }

  executePayment() {
    this.nextStep().pipe(
      concatMap((correlative) => {
        if (!correlative) {
          this.showAlert('error', 'No se pudo generar el archivo.');
          return of(null);
        }

        return this.payLot(correlative.correlative);
      }),
      concatMap((request) => {
        if (!request) {
          this.showAlert('error', 'No se pudo construir la solicitud del lote de pago.');
          return of(null);
        }

        return this.serviceTransactions.payLote(request);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          this.saveStorageForExecuteLoadFile(response);
          this.router.navigate([SPRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
        }
      },
      error: (error) => {
        if (error.error.errorCode === '039') {
          this.saveStorageForExecuteLoadFile(error.error);
          this.router.navigate([SPRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
        } else {
          this.showAlert('error', error?.error?.dateTime ?? '');
          this.utils.hideLoader();
        }
      }
    });
  }





  previous() {
    this.utils.showLoader();
    this.router.navigate([SPRoutes.HOME]).finally(() => this.utils.hideLoader())
  }

  selectFormatting(accountList: IAccount[]): IPossibleValue[] {
    if (accountList && accountList.length === 0) return [];

    return accountList.map((account) => {
      const accountTemp: IPossibleValue = {
        value: account.account,
        name: `${this.nameFormatting(account)}`,
      };
      return accountTemp;
    });
  }

  private nameFormatting(account: IAccount): string {
    const acronym = this.utils.getProductAcronym(account?.product)
    return `${acronym} - ${account?.account}`;
  }

  formDefinition() {
    const participants = this.paymentDetail?.details ?? []
    this.amount = String(participants.reduce((sum, account) => sum + account.montoDestino, 0).toFixed(2));
    const date = this.getDate(participants)

    this.formLayout = this.formDefinitionService.buildFormLayout({
      title: 'ps:title',
      credits: String(this.paymentDetail?.details.length),
      amount: this.amount,
      date
    });

    this.form = this.adfFormBuilder.formDefinition(this.formLayout.attributes);
    this.buildSelectOptions();
    this.changeForm();

  }

  private getDate(participants: PSParticipant[]): string {
    let date:string;
    if (participants.length > 0) {
      const allAccountsHaveSameDate = participants.every(account => account.fechaCreacion === this.paymentDetail.details[0].fechaCreacion);
      date = allAccountsHaveSameDate ? this.paymentDetail.details[0].fechaCreacion : this.utils.getDateWithoutHour();
    } else {
      date = '';
    }
    return date
  }

  changeForm() {
    this.form.get(SpFormAttributes.SOURCE_ACCOUNT)?.valueChanges.subscribe((value) => {
      this.sourceAccountSelected = this.sourceAccountList.find((account) => account.account === value) as IAccount;
      this.mangeChangeSourceAccountSelected(this.sourceAccountSelected)

    });
  }
  mangeChangeSourceAccountSelected(account: any) {

    this.sourceAccountSelected = account;
    this.formLayout.attributes.forEach((attribute) => {
      if (attribute.controlName === SpFormAttributes.SOURCE_ACCOUNT) {
        attribute.layoutSelect = account ? this.formDefinitionService.buildCreditAccountSelectAttributes(account) : [];
      }
    });
  }
  showAlert(type: string, message: string) {
    this.typeMessage = type;
    this.message = message;
  }

  saveStorageForExecuteLoadFile(response) {
    const state = this.parameterManager.getParameter('navigateStateParameters');
    this.parameterManager.sendParameters({
      navigateStateParameters: {
        ...state,
        paymentDetail: this.paymentDetail,
        response: response,
        cuentaSeleccionada: this.cuentaSeleccionada,
        amount: this.amount
      },
      navigationProtectedParameter: PaymentOfSupplierRouteProtectedParameter.PAYMENT_VOUCHER,
    })
  }

  //token

  openTokenModal() {
    this.utils.hideLoader()
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} sm-600`,
      size: 'lg',
    });


    modal.componentInstance.typeTransaction = 'AUTHENTICATION';
    modal.componentInstance.executeService = (token?: string) => this.executeTransaction(token);

    modal.dismissed.subscribe(() => {
      return;
    });

    (modal.result).then(
      (result) => {
        if (!result) return;
        this.handleResponseTransaction(result);
      },
      (error) => error);
  }

executeTransaction(token?: string) {
  this.utils.showPulseLoader();

  return this.nextStep().pipe(
    switchMap((fileName) => {
      if (!fileName) {
        this.utils.hidePulseLoader();
        this.showAlert('error', 'No se pudo generar el archivo de la transacción.');
        return of(null);
      }

      return this.payLot(fileName.correlative).pipe(
        switchMap((request) => {
          if (!request) {
            this.showAlert('error', 'No se pudo construir la solicitud del lote de pago.');
            return of(null);
          }

          return this.serviceTransactions.paymentWithToken(this.isTokenRequired, request, token as string);
        })
      );
    }),
    tap((response) => {
      this.utils.hidePulseLoader();

      if (response) {
        console.log('RESPONSE', response)
        this.saveStorageForExecuteLoadFile(response);
        this.router.navigate([SPRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
      } else if (response.reference === '039') {
        this.saveStorageForExecuteLoadFile(response);
        this.router.navigate([SPRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
      } else {
        this.showAlert('error', response?.error?.dateTime ?? '');
        this.utils.hideLoader();
      }
    }),
    catchError((error) => {
      if (error.error.errorCode === '039') {
        this.saveStorageForExecuteLoadFile(error.error);
        this.router.navigate([SPRoutes.VOUCHER_PAYMENT]).finally(() => this.utils.hideLoader());
      } else {
        this.utils.hidePulseLoader();
        return of(this.utilTransaction.handleErrorTransaction(error));
      }
      this.utils.hidePulseLoader();
      return of(this.utilTransaction.handleErrorTransaction(error));
    })
  );
}


  handleResponseTransaction(response: any) {
    if (+response?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
      this.utils.hideLoader();
      this.showAlert('error', response?.message ?? '');
      this.utils.scrollToTop();
      return;
    }

    }
}
