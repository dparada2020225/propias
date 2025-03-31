import { TestBed } from '@angular/core/testing';

import { GetAchUniLoteDetailResolver } from './get-ach-uni-lote-detail.resolver';

describe('GetAchUniLoteDetailResolver', () => {
  let resolver: GetAchUniLoteDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetAchUniLoteDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
