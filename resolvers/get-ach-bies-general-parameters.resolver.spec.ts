import { TestBed } from '@angular/core/testing';

import { GetAchBiesGeneralParametersResolver } from './get-ach-bies-general-parameters.resolver';

describe('GetAchBiesGeneralParametersResolver', () => {
  let resolver: GetAchBiesGeneralParametersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GetAchBiesGeneralParametersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
