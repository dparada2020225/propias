import { TestBed } from '@angular/core/testing';

import { S365GetTermAndConditionsResolver } from './s365-get-term-and-conditions.resolver';

describe('S365GetTermdAndConditionsResolver', () => {
  let resolver: S365GetTermAndConditionsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(S365GetTermAndConditionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
