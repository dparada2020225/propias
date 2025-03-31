import { TestBed } from '@angular/core/testing';

import { T365TargetAccountResolver } from './t365-target-account.resolver';

describe('T365TargetAccountResolver', () => {
  let resolver: T365TargetAccountResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(T365TargetAccountResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
