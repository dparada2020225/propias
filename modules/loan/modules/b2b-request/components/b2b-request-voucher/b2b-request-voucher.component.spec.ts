import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoanPrintService } from 'src/app/modules/loan/prints/loan-print.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bRequestStateDefaultMock, iUserInfoMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { MockTranslatePipe } from '../../../../../../../assets/mocks/public/tranlatePipeMock';
import { EB2bRequestView } from '../../enum/b2b-request-view.enum';
import { B2bdManagerService } from '../../service/definition/b2bd-manager.service';
import { B2bRequestVoucherComponent } from './b2b-request-voucher.component';

describe('B2bRequestVoucherComponent', () => {
  let component: B2bRequestVoucherComponent;
  let fixture: ComponentFixture<B2bRequestVoucherComponent>;

  let router: jasmine.SpyObj<Router>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const b2bManagerDefinitionSpy = jasmine.createSpyObj('B2bdManagerService', ['buildVoucherLayout', 'buildPdfLayout', 'buildModalLayout'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('LoanPrintService', ['pdfGenerate'])
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    await TestBed.configureTestingModule({
      declarations: [B2bRequestVoucherComponent, MockTranslatePipe],
      providers: [
        { provide: B2bdManagerService, useValue: b2bManagerDefinitionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: LoanPrintService, useValue: pdfServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EB2bRequestView.DEFAULT
              }
            }
          }
        },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(B2bRequestVoucherComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    parameterManagement.getParameter.and.returnValue({
      userInfo: iUserInfoMock,
      navigateStateParameters: iB2bRequestStateDefaultMock
    })

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the nextStep', fakeAsync(() => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    clickElement(fixture, 'adf-button.primary');
    tick(4000);
    expect(modalService.open).toHaveBeenCalled();
  }))

  it('should return to back Step', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.backStep();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    })
    expect(router.navigate).toHaveBeenCalledWith(['/loan/request']);
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull();
    expect(component.messageAlert).toBeNull();
  })


});
