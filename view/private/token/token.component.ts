import { MaskOptionsBuilder } from '@adf/components';
import { AuthenticationService, StorageService } from "@adf/security";
import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subscription, lastValueFrom } from 'rxjs';
import { finalize, first } from "rxjs/operators";
import { StyleManagementService } from "src/app/service/common/style-management.service";
import { ParameterManagementService } from "src/app/service/navegation-parameters/parameter-management.service";
import { TokenService } from "src/app/service/private/token/token.service";
import { MenuService } from "src/app/service/shared/menu.service";
import { environment } from "src/environments/environment";
import { ServiceOption } from "../../../models/service-menu.model";
import { ISettingData } from "../../../models/setting-interface";





import { HttpErrorResponse } from '@angular/common/http';
import { ERequestTypeTransaction } from "src/app/enums/transaction-header.enum";
import { SecurityService } from "src/app/service/private/security.service";
import { SecureIndentityService } from "src/app/service/private/token/secure-indentity.service";
import { TokenModalComponent } from "../token-modal/token-modal.component";
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { EProfile } from 'src/app/enums/profile.enum';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';


/**
 * @author Noe Fernandez
 *
 * Provide a way to identify the browser
 */

@Component({
  selector: "byte-token",
  templateUrl: "./token.component.html",
  styleUrls: ["./token.component.scss"],
})
export class TokenComponent implements OnInit, OnDestroy {
  tokenForm!: FormGroup;
  vclockForm!: FormGroup;
  show = true;
  tokenTypeResponse;
  tokenType!: string;
  tokenValidateStatus;
  attemptCounter = 0;
  remainingAttempts = 3;
  isDisabled = false;
  autoSync = false;
  manualSync = false;
  message = "";
  errors = false;
  minLength!: number;
  maxLength;
  showMessage = false;
  userInformation: any = this.parameterManager.getParameter('userInfo');
  serviceOption!: ServiceOption;
  showAlert = false;
  messageAlert!: string;
  settingData!: ISettingData;

  private readonly tokenServiceSubscription: Subscription;

  theme: string | undefined;

  imaskOptions = new MaskOptionsBuilder()
    .mask({ mask: "00000000" })
    .build()

  imaskOptionsClock = new MaskOptionsBuilder()
    .mask({ mask: "00000" })
    .build()

  home: string = environment.home;

  public menuLoadEvent: EventEmitter<any> = new EventEmitter();
  profile = environment["profile"];

  get tokenControl(){
    return this.tokenForm.controls['token'] as FormControl;
  }

  get vclockControl(){
    return this.tokenForm.controls['vclock'] as FormControl;
  }

  get vclockDosControl(){
    return this.tokenForm.controls['vclockDos'] as FormControl;
  }

