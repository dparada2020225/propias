import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, Subscription } from "rxjs";
import { AccountDetail, Balance, Limits, LockDetails, Reservation } from "src/app/models/account-balance.modal";
import { OnResize } from "src/app/modules/shared/classes/on-risize";
import { ParameterManagementService } from "src/app/service/navegation-parameters/parameter-management.service";
import { AccountBalanceService } from "src/app/service/private/account-balance/account-balance.service";
import { BusinessNameService } from "src/app/service/shared/business-name.service";
import { ErrorMessageService } from "src/app/service/shared/error-message.service";
import { environment } from "src/environments/environment";
import { AverageBalanceComponent } from "../average-balance/average-balance.component";
import { ReservationDetailComponent } from "../reservation-detail/reservation-detail.component";
import { HttpErrorResponse } from '@angular/common/http';
import { statementsTitleByProduct } from '../../../modules/statements/interfaces/statements.interface';



/**
 * @author Fabian Serrano
 *
 * @date 24/03/21
 *
 */
export interface PeriodicElement {
  detail: string;
  value: number;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'byte-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent extends OnResize implements OnInit, OnDestroy {

  accountBalanceJson: any;
  accountDetailList!: AccountDetail[];
  balanceList!: Balance[];
  limitsList!: Limits[];
  reservationList!: Reservation[];
  currencySymbol!: string;
  reference!: string;
  business!: string;
  lastMovement!: string;
  entryType = 'DEBIT';
  product: string;
  service: string;
  messageError: any;
  show = false;
  errorMessage: any;
  accountNumber: string;
  account = new FormControl();
  today = new Date();
  title!: string;
  private serviceSubscription!: Subscription;

  reservation = {
    hours24: 'TYPE_24',
    hours48: 'TYPE_48',
    exteriorTwists: 'GIEX'
  };

  displayedColumnsReservation: string[] = ['detail', 'value'];
  dataSourceReservation = ELEMENT_DATA;

  displayedColumnsLockDetails: string[] = ['detail', 'value'];
  dataSourceLockDetails = ELEMENT_DATA;
  dataSourceLockDetailsWithoutTotal = ELEMENT_DATA;

  constructor(
    private accountBalanceService: AccountBalanceService,
    private activatedRouter: ActivatedRoute,
    private businessName: BusinessNameService,
    private config: NgbModalConfig,
    private error: ErrorMessageService,
    private location: Location,
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private parameterManagement: ParameterManagementService
  ) {
    super();


    this.accountNumber = this.businessName.accountNumber
    this.product = this.parameterManagement.getParameter('product')

    this.parameterManagement.getSharedParameter().subscribe((data: any) => {
      if (data?.account && data?.product) {
        this.accountNumber = data['account'];
        this.product = data['product'];
      }
    });

    this.title = statementsTitleByProduct[this.product] || this.product;

    this.service = this.parameterManagement.getMenuEquivalence(router) ?? '';
  }

  /**
   * Metodo el cual se encarga de desplegar el modal de saldos promedio en el cual envia el numero de cuenta haciendo uso del
   * metodo modal.componentInstance para mostrar el detalle del saldo promedio segun la cuenta que se encontraba seleccionada
   */
  open() {
    this.spinner.show();
    const theme = environment['profile'] || 'byte-theme';
    const modal = this.modalService.open(AverageBalanceComponent, {
      centered: true,
      windowClass: theme + ` custom-modal modal-average-balance`
    });

    modal.componentInstance.accountAverage = this.account.value;
  }

  /**
 * Metodo el cual se encarga de desplegar el modal de las reservaciones en el cual envia el numero de cuenta, el tipo de reserva
 * el cual puede ser (Giros del exterio, 24 horas o 48 horas), a de mas de alias de la cuenta que se encuentra seleccionada
 * haciendo uso del metodo modal.componentInstance para mostrar el detalle de las reservaciones segun los parametros enviados
 */
  openReservation(key: string, value: any) {
    const theme = environment['profile'] || 'byte-theme';
    if (value !== '0.00') {
      const modal = this.modalService.open(ReservationDetailComponent, {
        centered: true,
        windowClass: theme + ` custom-modal modal-account-balance`
      });
      modal.componentInstance.reservationType = this.reservation[key];
      modal.componentInstance.accountReservation = this.account.value;
      modal.componentInstance.aliasName = this.accountBalanceJson.accountDetail.accountName;
    }
  }

  ngOnInit(): void {
    if (!this.accountNumber && !this.product) {
      this.accountNumber = this.parameterManagement.getParameter('account');
      this.product = this.parameterManagement.getParameter('product');
    }

    this.service = this.parameterManagement.getMenuEquivalence(this.router) ?? '';
  }

