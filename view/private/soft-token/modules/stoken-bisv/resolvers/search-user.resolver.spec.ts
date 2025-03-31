import { TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { SearchUserService } from '../services/transaction/HID/search-user.service';
import { SearchUserResolver } from './search-user.resolver';

xdescribe('SearchUserResolver', () => {
  let resolver: SearchUserResolver;

  let searchUserService: jasmine.SpyObj<SearchUserService>;
  let storage: jasmine.SpyObj<StorageService>;
  let parameterManagementService: jasmine.SpyObj<ParameterManagementService>;


  beforeEach(() => {

    const searchUserServiceSpy = jasmine.createSpyObj('SearchUserService', ['getUserStatus']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SearchUserService, useValue: searchUserServiceSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ParameterManagementService, useValue: parameterManagementServiceSpy }
      ]
    });
    resolver = TestBed.inject(SearchUserResolver);
    searchUserService = TestBed.inject(SearchUserService) as jasmine.SpyObj<SearchUserService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    parameterManagementService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;

  });

  it('should be created SearchUserResolver', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return object with the data when the search user responds with status 200', () => {

    storage.getItem.and.returnValue('KVELIZ');

    const resSearchUser = {
      code: "304",
      errorMessage: "El usuario existe en 4Tress y tiene dispositivo asociado con QR generado",
      message: "El usuario existe en 4Tress y tiene dispositivo asociado con QR generado",
      timestamp: "2023-04-21T16:18:05.221-05:00",
      exception: "com.bytesw.tyu.bi.clients.soft.token.exceptions.SoftTokenException",
      status: 200
    };

    const resResolver = {
      code: resSearchUser.code,
      message: resSearchUser.message,
      status: resSearchUser.status,
      username: 'KVELIZ'
    }

    const serviceResponse = new Subject<any>();
    searchUserService.getUserStatus.and.returnValue(serviceResponse.asObservable());
    resolver.resolve().subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.status).toBe(200);
      expect(data.code).toBe('304');
      expect(data).toEqual(resResolver);
    });

    serviceResponse.next(resSearchUser); // Emite los datos de prueba en el Subject



  });


  it('should return object with the data when the search user responds with status different to 200', () => {

    storage.getItem.and.returnValue('KVELIZ');

    const dataMock: HttpErrorResponse = new HttpErrorResponse({
      error: {
        code: '400',
        message: 'Internal server error'
      },
      status: 400,
      statusText: ''
    });

    const resResolver = {
      code: undefined,
      message: 'stoken-error-searchUser',
      status: '400',
      username: 'KVELIZ'
    }

    const serviceResponse = new Subject<any>();
    searchUserService.getUserStatus.and.returnValue(serviceResponse.asObservable());
    resolver.resolve().subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.status).toBe('400');
      expect(data.code).toBeUndefined();
      expect(data).toEqual(resResolver);
    });

    serviceResponse.error(dataMock); // Emite los datos de prueba en el Subject



  });

  it('should not call the get user status if the type token is devel', () => {
    parameterManagementService.getParameter.withArgs('typeToken').and.returnValue(TypeTokenEnum.SOFT_TOKEN_DEVEL);

    resolver.resolve();

    expect(searchUserService.getUserStatus).not.toHaveBeenCalled();
  });


});
