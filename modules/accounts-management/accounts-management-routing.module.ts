import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "365-membership",
    loadChildren: () =>
      import('./modules/t365-membership/t365-membership.module').then(
        (m) => m.T365MembershipModule
      )
  },
  {
    path: "ach",
    loadChildren: () =>
      import('./modules/ach/ach.module').then(
        (m) => m.AchModule
      )
  },
  {
    path: "365-movil",
    loadChildren: () =>
      import('./modules/t365-movil/t365-movil.module').then(
        (m) => m.T365MovilModule
      )
  },
  {
    path: "365-sipa",
    loadChildren: () =>
      import('./modules/am-365-sipa/am-365-sipa.module').then(
        (m) => m.Am365SipaModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsManagementRoutingModule { }
