import { TestBed } from '@angular/core/testing';

import { AESCryptographyService } from '@adf/security';
import { Base64Service } from '../common/base64.service';
import { StepService } from './step.service';

describe('StepService', () => {
  let service: StepService;
  let base64: jasmine.SpyObj<Base64Service>;
  let y: jasmine.SpyObj<AESCryptographyService>;

  beforeEach(() => {
    const base64Spy = jasmine.createSpyObj('Base64Service', ['decoded']);
    const ySpy = jasmine.createSpyObj('AESCryptographyService', ['dH'])
    TestBed.configureTestingModule({
      providers: [
        { provide: Base64Service, useValue: base64Spy },
        { provide: AESCryptographyService, useValue: ySpy },
      ]
    });
    service = TestBed.inject(StepService);
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    y = TestBed.inject(AESCryptographyService) as jasmine.SpyObj<AESCryptographyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return any encrypt value', () => {
    base64.decoded.and.returnValue('-')
    y.dH.and.returnValue('encryptado')
    expect(service.s('te_s-t.asd.ads')).toEqual('encryptado')
  })

  it('should retunr null', () => {
    expect(service.s('')).toBeNull();
  })

});
