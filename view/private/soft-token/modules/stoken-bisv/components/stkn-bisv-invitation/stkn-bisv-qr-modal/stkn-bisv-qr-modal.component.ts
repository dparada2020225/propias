import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { EInvitationModal, EStokenBisvQrCodesDEVEL } from '../../../enums/stkn-bisv.enum';
import { StknBisvInvitationService } from '../../../services/stkn-bisv-invitation.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';

@Component({
  selector: 'byte-stkn-bisv-qr-modal',
  templateUrl: './stkn-bisv-qr-modal.component.html',
  styleUrls: ['./stkn-bisv-qr-modal.component.scss']
})
export class StknBisvQrModalComponent implements OnInit {

  qrCode: string | null = null;
  qrCodeError: boolean = false;
  @Input() allowCloseModal: boolean = true;
  typeAlert!: string;
  messageAlert!: string;
  textForReturnBtn: string = '';


  constructor(
    private activeModal: NgbActiveModal,
    private utilsStknBisvService: StknBisvUtilsService,
    private stokenBisvDevelServices: StknBisvDevelService,
    private invitationStknService: StknBisvInvitationService,
    private utils: UtilService,
    private parameterManagementService: ParameterManagementService
  ) { }


  ngOnInit(): void {
    this.textForReturnBtn = this.allowCloseModal ? 't.return' : 'stoken-logout';
    this.utils.showPulseLoader();
    this.handlerCreateUser();
  }

  close(close?: boolean) {
    if (!this.allowCloseModal) return;
    this.activeModal.close(close);
  }

  handlerCreateUser(){
    const typeToken = this.utilsStknBisvService.getTypeToken();
    if(typeToken === TypeTokenEnum.FISICO || typeToken === TypeTokenEnum.SMS){
      this.requestQrToService();
      return;
    }

    this.createUserInDevel();
  }

  createUserInDevel() {
    this.stokenBisvDevelServices.assignTokenType(false)
      .subscribe({
        next: res => {
          if (res.responseCode === '204') {
            this.requestQrToService();
          }
        },
        error: (error: HttpErrorResponse) => this.handlerError(error, 'error_asign')
      })
  }

  requestQrToService() {
    const clientType = this.utilsStknBisvService.getClientType();
    
    this.stokenBisvDevelServices.generateCodeQR(clientType)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (res) => {
          this.getSRCforIMG(res.responseMessage)
        },
        error: error => this.handlerError(error, 'error_qr')
      })
  }

  handlerError(error: HttpErrorResponse, optionalMessage: string) {
    const errorMessageOptional = this.optionalErrorMessage(optionalMessage);
    this.qrCodeError = true;
    this.showAlert('error', error?.error?.message ?? errorMessageOptional);
    this.utils.hidePulseLoader();

  }

  optionalErrorMessage(error: string): string {
    const errors = {
      'error_asign': 'error_creating_user_devel',
      'error_qr': 'error_getting_qr_devel'
    };

    return errors[error] ?? 'internal_server_error'
  }

  getSRCforIMG(code: string) {
    this.qrCodeError = false;
    this.qrCode = this.utilsStknBisvService.generateSRCfromBase64(code);
  }


  verifyIfQRHasBeenScann() {
    if(this.checkIfWarningModalQRIsAlreadyOpen()) return;

    this.utils.showPulseLoader();
    const clientType = this.utilsStknBisvService.getClientType();
    const userName = this.utilsStknBisvService.getUserName();
    this.stokenBisvDevelServices.validateStatusQR(userName, clientType)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: res => { },
        error: (error: HttpErrorResponse) => this.handlerErrorFromVerifyIfQRHasBeenScann(error)
      })

  }

  handlerErrorFromVerifyIfQRHasBeenScann(error: HttpErrorResponse) {

    if (error?.error?.code === EStokenBisvQrCodesDEVEL.QR_SYNCHRONIZED_SUCCESS) {
      this.next();
      return;
    }

    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_QR_WARNING, false)

  }


  next() {
    const hasGracePeriod = this.utilsStknBisvService.validateIfUserIsInGracePeriod();
    this.activeModal.close(close);
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_TOKEN, hasGracePeriod);
  }

  clickOnRetryMessage(retry: boolean) {

    if (!retry) return;

    this.ngOnInit();
  }

  handlerBack(){
    this.allowCloseModal
    ? this.back()
    : this.logOut();
  }

  logOut(){
    this.activeModal.close(close);
    this.utilsStknBisvService.logOut();
  }

  back() {
    const hasGracePeriod = this.utilsStknBisvService.validateIfUserIsInGracePeriod();
    this.activeModal.close(close);
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_INFORMATION, hasGracePeriod);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  private checkIfWarningModalQRIsAlreadyOpen() {
    return this.parameterManagementService?.getParameter('modalWarningQRAlreadyOpen');
  }

  
}
