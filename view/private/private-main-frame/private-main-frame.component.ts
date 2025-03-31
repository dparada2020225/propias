import {ChangeLanguageService, SnackBarComponent} from '@adf/components';
import {AuthenticationService, StorageService} from '@adf/security';
import {HttpErrorResponse} from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {lastValueFrom, observable, Subscription} from 'rxjs';
import {FeatureManagerService} from 'src/app/service/common/feature-manager.service';
import {StyleManagementService} from 'src/app/service/common/style-management.service';
import {UtilService} from 'src/app/service/common/util.service';
import {CheckProfileService} from 'src/app/service/general/check-profile.service';
import {ParameterManagementService} from 'src/app/service/navegation-parameters/parameter-management.service';
import {CurrenciesService} from 'src/app/service/private-main/currencies.service';
import {ExchangeRateService} from 'src/app/service/private-main/exchange-rate.service';
import {PermissionsService} from 'src/app/service/private-main/permissions.service';
import {PrivateMainFrameService} from 'src/app/service/private-main/private-main-frame.service';
import {RestarIldeService} from 'src/app/service/private/restar-ilde.service';
import {SecurityService} from 'src/app/service/private/security.service';
import {StepService} from 'src/app/service/private/step.service';
import {TimeoutService} from 'src/app/service/private/time-out/timeout.service';
import {MenuService} from 'src/app/service/shared/menu.service';
import {environment} from 'src/environments/environment';
import simpleNavbarList from '../../../../assets/data/simple-navbar-list.json';
import socialNetwork from '../../../../assets/fake-data/social-network.json';
import {EVersionHandler} from '../../../enums/version-handler.enum';
import {ISettingData} from '../../../models/setting-interface';
import {StateManagerService} from '../../../service/private-main/state-manager.service';
import {FindServiceCodeService} from '../../../service/common/find-service-code.service';
import { RcExecuteFlowService } from 'src/app/service/private/regional-connection/rc-execute-flow.service';
import { ModalTokenComponent } from '../token/modal-token/modal-token.component';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';
import { EStokenNavigationUrlNavigation, EStokenRoutesNewUser } from '../soft-token/modules/stoken-bisv/enums/stkn-bisv.enum';

/**
 * @author Sebastian Chicoma S.
 *
 * Barra de navegación para components de ámbito privado
 */
@Component({
  selector: 'byte-private-main-frame',
  templateUrl: './private-main-frame.component.html',
  styleUrls: ['./private-main-frame.component.scss']
})
export class PrivateMainFrameComponent implements OnInit, OnDestroy {

  @ViewChild(SnackBarComponent)
  private snackBarComponent!: SnackBarComponent;

  @ViewChild('regionalConnectionIcon') regionalConnectionIcon!: ElementRef;

  safeUrl!: SafeResourceUrl;
  currencySymbol: any;
  buyAmount!: string;
  sellAmount!: string;
  information: any;
  settings!: ISettingData;
  linkList: any;
  show: boolean = false;
  showIconSToken: boolean = false;
  resetComponent: boolean = false;
  showUpdateData: boolean = false;
  code!: any
  clientType!: string


  profile = environment.profile;
  home: string = environment.home;
  isMenuCollapsed = true;
  isMenuInfoCollapsed = true;
  isMenuInfoCollapsedBI = false;
  idleState = 'NOT_STARTED';
  countdown: number | undefined = 0;
  timedOut = false;
  lastPing!: Date | undefined;
  menuResponse: any;
  menu: any;
  url!: string;
  preLoggedGuardList: string[] = [];
  lightNavbarList = ['/logout', '/token', '/routing-security-option'];
  versionAssets = EVersionHandler.ASSETS;

  publicLogo = `assets/images/public/${this.profile}_logo_${EVersionHandler.ASSETS}.png`;
  privateLogo = `assets/images/private/${this.profile}_logo_privado_${EVersionHandler.ASSETS}.png`;

  // eliminar pasa al footer
  isFooterCollapsed = {
    links: true,
    downloads: true,
    support: true,
    about: true
  };

  showRegionalConnection!: boolean;
  simpleNavbar = true;
  lockMenu = false;
  imageNavigateLogout: boolean = false;

  blockingTime!: number;
  timeOut!: number;

