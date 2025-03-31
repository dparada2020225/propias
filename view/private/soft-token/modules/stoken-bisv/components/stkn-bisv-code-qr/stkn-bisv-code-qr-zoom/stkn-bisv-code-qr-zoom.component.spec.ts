import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StknBisvCodeQrZoomComponent } from './stkn-bisv-code-qr-zoom.component';

fdescribe('StknBisvCodeQrZoomComponent', () => {
  let component: StknBisvCodeQrZoomComponent;
  let fixture: ComponentFixture<StknBisvCodeQrZoomComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;


  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      providers:[
        { provide: NgbActiveModal, useValue: activeModalSpy}
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
      declarations: [ StknBisvCodeQrZoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StknBisvCodeQrZoomComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create StknBisvCodeQrZoomComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when the user click the X button', ()=>{
    const btn = fixture.debugElement.query(By.css('.close'));
    btn.triggerEventHandler('click', null);

    expect(activeModal.close).toHaveBeenCalled();
  });

  it('should close the modal', ()=>{
    component.return();
    expect(activeModal.close).toHaveBeenCalled();

  });

  it('should close the modal', ()=>{
    component.continue();
    expect(activeModal.close).toHaveBeenCalled();

  });
});