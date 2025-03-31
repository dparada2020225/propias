import { TestBed } from '@angular/core/testing';

import { S365GetReasonResolver } from './s365-get-reason.resolver';

describe('S365GetReasonResolver', () => {
  let resolver: S365GetReasonResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(S365GetReasonResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