  menuLoadSubscription: Subscription;
  onIdleStartSubscription!: Subscription;
  onIdleEndSubscription!: Subscription;
  onTimeoutSubscription!: Subscription;
  onTimeoutWarningSubscription!: Subscription;
  onPingSubscription!: Subscription;
  validateUserService!: number;

  gifLogout = this.util.getLoader(this.featureManagerService.labelSpinnerLogOut() ? 'close_session_message' : undefined);
  gif = this.util.getLoader();
  encryptionTest = environment.encryptionTest;
  blockingTimeTest = environment.blockingTimeTest;
  blockingTimeTemp = environment.blockingTimeTemp;
  logoutUrl = `${environment.urlOnlineBankingLegacy}service=logout`;
  timeoutLogout: boolean = false;
  private subscriptionService!: Subscription;
  private subscriptionMangerService: Subscription;
  timeOutkeepAlive;
  urlRegionalConnection: string = '';

  get isLogin(): boolean {

    if(this.storageService.getItem('userLoggedIn') !== null
    || this.storageService.getItem('userPreLoggedIn') !== null){
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private idle: Idle,
    private keepalive: Keepalive,
    private privateMainframService: PrivateMainFrameService,
    private timeoutService: TimeoutService,
    private router: Router,
    private securityService: SecurityService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private translate: TranslateService,
    private exchangeChange: ExchangeRateService,
    private currency: CurrenciesService,
    private menuService: MenuService,
    private stateMangerService: StateManagerService,
    private modalService: NgbModal,
    private checkProfileService: CheckProfileService,
    private parameterManagemen: ParameterManagementService,
    public permissionsService: PermissionsService,
    private restarIlde: RestarIldeService,
    private persistStepStateService: ParameterManagementService,
    private styleManagement: StyleManagementService,
    private changeLanguageService: ChangeLanguageService,
    private sanitizer: DomSanitizer,
    private util: UtilService,
    private step: StepService,
    private featureManagerService: FeatureManagerService,
    private findServiceCode: FindServiceCodeService,
    private regionalConnectionExecuteService: RcExecuteFlowService,
    private parameterManager: ParameterManagementService
  ) {
    if (this.featureManagerService.softTokenAllow() || this.featureManagerService.stknBisvAllow() ) {
      if(this.featureManagerService.isUserLigth()){
        this.showIconSToken = true;
      }
    }

    this.code = this.parameterManagemen.getParameter('codeInfo')

    const infoUserProfile = JSON.parse(this.storageService.getItem('userInformation'));

    this.clientType = this.parameterManagemen.getParameter('clientType');
    if ( this.clientType === "N" && this.code != "0" && this.featureManagerService.updateDataAllow() && infoUserProfile.profile === "BIF") {
      this.showUpdateData = true;
    }


    this.changeLanguageService.getCodeLanguage().subscribe((data) => {
      setTimeout(() => {
        this.gifLogout = this.util.getLoader();
        this.gif = this.util.getLoader();
      }, 50)
    })

    // TODO: remove this;
    // this.encryptionTest = this.storageService.getItem('encryptionTest') === 'true';
    this.subscriptionMangerService = this.stateMangerService.getData().subscribe(data => {
      this.showAlertTest(data);
    });

    this.menuLoadSubscription = this.menuService.menuLoadEvent.subscribe({
      next: (localMenu) => {
        this.menu = localMenu;
      }
    });



    this.handleExpiryTime();
    this.handleSubscribeToSharedService();

    this.getExchangeRate();
    this.getCurrencySymbol();

    this.preLoggedGuardList = simpleNavbarList.map((element) => element.name);
  }

  get handleRegionalConnection() {
    return this.featureManagerService.handleRegionalConnection();
  }

  async executeRegionalConnection() {
    const regionalConnectionStatus = await this.regionalConnectionExecuteService.validateRegionalConnectionStatus(this.linkRegionalConnection || '');

    if (regionalConnectionStatus) {
      this.regionalConnectionExecuteService.execute(this.linkRegionalConnection || '');
    }
  }


  getExchangeRate() {
    if (environment.profile === 'banpais') {
      this.exchangeChange.getExchangeRate().subscribe(result => {
        this.buyAmount = result[0].buy.exchange;
        this.sellAmount = result[0].sell.exchange;
      });
    }
  }
  getCurrencySymbol() {
    // Get currency symbol
    this.currencySymbol = this.currency.getCurrency();

    this.permissionsService.isValid.subscribe(notPermission => {
      if (notPermission) {
        this.spinner.hide('main-spinner')
        .catch((error) => console.error(error));
        this.snackBarComponent.openSnackBar('warning', this.translate.instant('no-permission-account'), 5000, 'end', 'top');
      }
    });
  }

  handleExpiryTime() {
    try {
      if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data['userInfo']) {
        const encryptedMessage = this.activatedRoute.snapshot.data['userInfo'].expiryTime;

        try {
          const expiryTime = this.step.s(encryptedMessage);

          if (this.profile === 'bisv'
            && expiryTime
            && expiryTime !== '') {

            environment.blockingTime = Number.parseInt(expiryTime);
          }
        } catch (err) {
          console.log(err);
        }

        this.information = this.activatedRoute.snapshot.data['userInfo'];
        this.storageService.addItem('userName', this.information?.username ?? '');
        if (this.information && this.information.firstName && this.information.firstLastname) {
          this.information.firstName = this.information.firstName.toLowerCase();
          this.information.firstLastname = this.information.firstLastname.toLowerCase();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }


  handleSubscribeToSharedService() {
    this.timeOut = environment.blockingTime;
    this.blockingTime = environment.blockingTime;

    this.initIdle();

    this.restarIlde.activeRestar().subscribe(() => {
      this.restarIdle();
    });

    this.privateMainframService.getSharedData().subscribe(result => {
      this.simpleNavbar = this.preLoggedGuard();
    });

    this.timeoutService.getSharedData().subscribe(data => {
      this.showAlertTimeOut(data.type, data.service);
    });

    this.settings = JSON.parse(this.storageService.getItem('securityParameters'));
  }

  @HostListener('window: popstate', [])
  onPopState(event: any) {
    if (this.preLoggedGuard()) {
      this.logout('login');
    }
  }

  get linkRegionalConnection() {
    return this.step.s(this.settings?.regionalConnectionPriv || '');
  }

  initIdle() {
    this.idle.setIdle(5);
    this.idle.setTimeout(this.timeOut);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // do something when the user becomes idle
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE';
    });
    // do something when the user is no longer idle
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NOT_IDLE';
      this.countdown = undefined;
      this.cdRef.detectChanges();
    });
    // do something when the user has timed out - logout
    this.idle.onTimeout.subscribe(() => {
      // if (!this.simpleNavbar) { // A petición de PA-HN mediante Renato vía Skype se solicita que el tiempo de inactividad también esté en pre-login.
      if (this.isLogin){
        this.idleState = 'TIMED_OUT';
        this.timedOut = true;
        this.modalService.dismissAll('timeout');
        this.logout('logout');
      }
      // }
    });
    // do something as the timeout countdown does its thing - warn user
    this.subscriptionService = this.idle.onTimeoutWarning.subscribe((seconds) => {
      if (this.isLogin){
        this.countdown = seconds;
        if (seconds === 20) {
          this.snackBarComponent.openSnackBar('warning', this.translate.instant('logout_due_to_inactivity'), 5000, 'end', 'top');
        }
      }
      //}
    });

    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  restarIdle() {
    this.idle.setTimeout(this.timeOut);
    this.reset();
  }


  ngOnInit(): void {
    if (this.blockingTimeTest) {
      this.timeOut = this.storageService.getItem('blockingTimeTest') === 'true' ? this.blockingTimeTemp : this.blockingTime;
    }
    this.idle.setTimeout(this.timeOut);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.logoutUrl);
    this.reset();
    this.menu = JSON.parse(this.storageService.getItem('userMenu'));
    this.linkList = socialNetwork[environment.profile];
    this.urlRegionalConnection =  this.getUrlRegionalConnection;
    if (environment.profile === 'bisv') {
      this.show = true;
    }

    this.persistStepStateService.sendParameters({
      userInfo: this.activatedRoute.snapshot.data['userInfo']
    })

    this.authenticationService.activateTimeoutKeepAliveService();

  }

  validateNavigate(){
    const urlRegional= this.getUrlRegionalConnection;

    if(urlRegional === 'home' && this.regionalConnectionIcon){
      this.regionalConnectionIcon.nativeElement.removeAttribute("target");
    }
  }

  get getUrlRegionalConnection(): string {
    const settings = JSON.parse(this.storageService.getItem("securityParameters"));

    if(!settings && !settings?.regionalConnectionPriv){
      return 'home';
    }

    return this.step.s(settings.regionalConnectionPriv) ?? '';
  }

  goToSTokenMigrate() {
    const url = this.findServiceCode.getUrl(EStokenNavigationUrlNavigation.MIGRATION);
    this.router.navigate([url])
      .catch((error) => {
        console.log(error);
      });
  }


  goToHome() {
    let parameters = { 'product': undefined };
    this.router.navigate([this.home]).finally(() => {
      this.parameterManagemen.sendParameters(parameters);
    });
  }

  goToTransfer() {
    const isReloaded = this.restUrl(this.util.getUrlTransferOwn());
    this.router.navigate([this.util.getUrlTransferOwn()]).then(() => {
      if (isReloaded) {
        this.util.resetStorage();
        window.location.reload();
      }
    })
    .catch((error) => console.error(error));
  }

  restUrl(urlParam: string): boolean {
    const url = this.router.url.split('?')[0];

    return url === `${urlParam}`;
  }

  goToUtilitiesPay() {
    const payOption = (environment.profile !== 'bipa') ? 'pay-service' : 'service_payment';
    this.router.navigate(['/' + payOption])
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  }


  logout(route?: string) {
    this.imageNavigateLogout = true;
    clearTimeout(this.timeOutkeepAlive);
    delete this.timeOutkeepAlive;
    this.spinner.show('main-spinner-logout')
    .catch((error) => console.error(error));
    if (this.preLogoutNavigation()) {
      this.router.navigate(['login'])
      .catch((error) => console.error(error));

      this.spinner.hide('main-spinner-logout')
      .catch((error) => console.error(error));
    } else {
      setTimeout(() => {
        const authService = this.authenticationService.logout(route);
        lastValueFrom(authService).finally(() => {});
        this.timeoutLogout = true;
      }, 5000);
    }
  }

  preLogoutNavigation(): boolean {
    return (this.router.url.indexOf('change-password') >= 1);
  }

  reset() {
    this.idle.watch();
    this.idleState = 'NOT_IDLE';
    this.countdown = undefined;
    this.lastPing = undefined;
    this.timedOut = false;
  }

  navigate(component: string) {
    if(component === 'security-profile'){
      this.navigateSecurityOption();
    }
    this.router.navigate(['/' + component])
    .catch((error) => console.error(error));
    this.isMenuCollapsed = true;
  }

  navigateSecurityOption(){
    this.privateMainframService.reloadSecurityOption();
  }

  navbarLogoutLogo(): boolean {
    return (this.styleManagement.corporateImageApplication() && (this.router.url.indexOf('/logout') >= 0));
  }

  getUrlLogoPublic(): boolean {
    return this.styleManagement.corporateImageApplication() && this.lightNavbar();
  }

  lightNavbar(): boolean {
    this.url = this.router.url;
    let found = false;
    for (const element of this.lightNavbarList) {
      if (this.url.indexOf(element) >= 0) {
        found = true;
        break;
      }
    }
    return found;
  }

  preLoggedGuard(): boolean {
    this.url = this.router.url;
    const urlProtectUpd ="/update-data"
    if ( this.clientType === "N"){
      if (this.code === "302" && !this.preLoggedGuardList.includes(urlProtectUpd)) {
        this.preLoggedGuardList.push("/update-data")
      }
    }
    return this.preLoggedGuardList.includes(this.url);
  }


  imageNavigate() {
    if (this.preLoggedGuard()) {
      this.logout('login');
      return;
    }

    if (this.imageNavigateLogout) {
      return;
    }

    if (this.encryptionTest || this.blockingTimeTest) {
      this.stateMangerService.accountant();
    } else {
      this.handleValidateUserPreLogged();
    }
  }

  handleValidateUserPreLogged() {
    let component = this.preLoggedGuard() ? 'login' : 'home';

    if (this.router.url.includes('private-help')) {
      component = 'home';
    }

    if (this.preLoggedGuard()) {
      this.checkProfileService.validateUser()
        .subscribe({
          next: (result) => {
            this.validateUserService = result.postponeTimes;
            if (this.validateUserService > 0) {
              this.router.navigate(['/login'])
             .catch((error) => console.error(error));
            }
          },
          error: (error: HttpErrorResponse) => {
            this.router.navigate(['/login'])
      .catch((error) => console.error(error));
          }
        })
    } else {
      if (component === this.home) {
        let parameters = { 'product': undefined };
        this.parameterManagemen.sendParameters(parameters);
      }

      this.router.navigate(['/' + component])
      .catch((error) => console.error(error));
      this.isMenuCollapsed = true;
    }
  }

  showAlertTimeOut(type: string, service: string) {

    if (type === 'error') {

      this.snackBarComponent.openSnackBar(type,
        this.translate.instant('error_time_out_services', { service }),
        5000, 'end', 'top');
    } else if (type === 'warning') {

      this.snackBarComponent.openSnackBar(type,
        this.translate.instant('warning_time_out_services', { service }),
        5000, 'end', 'top');
    }
  }

  showAlertTest(status: boolean) {
    if (this.encryptionTest) {
      this.handleShowAlertForEncryptionTest(status);
    }
    if (this.blockingTimeTest) {
      this.handleShowAlertForBlockingTimeTest(status);
    }

    if (this.blockingTimeTest && this.encryptionTest) {
      this.handleShowAlertForEncryptionTestAndBlockingTimeTest(status);
    }
  }

  handleShowAlertForEncryptionTest(status: boolean) {
    if (status) {
      this.snackBarComponent.openSnackBar('success',
        this.translate.instant('Cifrado híbrido activado'),
        5000, 'end', 'top');
    } else {
      this.snackBarComponent.openSnackBar('error',
        this.translate.instant('Encriptación híbrida desactivada'),
        5000, 'end', 'top');
    }
  }

  handleShowAlertForBlockingTimeTest(status: boolean) {
    this.timeOut = status ? this.blockingTime : this.blockingTimeTemp;
    this.idle.setTimeout(this.timeOut);
    this.reset();

    if (status) {
      this.snackBarComponent.openSnackBar('success',
        this.translate.instant('Tiempo de bloqueo de 10 min activado'),
        5000, 'end', 'top');
    } else {
      this.snackBarComponent.openSnackBar('error',
        this.translate.instant('Tiempo de bloqueo de 10 min cambiado a 30 segundos'),
        5000, 'end', 'top');
    }
  }

  handleShowAlertForEncryptionTestAndBlockingTimeTest(status: boolean) {
    this.timeOut = status ? this.blockingTime : this.blockingTimeTemp;
    this.idle.setTimeout(this.timeOut);
    this.reset();

    if (status) {
      this.snackBarComponent.openSnackBar('success',
        this.translate.instant('Cifrado híbrido y tiempo de bloqueo de 10 min activado'),
        5000, 'end', 'top');
    } else {
      this.snackBarComponent.openSnackBar('error',
        this.translate.instant('Encriptación híbrida desactivada y tiempo de bloqueo de 10 min cambiado a 30 segundos'),
        5000, 'end', 'top');
    }
  }

  goUpdateData() {

    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;

    modal.dismissed.subscribe((a) => {
      return;
    });

    modal.result.then(result => {
      if (!result) { return; }

      this.router.navigate(['/update-data']);
    }).catch(error => error);
  }

  public ngOnDestroy(): void {
    if (this.menuLoadSubscription) {
      this.menuLoadSubscription.unsubscribe();
    }
    if (this.onIdleStartSubscription) {
      this.onIdleStartSubscription.unsubscribe();
    }
    if (this.onIdleEndSubscription) {
      this.onIdleEndSubscription.unsubscribe();
    }
    if (this.onTimeoutSubscription) {
      this.onTimeoutSubscription.unsubscribe();
    }
    if (this.onTimeoutWarningSubscription) {
      this.onTimeoutWarningSubscription.unsubscribe();
    }
    if (this.onPingSubscription) {
      this.onPingSubscription.unsubscribe();
    }
    if (this.subscriptionMangerService) {
      this.subscriptionMangerService.unsubscribe();
    }
    if (this.subscriptionMangerService) {
      this.subscriptionMangerService.unsubscribe();
    }
  }

  softToken(): boolean{
    this.url = this.router.url
    return EStokenRoutesNewUser.WELCOME_SCREEN === this.url
   
    
  }
}
