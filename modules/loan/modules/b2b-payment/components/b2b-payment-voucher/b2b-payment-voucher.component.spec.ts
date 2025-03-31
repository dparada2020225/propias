import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { B2bPaymentPrintService } from 'src/app/modules/loan/prints/b2b-payment-print.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bPaymentStateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockModal } from 'src/assets/mocks/modules/transfer/service/own-transfer/otd-transfer-modal.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockPromise } from 'src/assets/testing';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentVoucherComponent } from './b2b-payment-voucher.component';

describe('B2bPaymentVoucherComponent', () => {
  let component: B2bPaymentVoucherComponent;
  let fixture: ComponentFixture<B2bPaymentVoucherComponent>;

  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {

    const managerDefinitionSpy = jasmine.createSpyObj('B2bdPaymentManagerDefinitionService', ['buildVoucherLayout', 'buildPdfLayout', 'buildModalLayout'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const pdfServiceSpy = jasmine.createSpyObj('B2bPaymentPrintService', ['pdfGenerate'])
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant'])

    await TestBed.configureTestingModule({
      declarations: [B2bPaymentVoucherComponent, MockTranslatePipe],
      providers: [
        { provide: B2bdPaymentManagerDefinitionService, useValue: managerDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: B2bPaymentPrintService, useValue: pdfServiceSpy },
        { provide: TranslateService, useValue: translateSpy },
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

    fixture = TestBed.createComponent(B2bPaymentVoucherComponent);
    component = fixture.componentInstance;

    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;

    parameterManagement.getParameter.and.returnValue(iB2bPaymentStateMock)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the next step', () => {
    modalService.open.and.returnValue(mockModal as NgbModalRef)
    clickElement(fixture, 'adf-button.primary')
    fixture.detectChanges();
    expect(modalService.open).toHaveBeenCalled();
  })

  it('should return to prev Step', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'adf-button.secondary')
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: null,
      navigateStateParameters: null,
    })
    expect(router.navigate).toHaveBeenCalledWith(['/loan/payment'])
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

});
