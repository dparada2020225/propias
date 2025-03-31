import { AdfConfirmationModalComponent, EInputType, IConfirmationModal, MaskOptionsBuilder, SnackBarComponent } from '@adf/components';
import { AuthenticationService, OperationBuilder, SmartcoreCheckpointService, StorageService, TransactionBuilder } from '@adf/security';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, lastValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';
import { PasswordDefinition } from 'src/app/models/change-password-modal';
import { OnResize } from 'src/app/modules/shared/classes/on-risize';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';
import { SmartCoreService } from 'src/app/service/common/smart-core.service';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { WorkerService } from 'src/app/service/general/worker.service';
import { StateManagerService } from 'src/app/service/private-main/state-manager.service';
import { SecurityService } from 'src/app/service/private/security.service';
import { TokenService } from 'src/app/service/private/token/token.service';
import { MenuService } from 'src/app/service/shared/menu.service';
import { environment } from 'src/environments/environment';
import socialNetwork from '../../../../assets/fake-data/social-network.json';
import defaultSettingsJson from '../../../../assets/settings/settings-data.json';
import { EProfile } from '../../../enums/profile.enum';
import { EVersionHandler } from '../../../enums/version-handler.enum';
import { ServiceOption } from '../../../models/service-menu.model';
import { IBanner, ISettingData } from '../../../models/setting-interface';
import { ParameterManagementService } from '../../../service/navegation-parameters/parameter-management.service';
import { VersionInformationModal } from '../version-information-modal/version-information-modal.component';
import { SearchUserService } from '../../private/soft-token/modules/stoken-bisv/services/transaction/HID/search-user.service';
import { StknBisvHandlerService } from 'src/app/service/public/stkn-bisv-handler/stkn-bisv-handler.service';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { EStokenBISVRequiredToken } from '../../private/soft-token/modules/stoken-bisv/enums/stkn-bisv.enum';

