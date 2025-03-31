import { TestBed } from '@angular/core/testing';

import { GetAffiliationResolver } from './get-affiliation.resolver';

describe('GetAffiliationResolver', () => {
  let resolver: GetAffiliationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetAffiliationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
