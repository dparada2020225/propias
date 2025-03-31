import { TestBed } from '@angular/core/testing';

import { ParseUtf8Service } from './parse-utf8.service';

describe('ParseUtf8Service', () => {
  let service: ParseUtf8Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseUtf8Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should conversion', () => {
    const body:string = 'í©';
    expect(service.conversion(body)).toBeDefined();
  })

});
