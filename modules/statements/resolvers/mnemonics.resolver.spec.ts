import { TestBed } from '@angular/core/testing';

import { StatementsService } from 'src/app/service/shared/statements.service';
import { mockObservable } from 'src/assets/testing';
import { MnemonicsResolver } from './mnemonics.resolver';

describe('MnemonicsResolver', () => {
  let resolver: MnemonicsResolver;
  let statements: jasmine.SpyObj<StatementsService>;

  beforeEach(() => {
    const statementsSpy = jasmine.createSpyObj('StatementsService', ['getMenmonics']);
    TestBed.configureTestingModule({
      providers: [{ provide: StatementsService, useValue: statementsSpy }],
    });
    resolver = TestBed.inject(MnemonicsResolver);
    statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get CHECK_TRANSACTION', () => {
    const response: string = 'CHECK_TRANSACTION';

    statements.getMenmonics.and.returnValue(mockObservable(response));

    resolver.resolve().subscribe({
      next(value) {
        expect(value).toEqual(response);
      },
    });
  });
});
