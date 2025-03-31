import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WhatIsComponent} from './what-is.component';
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {UtilService} from "../../../../../../service/common/util.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ValidationTriggerTimeService} from "../../../../../../service/common/validation-trigger-time.service";
import {mockPromise} from "../../../../../../../assets/testing";
import {EThirdTransferUrlNavigationCollection} from "../../enums/third-transfer-navigate-parameters.enum";

describe('WhatIsComponent', () => {
  let component: WhatIsComponent;
  let fixture: ComponentFixture<WhatIsComponent>;

  let util: jasmine.SpyObj<UtilService>;
  let validationTriggerTime: jasmine.SpyObj<ValidationTriggerTimeService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['hideLoader', 'getLicensesTransactions'])
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot'])
    const validationTriggerTimeSpy = jasmine.createSpyObj('ValidationTriggerTimeService', ['validate', 'openModal', 'isAvailableSchedule'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])


    await TestBed.configureTestingModule({
      declarations: [WhatIsComponent, MockTranslatePipe],
      providers: [
        {provide: UtilService, useValue: utilSpy},
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                menuOptionsLicenses: [{'transfer_option': true}]
              }
            }
          }
        },
        {provide: ValidationTriggerTimeService, useValue: validationTriggerTimeSpy},
        {provide: Router, useValue: routerSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WhatIsComponent);
    component = fixture.componentInstance;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    validationTriggerTime = TestBed.inject(ValidationTriggerTimeService) as jasmine.SpyObj<ValidationTriggerTimeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.view).toEqual('information')
  });

  it('should changeView to question', () => {
    component.selectView('question');
    expect(component.view).toEqual('question')
  })

  it('should changeView to information', () => {
    component.selectView('information');
    expect(component.view).toEqual('information')
  })

  it('should changeView to undefined value', () => {
    component.selectView(undefined as any);
    expect(component.view).toEqual('information')
  })
  it('should changeView to null value', () => {
    component.selectView(null as any);
    expect(component.view).toEqual('information')
  })
  it('should changeView to othet value', () => {
    component.selectView('other');
    expect(component.view).toEqual('information')
  })

  it('should navigate To Transfer Third', () => {
    router.navigate.and.returnValue(mockPromise(true))
    component.navigateToTransferThird();
    expect(router.navigate).toHaveBeenCalledWith([EThirdTransferUrlNavigationCollection.HOMESV])
  })

  it('should showAlert', () => {
    const type: string = 'success';
    const message: string = 'message success'

    component.showAlert(type, message);

    expect(component.typeAlert).toEqual(type)
    expect(component.messageAlert).toEqual(message)
  })

});
