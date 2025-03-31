import { TestBed } from '@angular/core/testing';

import { DinamicFormResolver } from './dinamic-form.resolver';

describe('DinamicFormResolver', () => {
  let resolver: DinamicFormResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DinamicFormResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
