import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { OwnTransferCreditResolver } from './own-transfer-credit.resolver';

import { RouterStateSnapshot } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import accountCreditFalse from '../../../../../../assets/mocks/modules/transfer/service/own-transfer/credit-accounts-enableFalse.json';

describe('OwnTransferCreditResolver', () => {
  let resolver: OwnTransferCreditResolver;

  let statements: jasmine.SpyObj<StatementsService>;
  let routerStateSnapshot: RouterStateSnapshot;
  let findService: jasmine.SpyObj<FindServiceCodeService>;

  beforeEach(() => {
    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getAccountsWithoutProduct']);
    const findServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode']);

    TestBed.configureTestingModule({
      providers: [
        OwnTransferCreditResolver,
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

    resolver = TestBed.inject(OwnTransferCreditResolver);
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
    findService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    routerStateSnapshot = new MockRouterStateSnapshot('/own-transfer/credit');
  });

  it('should create OwnTransferCreditResolver', () => {
    expect(resolver).toBeTruthy();
  });

  it('resolver() should return object error if receive null', (done: DoneFn) => {
    statements.getAccountsWithoutProduct.and.returnValue(throwError(() => null));
    resolver.resolve(statements, routerStateSnapshot).subscribe((data) => {
      expect(data).toEqual({
        message: 'error_getting_list_accounts_credit',
        status: 500,
        error: 'invalid error',
      });
      done();
    });
  });

  it('resolve() should return an empty array if account have enabled property on false', (done: DoneFn) => {
    statements.getAccountsWithoutProduct.and.returnValue(of(accountCreditFalse));
    resolver.resolve(statements, routerStateSnapshot).subscribe((data) => {
      expect(data).toEqual([]);
      done();
    });
  });
});
