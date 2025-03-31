import { TestBed } from '@angular/core/testing';

import { UpdCallResolver } from './upd-call.resolver';

describe('UpdCallResolver', () => {
  let resolver: UpdCallResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UpdCallResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
