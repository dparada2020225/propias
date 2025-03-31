import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import accountsEnabledFalse from '../../../../../../assets/mocks/modules/transfer/service/own-transfer/credit-accounts-enableFalse.json';
import debitAccounts from '../../../../../../assets/mocks/modules/transfer/service/own-transfer/credit-accounts.json';
import { OwnTransferDebitResolver } from './own-transfer-debit.resolver';

describe('Description', () => {
  let resolver: OwnTransferDebitResolver;

  let statements: jasmine.SpyObj<StatementsService>;
  let findService: jasmine.SpyObj<FindServiceCodeService>;

  beforeEach(() => {
    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getAccountsWithoutProduct']);
    const findServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode']);

    TestBed.configureTestingModule({
      providers: [
        OwnTransferDebitResolver,
        { provide: FindServiceCodeService, useValue: findServiceSpy },
        { provide: StatementsService, useValue: statementsSpy },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    resolver = TestBed.inject(OwnTransferDebitResolver);
    findService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
  });

  it('should create OwnTransferDebitResolver', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolve() should return observable with accounts if property "enabled" are true', (done: DoneFn) => {
    const routerStateSnapshot: RouterStateSnapshot = new MockRouterStateSnapshot('/own-transfer/debit');

    statements.getAccountsWithoutProduct.and.returnValue(of(debitAccounts));
    resolver.resolve(statements, routerStateSnapshot).subscribe((data) => {
      expect(data).not.toContain({
        account: '01001092144322',
        alias: 'Solo Alias',
        currency: 'L',
        product: 1,
        subproduct: 5,
        enabled: false,
        cif: '1651457',
        consortium: '',
        agency: 900,
        mask: '01-001-001250-5',
        name: '',
        status: 'Activa',
        availableAmount: 85252.93,
        totalAmount: 85252.93,
      });

      done();
    });
  });

  it('resolver() should return object error if receive null', (done: DoneFn) => {
    const routerStateSnapshot: RouterStateSnapshot = new MockRouterStateSnapshot('/own-transfer/debit');

    statements.getAccountsWithoutProduct.and.returnValue(throwError(() => null));
    resolver.resolve(statements, routerStateSnapshot).subscribe((data) => {
      expect(data).toEqual({
        message: 'error_getting_list_accounts_debited',
        status: 500,
        error: 'invalid error',
      });
      done();
    });
  });

  it('resolve() should return an empty array if account have enabled property on false', (done: DoneFn) => {
    const routerStateSnapshot: RouterStateSnapshot = new MockRouterStateSnapshot('/own-transfer/debit');
    statements.getAccountsWithoutProduct.and.returnValue(of(accountsEnabledFalse));
    resolver.resolve(statements, routerStateSnapshot).subscribe((data) => {
      expect(data).toEqual([]);
      done();
    });
  });
});
