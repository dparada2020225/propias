import { EInputType, MaskOptionsBuilder } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { EStokenBISVFlows, EStokenNavigationProtection, EStokenScreenNames } from '../../../enums/stkn-bisv.enum';
import { IUserDataStoken } from '../../../interfaces/stkn-bisv.interface';
import { StknBisvDevelService } from '../../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';
import { StknBisvHelpModalComponent } from '../../stkn-bisv-help-modal/stkn-bisv-help-modal.component';

@Component({
  selector: 'byte-stkn-bisv-token-approve',
  templateUrl: './stkn-bisv-token-approve.component.html',
  styleUrls: ['./stkn-bisv-token-approve.component.scss']
})
export class StknBisvTokenApproveComponent implements OnInit {

  placeHolder: string = '';
  inputToken!: FormControl;
  inputTokenForm!: FormGroup;
  userDataQR!: IUserDataStoken
  maxLengthToken: number = 6;
  hasError: boolean = false;
  stokenPreLogin: boolean = false;
  path: string = '';
  currentUserName: string = '';


  typeAlert!: string;
  messageAlert!: string;

  otpMaxLength: number = 6;
  otpMinLength: number = 6;

  maskToken = new MaskOptionsBuilder()
    .type(EInputType.TEXT)
    .mask({
      mask: /^\d{0,6}$/,
    })
    .build();

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private parameterManager: ParameterManagementService,
    private spinner: NgxSpinnerService,
    private stokenBisvUtils: StknBisvUtilsService,
    private utils: UtilService,
    private develService: StknBisvDevelService,
    private storage: StorageService

  ) {

    this.userDataQR = this.parameterManager.getParameter('userDataQR');
    const getStokenPreLogin = this.parameterManager.getParameter('stokenPreLogin');
    if (getStokenPreLogin) {
      this.stokenPreLogin = getStokenPreLogin.stokenPreLog;
    }

    this.buildInputTokenForm();

  }

  get controlForInputToken(): FormControl {
    return this.inputTokenForm.get('inputToken') as FormControl;
  }

  get inputHasMinLength(): boolean {
    let errorMinLength = this.inputTokenForm.controls['inputToken'].errors?.['minlength'];
    return errorMinLength;
  }


  ngOnInit(): void {

    this.getUserName();
    this.getPath();
    this.placeHolder = this.translate.instant('stoken-input');
    this.utils.hideLoader();

  }

  private getUserName() {
    this.currentUserName = this.stokenBisvUtils.getUserName();
  }

  openHIDModal() {
    this.modalService.open(StknBisvHelpModalComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} stoken-HelpModal`,
      size: `lg`,
    });
  }


  back() {
    this.resetStorage();
    this.stokenBisvUtils.logOut();
  }

  resetStorage() {
    this.parameterManager.sendParameters({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    });
  }

  onSubmit() {
    this.validateOTP();
  }

  /**
 * Validate the token OTP with validateOTPService, if the response is correct should call membershipAdd()
 * if validateOTPService response an error should call handleResError
 */

  private handlerValidateOTP() {
    const token = this.controlForInputToken.value;


    return this.stokenPreLogin
      ? this.develService.firstValidateTokenExposed(token, this.currentUserName)
      : this.develService.firstValidateToken(token);
  }


  private validateOTP() {

    if (!this.inputTokenForm.valid) {
      return this.inputTokenForm.markAllAsTouched();
    }

    this.showSpinner();

    const serviceForUseToValidateOTP = this.handlerValidateOTP();

    serviceForUseToValidateOTP
      .subscribe({
        next: (res) => this.activateAfiliation(),
        error: (error: HttpErrorResponse) => this.handleResError(error),

      });
  }

  /**
 * the membershipAdd method user membershipLogService to inserts the user's data in vitacora
 * if the membershipLogService response an error should call handleResError
 */


  activateAfiliation() {

    this.develService.stokenActivationOnAs()
      .subscribe({
        next: (res) => {
          console.log(res);
          if(this.path === EStokenBISVFlows.CHANGE_DEVICE){
            this.insertOnLogAfiliation();
          }else{
            this.handleResSuccessful();
          }
        },
        error: (error: HttpErrorResponse) => this.handleResError(error)
      })


  }

  insertOnLogAfiliation(){
    this.develService.insertOnAfiliationLog()
    .subscribe({
      next: () => this.handleResSuccessful(),
      error: (error: HttpErrorResponse) => this.handleResError(error)
    })

  }

  /**
* If the user is in preLogin (exposed flow) will navigate to confirmation screen.
* and if the user is not in preLogin (logged sucessfull) will navigate to confirmation screen
* depends the route identifier to know which flow it should take
*/

handleResSuccessful() {
  this.parameterManager.sendParameters({
    navigationProtectedParameter: EStokenNavigationProtection.CONFIRMATION
  });

  this.stokenBisvUtils.stokenRoutes(this.stokenPreLogin, this.path, EStokenScreenNames.CONFIRMATION);

}

  /**
   * Show an alert with the message error
   *  if the message does not exist should show errorDefault
   */

  handleResError(error: HttpErrorResponse) {
    let errorDefault = this.translate.instant('stoken-error-default');
    if(error.error.code === '852'){
      this.showAlert('error', this.translate.instant('stkn-bisv-error-invalid-token') ?? errorDefault);
    }else {
      this.showAlert('error', error?.error?.message ?? errorDefault);
    }

    this.hideSpinner();
  }

  /**
 * Create a form for inputTokenForm
 */

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

  hideSpinner() {
    this.spinner.hide("main-spinner")
      .catch(() => { });
  }

  showSpinner() {
    this.spinner.show("main-spinner")
      .catch(() => { });
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  get inputHasError(): boolean {
    let isRequired: boolean = this.inputTokenForm.controls['inputToken'].errors?.['required']
    return isRequired;
  }

  getPath() {
    const getStokenPreLogin = this.parameterManager.getParameter('pathToNavigate');
    this.path = getStokenPreLogin;
  }


}

