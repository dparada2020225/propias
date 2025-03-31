import { TestBed } from '@angular/core/testing';

import { T365GeneralParametersResolver } from './t365-general-parameters.resolver';

describe('T365GeneralParametersResolver', () => {
  let resolver: T365GeneralParametersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(T365GeneralParametersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
