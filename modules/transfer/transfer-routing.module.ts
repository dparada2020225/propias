import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'own',
    loadChildren: (() => import('./modules/transfer-own/transfer-own.module').then(
      (m) => m.TransferOwnModule
    ))
  },
  {
    path: 'third',
    loadChildren: (() => import('./modules/transfer-third/transfer-third.module').then(
      (m) => m.TransferThirdModule
    ))
  },
  {
    path: 'donations',
    loadChildren: (() => import('./modules/donation/donation.module').then(
      (m) => m.DonationModule
    ))
  },
  {
    path: 'ach',
    loadChildren: (() => import('./modules/transfer-ach/transfer-ach.module').then(
      (m) => m.TransferAchModule
    ))
  },
  {
    path: '365',
    loadChildren: (() => import('./modules/transfer-365/transfer-365.module').then(
      (m) => m.Transfer365Module
    ))
  },
  {
    path: '365-movil',
    loadChildren: (() => import('./modules/transfer-365-movil/transfer-365-movil.module').then(
      (m) => m.Transfer365MovilModule
    ))
  },
  {
    path: '365-multiple',
    loadChildren: (() => import('./modules/transfer-365-multiple/transfer-365-multiple.module').then(
      (m) => m.Transfer365MultipleModule
    ))
  },
  {
    path: '365-sipa',
    loadChildren: (() => import('./modules/transfer-365-sipa/transfer-365-sipa.module').then(
      (m) => m.Transfer365SipaModule
    ))
  },
  {
    path: 'ach-uni',
    loadChildren: (() => import('./modules/transfer-ach-uni/transfer-ach-uni.module').then(
      (m) => m.TransferAchUniModule
    ))
  },
  {
    path: 'bulk-transfers',
    loadChildren: (() => import('./modules/bulk-transfer/bulk-transfer.module').then(
      (m) => m.BulkTransferModule
    ))
  },
  {
    path: 'consult-ach',
    loadChildren: (() => import('./modules/consult-ach/consult-ach.module').then(
      (m) => m.ConsultAchModule
    ))
  },
  {
    path: 'ach-uni-multiple',
    loadChildren: () => import('./modules/transfer-ach-uni-multiple/transfer-ach-uni-multiple.module').then(
      (m) => m.TransferAchUniMultipleModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
