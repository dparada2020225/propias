import { TestBed } from '@angular/core/testing';

import { M365GetBeneficiaryListResolver } from './m365-get-beneficiary-list.resolver';

describe('M365GetBeneficiaryListResolver', () => {
  let resolver: M365GetBeneficiaryListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(M365GetBeneficiaryListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
