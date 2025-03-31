import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/service/common/util.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iB2bPaymentStateMock, iPaymentExecutionDescriptionMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { MockTranslatePipe } from 'src/assets/mocks/public/tranlatePipeMock';
import { clickElement, mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { EB2bPaymentNavigateParameter } from '../../enum/b2b-payment-navigate-parameter.enum';
import { EB2bPaymentView } from '../../enum/b2b-payment-view.enum';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';
import { B2bPaymentConfirmationComponent } from './b2b-payment-confirmation.component';

describe('B2bPaymentConfirmationComponent', () => {
  let component: B2bPaymentConfirmationComponent;
  let fixture: ComponentFixture<B2bPaymentConfirmationComponent>;
  let managerDefinition: jasmine.SpyObj<B2bdPaymentManagerDefinitionService>;
  let parameterManagement: jasmine.SpyObj<ParameterManagementService>;
  let location: jasmine.SpyObj<Location>;
  let paymentTransaction: jasmine.SpyObj<B2bPaymentService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {
    const managerDefinitionSpy = jasmine.createSpyObj('B2bdPaymentManagerDefinitionService', ['buildConfirmationLayout', 'buildDataToExecuteTransaction'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const locationSpy = jasmine.createSpyObj('Location', ['back'])
    const paymentTransactionSpy = jasmine.createSpyObj('B2bPaymentService', ['executePayment'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showLoader', 'hideLoader'])
    await TestBed.configureTestingModule({
      declarations: [B2bPaymentConfirmationComponent, MockTranslatePipe],
      providers: [
        { provide: B2bdPaymentManagerDefinitionService, useValue: managerDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: Location, useValue: locationSpy },
        { provide: B2bPaymentService, useValue: paymentTransactionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilService, useValue: utilsSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                view: EB2bPaymentView.DEFAULT
              }
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(B2bPaymentConfirmationComponent);
    component = fixture.componentInstance;
    managerDefinition = TestBed.inject(B2bdPaymentManagerDefinitionService) as jasmine.SpyObj<B2bdPaymentManagerDefinitionService>;
    parameterManagement = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    paymentTransaction = TestBed.inject(B2bPaymentService) as jasmine.SpyObj<B2bPaymentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    parameterManagement.getParameter.and.returnValue(iB2bPaymentStateMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should got to the next step', fakeAsync(() => {
    paymentTransaction.executePayment.and.returnValue(mockObservable(iPaymentExecutionDescriptionMock))
    router.navigate.and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    tick(4000)
    expect(utils.showLoader).toHaveBeenCalled();
    expect(managerDefinition.buildDataToExecuteTransaction).toHaveBeenCalled
    expect(router.navigate).toHaveBeenCalledWith(['/loan/payment/voucher'])
  }))

  it('should go to the prev Step', () => {
    clickElement(fixture, 'adf-button.secondary');
    fixture.detectChanges();
    expect(parameterManagement.sendParameters).toHaveBeenCalledWith({
      navigationProtectedParameter: EB2bPaymentNavigateParameter.FORM,
    })
    expect(location.back).toHaveBeenCalled();
  })

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

  it('should got to the next step but have error', () => {
    paymentTransaction.executePayment.and.returnValue(mockObservableError(
      {
        error: {
          message: 'NOT FOUND'
        }
      }
    ))
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('NOT FOUND')
  })

});
