import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfAlertComponent, AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { clickElement, mockPromise } from 'src/assets/testing';
import { EPaymentLoansFlowView } from '../../../../enum/navigate-protection-parameter.enum';
import { TplUpdateConfirmService } from '../../../../services/definition/crud/update/tpl-update-confirm.service';
import { UpdateTplConfirmComponent } from './update-tpl-confirm.component';

describe('UpdateTplConfirmComponent', () => {
  let component: UpdateTplConfirmComponent;
  let fixture: ComponentFixture<UpdateTplConfirmComponent>;

  let parametersService: jasmine.SpyObj<ParameterManagementService>;
  let updateConfirmService: jasmine.SpyObj<TplUpdateConfirmService>;
  let router: Router;

  beforeEach(async () => {
    const parametersServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const updateConfirmServiceSpy = jasmine.createSpyObj('TplUpdateConfirmService', ['builderLayoutConfirmation'])
    await TestBed.configureTestingModule({
      declarations: [UpdateTplConfirmComponent, AdfAlertComponent, AdfButtonComponent],
      providers: [
        { provide: ParameterManagementService, useValue: parametersServiceSpy },
        { provide: TplUpdateConfirmService, useValue: updateConfirmServiceSpy },
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

    fixture = TestBed.createComponent(UpdateTplConfirmComponent);
    component = fixture.componentInstance;
    parametersService = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    updateConfirmService = TestBed.inject(TplUpdateConfirmService) as jasmine.SpyObj<TplUpdateConfirmService>;
    router = TestBed.inject(Router);

    spyOn(router.events, 'subscribe').and.callFake((observer: any) => {
      observer.next({ navigationTrigger: 'popstate' } as any);
      return new Subscription();
    });

    parametersService.getParameter.and.returnValue({
      view: EPaymentLoansFlowView.ALL_LOANS,
      type: 'success',
      message: 'Successfully updated'
    })

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(updateConfirmService.builderLayoutConfirmation).toHaveBeenCalled();
  });

  it('should go to back view == ALL_LOANS', () => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans/all'])
    expect(parametersService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  })

  it('should go to back view == ALL_LOANS', () => {
    component.currentView = EPaymentLoansFlowView.THIRD_PARTY_LOANS;
    spyOn(router, 'navigate').and.returnValue(mockPromise(true));
    clickElement(fixture, 'adf-button.primary');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/loan/third-party-loans'])
    expect(parametersService.sendParameters).toHaveBeenCalledWith({
      navigateStateParameters: null,
      navigationProtectedParameter: null,
    })
  })

});
