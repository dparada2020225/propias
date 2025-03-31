import { TestBed } from '@angular/core/testing';

import { GetSourceAccountResolver } from './get-source-account.resolver';

describe('GetSourceAccountResolver', () => {
  let resolver: GetSourceAccountResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetSourceAccountResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
