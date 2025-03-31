import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddAccountsModalComponent} from './add-accounts-modal.component';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {AdfButtonComponent} from "@adf/components";
import {UtilService} from "../../../../../../../../../service/common/util.service";
import {Base64Service} from "../../../../../../../../../service/common/base64.service";

describe('AddAccountsModalComponent', () => {
  let component: AddAccountsModalComponent;
  let fixture: ComponentFixture<AddAccountsModalComponent>;

  let modalService: jasmine.SpyObj<NgbActiveModal>;
  let util: jasmine.SpyObj<UtilService>;
  let base64: jasmine.SpyObj<Base64Service>;

  beforeEach(async () => {

    const modalServiceSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const utilSpy = jasmine.createSpyObj('UtilService', ['getUserName'])
    const base64Spy = jasmine.createSpyObj('Base64Service', ['encryption'])

    await TestBed.configureTestingModule({
      declarations: [AddAccountsModalComponent, AdfButtonComponent],
      providers: [
        {provide: NgbActiveModal, useValue: modalServiceSpy},
        { provide: UtilService, useValue: utilSpy },
        { provide: Base64Service, useValue: base64Spy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddAccountsModalComponent);
    component = fixture.componentInstance;

    modalService = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    base64 = TestBed.inject(Base64Service) as jasmine.SpyObj<Base64Service>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(modalService.close).toHaveBeenCalled();
  })

  it('should close modal', () => {
    component.closeModal();
    expect(modalService.close).toHaveBeenCalled();
  })

});
