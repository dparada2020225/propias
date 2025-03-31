import { LoggedGuard, PreLoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockMenuGuard } from './guards/block-menu.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { KeepAlive2Resolver } from './resolvers/keep-alive2.resolver';
import { PasswordPeriodResolver } from './resolvers/password-period.resolver';
import { PhoneCompaniesResolver } from './resolvers/phone-companies.resolver';
import { ProductsResolver } from './resolvers/products.resolver';
import { RoutingSecurityOptionResolver } from './resolvers/routing-security-option.resolver';
import { SecurityNavigationResolver } from './resolvers/security-navigation.resolver';
import { SecurityOptionResolver } from './resolvers/security-option.resolver';
import { SettingDataResolver } from './resolvers/setting-data.resolver';
import { TokenResolver } from './resolvers/token.resolver';
import { UrlLogResolver } from './resolvers/url-log.resolver';
import { UserInfoResolver } from './resolvers/user-info.resolver';
import { AccountBalanceComponent } from './view/private/account-balance/account-balance.component';
import { HomePrivateComponent } from './view/private/home-private/home-private.component';
import { PrivateMainFrameComponent } from './view/private/private-main-frame/private-main-frame.component';
import { RoutingSecurityOptionComponent } from './view/private/routing-security-option/routing-security-option.component';
import {
  SecurityLimitsComponent
} from './view/private/security-option/option-limits/components/security-limits/security-limits.component';
import { SecurityLimitsGuard } from './view/private/security-option/option-limits/guards/security-limits.guard';
import {
  SpCurrentLimitsResolver
} from './view/private/security-option/option-limits/resolvers/sp-current-limits.resolver';
import { SecurityOptionComponent } from './view/private/security-option/security-option.component';
import { TokenComponent } from './view/private/token/token.component';
import { HelpComponent } from './view/public/help-component/help.component';
import { LoginComponent } from './view/public/login/login.component';
import { LogoutComponent } from './view/public/logout/logout.component';
import { MainFrameComponent } from './view/public/main-frame/main-frame.component';
import { RecoverPasswordComponent } from './view/public/recover-password/recover-password.component';
import { ScheduleComponent } from './view/public/schedule/schedule.component';
import { TokenRequestSettingsResolver } from './resolvers/token-request-settings.resolver';
import { RegionalConnectionErrorComponent } from './view/private/regional-connection-error/regional-connection-error.component';
import { UpdateDataComponent } from './view/private/security-option/update-data/components/update-data/update-data.component';
import { VoucherUpdateDataComponent } from './view/private/security-option/update-data/components/voucher-update-data/voucher-update-data.component';
import { UpdateDatacheduleService } from './view/private/security-option/update-data/enum/update-data-status.interfaces';
import { ScheduleServiceResolver } from './resolvers/schedule-service.resolver';
import { DinamicFormResolver } from './view/private/security-option/update-data/resolver/dinamic-form.resolver';
import { UpdCallResolver } from './view/private/security-option/update-data/resolver/upd-call.resolver';
import { StokenPreloginGuard } from './view/private/soft-token/modules/stoken-bisv/guards/stoken-prelogin.guard';
import { NewUserStokenGuard } from './guards/new-user-stoken.guard';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: 'regional-connection-error', pathMatch: 'full', component: RegionalConnectionErrorComponent },
  {
    path: "",
    component: MainFrameComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "help", component: HelpComponent },
      { path: "schedule", component: ScheduleComponent },
      { path: "recover-password", component: RecoverPasswordComponent },
    ],
    resolve: {
      settingData: SettingDataResolver
    }
  },
  {
    path: "",
    component: PrivateMainFrameComponent,
    children: [
      {
        path: "change-password",
        component: SecurityOptionComponent,
        data: { type: 2 },
        canActivate: [PreLoggedGuard],
        resolve: {
          keepAlive2Resolver: KeepAlive2Resolver,

        },
      },
    ]
  },
  {
    path: "",
    component: PrivateMainFrameComponent,
    children: [
      {
        path: "token",
        component: TokenComponent,
        data: { simpleNavbar: true },
        resolve: {
          tokenType: TokenResolver
        },
        canActivate: [PreLoggedGuard],
      },
      {
        path: "update-data",
        component: UpdateDataComponent,
        data: {
          service: UpdateDatacheduleService.UPDATE_DATA,
        },
        resolve: {
          scheduleService: ScheduleServiceResolver,
          dynamicResolver: DinamicFormResolver,
          infoUpd: UpdCallResolver
        },
        canActivate: [LoggedGuard],
      },
      {
        path: "update-data-voucher",
        component: VoucherUpdateDataComponent,
        data: {
          service: UpdateDatacheduleService.UPDATE_DATA,
        },
        resolve: {
          scheduleService: ScheduleServiceResolver,
        },
        canActivate: [LoggedGuard],
      },

      {
        path: "routing-security-option",
        component: RoutingSecurityOptionComponent,
        data: { simpleNavbar: true },
        resolve: {
          routingSecurityOption: RoutingSecurityOptionResolver,
          urlLog: UrlLogResolver,
        },
        canActivate: [LoggedGuard],
      },
      {
        path: "home",
        component: HomePrivateComponent,
          canActivate: [LoggedGuard, RequireSecurityProfileGuard, NewUserStokenGuard],
        resolve: {
          products: ProductsResolver,
          keepAlive2Resolver: KeepAlive2Resolver,
          tokenRequestSettings: TokenRequestSettingsResolver,
        },
        runGuardsAndResolvers: "always",
      },
      {
        path: "checks",
        component: HomePrivateComponent,
        data: { product: '01' },
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          products: ProductsResolver,
          securityResolver: SecurityNavigationResolver,
        },
        runGuardsAndResolvers: "always",
      },
      {
        path: "savings",
        component: HomePrivateComponent,
        data: { product: '02' },
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          products: ProductsResolver,
          securityResolver: SecurityNavigationResolver,
        },
        runGuardsAndResolvers: "always",
      },
      {
        path: "fixed-term",
        component: HomePrivateComponent,
        data: { product: '03' },
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          products: ProductsResolver,
          securityResolver: SecurityNavigationResolver,
        },
        runGuardsAndResolvers: "always",
      },
      {
        path: "general-inquiry",
        component: HomePrivateComponent,
        data: { product: '04' },
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          products: ProductsResolver,
          securityResolver: SecurityNavigationResolver,
        },
        runGuardsAndResolvers: "always",
      },
      {
        path: "summary",
        component: HomePrivateComponent,
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          products: ProductsResolver,
          keepAlive2Resolver: KeepAlive2Resolver,

        },
        data: { summary: true },
      },
      {
        path: "private-help",
        component: HelpComponent,
        data: { simpleNavbar: true },
        resolve: {
          keepAlive2Resolver: KeepAlive2Resolver
        },
      },
      {
        path: "security-option",
        component: SecurityOptionComponent,
        data: { type: 1 },
        canActivate: [LoggedGuard],
        resolve: {
          phoneCompanies: PhoneCompaniesResolver,
          passwordPeriod: PasswordPeriodResolver,
          securityOption: SecurityOptionResolver,
          keepAlive2Resolver: KeepAlive2Resolver,
          urlLog: UrlLogResolver,
        },
      },
      {
        path: "security-profile",
        component: SecurityOptionComponent,
        data: { type: 3 },
        canActivate: [LoggedGuard, RequireSecurityProfileGuard],
        resolve: {
          phoneCompanies: PhoneCompaniesResolver,
          passwordPeriod: PasswordPeriodResolver,
          securityOption: SecurityOptionResolver,
          keepAlive2Resolver: KeepAlive2Resolver
        },
      },
      {
        path: "security-limits",
        component: SecurityLimitsComponent,
        canActivate: [LoggedGuard, RequireSecurityProfileGuard, SecurityLimitsGuard],
        resolve: {
          currentLimits: SpCurrentLimitsResolver,
          keepAlive2Resolver: KeepAlive2Resolver
        },
      },
      {
        path: "account-balance",
        component: AccountBalanceComponent,
        canActivate: [PermissionsGuard],
        runGuardsAndResolvers: "always",
        resolve: {
          keepAlive2Resolver: KeepAlive2Resolver,

        },
      },
      {
        path: "logout",
        component: LogoutComponent,
        data: { simpleNavbar: true },
      },
      {
        path: "",
        canActivate: [
        ],
        loadChildren: () =>
          import("./modules/embedded/embedded.module").then(
            (m) => m.EmbeddedModule
          )
      },
      {
        path: '',
        loadChildren: () =>
          import('./modules/investments/investments.module').then(
            (m) => m.InvestmentsModule
          )
      },
      {
        path: "statements",
        loadChildren: () =>
          import("./modules/statements/statements.module").then(
            (m) => m.StatementsModule
          )
      },
      {
        path: "transaction-manager-payroll",
        loadChildren: () =>
          import("./modules/transaction-manager/transaction-manager.module").then(
            (m) => m.TransactionManagerModule
          )
      },
      {
        path: "transaction-manager",
        loadChildren: () =>
          import("./modules/transaction-manager/transaction-manager.module").then(
            (m) => m.TransactionManagerModule
          )
      },
      {
        path: "accounts-management",
        loadChildren: () =>
          import("./modules/accounts-management/accounts-management.module").then(
            (m) => m.AccountsManagementModule
          )
      },
      {
        path: "transfer",
        loadChildren: () =>
          import("./modules/transfer/transfer.module").then(
            (m) => m.TransferModule
          )
      },
      {
        path: "transfer",
        loadChildren: () =>
          import("./modules/transfer/transfer.module").then(
            (m) => m.TransferModule
          )
      },
      {
        path: "payments",
        loadChildren: () =>
          import("./modules/payment-suppliers/payment-suppliers.module").then(
            (m) => m.PaymentSuppliersModule
          )
      },
      {
        path: "loan",
        loadChildren: () =>
          import("./modules/loan/loan.module").then(
            (m) => m.LoanModule
          )
      },
      {
        path: "new-user/soft-token",
        data: { simpleNavbar: true },
        canActivate: [
          PreLoggedGuard,
          StokenPreloginGuard
        ],
        loadChildren: () =>
          import("./view/private/soft-token/modules/stoken-bisv/modules/public/stkn-new-user/stkn-bisv-new-user.module").then(
            (m) => m.StknBisvNewUserModule
          )
      },
      {
        path: "soft-token",
        loadChildren: () =>
          import("./view/private/soft-token/modules/stoken-bisv/stoken-bisv.module").then(
            (m) => m.StokenBisvModule
          )
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./modules/payroll/payroll.module').then(
            (m) => m.PayrollModule
          )
      },
    ],
    resolve: {
      userInfo: UserInfoResolver,
      settingData: SettingDataResolver,
      infoUpd: UpdCallResolver
    },
    canActivate: [BlockMenuGuard],

  },
  { path: "**", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],

})
export class AppRoutingModule { }
