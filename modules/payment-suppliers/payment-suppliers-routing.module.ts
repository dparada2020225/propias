import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'suppliers',
    loadChildren: (() => import('./managment-payments/managment-payments.module').then(
      (m) => m.ManagmentPaymentsModule
    ))
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentSuppliersRoutingModule { }
