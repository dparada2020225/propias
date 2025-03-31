import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ILoadItem } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IIsSchedule } from 'src/app/models/isSchedule.interface';
import { UtilService } from 'src/app/service/common/util.service';
import { ValidationTriggerTimeService } from 'src/app/service/common/validation-trigger-time.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { iPaymentAccountDetailMock, iPaymentAccountMock, iPaymentB2bAccountResponseMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError, mockPromise } from 'src/assets/testing';
import { PaymentTableType } from '../../enum/b2b-payment-control-name.enum';
import { IPaymentAccount } from '../../interfaces/b2b-payment.interface';
import { B2bdPaymentManagerDefinitionService } from '../../service/definition/b2bd-payment-manager-definition.service';
import { B2bPaymentService } from '../../service/transction/b2b-payment.service';
import { B2bPaymentHomeComponent } from './b2b-payment-home.component';

describe('B2bPaymentHomeComponent', () => {
  let component: B2bPaymentHomeComponent;
  let fixture: ComponentFixture<B2bPaymentHomeComponent>;
  let paymentTransaction: jasmine.SpyObj<B2bPaymentService>;
  let router: jasmine.SpyObj<Router>;
  let utils: jasmine.SpyObj<UtilService>;


  beforeEach(async () => {

    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate'])
    const managerDefinitionSpy = jasmine.createSpyObj('B2bdPaymentManagerDefinitionService', ['buildTableLayout'])
    const paymentTransactionSpy = jasmine.createSpyObj('B2bPaymentService', ['getB2bAccountDetail'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const parameterManagementSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'showLoader'])

    const data: IIsSchedule = {
      isSchedule: true,
      schedule: {
        initialDate: '2015',
        finalDate: '2030'
      }
    }

    await TestBed.configureTestingModule({
      declarations: [B2bPaymentHomeComponent],
      providers: [
        { provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy },
        { provide: B2bdPaymentManagerDefinitionService, useValue: managerDefinitionSpy },
        { provide: B2bPaymentService, useValue: paymentTransactionSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ParameterManagementService, useValue: parameterManagementSpy },
        { provide: UtilService, useValue: utilsSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                scheduleService: data,
                b2bAccountList: iPaymentB2bAccountResponseMock
              }
            }
          }
        }
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

    fixture = TestBed.createComponent(B2bPaymentHomeComponent);
    component = fixture.componentInstance;
    paymentTransaction = TestBed.inject(B2bPaymentService) as jasmine.SpyObj<B2bPaymentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go To Confirmation', () => {
    router.navigate.and.returnValue(mockPromise(true))
    paymentTransaction.getB2bAccountDetail.and.returnValue(mockObservable(iPaymentAccountDetailMock))
    const mock: ILoadItem<IPaymentAccount> = {
      action: PaymentTableType.PAY,
      item: iPaymentAccountMock
    }
    component.getActionTable(mock)
    expect(router.navigate).toHaveBeenCalledWith(['/loan/payment/form'])
  })

  it('should go To Confirmation but have error', () => {
    paymentTransaction.getB2bAccountDetail.and.returnValue(mockObservableError({
      error: {
        message: 'Payment Error'
      }
    }))
    const mock: ILoadItem<IPaymentAccount> = {
      action: PaymentTableType.PAY,
      item: iPaymentAccountMock
    }
    component.getActionTable(mock)
    expect(component.typeAlert).toEqual('error')
    expect(component.messageAlert).toEqual('Payment Error')
    expect(utils.hideLoader).toHaveBeenCalled();
  });

  it('should hidden Alert', () => {
    component.hiddenAlert();
    expect(component.typeAlert).toBeNull()
    expect(component.messageAlert).toBeNull()
  })

});
