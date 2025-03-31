import { TestBed } from '@angular/core/testing';

import { S365TermConditionsGuard } from './s365-term-conditions.guard';

describe('S365TermConditionsGuard', () => {
  let guard: S365TermConditionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(S365TermConditionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
