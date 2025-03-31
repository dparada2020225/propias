import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { mockPromise } from 'src/assets/testing';
import { environment } from 'src/environments/environment';
import { EVersionHandler } from '../../../enums/version-handler.enum';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const styleManagementSpy = jasmine.createSpyObj('StyleManagementService', ['corporateImageApplication']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      providers: [
        {
          provide: StyleManagementService,
          useValue: styleManagementSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    styleManagement = TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>;
    styleManagement.corporateImageApplication.and.returnValue(false);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  const profile = environment.profile;
  const eVersionHandler = EVersionHandler.ASSETS;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the mainImage and secondaryImage correctly when corporateImageApplication is true', () => {
    component.profile = profile;
    component.newLogoutStructure();
    expect(component.mainImage).toEqual(`assets/images/gif/LoaderBR/Loader_${profile}_${eVersionHandler}.png`);
    expect(component.secondaryImage).toEqual(`assets/images/gif/LoaderBR/Loader_${profile}_${eVersionHandler}.gif`);
  });

  it('should set the mainImage correctly when corporateImageApplication is false', () => {
    component.profile = profile;
    component.oldLogoutStructure();
    expect(component.mainImage).toEqual(`assets/images/gif/LoaderBR/Loader_${profile}_${eVersionHandler}.gif`);
  });

  it('should navigate to the login page when the login method is called', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to the login page when the navigateToLogin method is called', () => {
    router.navigate.and.returnValue(mockPromise(true));
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
