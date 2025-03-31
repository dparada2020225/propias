import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfComponentsModule } from '@adf/components';
import { StorageService } from '@adf/security';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ModalMsecurityComponent } from './modal-msecurity.component';

fdescribe('ModalMsecurityComponent', () => {
  let component: ModalMsecurityComponent;
  let fixture: ComponentFixture<ModalMsecurityComponent>;

  //spy
  let modalService: jasmine.SpyObj<NgbActiveModal>;
  let storageService: jasmine.SpyObj<StorageService>

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem'])

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbActiveModal, useValue: modalServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      imports: [
        AdfComponentsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [ModalMsecurityComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModalMsecurityComponent);
    component = fixture.componentInstance;

    //Spy
    modalService = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal in method close()', () => {
    modalService.close.and.callThrough();
    component.close();
    expect(modalService.close).toHaveBeenCalled();
  });

});