import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'manager',
    loadChildren: (() => import('./manager-payroll/manager-payroll.module').then(
      (m) => m.ManagerPayrollModule
    ))
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
