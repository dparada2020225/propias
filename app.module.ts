import {HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpClientModule} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import * as equivalenceMenu from './../assets/data/menu-service-equivalence.json';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {InternetExplorerBlockComponent} from './view/public/internet-explorer-block/internet-explorer-block.component';
import {MultiTranslateHttpLoaderService} from './service/i18n/multi-translate-http-loader.service';
import {CustomPhonePipe} from './pipes/custom-phone.pipe';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MainFrameComponent} from './view/public/main-frame/main-frame.component';
import {LoginComponent} from './view/public/login/login.component';
import {HelpComponent} from './view/public/help-component/help.component';
import {ScheduleComponent} from './view/public/schedule/schedule.component';
import {RecoverPasswordComponent} from './view/public/recover-password/recover-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ListFeaturesFixesModalComponent
} from './view/public/list-features-fixes-modal/list-features-fixes-modal.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IMaskModule} from 'angular-imask';
import {
  AdfSecurityModule,
  AngularEncryptStorageService,
  AuthenticationService,
  AuthGuard,
  BankingAuthenticationService,
  KeepAliveService,
  LoggedGuard,
  StorageService,
} from '@adf/security';
import {AdfComponentsModule} from '@adf/components';
import {ProductListComponent} from './view/public/product-list/product-list.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {VersionInformationModal} from './view/public/version-information-modal/version-information-modal.component';
import {TimeoutService} from './service/private/time-out/timeout.service';
import {SecurityNavigationResolver} from './resolvers/security-navigation.resolver';
import {StatusMessageHeader500Interceptor} from './interceptor/status-message-header500.interceptor';
import {ProxyInterceptor} from './interceptor/proxy.interceptor';
import {HeaderInterceptor} from './interceptor/header.interceptor';
import {EvaluateResponseInterceptor} from './interceptor/evaluate-response.interceptor';
import {RegistrationRequiredInterceptor} from './interceptor/registration-required.interceptor';
import {TimeOutInterceptor} from './interceptor/time-out.interceptor';
import {RefreshTokenInterceptor} from './interceptor/refresh-token.interceptor';
import {EncryptionInterceptor} from './interceptor/encryption.interceptor';
import {PrivateMainFrameComponent} from './view/private/private-main-frame/private-main-frame.component';
import {SecurityOptionComponent} from './view/private/security-option/security-option.component';
import {ChangePasswordComponent} from './view/private/security-option/change-password/change-password.component';
import {PasswordPeriodComponent} from './view/private/security-option/password-period/password-period.component';
import {
  PersonalInformationComponent
} from './view/private/security-option/personal-information/personal-information.component';
import {
  PhoneChangeValidationModalComponent
} from './view/private/security-option/phone-change-validation-modal/phone-change-validation-modal.component';
import {TextModalComponent} from './view/private/security-option/text-modal/text-modal.component';
import {VideoModalComponent} from './view/private/security-option/video-modal/video-modal.component';
import {TokenComponent} from './view/private/token/token.component';
import {ModalTokenComponent} from './view/private/token/modal-token/modal-token.component';
import {RoutingSecurityOptionComponent} from './view/private/routing-security-option/routing-security-option.component';
import {PostponeModalComponent} from './view/private/routing-security-option/postpone-modal/postpone-modal.component';
import {TokenModalComponent} from './view/private/token-modal/token-modal.component';
import {
  SecurityOptionModalComponent
} from './view/private/routing-security-option/security-option-modal/security-option-modal.component';
import {HomePrivateComponent} from './view/private/home-private/home-private.component';