  /**
   * @param modalService Instance for Modal initiation
   * @param fb FormBuilder Instance
   * @param route Router Instance
   * @param router ActivatedRoute Instance
   * @param tokenService TokenService Instance
   * @param secureIndentityService SecureIndentityService Instance
   * @param authenticationService
   * @param menuService
   * @param storage
   * @param spinner
   * @param translate
   * @param securityService
   * @param parameterManager
   * @param storageService
   * @param styleManagement
   */

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private tokenService: TokenService,
    private secureIndentityService: SecureIndentityService,
    private authenticationService: AuthenticationService,
    private menuService: MenuService,
    private storage: StorageService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private securityService: SecurityService,
    private parameterManager: ParameterManagementService,
    private storageService: StorageService,
    private styleManagement: StyleManagementService,
    private featureManagerService: FeatureManagerService

  ) {
    this.tokenServiceSubscription =
      this.tokenService.errorLoggingEvent.subscribe({
        next: (message: string) => {
          this.openAlert("warn", message);
        },
      });

    this.theme = environment["profile"] || "byte-theme";
  }

  /**
   * Initializes modals and validations
   * @return Initializes modals and validations
   */
  ngOnInit(): void {
    this.settingData = JSON.parse(this.storage.getItem('securityParameters'));
    this.tokenTypeResponse = this.router.snapshot.data["tokenType"];

    if (!this.tokenTypeResponse) {
      this.modalService.dismissAll();
      const logOutService = this.authenticationService.logout();
      lastValueFrom(logOutService).finally(() => this.tokenService.notifyErrorToLogin('NO TOKEN FOUND'));
    }

    if (this.tokenTypeResponse) {
      if (this.tokenTypeResponse === "S") {
        this.tokenType = this.tokenTypeResponse;
        this.tokenGenerate();
      }
    }
    this.validateFormToken();
    this.validateFormVclock();
    this.hiddenSpinner();
  }



  /**
   * TOKEN form validation
   * @return We validate the required fields in the TOKEN form.
   */
  validateFormToken() {
    if (this.tokenTypeResponse === 'D') {
      this.minLength = this.settingData?.token['soft-token']?.min ?? 8;
      this.maxLength = this.settingData?.token['soft-token']?.max ?? 8;
      this.tokenForm = this.fb.group({
        token: ['',
          [
            Validators.required,
            Validators.minLength(this.minLength),
            Validators.maxLength(this.maxLength)
          ]],
      });
      return;
    }
    if (this.tokenType === 'S') {
      this.minLength = this.settingData.token.sms.min;
      this.maxLength = this.settingData.token.sms.max;
      this.tokenForm = this.fb.group({
        token: ['',
          [
            Validators.required,
            Validators.minLength(this.settingData.token.sms.min),
            Validators.maxLength(this.settingData.token.sms.max)
          ]],
      });
    } else {
      this.minLength = this.settingData.token.physical.min;
      this.maxLength = this.settingData.token.physical.max;
      this.tokenForm = this.fb.group({
        token: ['',
          [
            Validators.required,
            Validators.minLength(this.settingData.token.physical.min),
            Validators.maxLength(this.settingData.token.physical.max)
          ]],
      });
    }
  }

  /**
   * Vclock form validation
   * @return We validate the required fields in the VCLOCK form.
   */
  validateFormVclock() {
    this.vclockForm = this.fb.group({
      vclock: [
        "",
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      vclockDos: [
        "",
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
    });
  }

  /**
   * Modals to be presented at the hearing
   * @return We call the modal to be displayed in the view at startup
   */
  open() {
    const theme = environment["profile"] || "byte-theme";
    this.modalService.open(TokenModalComponent, {
      centered: true,
      windowClass: theme + " token-modal",
      size: "lg",
    });
  }

  /**
   * @return back To Login
   */
  backToLogin() {
    this.showSpinner();
    if (this.show) {
      this.modalService.dismissAll();
      lastValueFrom(this.authenticationService.logout()).finally(() => {});
    } else {
      this.show = true;
    }
  }

  /**
   * Change of form
   * @return se hace el llamado al servicio para validacion de token o el llamado para sicronizacion manual
   */
  clock() {
    this.message = "";
    this.errors = false;
    this.autoSync = false;
    this.manualSync = false;
    this.showSpinner();
    if (this.show) {
      if (this.tokenForm.controls['token'].errors === null) {
        if (this.attemptCounter < 3) {
          this.handleValidateToken();
        } else {
          this.handleAutoSyncToken();
        }
      } else {
        this.tokenForm.markAllAsTouched();
        this.hiddenSpinner();
      }
    } else {
      this.handleManualSyncToken();
    }
  }

  handleValidateToken() {
    const validateTokenService = this.handlerValidationToken();
    validateTokenService
      .subscribe({
        next: (dataValidate) => {
          this.storageService.addItem("ne", this.tokenForm.controls['token'].value);
          this.getMenuData(dataValidate);
        },
        error: (error: HttpErrorResponse) => {
          if (this.tokenTypeResponse && this.tokenTypeResponse === "F") {
            this.tokenValidateStatus = error.status;
            this.attemptCounter = 1 + this.attemptCounter;
            this.remainingAttempts -= 1;
            if (this.attemptCounter === 3) {
              this.tokenForm.controls['token'].setValue("");
            } else {
              this.message = `${this.translate.instant(
                "invalid_token"
              )}, ${this.remainingAttempts} ${this.translate.instant(
                "remaining_attempts"
              )}`;
              this.errors = true;
              this.showMessage = true;
            }
          } else {
            this.message = error?.error?.message  ?? error?.message;
            this.errors = true;
            this.showMessage = error?.status != 401;
          }

          this.hiddenSpinner();
        },
      })
  }

  handleAutoSyncToken() {
    const token = +this.tokenForm.controls['token'].value;
    this.secureIndentityService.getAutoSync(token)
      .pipe(finalize(() => this.hiddenSpinner()))
      .subscribe({
        next: () => {
          this.attemptCounter = 0;
          this.remainingAttempts = 3;
          this.autoSync = true;
        },
        error: () => {
          this.attemptCounter = 0;
          this.remainingAttempts = 3;
          this.show = false;
          this.open();
        }
      });
  }

  handleManualSyncToken() {
    if (
      this.vclockForm.controls['vclock'].errors === null &&
      this.vclockForm.controls['vclockDos'].errors === null
    ) {
      const vclock: number = +this.vclockForm.controls['vclock'].value;
      const vclockDos: number = +this.vclockForm.controls['vclockDos'].value;
      this.secureIndentityService
        .manualSync(vclock, vclockDos)
        .pipe(finalize(() => this.hiddenSpinner()))
        .subscribe({
          next: () => {
            this.autoSync = true;
            this.show = true;
          },
          error: () => {
            this.autoSync = true;
            this.show = true;
          }
        })
    } else {
      this.vclockForm.markAllAsTouched();
      this.hiddenSpinner();
    }
  }

  exceededAttempt(): boolean {
    return this.attemptCounter === 3;
  }

  getMenuData(dataValidate) {
    this.userInformation = this.parameterManager.getParameter('userInfo');
    this.menuService.getMenu()
      .pipe(first())
      .subscribe({
        next: (dataMenu) => {
          if (this.userInformation.userType === "A") {
            for (const menu of dataMenu.body) {
              if (menu.service === "mnu-admin") {
                this.serviceOption = {
                  service: "uad-admin",
                  name: "Usuario Administrador",
                  show: true,
                  child: [],
                };
                menu.child.push(this.serviceOption);
              }
            }
          }
          this.storage.addItem("userMenu", JSON.stringify(dataMenu.body));
          this.storage.addItem("userLoggedIn", "true");
          this.menuService.notifyMenuLoaded(dataMenu.body);

          if (dataValidate) {
            this.tokenValidateStatus = dataValidate.status;
          }

          this.authenticationService.registerSecureNavigation();
          this.route.navigate(["/routing-security-option"]).finally(() => {});
        },
        error: (error: HttpErrorResponse) => {
          this.tokenValidateStatus = error.status;
          this.attemptCounter = 1 + this.attemptCounter;
          this.remainingAttempts -= 1;
          this.hiddenSpinner();
          if (this.attemptCounter === 3) {
            this.tokenForm.controls['token'].setValue("");
          }
          this.tokenService.notifyErrorToLogin(error.message);
        }
      });
  }

  tokenGenerate() {
    this.showMessage = false;
    this.tokenService.tokenGenerate(ERequestTypeTransaction.AUTHENTICATION)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.errors = res.code !== 0;
          this.showMessage = true;

          if (!this.errors) {
            this.message = this.translate.instant("t_ok_send_token", {
              digitCode: res.digitCode,
            });
          }
        },
        error: () => {
          this.showMessage = true;
          this.message = "t_could_not_send_token";
          this.errors = true;
        }
      });
  }

  openAlert(type: string, message: string) {
    this.showAlert = true;
    this.messageAlert = message;
  }

  public ngOnDestroy(): void {
    if (this.tokenServiceSubscription) {
      this.tokenServiceSubscription.unsubscribe();
    }
  }

  corporateImageApplication(): boolean{
    return  this.styleManagement.corporateImageApplication();
  }

  showSpinner() {
    this.spinner.show('main-spinner').finally(() => {});
  }

  hiddenSpinner() {
    this.spinner.hide('main-spinner').finally(() => {});
  }

  handlerValidationToken(): Observable<any>{
    const tokenValue = this.tokenForm.controls['token'].value;
    const profile: string = environment.profile;
    const featureManager = this.featureManagerService.stknBisvAllow();


      if((this.tokenTypeResponse === TypeTokenEnum.SOFT_TOKEN_DEVEL) && (EProfile.SALVADOR === profile) && (featureManager)){
        return this.tokenService.validateOTPStokenSV(tokenValue)
      }

      return this.tokenService.getTokenValidate(tokenValue)
  }

}