  /**
   * Meto el cual se encarga de restructurar toda la data que se debe mostar en el balance de las Cuentas
   * en este metodo se encarga de obtener las palabras claves de las tablas asi como la data y lo valores de cada
   * seccion que se puede apreciar en la vista las cuales son: los detalles de la cuenta, los saldos,
   * las, reservas y los detalles de bloqueo.
   */
  restoreData(data) {
    this.accountBalanceJson = data;

    this.accountDetailList = new Array<AccountDetail>();
    this.balanceList = new Array<Balance>();
    this.limitsList = new Array<Limits>();
    this.reservationList = new Array<Reservation>();


    // --------------------------------------------------- Services ---------------------------------------------------

    const accountDetailResponse = this.accountBalanceJson['accountDetail'];
    const balanceResponse = this.accountBalanceJson['balance'];
    const limitsResponse = this.accountBalanceJson['limits'];
    const reservationResponse = this.accountBalanceJson['reservation'];
    const lockDetailsResponse = this.accountBalanceJson['lockDetails'];
    this.currencySymbol = this.accountBalanceJson['currencySymbol'];
    this.reference = this.accountBalanceJson['reference'];
    this.business = this.businessName.getBusiness(environment.profile);
    this.lastMovement = this.accountBalanceJson['lastMovement'];


    // --------------------------------------------------- Services ---------------------------------------------------

    this.getAccountDetail(accountDetailResponse);
    this.getBalanceResponse(balanceResponse);
    this.getLimitsResponse(limitsResponse);
    this.getReservationResponse(reservationResponse);
    this.getLockDetailsResponse(lockDetailsResponse);
  }


  getAccountDetail(accountDetailResponse: any) {
    if (!accountDetailResponse) { return; }

    for (const accountDetail in accountDetailResponse) {
      if (accountDetailResponse.hasOwnProperty(accountDetail)) {
        const detail: AccountDetail = new AccountDetail();

        detail.key = accountDetail;
        detail.value = accountDetailResponse[accountDetail];
        this.accountDetailList.push(detail);
      }
    }
  }

  getBalanceResponse(balanceResponse: any) {
    if (!balanceResponse) { return; }

    for (const balanceTemp in balanceResponse) {
      if (balanceResponse.hasOwnProperty(balanceTemp)) {
        const balance: Balance = new Balance();

        balance.key = balanceTemp;
        balance.value = balanceResponse[balanceTemp];
        this.balanceList.push(balance);
      }
    }
  }

  getLimitsResponse(limitsResponse: any) {
    if (!limitsResponse) { return; }

    for (const limitsTemp in limitsResponse) {
      if (limitsResponse.hasOwnProperty(limitsTemp)) {
        const limits: Limits = new Limits();

        limits.key = limitsTemp;
        limits.value = limitsResponse[limitsTemp];
        this.limitsList.push(limits);
      }
    }
  }

  getReservationResponse(reservationResponse: any) {
    if (!reservationResponse) { return; }

    for (const reservationTemp in reservationResponse) {
      if (reservationResponse.hasOwnProperty(reservationTemp)) {
        const reservation: Reservation = new Reservation();

        reservation.detail = reservationTemp;
        reservation.value = reservationResponse[reservationTemp];
        this.reservationList.push(reservation);
      }
    }

    this.dataSourceReservation = this.reservationList;
  }

  getLockDetailsResponse(lockDetailsResponse: any) {
    const lockDetailsList = new Array<LockDetails>();

    if (lockDetailsResponse) {
      for (const lockDetailsTemp in lockDetailsResponse) {
        if (lockDetailsResponse.hasOwnProperty(lockDetailsTemp)) {
          const lockDetails: LockDetails = new LockDetails();

          lockDetails.detail = lockDetailsTemp;
          lockDetails.value = lockDetailsResponse[lockDetailsTemp];
          lockDetailsList.push(lockDetails);
        }
      }
      this.dataSourceLockDetails = lockDetailsList;
      this.dataSourceLockDetailsWithoutTotal = this.dataSourceLockDetails.filter(p => p.detail.toLowerCase() !== 'total');
    } else {
      this.dataSourceLockDetails = [];
      this.dataSourceLockDetails.push({ detail: 'total', value: 0 });
      this.dataSourceLockDetailsWithoutTotal = [];
    }
  }

  /**
   * Metodo el cual se encarga de llenar el select de las cuentas que pertenecen a ese usuario
   */
  getAccount(event: any) {
    this.spinner.show('main-spinner');
    this.accountBalanceService.getAccountBalance(event)
      .pipe(finalize(() => this.spinner.hide('main-spinner')))
      .subscribe({
        next: (data: any) => {
          this.restoreData(data);
          this.show = true;
        },
        error: (err: HttpErrorResponse) => {
          this.show = false;
          this.messageError = err;
          this.errorMessage = this.error.getTranslateKey(err);
        }
      });
  }

  return() {
    this.location.back();
  }

  public ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
