import { TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { of } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvInvitationService } from './stkn-bisv-invitation.service';
import { StknBisvDevelService } from './transaction/DEVEL/stkn-bisv-devel.service';

fdescribe('StknBisvInvitationService', () => {
  let service: StknBisvInvitationService;

  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let util: jasmine.SpyObj<UtilService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;
  let storage: jasmine.SpyObj<StorageService>;



  beforeEach(() => {

    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const utilSpy = jasmine.createSpyObj('UtilService', ['getProfile', 'showPulseLoader', 'hidePulseLoader']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['assignTokenType', 'generateCodeQR', 'validateStatusQR', 'consultGracePeriod']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);



    TestBed.configureTestingModule({
      providers: [
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: UtilService, useValue: utilSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: StorageService, useValue: storageSpy },
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
    service = TestBed.inject(StknBisvInvitationService);
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.
      SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    stokenBisvDevelServices = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;

    TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

  });

  it('should be created StknBisvInvitationService', () => {
    expect(service).toBeTruthy();
  });

  it('should not show the invitation flow if the type token is devel', ()=>{

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('D');
    spyOn(service, 'checkIfUserIsInGracePeriod');

    service.showInvitationModal();

    expect(service.checkIfUserIsInGracePeriod).not.toHaveBeenCalled();

  });

  it('should show the invitation flow if the type token is  different devel', ()=>{

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('S');
    parameterManager.getParameter.withArgs('userAlreadyCloseTheInvitation').and.returnValue(undefined);
    spyOn(service, 'checkIfUserIsInGracePeriod');

    service.showInvitationModal();

    expect(service.checkIfUserIsInGracePeriod).toHaveBeenCalled();

  });

  it('should not show the invitation flow if the user already close the modal', ()=>{

    parameterManager.getParameter.withArgs('typeToken').and.returnValue('S');
    parameterManager.getParameter.withArgs('userAlreadyCloseTheInvitation').and.returnValue(true);
    spyOn(service, 'checkIfUserIsInGracePeriod');

    service.showInvitationModal();

    expect(service.checkIfUserIsInGracePeriod).not.toHaveBeenCalled();

  });

  it('should not open any modal if the modalName is not valid', ()=>{

    service.handlerOpenModal('', true);

    expect(modalService.open).not.toHaveBeenCalled();

  });

  const modalRefMockWarning = {
    componentInstance: {
      data: true,
      allowCloseModal: true
    },
    result: Promise.resolve('close'),
  };


  it('should check if the user is in grace period', ()=>{
    stokenBisvDevelServices.consultGracePeriod.and.returnValue(of({hasGracePeriod: false}));
    modalService.open.and.returnValue(modalRefMockWarning as any);


    service.showInvitationModal();
    expect(parameterManager.sendParameters).toHaveBeenCalled();
  });


});
