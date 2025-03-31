import { EInputType, MaskOptionsBuilder } from '@adf/components';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { EInvitationModal } from '../../../enums/stkn-bisv.enum';
import { StknBisvInvitationService } from '../../../services/stkn-bisv-invitation.service';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'byte-stkn-bisv-validate-modal',
  templateUrl: './stkn-bisv-validate-modal.component.html',
  styleUrls: ['./stkn-bisv-validate-modal.component.scss']
})
export class StknBisvValidateModalComponent implements OnInit {

  inputToken!: FormControl;
  inputTokenForm!: FormGroup;
  doNothingVariable: boolean = false;
  @Input() allowCloseModal: boolean = true;
  textForReturnBtn: string = '';
  typeAlert!: string;
  messageAlert!: string;



  otpMaxLength: number = 6;
  otpMinLength: number = 6;

  get controlForInputToken(): FormControl {
    return this.inputTokenForm.get('inputToken') as FormControl;
  };

  get inputHasError(): boolean {
    let isRequired: boolean = this.inputTokenForm.controls['inputToken'].errors?.['required']
    return isRequired;
  }

  get inputHasMinLength(): boolean {
    let errorMinLength = this.inputTokenForm.controls['inputToken'].errors?.['minlength'];
    return errorMinLength;
  }

  maskToken = new MaskOptionsBuilder()
  .type(EInputType.TEXT)
  .mask({
    mask: /^\d{0,6}$/,
  })
  .build();

  constructor(
    private activeModal: NgbActiveModal,
    private invitationStknService : StknBisvInvitationService,
    private utilsStknBisvService: StknBisvUtilsService,
    private stokenBisvDevelServices: StknBisvDevelService,
    private utils: UtilService,
    private translateService: TranslateService,
    private router: Router


  ) { }


  ngOnInit(): void {
    //this.textForReturnBtn = this.allowCloseModal ? 't.return' : 'stoken-logout';
    this.buildInputTokenForm();
  }

  private buildInputTokenForm() {
    this.inputTokenForm = new FormGroup({
      inputToken: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(this.otpMinLength),
          Validators.maxLength(this.otpMaxLength)
        ],
      }),
    });
  }

  close(close?: boolean) {
    if(!this.allowCloseModal) return;
    this.activeModal.close(close);
  }

  next(){
    const isValidForm = this.validateTokenInput();

    if (!isValidForm.valid) return;

    this.utils.showPulseLoader();
    this.validateOTP(isValidForm.value);
  }

  private validateTokenInput() {

    const tokenInputControl = this.inputTokenForm.controls['inputToken']

    if (!tokenInputControl.touched || tokenInputControl.status === 'INVALID') {
      tokenInputControl.markAsTouched();
      return { valid: false, value: null };
    }

    return { valid: true, value: tokenInputControl.value };
  }

  private validateOTP(otpValue: string) {

    this.stokenBisvDevelServices.firstValidateToken(otpValue)
      .subscribe({
        next: res => this.updateStatusMembership(),
        error: (error: HttpErrorResponse) => this.handlerErrorAlert(error)
      })

  }

  private updateStatusMembership(){

    this.stokenBisvDevelServices.stokenActivationOnAs()
    .subscribe({
      next: res => this.insertOnLogAfiliation(),
      error: (error: HttpErrorResponse) => this.handlerErrorAlert(error)
    })
  }

    private insertOnLogAfiliation(){
    this.stokenBisvDevelServices.insertOnAfiliationLog()
    .pipe(finalize(() => this.utils.hidePulseLoader()))
    .subscribe({
      next: () =>{
        this.activeModal.close();
        this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_CONFIRMATION, false);
      },
      error: (error: HttpErrorResponse) => this.handlerErrorAlert(error)
    })

  }
  
  handlerErrorAlert(error: HttpErrorResponse) {
    this.utils.hidePulseLoader();
    if(error.error.code === '852'){
      this.showAlert('error', this.translateService.instant('stkn-bisv-error-invalid-token') ?? 'internal_server_error');
    }else {
      this.showAlert('error', error?.error?.message ?? 'internal_server_error');
    }
   
  }

  openHelpModal(){
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_TOKEN_HELP, true);
  }

  doNothing(){
    this.doNothingVariable = !this.doNothingVariable;
  }

  handlerBack(){
    this.allowCloseModal
    ? this.back()
    : this.logOut();
  }

  handlerBackLogout(){
   this.logOut();
  }

  handlerBackHome(){
  this.backHome()

  }

  logOut(){
    this.activeModal.close(close);
    this.utilsStknBisvService.logOut();
  }

  back(){
    const hasGracePeriod = this.utilsStknBisvService.validateIfUserIsInGracePeriod();
    this.activeModal.close(close);
    this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_QR, hasGracePeriod);
  }

  backHome(){
    const hasGracePeriod = this.utilsStknBisvService.validateIfUserIsInGracePeriod();
    this.activeModal.close(close);
    this.router.navigate(['/home'])
    //this.invitationStknService.handlerOpenModal(EInvitationModal.MODAL_QR, hasGracePeriod);
  }
  

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
