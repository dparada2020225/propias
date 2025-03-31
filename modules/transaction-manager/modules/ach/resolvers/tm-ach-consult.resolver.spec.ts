import { TestBed } from '@angular/core/testing';

import { TmAchConsultResolver } from './tm-ach-consult.resolver';

describe('TmAchConsultResolver', () => {
  let resolver: TmAchConsultResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TmAchConsultResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
