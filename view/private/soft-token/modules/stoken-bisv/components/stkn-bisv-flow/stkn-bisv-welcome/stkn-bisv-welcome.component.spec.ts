import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { EStokenRoutesNewUser } from '../../../enums/stkn-bisv.enum';
import { StknBisvWelcomeComponent } from './stkn-bisv-welcome.component';

fdescribe('StknBisvWelcomeComponent', () => {
  let component: StknBisvWelcomeComponent;
  let fixture: ComponentFixture<StknBisvWelcomeComponent>;

  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let findServiceCode: jasmine.SpyObj<FindServiceCodeService>;
  let storage: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide']);
    const parameterSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters']);
    const findServiceCodeSpy = jasmine.createSpyObj('FindServiceCodeService', ['validateCustomFeature']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ParameterManagementService, useValue: parameterSpy },
        { provide: FindServiceCodeService, useValue: findServiceCodeSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: Router, useValue: routerSpy }

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
      declarations: [StknBisvWelcomeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvWelcomeComponent);
    component = fixture.componentInstance;

    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;
    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    spinner.hide.and.returnValue(new Promise(() => true))

    fixture.detectChanges();
  });

  it('should create StknBisvWelcomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to information screen when user clicks the continue button', () => {

    router.navigate.and.returnValue(new Promise(() => true))


    const btn = fixture.debugElement.query(By.css('#information-stoken-btn'));
    btn.triggerEventHandler('click', null);

    expect(parameterManager.sendParameters).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([EStokenRoutesNewUser.INFORMATION_SCREEN])


  });


});