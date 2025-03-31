import { LoggedGuard, RequireSecurityProfileGuard } from '@adf/security';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepAlive2Resolver } from 'src/app/resolvers/keep-alive2.resolver';
import { EmbeddedObComponent } from 'src/app/view/private/embedded-ob/embedded-ob.component';

const routes: Routes = [
  {
    path: 'account-statement',
    component: EmbeddedObComponent,
    data: { service: 'estado-cta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'suppliers-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-pro' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'user-administration',
    component: EmbeddedObComponent,
    data: { service: 'uad-admin' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-line-consultation',
    component: EmbeddedObComponent,
    data: { service: 'adq-cncrad' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'disbursement-request',
    component: EmbeddedObComponent,
    data: { service: 'adq-desemb' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-statement-pos',
    component: EmbeddedObComponent,
    data: { service: 'adq-estcra' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'transaction-history',
    component: EmbeddedObComponent,
    data: { service: 'seg-cnhtrx' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'special-payroll-payment',
    component: EmbeddedObComponent,
    data: { service: 'pla-wal' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'lines-credit',
    component: EmbeddedObComponent,
    data: { service: 'aba-icllc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'list-requisitions',
    component: EmbeddedObComponent,
    data: { service: 'aba-iclrq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'requisition-authorization',
    component: EmbeddedObComponent,
    data: { service: 'aba-iadrq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-lines',
    component: EmbeddedObComponent,
    data: { service: 'aba-fcnlc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'list-requisition',
    component: EmbeddedObComponent,
    data: { service: 'aba-fclrq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'entry-requisitions',
    component: EmbeddedObComponent,
    data: { service: 'aba-finrq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'payments',
    component: EmbeddedObComponent,
    data: { service: 'aba-fclpt' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'vendor-management',
    component: EmbeddedObComponent,
    data: { service: 'aba-fclpt' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-paid-vendor',
    component: EmbeddedObComponent,
    data: { service: 'pro-cltpag' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'vendor-payment',
    component: EmbeddedObComponent,
    data: { service: 'pro-pag' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'ach-supplier-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-proach' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-administration',
    component: EmbeddedObComponent,
    data: { service: 'ach-cnsadm' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'transaction-follow-up',
    component: EmbeddedObComponent,
    data: { service: 'seg-statrx' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'third-party-transfers',
    component: EmbeddedObComponent,
    data: { service: 'tra-ctater' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'donations',
    component: EmbeddedObComponent,
    data: { service: 'ope-dncs' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'ach-operations',
    component: EmbeddedObComponent,
    data: { service: 'ach-cnsope' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'membership-t365-to-own-account',
    component: EmbeddedObComponent,
    data: { service: 'web-af365m' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'administration-t365',
    component: EmbeddedObComponent,
    data: { service: 'web-ad365m' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'transfers-between-accounts',
    component: EmbeddedObComponent,
    data: { service: 'transfer' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'inter-banking-transfer',
    component: EmbeddedObComponent,
    data: { service: 'ach-transf' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'file-upload-transfers',
    component: EmbeddedObComponent,
    data: { service: 'ach-cararc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'file-upload-transfers-365',
    component: EmbeddedObComponent,
    data: { service: 'ach-car365' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-operation',
    component: EmbeddedObComponent,
    data: { service: 'ach-conope' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'monthly-account-statement',
    component: EmbeddedObComponent,
    data: { service: 'adq-edocta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'transactions-date',
    component: EmbeddedObComponent,
    data: { service: 'adq-cnstrx' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'record-sales-tax',
    component: EmbeddedObComponent,
    data: { service: 'adq-cnsrec' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'monthly-transaction-volume',
    component: EmbeddedObComponent,
    data: { service: 'adq-voltrx' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'invoice-uploading',
    component: EmbeddedObComponent,
    data: { service: 'cpr-subarc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'payment-cp-loans',
    component: EmbeddedObComponent,
    data: { service: 'cpr-lispag' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-invoice-status',
    component: EmbeddedObComponent,
    data: { service: 'cpr-lisprv' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-lines-of-credit',
    component: EmbeddedObComponent,
    data: { service: 'cpr-lincre' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'invoice-management',
    component: EmbeddedObComponent,
    data: { service: 'cpr-gesfac' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'salary-deducted-loan',
    component: EmbeddedObComponent,
    data: { service: 'lib-envlot' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'check-notice',
    component: EmbeddedObComponent,
    data: { service: 'chp-regchq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-notice',
    component: EmbeddedObComponent,
    data: { service: 'chp-cnschq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'cancellation-notices',
    component: EmbeddedObComponent,
    data: { service: 'chp-canchq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'database-upload',
    component: EmbeddedObComponent,
    data: { service: 'mpg-pcarbd' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'database-management',
    component: EmbeddedObComponent,
    data: { service: 'mpg-padbd' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'collection-lookup',
    component: EmbeddedObComponent,
    data: { service: 'mpg-pcoco' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'valid-record-update',
    component: EmbeddedObComponent,
    data: { service: 'mpg-pacrg' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'sap-vendor-management',
    component: EmbeddedObComponent,
    data: { service: 'sap-proadm' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-sap-paid-batch',
    component: EmbeddedObComponent,
    data: { service: 'sap-procns' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'sap-vendor-payments',
    component: EmbeddedObComponent,
    data: { service: 'sap-pagpro' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'payroll-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-pla' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-payroll',
    component: EmbeddedObComponent,
    data: { service: 'pla-consul' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'corporate-account-statement',
    component: EmbeddedObComponent,
    data: { service: 'res-ctacor' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'international-transfer',
    component: EmbeddedObComponent,
    data: { service: 'ges-trfint' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'foreign-currency-sale',
    component: EmbeddedObComponent,
    data: { service: 'ope-vtadiv' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'tigo-recharges',
    component: EmbeddedObComponent,
    data: { service: 'ope-subdiv' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'buy-foreign-currency',
    component: EmbeddedObComponent,
    data: { service: 'ope-cmpdiv' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'accession-agreement',
    component: EmbeddedObComponent,
    data: { service: 'dei-ccont' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'rop-payment',
    component: EmbeddedObComponent,
    data: { service: 'ope-prop' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'guide-payment',
    component: EmbeddedObComponent,
    data: { service: 'ope-pguia' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'det-payment',
    component: EmbeddedObComponent,
    data: { service: 'ope-pdet' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-paid-taxes',
    component: EmbeddedObComponent,
    data: { service: 'dei-cnpag' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-paid-customs-taxes',
    component: EmbeddedObComponent,
    data: { service: 'dei-cnsapg' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'customs-duties-payment',
    component: EmbeddedObComponent,
    data: { service: 'ope-psarah' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'block-savings-accounts',
    component: EmbeddedObComponent,
    data: { service: 'bloqueocta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'stop-check-payment',
    component: EmbeddedObComponent,
    data: { service: 'bloqueochq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'banking-references',
    component: EmbeddedObComponent,
    data: { service: 'ges-refban' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'checkbook-request',
    component: EmbeddedObComponent,
    data: { service: 'sol-che' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'enable-personalized-cheques',
    component: EmbeddedObComponent,
    data: { service: 'sol-hchp' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'customer-data-update',
    component: EmbeddedObComponent,
    data: { service: 'ges-actdat' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'lps-cashier-check-request',
    component: EmbeddedObComponent,
    data: { service: 'ges-solchq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'third-party-credit-card-payment',
    component: EmbeddedObComponent,
    data: { service: 'pago-tc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'general-look-up',
    component: EmbeddedObComponent,
    data: { service: 'tc-cnsgral' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-card-account-statement',
    component: EmbeddedObComponent,
    data: { service: 'tc-edocta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-card-payments',
    component: EmbeddedObComponent,
    data: { service: 'tc-pago' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-card-down-payment',
    component: EmbeddedObComponent,
    data: { service: 'tc-pantic' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'expense-summary',
    component: EmbeddedObComponent,
    data: { service: 'tc-sresgas' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'split-it-all',
    component: EmbeddedObComponent,
    data: { service: 'tc-divtodo' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'loan-payment',
    component: EmbeddedObComponent,
    data: { service: 'pago-ptmos' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'Credit-card-down-payment',
    component: EmbeddedObComponent,
    data: { service: 'ope-anttc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'third-party-transfer-management',
    component: EmbeddedObComponent,
    data: { service: 'ttr-admin' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'tigo-recharge',
    component: EmbeddedObComponent,
    data: { service: 'ope-rctg' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'claro-recharges',
    component: EmbeddedObComponent,
    data: { service: 'ope-rccl' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'service-payment',
    component: EmbeddedObComponent,
    data: { service: 'mnu-mpps' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'what-are-service-payments',
    component: EmbeddedObComponent,
    data: { service: 'mpg-cinfo' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'pay-service',
    component: EmbeddedObComponent,
    data: { service: 'mpg-cpago' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'payment-lookup',
    component: EmbeddedObComponent,
    data: { service: 'mpg-ccnhp' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'bulk-payments',
    component: EmbeddedObComponent,
    data: { service: 'mpg-cpmpg' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'bulk-payment-lookup',
    component: EmbeddedObComponent,
    data: { service: 'mpg-cpmcn' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-card-request',
    component: EmbeddedObComponent,
    data: { service: 'tc-solic' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'request-new-pin',
    component: EmbeddedObComponent,
    data: { service: 'tc-solpin' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'look-up-lines-credit',
    component: EmbeddedObComponent,
    data: { service: 'pym-cnslc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'disbursement',
    component: EmbeddedObComponent,
    data: { service: 'pym-desemb' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'international-transfers',
    component: EmbeddedObComponent,
    data: { service: 'transf-int' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'loans-payments',
    component: EmbeddedObComponent,
    data: { service: 'pago-ptmos' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'loan-account-statement',
    component: EmbeddedObComponent,
    data: { service: 'estado-cta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-statements',
    component: EmbeddedObComponent,
    data: { service: 'estado-cta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'payment',
    component: EmbeddedObComponent,
    data: { service: 'tc-pago' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'cash-advance',
    component: EmbeddedObComponent,
    data: { service: 'tc-pantic' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'expenses-report',
    component: EmbeddedObComponent,
    data: { service: 'tc-sresgas' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-afiliation',
    component: EmbeddedObComponent,
    data: { service: 'afi-add' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'third-party-transfer',
    component: EmbeddedObComponent,
    data: { service: 'tra-ctater' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-disaffiliation',
    component: EmbeddedObComponent,
    data: { service: 'afi-des' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'account-statement-summary',
    component: EmbeddedObComponent,
    data: { service: 'res-edocta' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'service_payment',
    component: EmbeddedObComponent,
    data: { service: 'pagser-ope' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'finance-payment',
    component: EmbeddedObComponent,
    data: { service: 'hac-pagimp' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'finance-payment-npe',
    component: EmbeddedObComponent,
    data: { service: 'ope-hacnpe' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'anda-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-anda' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'scheduled-payments',
    component: EmbeddedObComponent,
    data: { service: 'ppg-pagprg' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'isss-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-isss' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'credit-card-payments-sv',
    component: EmbeddedObComponent,
    data: { service: 'ptc-pagtar' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'collectors-payment',
    component: EmbeddedObComponent,
    data: { service: 'pxp-pagser' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'afp-crecer-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-afpcre' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'afp-confia-payment',
    component: EmbeddedObComponent,
    data: { service: 'pag-afpcon' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'reportes-fideicomisos',
    component: EmbeddedObComponent,
    data: { service: 'mnu-cnsfid' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'loan-listing-requisition',
    component: EmbeddedObComponent,
    data: { service: 'aba-fdlrq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'trusts-balances',
    component: EmbeddedObComponent,
    data: { service: 'con-fid' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'consolidated-account-statement-export',
    component: EmbeddedObComponent,
    data: { service: 'cns-ectcn' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'international-check-request',
    component: EmbeddedObComponent,
    data: { service: 'ges-solchd' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'con-sal',
    component: EmbeddedObComponent,
    data: { service: 'con-sal' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'tc-mnublq',
    component: EmbeddedObComponent,
    data: { service: 'tc-mnublq' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'tc-blqdtc',
    component: EmbeddedObComponent,
    data: { service: 'tc-blqdtc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'tc-cnstcs',
    component: EmbeddedObComponent,
    data: { service: 'tc-cnstcs' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'ttr-trastk',
    component: EmbeddedObComponent,
    data: { service: 'ttr-trastk' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'ttr-deflim',
    component: EmbeddedObComponent,
    data: { service: 'ttr-deflim' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'cns-chqtrc',
    component: EmbeddedObComponent,
    data: { service: 'cns-chqtrc' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'timo-mnu',
    component: EmbeddedObComponent,
    data: { service: 'timo-mnu' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'mnu-trante',
    component: EmbeddedObComponent,
    data: { service: 'mnu-trante' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'mnu-lbtrep',
    component: EmbeddedObComponent,
    data: { service: 'mnu-lbtrep' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'mnu-oblbcr',
    component: EmbeddedObComponent,
    data: { service: 'mnu-oblbcr' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'pro-admin',
    component: EmbeddedObComponent,
    data: { service: 'pro-admin' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'embedded-ob',
    component: EmbeddedObComponent,
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: 'admin-international-account-management',
    component: EmbeddedObComponent,
    data: { service: 'web-mtosip' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
  {
    path: "international-account-management",
    component: EmbeddedObComponent,
    data: { service: 'trf-sipa' },
    resolve: {
      keepAlive2Resolver: KeepAlive2Resolver,
    },
    canActivate: [LoggedGuard, RequireSecurityProfileGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmbeddedRoutingModule {}
