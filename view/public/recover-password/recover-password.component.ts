import { EInputType, MaskOptionsBuilder } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { HttpStatusCode } from 'src/app/enums/http-status-code.enum';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { StepService } from 'src/app/service/private/step.service';
import { PasswordRecoveryService } from 'src/app/service/public/password-recovery.service';
import { environment } from '../../../../environments/environment';
import { ISettingData } from '../../../models/setting-interface';
import { ModalTokenComponent } from '../../private/token/modal-token/modal-token.component';
import { ItokenInfo } from './user-model';

class SmsResponse {
  phone!: string;
}

class MailResponse {
  email!: string;
}
@Component({
  selector: 'byte-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent extends OnResize implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  returnUrl!: string;
  error = '';
  showAlert = false;
  messageAlert!: string;
  showButton = true;
  typeRecover!: string;
  passwordChangeResponse: any;
  smsResponse!: SmsResponse;
  mailResponse!: MailResponse;
  showText = true;
  profile = environment['profile'];
  typeUsername: EInputType = EInputType.TEXT;
  phoneNumber: string;
  settingStorage: ISettingData;
  typeAlert: string | undefined;
  username: string | null = null;
  responseService: ItokenInfo | null = null;
  typeConsult: string | null = null;

  get formUserName() {
    return this.loginForm.controls['username'] as FormControl;
  }

  mask = new MaskOptionsBuilder()
    .mask({
      mask: /^\w+$/,
      prepare: function (str) {
        return str.toUpperCase();
      },
    })
    .build();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private passwordRecoveryService: PasswordRecoveryService,
    private storage: StorageService,
    private styleManagement: StyleManagementService,
    private modalService: NgbModal,
    private stepService: StepService,
    private spinner: NgxSpinnerService,
    private managementMethod: FeatureManagerService
  ) {
    super();
    this.settingStorage = JSON.parse(this.storage.getItem('securityParameters'));
    this.phoneNumber = this.settingStorage.contactsInfo.phone;
    // redirect to home if already logged
    if (this.authenticationService.currentTokenValue) {
      this.router.navigate(['/routing-security-option']).then(() => {});
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    const attReturnUrl = 'returnUrl';
    this.returnUrl = this.route.snapshot.queryParams[attReturnUrl] || '/';
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }

  reverse() {
    this.router.navigate(['/login']).then(() => {});
  }

  recoverPassword(type: string) {
    this.typeConsult = type;
    this.typeRecover = type;
    this.username = this.loginForm.controls['username'].value;

    if (this.loginForm.controls?.['username'].errors?.['required'] ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.managementMethod.implementMethod()) {
      this.passwordRecoveryService.getInfoTokenUser(this.username!).subscribe({
        next: (data: ItokenInfo) => {
          let tokenRequireDes: string = `${this.stepService.s(data.tokenRequired)}`;
          let tokenTypeDes: string = `${this.stepService.s(data.tokenType)}`;
          this.responseService = { tokenRequired: tokenRequireDes, tokenType: tokenTypeDes };

          if (this.responseService.tokenRequired === 'true') {
            this.openTokenModal(this.responseService, type);
            this.hiddenAlert();
          } else {
            this.executeRecoverPassword(this.username!);
          }
        },
        error: (error) => {
          let message = error.error.message;
          error.message = message.substring(message.indexOf(':') + 1, message.length);

          if (error.status != 404) {
            this.loginForm
              .get('username')!
              .setErrors({ customError: message });
          } else {
            this.loginForm.get('username')!.setErrors({ unregisteredUser: message });
          }
        },
      });
    }else{
      this.hiddenAlert();
      this.evaluateExecute();
    }
  }

  openTokenModal(typeToken: ItokenInfo, typeConsult: string) {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    this.hiddenSpinner();

    modal.componentInstance.user = this.username;
    modal.componentInstance.tokenType = typeToken.tokenType;
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.CHANGE_PASSWORD;
    modal.componentInstance.executeService = this.executeRecoverPassword.bind(this);
    modal.dismissed.subscribe(() => {
      return;
    });

    modal.result
      .then((result) => {
        if (!result) {
          return;
        }

        this.evaluateMethod(typeConsult, result);
      })
      .catch((error) => {
        String(error);
      });
  }

  evaluateMethod(typeRecover: string, result: any) {
    if (this.typeRecover === 'mobile') {
      this.executeMobile(result);
      return;
    }
    this.executeEmail(result);
  }

  evaluateExecute() {
    if (this.typeRecover === 'mobile') {
      this.handleRecoverPasswordBySMS();
      return;
    }
    this.handleRecoverPasswordByEmail();
  }

  executeMobile(result: any) {
    this.showText = false;
    this.smsResponse = result;
    this.showButton = false;

    if (this.managementMethod.implementMethod()) {
      console.log(this.responseService?.tokenRequired);

      if (this.responseService?.tokenRequired === 'true' && result.status) {
        if (result?.status === HttpStatusCode.INVALID_TOKEN) {
          return;
        }

        if (result?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
          let message = result.message;
          result.message = message.substring(message.indexOf(':') + 1, message.length);
          this.loginForm.get('username')!.setErrors({ customError: result?.message });
          return;
        }
      }
    }

    for (let i = 0; i < this.smsResponse.phone.length; i++) {
      if (i <= 3) {
        this.passwordChangeResponse = '****';
      } else {
        this.passwordChangeResponse = this.passwordChangeResponse + this.smsResponse.phone.charAt(i);
      }
    }
  }

  executeEmail(result: any) {
    this.mailResponse = result;
    this.showButton = false;
    this.showText = false;

    if (this.managementMethod.implementMethod()) {
      if (this.responseService?.tokenRequired === 'true' && result.status) {
        if (result?.status === HttpStatusCode.INVALID_TOKEN) {
          return;
        }

        if (result?.status !== HttpStatusCode.SUCCESS_TRANSACTION) {
          this.loginForm.get('username')!.setErrors({ customError: result?.message });
          return;
        }
      }
    }

    const email = this.mailResponse.email;
    const atIndex = email.indexOf('@');
    const atPart = email.substring(atIndex);
    const hiddenPart = email.substring(0, 2).padEnd(email.length - atPart.length, '*');
    this.passwordChangeResponse = `${hiddenPart}${atPart}`;
  }

  executeRecoverPassword(tokenValue?: string) {
    const serviceResponse = new Subject();
    const obs = serviceResponse.asObservable();

    this.showSpinner();

    if (this.typeConsult === 'mobile') {
      this.handleRecoverPasswordBySMS(serviceResponse, tokenValue as string);
    } else {
      this.handleRecoverPasswordByEmail(serviceResponse, tokenValue as string);
    }
    return obs;
  }

  handleRecoverPasswordBySMS(serviceResponse?: Subject<any>, tokenValue?: string) {
    this.passwordRecoveryService.getPassword(this.username!, false ,this.responseService?.tokenRequired, tokenValue).subscribe({
      next: (response) => {

        if (this.managementMethod.implementMethod()) {
            serviceResponse!.next({
              status: HttpStatusCode.SUCCESS_TRANSACTION,
              data: response,
            });
            this.executeMobile(response);
        }else{
          this.executeMobile(response);
        }
      },
      error: (error) => {
        let message = error.error.message;

        if (this.managementMethod.implementMethod()) {
          this.manageErrorForRecoverPasswordService(serviceResponse!, error);
        }else{
            error.error.message = message.substring(message.indexOf(':') + 1, message.length);
          this.openAlert('error', message);
        }
      },
    });
  }

  manageErrorForRecoverPasswordService(observable: Subject<any>, error: HttpErrorResponse) {
    if (((error?.error && error?.error?.status) || (error && error?.status)) === HttpStatusCode.INVALID_TOKEN) {
      observable.next({
        status: HttpStatusCode.INVALID_TOKEN,
        message: error?.error?.message,
        error: error,
      });

      this.hiddenSpinner();
      return;
    }

    observable.next({
      status: error?.status,
      message: error?.error?.message ?? 'fatal-error:timeout',
      error: error,
    });
    let message = error.error.message;

    this.loginForm.get('username')!.setErrors({ customError: message });
    this.hiddenSpinner();
  }

  handleRecoverPasswordByEmail(serviceResponse?: Subject<any>, tokenValue?: string) {
    this.passwordRecoveryService.getPassword(this.username!, true , this.responseService?.tokenRequired, tokenValue).subscribe({
      next: (response) => {

        if (this.managementMethod.implementMethod()) {
          serviceResponse!.next({
            status: HttpStatusCode.SUCCESS_TRANSACTION,
            data: response,
          });

          this.hiddenSpinner();
          this.executeEmail(response)

        }else{
          this.executeEmail(response)
        }
      },
      error: (error) => {
        if (this.managementMethod.implementMethod()) {
          this.manageErrorForRecoverPasswordService(serviceResponse!, error);
        }else{
            this.openAlert('error', error?.error?.message);
        }
      },
    });
  }

  showSpinner() {
    this.spinner.show().then(() => {});
  }

  hiddenSpinner() {
    this.spinner.hide().then(() => {});
  }

  openAlert(type: string, message: string) {
    this.showAlert = true;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.messageAlert = null!;
    this.typeAlert = null!;
  }
}
