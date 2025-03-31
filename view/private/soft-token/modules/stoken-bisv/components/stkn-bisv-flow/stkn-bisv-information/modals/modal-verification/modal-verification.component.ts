import { MaskOptionsBuilder } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { EProfile } from 'src/app/enums/profile.enum';
import { Profile } from 'src/app/models/security-option-modal';
import { ISettingData } from 'src/app/models/setting-interface';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SecurityOptionStokenService } from 'src/app/view/private/soft-token/modules/stoken-bisv/services/transaction/security-option-stoken.service';
import { environment } from 'src/environments/environment';
import { ESTokenSettingsProperty, ETypeToken } from '../../../../../enums/stkn-bisv.enum';
import { IAssignStknBisvResponse } from '../../../../../interfaces/stkn-bisv-devel.interface';
import { IGenerateQrSToken, IUserDataStoken } from '../../../../../interfaces/stkn-bisv.interface';
import { StknBisvDevelService } from '../../../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../../../services/utils/stkn-bisv-utils.service';


@Component({
  selector: 'byte-modal-verification',
  templateUrl: './modal-verification.component.html',
  styleUrls: ['./modal-verification.component.scss']
})
export class ModalVerificationComponent implements OnInit {

/**
* THIS MODAL IS ONLY USED WHEN THE USER IS IN PRELOGIN (EXPOSED FLOW)
*/


  typeAlert!: string;
  messageAlert!: string;
  inputTokenForm!: FormGroup;
  settingData!: ISettingData;
  minLength!: number;
  maxLength!: number;
  profile!: Profile;
  featureFlagStokenNewUser: boolean = true;

  maskToken = new MaskOptionsBuilder()
    .mask({
      mask: /^\w{0,10}$/
    })
    .build();


  get controlForInputToken(): FormControl {
    return this.inputTokenForm.get('inputToken') as FormControl;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private storage: StorageService,
    private utils: UtilService,
    private fb: FormBuilder,
    private parametersService: ParameterManagementService,
    private securityOptionStokenService: SecurityOptionStokenService,
    private findServiceCode: FindServiceCodeService,
    private develServices: StknBisvDevelService,
    private stknBisvUtilsService: StknBisvUtilsService
  ) {
    let isBisv = environment.profile === EProfile.SALVADOR;
    this.featureFlagStokenNewUser = this.findServiceCode.validateCustomFeature(ESTokenSettingsProperty.STOKEN_NEW_USER, isBisv);
  }

  ngOnInit(): void {
    this.buildInputTokenForm();
    this.getData();

  }

  getData() {
    this.profile = this.parametersService.getParameter('profile');
    this.generateToken();
  }

  close() {
    this.activeModal.close();
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

    this.utils.showPulseLoader();
    this.validateToken();

  }

  /**
* Obtain the type token and create the form
* and obtain maxLength/minLength from storage
*/


  private buildInputTokenForm() {
    this.settingData = JSON.parse(this.storage.getItem('securityParameters'));
    const typeToken = this.utils.getTokenType();


    if (typeToken === ETypeToken.TYPE_EMPTY || typeToken === ETypeToken.TYPE_NULL || typeToken === ETypeToken.TYPE_UNDEFINED || typeToken === ETypeToken.TYPE_STOKEN || (typeToken === ETypeToken.TYPE_NEW_USER_STOKEN && this.featureFlagStokenNewUser)) {
      this.maxLength = 10;
      this.minLength = 4;

      this.inputTokenForm = this.fb.group({
        inputToken: [
          '',
          [
            Validators.required,
            Validators.minLength(this.minLength),
            Validators.maxLength(this.maxLength)],
        ],
      });

      return;
    }

    if (typeToken === ETypeToken.TYPE_SMS) {
      this.maxLength = this.settingData.token.sms.max;

      this.inputTokenForm = this.fb.group({
        inputToken: [
          '',
          [
            Validators.required,
            Validators.minLength(this.settingData.token.sms.min),
            Validators.maxLength(this.settingData.token.sms.max)],
        ],
      });

      return;
    }

    if (typeToken === ETypeToken.TYPE_F) {
      this.maxLength = this.settingData.token.physical.max
      this.inputTokenForm = this.fb.group({
        inputToken: [
          '',
          [
            Validators.required,
            Validators.minLength(this.settingData.token.physical.min),
            Validators.maxLength(this.settingData.token.physical.max)],
        ],
      });

    }

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

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }


  /**
 * Generate a verification code and send to user phone number
 */


  generateToken() {
    this.securityOptionStokenService.sendAffiliationCodeExpose(this.profile.phone ?? '', this.profile.codeOperator ?? '', this.profile.codeArea ?? '', this.profile.email ?? '')
      .subscribe({
        next: (data) => { },
        error: (error) => {
          this.showAlert('error', error.error.message ?? 'Internal_server_error')
        }
      })
  }

  /**
* Only called by the goTo().
* This method generate code QR from the generateQR Exposed service if the response status is 200.
* Should show an alert in the modal if is a invalid token and the response status is 498
* Should show an alert in the screen if generateQR Exposed service response status diferent to 200 or 498
*
* @returns observable type IGenerateChangeQr
*/


  validateToken() {
    const token = this.controlForInputToken.value;
    const userDataQR: IUserDataStoken = this.parametersService.getParameter('userDataQR');
    const typeToken = this.getTypeToke();
    const typeClient = this.stknBisvUtilsService.getClientType();
    const username = this.stknBisvUtilsService.getUserName();//validar con el valor de userDataQR
    const reqGenerateQR: IGenerateQrSToken = {
      inputCode: userDataQR?.code,
      username: userDataQR?.username,
      typeTokenValidation: typeToken
    }

    this.develServices.assignTokenTypeExposed(username,typeToken, typeClient, this.profile.codeArea )
      .pipe(finalize(() => this.utils.hidePulseLoader()))
      .subscribe({
        next: (data) => {

          const res: IAssignStknBisvResponse = {
            status: 200,
            message: data?.responseMessage ?? '',
            responseCode: data.responseCode,
            error: null
          }
          this.activeModal.close(res)
        },
        error: (error: HttpErrorResponse) => {

          if (error.status === HttpStatusCode.INVALID_TOKEN) {
            this.showAlert('error', error.error.message)
            return;
          }

          const errorRes: IAssignStknBisvResponse = {
            status: error?.status ?? 500,
            message: error?.error?.message ?? 'Internal_server_error',
            responseCode: '',
            error: error?.error
          }

          this.activeModal.close(errorRes);

        }
      })
  }

  onSubmit() {
    this.goTo();
  }

  /**
 * Obtain and validate typeToken from storage and return the type to validate
 * @returns typeToken
 */


  getTypeToke() {
    const typeToken = this.parametersService.getParameter("typeToken");

    if (typeToken === ETypeToken.TYPE_EMPTY || typeToken === ETypeToken.TYPE_NULL || typeToken === ETypeToken.TYPE_UNDEFINED) {
      return ETypeToken.TYPE_VALIDATE;
    }

    return typeToken;
  }



}