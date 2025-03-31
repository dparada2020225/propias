import { TestBed } from '@angular/core/testing';

import { Base64Service } from './base64.service';

describe('Base64Service', () => {
  let service: Base64Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Base64Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decoded', () => {
    const decoded:string = 'hola_Q-mundo';
    expect(service.decoded(decoded)).toBeDefined()
  })

  it('should encryption', () => {
    const decoded:string = 'hola_Q-mundo';
    expect(service.encryption(decoded)).toEqual('aG9sYV9RLW11bmRv')
  })

});
