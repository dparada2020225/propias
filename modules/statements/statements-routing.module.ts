import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { SecurityNavigationResolver } from 'src/app/resolvers/security-navigation.resolver';
import { MnemonicsStatementResolver } from './resolvers/mnemonics-statement.resolver';
import { MnemonicsResolver } from './resolvers/mnemonics.resolver';
import { CheckStatementResultComponent } from './views/check-statement-result/check-statement-result.component';
import { CheckStatementComponent } from './views/check-statement/check-statement.component';

const routes: Routes = [
  {
    path: '',
    component: CheckStatementComponent,
    canActivate: [PermissionsGuard],
    resolve: {
      securityResolver: SecurityNavigationResolver,
      mnemonicStatementResolver: MnemonicsStatementResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'result',
    component: CheckStatementResultComponent,
    canActivate: [PermissionsGuard],
    resolve: {
      securityResolver: SecurityNavigationResolver,
      mnemonicsForCheckTransactions: MnemonicsResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatementsRoutingModule {}
