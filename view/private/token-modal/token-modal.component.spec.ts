import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenModalComponent } from './token-modal.component';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


describe('TokenModalComponent', () => {
  let component: TokenModalComponent;
  let fixture: ComponentFixture<TokenModalComponent>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>
  let activeModal: NgbActiveModal;


  beforeEach(async () => {
    const styleManagementSpy = jasmine.createSpyObj("StyleManagementService", ["corporateImageApplication"] )
    await TestBed.configureTestingModule({
      declarations: [ TokenModalComponent ],
      providers: [
        NgbActiveModal,
        {
          provide: StyleManagementService,
          useValue:styleManagementSpy
        }
      ],
      imports:[
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenModalComponent);
    component = fixture.componentInstance;
    styleManagement= TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>
    styleManagement.corporateImageApplication.and.returnValue(false)
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a corporateImageApplication method', () => {
    expect(component.corporateImageApplication).toBeDefined();
  });

  it('should call the corporateImageApplication method of StyleManagementService when calling corporateImageApplication', () => {
    const spy = styleManagement.corporateImageApplication.and.returnValue(true)
    const result = component.corporateImageApplication();
    expect(spy).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
