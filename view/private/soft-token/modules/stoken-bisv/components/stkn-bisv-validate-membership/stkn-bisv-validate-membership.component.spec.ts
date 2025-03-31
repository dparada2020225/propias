import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { throwError } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { StknBisvDevelService } from '../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvValidateMembershipComponent } from './stkn-bisv-validate-membership.component';

fdescribe('StknBisvValidateMembershipComponent', () => {
  let component: StknBisvValidateMembershipComponent;
  let fixture: ComponentFixture<StknBisvValidateMembershipComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let utils: jasmine.SpyObj<UtilService>;
  let stokenBisvDevelServices: jasmine.SpyObj<StknBisvDevelService>;
  let storage: jasmine.SpyObj<StorageService>;


  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['showPulseLoader', 'hidePulseLoader']);
    const stokenBisvDevelServicesSpy = jasmine.createSpyObj('StknBisvDevelService', ['validateStatusQR']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: StknBisvDevelService, useValue: stokenBisvDevelServicesSpy },
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
      declarations: [StknBisvValidateMembershipComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StknBisvValidateMembershipComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    stokenBisvDevelServices = TestBed.inject(StknBisvDevelService) as jasmine.SpyObj<StknBisvDevelService>;
    storage = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    fixture.detectChanges();
  });

  it('should create StknBisvValidateMembershipComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call the validateStatusQr', () => {

    const errorResponse_ok = new HttpErrorResponse({
      error: {
        code: '400',
        message: 'Error en el servicio'
      },
      status: 400,
      statusText: 'Not Found'
    });

    stokenBisvDevelServices.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok));

    component.next()

    expect(stokenBisvDevelServices.validateStatusQR).toHaveBeenCalled();
  });

  it('should call the validateStatusQr when user close the modal', () => {

    const errorResponse_ok = new HttpErrorResponse({
      error: {
        code: '400',
        message: 'Error en el servicio'
      },
      status: 400,
      statusText: 'Not Found'
    });

    stokenBisvDevelServices.validateStatusQR.and.returnValue(throwError(() => errorResponse_ok));

    component.close()

    expect(stokenBisvDevelServices.validateStatusQR).toHaveBeenCalled();
  });

  it('should show alert', () => {
    component.showAlert('error', 'tester');

    expect(component.typeAlert).toEqual('error')
  });

});
