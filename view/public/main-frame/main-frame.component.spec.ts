import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFrameComponent } from './main-frame.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MainFrameComponent', () => {
  let component: MainFrameComponent;
  let fixture: ComponentFixture<MainFrameComponent>;

  let router: jasmine.SpyObj<Router>
  let modalService: jasmine.SpyObj<NgbModal>
  let styleManagement: jasmine.SpyObj<StyleManagementService>

  beforeEach(async () => {

    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['hide'])
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open'])
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication'])

    await TestBed.configureTestingModule({
      declarations: [MainFrameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        MainFrameComponent,
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: StyleManagementService, useValue: styleManagementSpy },
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

    fixture = TestBed.createComponent(MainFrameComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open', () => {
    component.open();
    expect(modalService.open).toHaveBeenCalled();
  })

  it('should navigate', () => {
    component.navigate('test');
    expect(router.navigate).toHaveBeenCalled();
  })

  it('should return "background-container"', () => {
    styleManagement.corporateImageApplication.and.returnValue(false)
    expect(component.isCorporateImageApplication).toEqual('background-container');
  });

  it('should return ""', () => {
    styleManagement.corporateImageApplication.and.returnValue(true)
    expect(component.isCorporateImageApplication).toEqual('');
  });

});
