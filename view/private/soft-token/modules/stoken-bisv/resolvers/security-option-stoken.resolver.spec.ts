import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { of } from 'rxjs';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { SecurityOptionStokenService } from 'src/app/view/private/soft-token/modules/stoken-bisv/services/transaction/security-option-stoken.service';
import { SecurityOptionStokenResolver } from './security-option-stoken.resolver';

fdescribe('SecurityOptionStokenResolver', () => {
  let resolver: SecurityOptionStokenResolver;

  let storage: jasmine.SpyObj<StorageService>;
  let securityOptionStokenService: jasmine.SpyObj<SecurityOptionStokenService>;
  let securityOptionService: SecurityOptionService;

let mockClass

  beforeEach(() => {

    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const securityOptionStokenServiceSpy = jasmine.createSpyObj('SecurityOptionStokenService', ['getProfileExposed']);

    mockClass = {
      getProfile: () => null,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: SecurityOptionStokenService, useValue: securityOptionStokenServiceSpy },
        { provide: SecurityOptionService, useValue: mockClass },
      ]
    });
    resolver = TestBed.inject(SecurityOptionStokenResolver);
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    securityOptionStokenService = TestBed.inject(SecurityOptionStokenService) as jasmine.SpyObj<SecurityOptionStokenService>;
    securityOptionService = TestBed.inject(SecurityOptionService)


  });

  it('should be created SecurityOptionStokenResolver', () => {
    expect(resolver).toBeTruthy();
  });


  it('Should return an Error SecurityOptionResolver if the profile properties are above 0', () => {
    // Configura los servicios y mocks para simular el caso de perfil vacío
    const info = { customerCode: 'customer-code' };
    resolver.profile = {
      code: 15,
      decription: 'string',
      status: 'string',
      registrationRequired: 'string',
      phone: 'string',
      codeOperator: 'string',
      email: 'string',
      lastConnectionDate: 'string',
      hasPendings: 'string',
      managedUser: 'string',
      periodChangePassword: 'string',
      profile: 'string',
      userType: 'string',
      error: 'string',
      changePeriod: '',
      codeArea:'',
      codeError:'',
      description: '',
      idClient:'',
      idGen:'',
      incompleteProfile:'',
      operatorDescription:'',
      reference:'',
    }; // Simula un perfil vacío

    let response = {
      name: 'KVELIZ',
      phone: '123455',
      email: 'tote.kev@gmail.com'
    }

    storage.getItem.and.returnValue(JSON.stringify(info));
    securityOptionStokenService.getProfileExposed.and.returnValue(of(response));

    // Llama al método resolve()
    resolver.resolve().subscribe(data => {
      expect(data).toEqual({name: 'KVELIZ', phone: '123455', email: 'tote.kev@gmail.com'})
    });

  });


  it('Should return an Error SecurityOptionResolver if the profile properties are up 0', () => {



    const info = { customerCode: 'customer-code' };


    let response = {
      name: 'KVELIZ',
      phone: '123455',
      email: 'tote.kev@gmail.com'
    }

    spyOn(securityOptionService, 'getProfile' as any).and.returnValue(['tester', 'tester2', 'and'])
    storage.getItem.and.returnValue(JSON.stringify(info));
    securityOptionStokenService.getProfileExposed.and.returnValue(of(response));


    resolver.resolve().subscribe( data => {
      expect(data).toEqual('Error SecurityOptionResolver ')
    });



  });

});
