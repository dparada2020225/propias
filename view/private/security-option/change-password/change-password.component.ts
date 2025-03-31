import { ChangeLanguageService, EInputType, MaskOptionsBuilder } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { EProfile } from 'src/app/enums/profile.enum';
import { PasswordDefinition } from 'src/app/models/change-password-modal';
import { IModalTokenResponse } from 'src/app/models/token.interface';
import { IThirdTransactionFailedResponse } from 'src/app/modules/transfer/modules/transfer-third/interfaces/third-transfer-definition.interface';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { PasswordValidationService } from 'src/app/service/private/security-option/password-validation.service';
import { ChangePasswordService } from 'src/app/service/public/change-password.service';
import { ErrorMessageService } from 'src/app/service/shared/error-message.service';
import { environment } from 'src/environments/environment';
import { HttpStatusCode } from '../../../../enums/http-status-code.enum';
import { ERequestTypeTransaction } from '../../../../enums/transaction-header.enum';
import { PasswordResponse } from '../../../../models/password-response.interface';
import { ModalTokenComponent } from '../../token/modal-token/modal-token.component';
import { TextModalComponent } from '../text-modal/text-modal.component';

@Component({
  selector: 'byte-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm!: FormGroup;
  home: string = environment.home;
  profile: string = environment.profile;
  hnProfile: string = EProfile.HONDURAS;
  loading = false;
  url: string;
  userName: string;
  minLength: number = PasswordDefinition.minLength;
  maxLength: number = PasswordDefinition.maxLength;
  maxLengthSv: number = PasswordDefinition.maxLengthSv;
  blacklist: Array<string> = PasswordDefinition.blacklist;
  blacklistSv: Array<string> = PasswordDefinition.blacklistSv;
  resCode!: string;
  typeToken!: string;
  tokenRequired!: string;

  showAlert: boolean = false;
  typeAlert;
  messageAlert;

  maskPassword = new MaskOptionsBuilder()
    .type(EInputType.PASSWORD)
    .mask({
      mask: /^\S*$/,
    })
    .build();

  passwordResponseList: PasswordResponse[] = [];
  hasError: boolean = false;
  serviceSubscriber!: Subscription;
  typePassword: EInputType = EInputType.PASSWORD;

  get oldPasswordControl() {
    return this.changePasswordForm.controls['OldPassword'] as FormControl;
  }

  get newPasswordControl() {
    return this.changePasswordForm.controls['NewPassword'] as FormControl;
  }

  get duplicatePasswordControl() {
    return this.changePasswordForm.controls['duplicatePassword'] as FormControl;
  }

  constructor(
    private changePasswordService: ChangePasswordService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private storage: StorageService,
    private passwordValidationService: PasswordValidationService,
    private modalService: NgbModal,
    private error: ErrorMessageService,
    private changeLanguageService: ChangeLanguageService,
    private styleManagement: StyleManagementService,
    private parameterManager: ParameterManagementService
  ) {
    this.url = this.router.url;

    this.userName = this.storage.getItem('currentUser');
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.typeToken = this.parameterManager.getParameter('typeToken');
    this.tokenRequired = this.parameterManager.getParameter('requiredToken');

    this.changePasswordForm = new FormGroup({
      OldPassword: new FormControl(null, [Validators.required]), // Se elimina el minLeght y solo será para SV a solicitud Post Prod PA. 21/03/2022
      NewPassword: new FormControl(null, [Validators.required]), // Se elimina el minLeght y solo será para SV a solicitud Post Prod PA. 21/03/2022
      duplicatePassword: new FormControl(null, [Validators.required]),
    });

    if (this.profile === EProfile.SALVADOR) {
      this.changePasswordForm.get('OldPassword')?.setValidators(Validators.minLength(this.minLength));
    }

    this.changePasswordForm.get('NewPassword')?.setValidators(Validators.minLength(this.minLength));

    this.serviceSubscriber = this.changeLanguageService.getCodeLanguage().subscribe((language) => {
      this.validationPasswordSv(language);
    });
  }

  ngOnDestroy(): void {
    this.serviceSubscriber.unsubscribe();
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }

  openModal() {
    const theme = environment['profile'] || 'byte-theme';
    this.modalService.open(TextModalComponent, { centered: true, windowClass: theme + ' text-modal-two', size: 'lg' });
  }

  changePass(tokenValue?: string) {
    this.loading = true;
    this.spinner.show();
    const oldPassword = this.changePasswordForm.controls['OldPassword'].value;
    const newPassword = this.changePasswordForm.controls['NewPassword'].value;
    const serviceResponse = new Subject();
    const obs = serviceResponse.asObservable();

    this.changePasswordService.sendNewPassword(this.userName, oldPassword, newPassword, tokenValue).subscribe({
      next: (data) => {
        this.spinner.hide();
        serviceResponse.next({
          status: 200,
          data,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.spinner.hide();
        if (((error?.error && error?.error?.status) || (error && error?.status)) === HttpStatusCode.INVALID_TOKEN) {
          serviceResponse.next({
            status: HttpStatusCode.INVALID_TOKEN,
            message: error?.error?.message,
            error: error?.error,
          } as IThirdTransactionFailedResponse);
          return;
        }
        this.setAlert('error', error?.error?.message);

        serviceResponse.next({
          status: error?.error?.code ?? error?.status,
          data: null,
          message: error?.error?.message,
        });
      },
    });
    return obs;
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.CHANGE_PASSWORD;
    modal.componentInstance.executeService = this.changePass.bind(this);

    modal.dismissed.subscribe((a) => {
      return;
    });

    (modal.result as Promise<IModalTokenResponse | null>)
      .then((result: any) => {
        if (!result) {
          return;
        }

        this.handleSetPasswordResponse(result);
      })
      .catch((error) => error);
  }

  getTokenType() {
    const currentToken = this.storage.getItem('currentToken'); // Recupera Tipo de Token del Storage

    if (!currentToken) return this.typeToken; // Si no fue posible recuperarlo es debido a que no ha hecho login, por tanto se recupera del routing.
    return JSON.parse(currentToken)['typeToken'];
  }

  handleValidateErrorsInInputPassword() {
    const oldPassword = this.changePasswordForm.controls['OldPassword'].value;
    const newPassword = this.changePasswordForm.controls['NewPassword'].value;
    const duplicatePassword = this.changePasswordForm.controls['duplicatePassword'].value;

    if (newPassword === oldPassword) {
      this.changePasswordForm.controls['NewPassword'].setErrors({ doNotDuplicate: true });
    }

    if (newPassword !== duplicatePassword) {
      this.changePasswordForm.controls['duplicatePassword'].setErrors({ doNotMatch: true });
    }

    if (this.profile === EProfile.SALVADOR) {
      this.blacklistValidationOldPasswordSV();
      this.blacklistValidationSv();
    } else {
      this.blacklistValidation();
    }
  }

  handleSetPasswordResponse(result: any) {
    if (result?.status !== 200) {
      this.spinner.hide();
      this.resCode = result?.status;
      //const err = result?.message ?? this.error.getTranslateKey(result?.error);
      let err = ''
      if(result?.status === '856'){
        err = this.translate.instant('stkn-bisv-error-invalid-token');
      }else {
        err = result?.message ?? this.error.getTranslateKey(result?.error);
      }
      this.setAlert('error', err);
      return;
    }

    this.setAlert('success', 'so_update_pass_success');
    const newUrl = this.url.split('?');
    if (newUrl[0] && newUrl[0] === '/change-password') {
      setTimeout(() => {
        this.spinner.show();
        this.storage.removeItem('userPreLoggedIn');
        this.spinner.hide();
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  handleOpenTokenModal(isTokenRequired: any) {
    if (this.profile === EProfile.SALVADOR && (isTokenRequired === 'true' || isTokenRequired === true)) {
      this.openTokenModal();
    } else {
      this.changePass().subscribe({
        next: (response) => this.handleSetPasswordResponse(response),
      });
    }
  }

  sendPassword() {
    const isRequiredToken = this.parameterManager.getParameter('isTokenRequired');
    const isTokenRequired = isRequiredToken ? isRequiredToken : this.tokenRequired;

    if (this.changePasswordForm.valid) {
      this.handleValidateErrorsInInputPassword();
    }

    if (this.changePasswordForm.valid) {
      this.handleOpenTokenModal(isTokenRequired);
    } else {
      this.changePasswordForm.markAllAsTouched();
    }

  }

  progressBar(): string {
    return this.passwordValidationService.validation(this.changePasswordForm.controls['NewPassword'].value);
  }

  validationPasswordSv(languaje?: string): void {
    this.blacklistValidationSv();

    this.passwordResponseList = this.passwordValidationService.validationPasswordSv(
      this.changePasswordForm.controls['NewPassword'].value,
      languaje
    );
    let count: number = 0;
    for (const resp of this.passwordResponseList) {
      if (resp.isValid) {
        count++;
      }
    }

    if (count === 6) {
      this.hasError = false;
    } else {
      this.hasError = true;
    }
  }

  errorToShow(error): string {
    if (error.characterNotAllowed) {
      return 'sp_character_not_allowed';
    } else if (error.securityPoints) {
      return 'not_security_points';
    } else if (error.minlength) {
      return this.translate.instant('sp.minlength', { minlength: this.minLength });
    } else if (error.doNotMatch) {
      return 'sp.password-not-match';
    } else if (error.doNotDuplicate) {
      return 'sp.do_not_duplicate';
    }
    return 'unknown';
  }

  blacklistValidation() {
    let newPassword = this.changePasswordForm.controls['NewPassword'].value;

    if (newPassword && this.blacklist && this.blacklist.length > 0) {
      for (const exception of this.blacklist) {
        if (newPassword.includes(exception)) {
          this.changePasswordForm.controls['NewPassword'].setErrors({ characterNotAllowed: true });
          break;
        }
      }
    }
  }

  blacklistValidationOldPasswordSV() {
    let oldPassword = this.changePasswordForm.controls['OldPassword'].value;
    if (oldPassword && this.blacklistSv && this.blacklistSv.length > 0) {
      for (const exception of this.blacklistSv) {
        if (oldPassword.includes(exception)) {
          this.changePasswordForm.controls['OldPassword'].setErrors({ characterNotAllowed: true });
          break;
        }
      }
    }
  }

  blacklistValidationSv() {
    let newPassword = this.changePasswordForm.controls['NewPassword'].value;

    if (!this.passwordValidationService.passwordEvaluationSv(newPassword)) {
      this.changePasswordForm.controls['NewPassword'].setErrors({ securityPoints: true });
      return;
    }

    if (newPassword && this.blacklistSv && this.blacklistSv.length > 0) {
      for (const exception of this.blacklistSv) {
        if (newPassword.includes(exception)) {
          this.changePasswordForm.controls['NewPassword'].setErrors({ characterNotAllowed: true });
          break;
        }
      }
    }
  }

  return() {
    this.storage.removeItem('userPreLoggedIn');
    // redirect to home if already logged
    if (this.authenticationService.currentTokenValue) {
      this.router.navigate(['/routing-security-option']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  setAlert(type: string, error: string) {
    this.showAlert = true;
    this.typeAlert = type;
    this.messageAlert = error;
  }
}
