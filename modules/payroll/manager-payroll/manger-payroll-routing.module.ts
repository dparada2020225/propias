import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmpHomeComponent } from './components/pmp-home/pmp-home.component';
import { PmpLoadHomeComponent } from './components/load/pmp-load-home/pmp-load-home.component';
import { PmpUploadComponent } from './components/load/pmp-upload/pmp-upload.component';
import { SpplConfirmationComponent } from './components/load/pmpl-confirmation/sppl-confirmation.component';
import { PmplVoucherComponent } from './components/load/pmpl-voucher/pmpl-voucher.component';
import { PmpManualHomeComponent } from './components/load/pmp-manual-home/pmp-manual-home.component';
import { SPPPaymentView, SPPView } from './enums/pmp-view.enum';
import { PmppConfirmationComponent } from './components/payment/pmpp-confirmation/pmpp-confirmation.component';
import { PmppPaymentComponent } from './components/payment/pmpp-home/pmpp-payment.component';
import { PmppVoucherComponent } from './components/payment/pmpp-voucher/pmpp-voucher.component';
import { PaymentOfPayrollResolver } from './resolver/source-accounts.resolver';
import { MenuPermissionEvaluatorGuard } from '../../../guards/menu-permission-evaluator.guard';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NavigationProtectedGuard } from '../../../guards/navigation-protected.guard';
import { ManagerPayrollService } from './enums/manager-payroll.enum';

const routes: Routes = [
  {
    path: '',
    component : PmpHomeComponent,
    canActivate: [
      MenuPermissionEvaluatorGuard,
      LoggedGuard,
      RequireSecurityProfileGuard,
    ],
  },
  {
    path: 'load',
    component:PmpLoadHomeComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'load/upload',
    component:PmpUploadComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'load/file/confirmation',
    component:SpplConfirmationComponent,
    data: {
      view: SPPView.LOAD_FILE
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'load/file/voucher',
    component: PmplVoucherComponent,
    data: {
      view: SPPView.LOAD_FILE
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'load/manual',
    component: PmpManualHomeComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'load/manual/confirmation',
    component: SpplConfirmationComponent,
    data: {
      view: SPPView.MANUAL
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'load/manual/voucher',
    component: PmplVoucherComponent,
    data: {
      view: SPPView.MANUAL
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'payment',
    component: PmppPaymentComponent,
    data: {
      service: ManagerPayrollService.ADMIN_PANEL
    },
    resolve: {
      sourceAccounts: PaymentOfPayrollResolver
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'payment/confirmation',
    component: PmppConfirmationComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'payment/voucher',
    component: PmppVoucherComponent,
    data: {
      view: SPPPaymentView.DEFAULT
    },
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard,
    ],
  },
  {
    path: 'payment/st-voucher',
    component: PmppVoucherComponent,
    data: {
      view: SPPPaymentView.ST_VOUCHER
    }
  },
  {
    path: 'payment/st-detail',
    component: PmppVoucherComponent,
    data: {
      view: SPPPaymentView.ST_DETAIL
    }
  },
  {
    path: 'payment/st-operation',
    component: PmppVoucherComponent,
    data: {
      view: SPPPaymentView.ST_OPERATION
    }
  },
  {
    path: 'payment/history',
    component: PmppVoucherComponent,
    data: {
      view: SPPPaymentView.TH_VOUCHER
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MangerPayrollRoutingModule { }
