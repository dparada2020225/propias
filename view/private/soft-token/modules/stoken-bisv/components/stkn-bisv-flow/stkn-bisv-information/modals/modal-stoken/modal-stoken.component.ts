import { MaskOptionsBuilder } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { ISettingData } from 'src/app/models/setting-interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { IGenerateQrSToken, IUserDataStoken } from '../../../../../interfaces/stkn-bisv.interface';
import { StknBisvDevelService } from '../../../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { ChangeDeviceService } from '../../../../../services/transaction/HID/change-device.service';
import { StknBisvUtilsService } from '../../../../../services/utils/stkn-bisv-utils.service';
import { TokenRequestSettingsService } from 'src/app/service/private/token/token-request-settings.service';

@Component({
  selector: 'byte-modal-stoken',
  templateUrl: './modal-stoken.component.html',
  styleUrls: ['./modal-stoken.component.scss']
})
export class ModalStokenComponent implements OnInit {

  /**
   * THIS MODAL IS ONLY USED WHEN THE USER IS NOT IN PRELOGIN (LOGGED SUCESSFULL)
   * AND FOR THE CHANGE-DEVICE FLOW
   */


  placeHolder: string = '';
  inputTokenForm!: FormGroup;
  maxLength!: number;
  minLength!: number;
  userDataQR!: IUserDataStoken;
  typeAlert!: string;
  messageAlert!: string;
  settingData!: ISettingData;
  regexImask = new MaskOptionsBuilder()
    .mask({ mask: /^(\d)*$/ })
    .build();

  get controlForInputToken(): FormControl {
    return this.inputTokenForm.get('inputToken') as FormControl;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private utils: UtilService,
    private fb: FormBuilder,
    private parameterManager: ParameterManagementService,
    private changeDeviceService: ChangeDeviceService,
    private storage: StorageService,
    private develBisvService: StknBisvDevelService,
    private stknBisvUtilsService: StknBisvUtilsService


  ) { }

  ngOnInit(): void {
    this.buildInputTokenForm();
  }

  close() {
    this.activeModal.close();
  }

    /**
   * If the type token is soft token will create the form
   * and obtain maxLength/minLength from storage
   */

  private buildInputTokenForm() {
    this.settingData = JSON.parse(this.storage.getItem('securityParameters'));


      this.maxLength = this.settingData.token['soft-token']?.max ?? 6;
      this.minLength = this.settingData.token['soft-token']?.min ?? 6;


      this.inputTokenForm = this.fb.group({
        inputToken: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLength),
            Validators.maxLength(this.maxLength)],
        ],
      });

  }

    /**
   * Verify if the form has errors
   * or if the form as invalid
   *
   */

  inputTokenError() {
    const error = this.inputTokenForm.controls['inputToken'].errors;

    if (error?.['required']) {
      return 'required';
    }

    if (error?.['minlength']) {
      return 'stoken-min-length'
    }

    if (error?.['maxlength']) {
      return 'stoken-max-length'
    }


    return 'Error';

  }

  get inputHasError() {
    return this.inputTokenForm.controls['inputToken']?.errors
  }

  /**
   * Verifiy if the form is valid.
   * If the form is valid will call validateToken()
   *
   */


  goTo() {

    if (!this.inputTokenForm.valid) {
      return this.inputTokenForm.markAllAsTouched();
    }

    this.validateToken();

  }

    /**
   * ValidateToken() will be called by goTo()
   * Returns code qr from change device service if the token is correct and the status response is 200
   * Show an alert if the token is incorrect and the status response is 498
   * Return an error if the change device service response has status different to 200 and 498
   */

  private validateToken() {
    this.utils.showPulseLoader();

    this.userDataQR = this.parameterManager.getParameter('userDataQR');
    const token = this.controlForInputToken.value;
    const typeToken = this.utils.getTokenType();

    
    const reqChangeDevice: IGenerateQrSToken = {
      inputCode: this.userDataQR?.code,
      username: this.userDataQR?.username,
      typeTokenValidation: typeToken
    }

    this.develBisvService.changeDeviceStoken( typeToken, token)
    //this.develBisvService.changeDeviceStoken(reqChangeDevice, token)
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (data) => {
          this.activeModal.close({
            status: 200,
            message: '',
            data: data,
            error: null
          })
        },
        error: (error: HttpErrorResponse) => {

          if (error.status === HttpStatusCode.INVALID_TOKEN) {
            this.showAlert('error', error?.error?.message ?? 'invalid_token')
            return;
          }

          this.activeModal.close({
            status: error?.status ?? 500,
            message: error?.error?.message ?? 'Internal_server_error',
            data: null,
            error
          })

        }
      })

  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


}
