import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'history',
    loadChildren: (() => import('./modules/transaction-history/transaction-history.module').then(
      (m) => m.TransactionHistoryModule
    ))
  },
  {
    path: 'signature-tracking',
    loadChildren: (() => import('./modules/signature-tracking/signature-tracking.module').then(
      (m) => m.SignatureTrackingModule
    ))
  },
  {
    path: 'ach',
    loadChildren: (() => import('./modules/ach/ach.module').then(
      (m) => m.AchModule
    ))
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionManagerRoutingModule { }
