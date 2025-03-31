import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PsHomeComponent } from './components/ps-home/ps-home.component';
import { MenuPermissionEvaluatorGuard } from 'src/app/guards/menu-permission-evaluator.guard';
import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { PsBatchManagerComponent } from './components/load/ps-batch-manager/ps-batch-manager.component';
import { NavigationProtectedGuard } from 'src/app/guards/navigation-protected.guard';
import { PsFileManagerComponent } from './components/load/ps-file-manager/ps-file-manager.component';
import { PsPaymentConfirmationComponent } from './components/load/ps-payment-confirmation/ps-payment-confirmation.component';
import { SPPView } from '../../payroll/manager-payroll/enums/pmp-view.enum';
import { PsFileVoucherComponent } from './components/load/ps-file-voucher/ps-file-voucher.component';
import { PsManualManagerComponent } from './components/load/ps-manual-manager/ps-manual-manager.component';
import { PsManualConfirmationComponent } from './components/load/ps-manual-confirmation/ps-manual-confirmation.component';
import { PsManualVoucherComponent } from './components/load/ps-manual-voucher/ps-manual-voucher.component';
import { PsPaymentManagerComponent } from './components/payment/ps-payment-manager/ps-payment-manager.component';
import { PaymentOfPayrollResolver } from '../../payroll/manager-payroll/resolver/source-accounts.resolver';
import { ManagerSupplierService } from './enums/manager-supplier.enum';
import { PsPaymentVoucherComponent } from './components/payment/ps-payment-voucher/ps-payment-voucher.component';
import { SPPPaymentView } from './enums/ps-view.enum';
import { SpStVoucherComponent } from './components/payment/sp-st-voucher/sp-st-voucher.component';
import { GetPaymentSupplierResolver } from './definitions/resolver/get-payment-supplier.resolver';

const routes: Routes = [
  {
    path: '',
    component: PsHomeComponent,
    canActivate: [
      MenuPermissionEvaluatorGuard,
      LoggedGuard,
      RequireSecurityProfileGuard,
    ],
  },
  {
    path: 'batch',
    component: PsBatchManagerComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'batch/upload',
    component: PsFileManagerComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'batch/file/confirmation',
    component: PsPaymentConfirmationComponent,
    data: {
      view: SPPView.LOAD_FILE
    },
    canActivate: [
      LoggedGuard,
      /* RequireSecurityProfileGuard,
      NavigationProtectedGuard */
    ],
  },
  {
    path: 'batch/file/voucher',
    component: PsFileVoucherComponent,
    data: {
      view: SPPView.LOAD_FILE
    },
    canActivate: [
      LoggedGuard,
      /* RequireSecurityProfileGuard,
      NavigationProtectedGuard */
    ],
  },
  {
    path: 'batch/manual',
    component: PsManualManagerComponent,
    canActivate: [
      LoggedGuard,
      RequireSecurityProfileGuard,
      NavigationProtectedGuard
    ],
  },
  {
    path: 'batch/manual/confirmation',
    component: PsManualConfirmationComponent,
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
    path: 'batch/voucher',
    component: PsManualVoucherComponent,
    data: {
      view: SPPView.MANUAL
    },
    canActivate: [
      LoggedGuard,
    ],
  },
  {
    path: 'payment',
    component: PsPaymentManagerComponent,
    data: {
      service: ManagerSupplierService.PAYMENT
    },
    resolve: {
      sourceAccounts: PaymentOfPayrollResolver
    },
    canActivate: [
      LoggedGuard,
      /* RequireSecurityProfileGuard,
      NavigationProtectedGuard */
    ],
  },
  {
    path: 'payment/voucher',
    component: PsPaymentVoucherComponent,
    data: {
      view: SPPPaymentView.ST_VOUCHER
    },
    canActivate: [
      LoggedGuard,
    ],
  },
  {
    path: 'payment/st-voucher',
    component: SpStVoucherComponent,
    data: {
      view: SPPPaymentView.ST_VOUCHER
    },
    resolve: {
      paymentSuppliers: GetPaymentSupplierResolver
    }
  },
  {
    path: 'payment/st-detail',
    component: SpStVoucherComponent,
    data: {
      view: SPPPaymentView.ST_DETAIL
    },
    resolve: {
      paymentSuppliers: GetPaymentSupplierResolver
    }
  },
  {
    path: 'payment/st-operation',
    component: SpStVoucherComponent,
    data: {
      view: SPPPaymentView.ST_OPERATION
    },
    resolve: {
      paymentSuppliers: GetPaymentSupplierResolver
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagmentPaymentsRoutingModule { }
