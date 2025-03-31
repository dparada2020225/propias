import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'change-device',
    loadChildren: (() => import('../stoken-bisv/modules/private/stoken-bisv-change-device/stoken-bisv-change-device.module').then(
      (m) => m.StokenBisvChangeDeviceModule
    ))
  },
  {
    path: 'migration',
    loadChildren: (() => import('../stoken-bisv/modules/private/stoken-bisv-migration/stoken-bisv-migration.module').then(
      (m) => m.StokenBisvMigrationModule
    ))
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StokenBisvRoutingModule { }