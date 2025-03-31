import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'request',
    loadChildren: (() => import('./modules/b2b-request/b2b-request.module').then(
      (m) => m.B2bRequestModule
    ))
  },
  {
    path: 'payment',
    loadChildren: (() => import('./modules/b2b-payment/b2b-payment.module').then(
      (m) => m.B2bPaymentModule
    ))
  },
  {
    path: 'consultation',
    loadChildren: (() => import('./modules/b2b-consultation/b2b-consultation.module').then(
      (m) => m.B2bConsultationModule
    ))
  },
  {
    path: "third-party-loans",
    loadChildren: (() => import('./modules/third-party-loans/third-party-loans.module').then(m => m.ThirdPartyLoansModule))
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
