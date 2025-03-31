import { TestBed } from '@angular/core/testing';

import { StatementsService } from 'src/app/service/shared/statements.service';
import { mockObservable } from 'src/assets/testing';
import { MnemonicsStatementResolver } from './mnemonics-statement.resolver';

describe('MnemonicsStatementResolver', () => {
  let resolver: MnemonicsStatementResolver;
  let statements: jasmine.SpyObj<StatementsService>;

  beforeEach(() => {
    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getMenmonics']);
    TestBed.configureTestingModule({
      providers: [{ provide: StatementsService, useValue: statementsSpy }],
    });
    resolver = TestBed.inject(MnemonicsStatementResolver);
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return Menmonics', () => {
    const response: string = 'MNEMONIC';

    statements.getMenmonics.and.returnValue(mockObservable(response));

    resolver.resolve().subscribe({
      next(value) {
        expect(value).toEqual(response);
      },
    });
  });
});
