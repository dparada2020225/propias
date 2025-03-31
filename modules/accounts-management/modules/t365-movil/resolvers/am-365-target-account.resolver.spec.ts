import { TestBed } from '@angular/core/testing';

import { Am365TargetAccountResolver } from './am-365-target-account.resolver';

describe('Am365TargetAccountResolver', () => {
  let resolver: Am365TargetAccountResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(Am365TargetAccountResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
