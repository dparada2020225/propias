import { TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { AuthenticationService, StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvUtilsService } from './stkn-bisv-utils.service';

fdescribe('StknBisvUtilsService', () => {
  let service: StknBisvUtilsService;

  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let utils: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let storage: jasmine.SpyObj<StorageService>;
  let authenticationService: jasmine.SpyObj<AuthenticationService>;


  beforeEach(() => {
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader', 'getTokenType', 'getProfile']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem',]);
    const authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);


    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },


      ],
      imports: [
        BrowserAnimationsModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        NgbModalModule,
        AdfComponentsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(StknBisvUtilsService);
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    authenticationService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
  });

  it('should be created StknBisvUtilsService', () => {
    expect(service).toBeTruthy();
  });

  it('should open the openValidationMembershipModal', ()=>{
    const modalRefMock = {
      componentInstance: {
        data: true,
        allowCloseModal: true
      },
      result: Promise.resolve('close'),
    };

    modalService.open.and.returnValue(modalRefMock as any);


    service.openValidationMembershipModal();

    expect(modalService.open).toHaveBeenCalled()

  });
});
