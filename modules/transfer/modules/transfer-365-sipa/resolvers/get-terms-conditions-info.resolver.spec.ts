import { TestBed } from '@angular/core/testing';

import { GetTermsConditionsInfoResolver } from './get-terms-conditions-info.resolver';

describe('GetTermsConditionsInfoResolver', () => {
  let resolver: GetTermsConditionsInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetTermsConditionsInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
