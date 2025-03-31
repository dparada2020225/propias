import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { LocalStorageServiceMock } from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import { PasswordValidationService } from './password-validation.service';

describe('PasswordValidationService', () => {
  let service: PasswordValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageServiceMock,
        { provide: StorageService, useClass: LocalStorageServiceMock }
      ]
    });
    service = TestBed.inject(PasswordValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should password Evaluation Sv', () => {
    expect(service.passwordEvaluationSv('1234')).toBeTruthy();
  })

  it('should validation Password Sv', () => {
    expect(service.validationPasswordSv('1234', 'es')).toEqual([{ label: 'español', isValid: true }])
  })

  it('should password valid', () => {
    expect(service.validation('')).toEqual('cero')
    expect(service.validation('1')).toEqual('veryLow')
    expect(service.validation('1A')).toEqual('low')
    expect(service.validation('1A#')).toEqual('half')
    expect(service.validation('1Ax#')).toEqual('high')
  })

});