import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {StickyDirectiveModule} from 'ngx-sticky-directive';
import {MenuComponent} from './view/private/menu/menu.component';
import {
  DefaultProductSectionComponent
} from './view/private/home-private/default-product-section/default-product-section.component';
import {
  CreditCardSectionComponent
} from './view/private/home-private/credit-card-section/credit-card-section.component';
import {FixTermSectionComponent} from './view/private/home-private/fix-term-section/fix-term-section.component';
import {LoanSectionComponent} from './view/private/home-private/loan-section/loan-section.component';
import {EmbeddedObComponent} from './view/private/embedded-ob/embedded-ob.component';
import {LogoutComponent} from './view/public/logout/logout.component';
import {SharedModule} from './modules/shared/shared.module'
import {AverageBalanceComponent} from './view/private/average-balance/average-balance.component';
import {ReservationDetailComponent} from './view/private/reservation-detail/reservation-detail.component';
import {AccountBalanceComponent} from './view/private/account-balance/account-balance.component';
import {MaterialModule} from './modules/material/material.module';
import localeEs from '@angular/common/locales/es-PE';
import localeEn from '@angular/common/locales/en';
import {LoanModule} from './modules/loan/loan.module';
import {FooterComponent} from './view/private/private-main-frame/footer/footer.component';
import {
  SecurityLimitsComponent
} from './view/private/security-option/option-limits/components/security-limits/security-limits.component';
import {
  SpHomeDashboardComponent
} from './view/private/security-option/option-limits/components/sp-home-dashboard/sp-home-dashboard.component';
import {
  SpModalLastChangesComponent
} from './view/private/security-option/option-limits/components/sp-modal-last-changes/sp-modal-last-changes.component';
import {FooterModule} from './modules/footer/footer.module';
import {OnboardingModalComponent} from './view/private/onboarding-modal/onboarding-modal.component';
import {
  RegionalConnectionErrorComponent
} from './view/private/regional-connection-error/regional-connection-error.component';
import {ChecksumInterceptor} from "./interceptor/checksum.interceptor";
import { UpdateDataComponent } from './view/private/security-option/update-data/components/update-data/update-data.component';
import { VoucherUpdateDataComponent } from './view/private/security-option/update-data/components/voucher-update-data/voucher-update-data.component';
import { StokenBisvModule } from './view/private/soft-token/modules/stoken-bisv/stoken-bisv.module';

const languageCode = localStorage.getItem('code');
let INITIAL_LANGUAGE = 'es';

if (languageCode) {
  INITIAL_LANGUAGE = languageCode;
}

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');

export function createTranslateLoader(httpBackend: HttpBackend) {
  const http = new HttpClient(httpBackend);
  return new MultiTranslateHttpLoaderService(http, [
    {prefix: './assets/i18n/', suffix: '.json?ngsw-bypass=true'},
    {prefix: './assets/i18n/', suffix: `_${environment.profile}.json?ngsw-bypass=true`},
  ]);
}

@NgModule({
  declarations: [
    FooterComponent,
    AppComponent,
    InternetExplorerBlockComponent,
    CustomPhonePipe,
    MainFrameComponent,
    LoginComponent,
    HelpComponent,
    ScheduleComponent,
    RecoverPasswordComponent,
    ListFeaturesFixesModalComponent,
    ProductListComponent,
    VersionInformationModal,
    PrivateMainFrameComponent,
    SecurityOptionComponent,
    ChangePasswordComponent,
    PasswordPeriodComponent,
    PersonalInformationComponent,
    PhoneChangeValidationModalComponent,
    TextModalComponent,
    VideoModalComponent,
    TokenComponent,
    ModalTokenComponent,
    RoutingSecurityOptionComponent,
    PostponeModalComponent,
    TokenModalComponent,
    SecurityOptionModalComponent,
    HomePrivateComponent,
    MenuComponent,
    DefaultProductSectionComponent,
    CreditCardSectionComponent,
    FixTermSectionComponent,
    LoanSectionComponent,
    EmbeddedObComponent,
    LogoutComponent,
    AverageBalanceComponent,
    ReservationDetailComponent,
    AccountBalanceComponent,
    SecurityLimitsComponent,
    SpHomeDashboardComponent,
    SpModalLastChangesComponent,
    OnboardingModalComponent,
    RegionalConnectionErrorComponent,
    UpdateDataComponent,
    VoucherUpdateDataComponent,
    VoucherUpdateDataComponent
    ],
  imports: [
    StokenBisvModule,
    CommonModule,
    NgxSpinnerModule,
    StickyDirectiveModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    AdfSecurityModule.forRoot(environment['security'], equivalenceMenu, environment['profile'], environment.encryptionEnabled),
    LoanModule,
    AdfComponentsModule,
    IMaskModule,
    SharedModule,
    TranslateModule.forRoot({
      defaultLanguage: INITIAL_LANGUAGE,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FooterModule
  ],
  providers: [
    TimeoutService,
    KeepAliveService,
    SecurityNavigationResolver,
    {provide: AuthGuard, useClass: AuthGuard},
    {provide: LoggedGuard, useClass: LoggedGuard},
    {provide: AuthenticationService, useClass: BankingAuthenticationService},
    {provide: StorageService, useClass: AngularEncryptStorageService},
    {provide: HTTP_INTERCEPTORS, useClass: StatusMessageHeader500Interceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: EvaluateResponseInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ChecksumInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: RegistrationRequiredInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimeOutInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: EncryptionInterceptor, multi: true},
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
