import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UtilService } from 'src/app/service/common/util.service';
import { StknBisvCodeQrComponent } from './stkn-bisv-code-qr.component';

fdescribe('StknBisvCodeQrComponent', () => {
  let component: StknBisvCodeQrComponent;
  let fixture: ComponentFixture<StknBisvCodeQrComponent>;

  let modalService: jasmine.SpyObj<NgbModal>;
  let utils: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const utilsSpy = jasmine.createSpyObj('UtilService', ['getProfile', 'hideLoader']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: UtilService, useValue: utilsSpy },
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
      declarations: [StknBisvCodeQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvCodeQrComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    fixture.detectChanges();
  });

  it('should create StknBipaCodeQrComponent', () => {
    expect(component).toBeTruthy();
  });

  it('show hide the loader when the QR is load', ()=>{
    const mockEvent = { type: 'load' } as Event;

    component.hideShadow(mockEvent);

    expect(utils.hideLoader).toHaveBeenCalled();
    expect(component.showShadowControl).toBeFalse();
  });

  it('should show the shadow', ()=>{
    component.showShadow();

    expect(component.showShadowControl).toBeTrue();
  });
});

