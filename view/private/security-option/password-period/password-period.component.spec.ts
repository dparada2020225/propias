import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomDateLabelPipe } from 'src/app/pipes/custom-date-label.pipe';
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { PasswordPeriodComponent } from './password-period.component';

describe('PasswordPeriodComponent', () => {
  let component: PasswordPeriodComponent;
  let fixture: ComponentFixture<PasswordPeriodComponent>;

  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let securityOptionService: jasmine.SpyObj<SecurityOptionService>;

  beforeEach(async () => {

    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const securityOptionServiceSpy = jasmine.createSpyObj('SecurityOptionService', ['updatePassworPeriod'])

    await TestBed.configureTestingModule({
      declarations: [PasswordPeriodComponent, CustomDateLabelPipe, CustomDatePipe, TranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: SecurityOptionService, useValue: securityOptionServiceSpy },
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

    fixture = TestBed.createComponent(PasswordPeriodComponent);
    component = fixture.componentInstance;

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    securityOptionService = TestBed.inject(SecurityOptionService) as jasmine.SpyObj<SecurityOptionService>;

    component.passwordPeriod = [
      {
        channel: 'passwordPeriod',
        code: 'ASDF4',
        description: 'datee'
      }
    ]

    component.profile = {
      periodChangePassword: '414214228'
    } as any

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change Period', fakeAsync(() => {
    component.configurationType = 1
    spyOn(component.changeTab, 'emit')
    securityOptionService.updatePassworPeriod.and.returnValue(mockObservable({}))
    component.changePeriod(null)
    tick(2000)
    expect(securityOptionService.updatePassworPeriod).toHaveBeenCalled();
    expect(component.changeTab.emit).toHaveBeenCalled()
    expect(component.showAlert).toBeTruthy();
    expect(component.typeAler).toEqual('success')
    expect(component.messageAlert).toEqual('period_successfully_saved')

  }))

  it('should change period have error http', () => {
    securityOptionService.updatePassworPeriod.and.returnValue(mockObservableError({}))
    component.changePeriod(null)
    expect(spinner.hide).toHaveBeenCalled();
    expect(component.showAlert).toBeTruthy()
    expect(component.typeAler).toEqual('error')
    expect(component.messageAlert).toEqual('so_transaction_not_sent')
  })

});