@Component({
  selector: 'byte-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends OnResize implements OnInit, OnDestroy {
  @ViewChild(SnackBarComponent)
  private snackBarComponent!: SnackBarComponent;

  private readonly tokenServiceSubscription: Subscription;
  private menuServiceSubscription: Subscription;
  private checkProfileServiceSubscription: Subscription;
  serviceSubscriber: Subscription;
  layoutModal!: IConfirmationModal;
  loginForm!: FormGroup;
  serviceOption!: ServiceOption;
  settingsData: ISettingData;
  typeUserName: EInputType = EInputType.TEXT;
  typePassword: EInputType = EInputType.PASSWORD;
  versionAssets = EVersionHandler.ASSETS;
  imageDesktopList: IBanner[] = [];
  imageTabletList: IBanner[] = [];
  imageList: IBanner[] = [];
  userInformation: any;
  urlTree: any;
  linkList!: any;
  encryptionTest: boolean = environment.encryptionTest;
  blockingTimeTest: boolean = environment.blockingTimeTest;
  requiredToken: boolean = true;
  loading: boolean = false;
  submitted: boolean = false;
  minLengthPassword: number = PasswordDefinition.minLength;
  maxLengthPassword: number = PasswordDefinition.maxLength;
  usernameMinLenght!: number;
  profile: string = environment['profile'];
  returnUrl!: string;
  tokenUrl: string = '';
  institutionUrl: string = '';
  error: string = '';
  countryLogin!: string;
  errorUsername: string = 'username.not.found';
  errorPassword: string = 'password.not.found';
  showAlert: boolean = false;
  messageAlert!: string;
  currentRegexPassword = /^\S*$/;
  BPRegexPassword = /^[^<>[\]!¡\/\\{}´`^°&~#;']+$/g;
  passwordRegex = environment.profile === EProfile.HONDURAS ? this.BPRegexPassword : this.currentRegexPassword;
  preLoggedGuardList = ['token', 'security-option', 'change-password', 'routing-security-option'];
  timeOutkeepAlive;
  stokePrelog: boolean = false;


  mask = new MaskOptionsBuilder()
    .mask({
      mask: /^\w+$/,
      prepare: function (str) {
        return str.toUpperCase();
      },
    })
    .build();

  maskPass = new MaskOptionsBuilder()
    .type(EInputType.PASSWORD)
    .mask({ mask: this.passwordRegex })
    .build();

  get formUserName(): FormControl {
    return this.loginForm.controls['username'] as FormControl;
  }

  get formPassword(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }

  get isCorporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }

  get f() {
    return this.loginForm.controls;
  }

  get urlTips(): string {
    return this.settingsData.customProperties['url-tips'] as string;
  }

  get isShowAlertClassName(): string {
    return this.showAlert ? '' : 'empty-box';
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private smartCore: SmartCoreService,
    private menuService: MenuService,
    private storage: StorageService,
    private checkProfileService: CheckProfileService,
    private tokenService: TokenService,
    private translate: TranslateService,
    private securityService: SecurityService,
    private stateManagerTestService: StateManagerService,
    private workerService: WorkerService,
    private modalService: NgbModal,
    private styleManagement: StyleManagementService,
    private parameterManager: ParameterManagementService,
    private searchUserService: SearchUserService,
    private spinner: NgxSpinnerService,
    private featureManagerService: FeatureManagerService,
    private smartcoreCheckpointService: SmartcoreCheckpointService,
    private handlerBisv: StknBisvHandlerService
  ) {
    super();
    this.urlTree = this.router.parseUrl(this.router.url);
    this.tokenUrl = this.urlTree.queryParams['token'];
    this.institutionUrl = this.urlTree.queryParams['institucion'];

    this.serviceSubscriber = this.stateManagerTestService.getData().subscribe((data) => {
      this.showAlertTest(data);
    });

    this.tokenServiceSubscription = this.tokenService.errorLoggingEvent.subscribe({
      next: (message: string) => {
        this.openAlert('warn', message);
      },
    });

    this.menuServiceSubscription = this.menuService.errorLoggingEvent.subscribe({
      next: (message: string) => {
        this.openAlert('warn', message);
      },
    });

    this.checkProfileServiceSubscription = this.checkProfileService.errorLoggingEvent.subscribe({
      next: (message: string) => {
        this.openAlert('warn', message);
      },
    });

    // redirect to home if already logged
    if (this.authenticationService.currentTokenValue && !this.preLoggedGuard()) {
      this.router.navigate(['/routing-security-option']);
    }

    this.settingsData = JSON.parse(this.storage.getItem('securityParameters'));
    this.getPublicBanners();
  }

  preLoggedGuard(): boolean {
    const urlLogParameter = this.parameterManager.getParameter('urlLog') || [];
    const lastUrlLog = urlLogParameter[urlLogParameter.length - 1] || 'not-found';
    let found = false;
    for (const element of this.preLoggedGuardList) {
      if (lastUrlLog.indexOf(element) >= 0) {
        found = true;
        break;
      }
    }
    return found;
  }

  ngOnInit() {
    this.workerService.checkForUpdates();
    this.getCountryLogin();
    this.usernameMinLenght = this.profile === EProfile.HONDURAS ? 2 : 4;

    if (this.encryptionTest) {
      this.storage.addItem('encryptionTest', '"true"');
    }

    if (this.blockingTimeTest) {
      this.storage.addItem('blockingTimeTest', '"true"');
    }
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: new FormControl(null, [
        Validators.required,
        // Se elimina el minLeght y solo será para SV a solicitud Post Prod PA. 21/03/2022
      ]),
      token: [''],
    });
    if (this.profile === EProfile.SALVADOR) {
      this.loginForm.get('password')?.setValidators([Validators.minLength(this.minLengthPassword), Validators.required]);
    }

    // get return url from route parameters or default to '/'
    const attReturnUrl = 'returnUrl';
    this.returnUrl = this.route.snapshot.queryParams[attReturnUrl] || '/';
    this.linkList = socialNetwork[environment.profile];
  }

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }

  getCountryLogin(): void {
    switch (environment.profile) {
      case EProfile.SALVADOR:
        this.countryLogin = 'country_login';
        break;
      case EProfile.PANAMA:
        this.countryLogin = 'country_login';
        break;
      default:
        this.countryLogin = '';
        break;
    }
  }

  startSmartCore() {
    const transaction = new TransactionBuilder()
      .category('login')
      .description('login')
      .type('traditional')
      .build();

    const operation = new OperationBuilder()
      .transaction(transaction)
      .build();

    this.smartCore.personalizationOperation(operation);
  }

  async buttonClicked() {
    this.parameterManager.sendParameters({
      urlLog: null,
    });

    this.showAlert = false;
    this.loading = true;
    this.submitted = true;
    this.authenticationService.personalizationIntegrity();

    let smartcoreDeviceData;

    if (this.smartcoreCheckpointService.useSmartidV5) {
      smartcoreDeviceData = await this.authenticationService.personalizationRaw();
    }

    if (this.loginForm.valid) {
      this.authenticationService
        .login(this.f['username'].value, this.f['password'].value, this.tokenUrl, this.institutionUrl, true, smartcoreDeviceData)
        .pipe(first())
        .subscribe({
          next: (data) => this.loginHandler(data),
          error: (errorData) => this.loginErrorHandler(errorData),
        });
    } else {
      this.loading = false;
      this.loginForm.markAllAsTouched();
    }
  }

  loginErrorHandler(errorData): void {

    if (errorData
      && errorData.error
      && errorData.error.code
      && errorData.status === 401) {

      switch (errorData.error.code) {
        case '104':
          this.handlerErrorCode104Login(errorData);
          break;

        case '901':
          this.handlerErrorCode901Login();
          break;

        case '902':
          this.handlerErrorCode902Login();
          break;

        default:
          this.error = errorData.error.message;
          break;
      }
    } else {
      this.error = this.translate.instant('error.http.500');
    }

    this.openAlert('error', this.error);
    this.loginForm.reset();
    this.loading = false;

    setTimeout(() => {
      this.loginForm.controls['username'].markAsPristine();
      this.loginForm.controls['password'].markAsPristine();
    });
  }

  /**
   * @return Method in charge of handling
   * the mandatory password change for login
   */
  handlerErrorCode104Login(errorData): void {
    let errorMessage = errorData.error.message;
    let splitted = [];
    splitted = errorMessage.split(',', 3);

    let typeToken = splitted[1];
    let requiredToken = splitted[2];

    this.parameterManager.sendParameters({
      requiredToken: requiredToken,
      typeToken: typeToken,
    });

    this.storage.addItem('userPreLoggedIn', 'true');
    const username = this.f['username'].value;
    this.storage.addItem('tempUsername', username);
    this.router.navigate(['/change-password']).finally(() => { });
  }

  /**
   * @return Method in charge of refreshing
   * the screen in case the frontend version
   * is not the latest
   */
  handlerErrorCode901Login(): void {
    document.location.reload();
  }

  /**
   * @return Method responsible for displaying
   * a modal indicating that the version of
   * the application found in the user's
   * browser is not the latest
   */
  handlerErrorCode902Login(): void {
    this.modalService.open(VersionInformationModal, {
      centered: true,
      windowClass: this.profile || 'byte-theme',
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
  }

  loginHandler(data): void {
    this.startSmartCore();
    this.requiredToken = data['required_token'];
    const username = this.f['username'].value;
    const clientType = data['clientType'];

    this.parameterManager.sendParameters({
      isTokenRequired: this.requiredToken,
      blockedMenu: { allowed: true },
      typeToken: data.typeToken,
      clientType,
      tokenControl: data.tokenControl,
      userStatus: data.userStatus
    });

    /* if(data.typeToken === TypeTokenEnum.NEW_USER && this.featureManagerService.stknBisvAllow()){
       this.parameterManager.sendParameters({
         stokenPreLogin: { stokenPreLog: true }
       })

       this.router.navigate(['/new-user']).catch(error=> console.log(error))
       return;
     }*/


    if(data.typeToken === TypeTokenEnum.NEW_USER && data.tokenControl === EStokenBISVRequiredToken.NOT_REQUIRED_TOKEN){
      this.securityService.getUserInfo()
        .subscribe({
          next: (data) => this.userInfohandler(data),
          error: (error) => this.getMenuData()
        });

    } else {
      if ((this.featureManagerService.stknBisvAllow())
        && ((data.typeToken === TypeTokenEnum.NEW_USER)
          || data.typeToken === TypeTokenEnum.SOFT_TOKEN_DEVEL)) {

        /* if ((this.featureManagerService.stknBisvAllow()) &&
              (data.typeToken === TypeTokenEnum.SOFT_TOKEN_DEVEL)
            ) {
        */
        this.handlerBisv.handlerStoken(data.typeToken, username, data.clientType, data.tokenControl)
          ?.subscribe({
            next: (res) => {
              console.log(res);
              if(res.stokenStatus === 'A'){
                this.requiredTokenValidate();
              }
            },
            error: (error:HttpErrorResponse) => {
              this.requiredTokenValidate();
            }
          })
        return;

      }
      this.requiredTokenValidate();

    }
  }

  requiredTokenValidate() {
    if (this.requiredToken ) {
      this.router.navigate(['/token']).finally(() => { });
    } else {
      this.securityService.getUserInfo()
        .subscribe({
          next: (data) => this.userInfohandler(data),
          error: (error) => this.getMenuData()
        });
    }
  };


  userInfohandler(data): void {
    this.userInformation = data;
    this.getMenuData();
  }

  sessionIsActive() {
    const modal = this.modalService.open(AdfConfirmationModalComponent, {
      centered: true,
      windowClass: `${this.profile || 'byte-theme'} ach-modal`,
      size: `lg`,
    });

    modal.componentInstance.data = this.layoutModal;

    modal.result.then((isConfirm: boolean) => {
      if (!isConfirm) {
        this.buttonClicked();
      }
    }).finally(() => { });
  }

  getMenuData() {
    this.menuService.getMenu().pipe(first())
      .subscribe({
        next: (data) => this.menuHandler(data),
        error: (error) => this.menuErrorHandler(error)
      });
  }

  menuHandler(data) {
    if (this.userInformation.userType === 'A') {
      for (const menu of data.body) {
        if (menu.service === 'mnu-admin') {
          this.serviceOption = {
            service: 'uad-admin',
            name: 'Usuario Administrador',
            show: true,
            child: [],
          };
          menu.child.push(this.serviceOption);
        }
      }
    }

    this.storage.addItem('userMenu', JSON.stringify(data.body));
    this.storage.addItem('userLoggedIn', 'true')
    this.router.navigate(['/routing-security-option']).finally(() => (this.loading = false));
  }

  menuErrorHandler(error) {
    this.loading = false;
    const logOutService = this.authenticationService.logout()
    lastValueFrom(logOutService).finally(() => this.openAlert('warn', error.statusText));
  }

  openAlert(type: string, message: string) {
    this.showAlert = true;
    this.messageAlert = message;
  }

  recoverPassword() {
    this.router.navigate(['/recover-password']).finally(() => { });
  }

  stateManager() {
    this.stateManagerTestService.accountant();
  }

  showAlertTest(status: boolean) {
    if (this.encryptionTest) {
      if (status) {
        this.storage.addItem('encryptionTest', '"true"');
        this.snackBarComponent.openSnackBar('success', this.translate.instant('Cifrado híbrido activado'), 5000, 'end', 'top');
      } else {
        this.storage.addItem('encryptionTest', '"false"');
        this.snackBarComponent.openSnackBar(
          'error',
          this.translate.instant(
            'Encriptación híbrida desactivada (si se desactiva antes del login no se podra activar hasta hacer logout)'
          ),
          5000,
          'end',
          'top'
        );
      }
    }

    if (this.blockingTimeTest) {
      if (status) {
        this.storage.addItem('blockingTimeTest', '"true"');
        this.snackBarComponent.openSnackBar('success', this.translate.instant('Tiempo de bloqueo de 10 min activado'), 5000, 'end', 'top');
      } else {
        this.storage.addItem('blockingTimeTest', '"false"');
        this.snackBarComponent.openSnackBar(
          'error',
          this.translate.instant('Tiempo de bloqueo de 10 min cambiado a 30 segundos'),
          5000,
          'end',
          'top'
        );
      }
    }
    if (this.blockingTimeTest && this.encryptionTest) {
      if (status) {
        this.storage.addItem('blockingTimeTest', '"true"');
        this.storage.addItem('encryptionTest', '"true"');
        this.snackBarComponent.openSnackBar(
          'success',
          this.translate.instant('Cifrado híbrido y tiempo de bloqueo de 10 min activado'),
          5000,
          'end',
          'top'
        );
      } else {
        this.storage.addItem('blockingTimeTest', '"false"');
        this.storage.addItem('encryptionTest', '"false"');
        this.snackBarComponent.openSnackBar(
          'error',
          this.translate.instant(
            'Encriptación híbrida desactivada (si se desactiva antes del login no se podra activar hasta hacer logout) y tiempo de bloqueo de 10 min cambiado a 30 segundos'
          ),
          5000,
          'end',
          'top'
        );
      }
    }
  }

  getPublicBanners() {
    const hasLoginBanners = this.settingsData?.loginBanners;
    const hasPcBanners = this.settingsData?.loginBanners?.pc;
    const hasTabletBanners = this.settingsData?.loginBanners?.tablet;

    if (hasLoginBanners && hasTabletBanners && hasTabletBanners?.length > 0 && hasPcBanners && hasPcBanners?.length > 0) {
      this.imageDesktopList = hasPcBanners;
      this.imageTabletList = hasTabletBanners;
      return;
    }

    const defaultImages = defaultSettingsJson[environment.profile].loginBanners;
    this.imageTabletList = defaultImages.tablet;
    this.imageDesktopList = defaultImages.pc;
  }

  href(link: string) {
    if (link) {
      window.location.href = link;
    }
  }

  public ngOnDestroy(): void {

    if (this.tokenServiceSubscription) {
      this.tokenServiceSubscription.unsubscribe();
    }
    if (this.serviceSubscriber) {
      this.serviceSubscriber.unsubscribe();
    }
  }
}
