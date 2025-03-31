import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StatementsService } from 'src/app/service/shared/statements.service';

/**
 * @author Sebastian Chicoma
 * @date 24/03/21
 *
 */
@Injectable({
  providedIn: 'root',
})
export class MnemonicsStatementResolver implements Resolve<Observable<any>> {
  constructor(private statements: StatementsService) {}

  resolve(): Observable<any> {
    return this.statements.getMenmonics('MNEMONIC');
  }
}
