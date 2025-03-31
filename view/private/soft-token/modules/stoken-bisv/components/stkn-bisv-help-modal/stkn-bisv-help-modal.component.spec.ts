import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StknBisvHelpModalComponent } from './stkn-bisv-help-modal.component';

fdescribe('StknBisvHelpModalComponent', () => {
  let component: StknBisvHelpModalComponent;
  let fixture: ComponentFixture<StknBisvHelpModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;


  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
      ],
      imports: [
        BrowserAnimationsModule,
        NgxSpinnerModule,
        HttpClientTestingModule,
        NgbModalModule,
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [ StknBisvHelpModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvHelpModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;

    fixture.detectChanges();
  });

  it('should create StknBisvHelpModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when user click the X button', ()=>{

    const btnX = fixture.debugElement.query(By.css('#btn-X-method-stoken-bisv'));
    btnX.triggerEventHandler('click', null);

    expect(activeModal.close).toHaveBeenCalled();

  });
});