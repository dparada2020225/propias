import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import socialNetwork from "../../../../assets/fake-data/social-network.json";
import { environment } from 'src/environments/environment';


describe('HelpComponentComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let styleManagement: jasmine.SpyObj<StyleManagementService>

  beforeEach(async () => {
    const styleManagementSpy = jasmine.createSpyObj("StyleManagementService", ["corporateImageApplication"] )
    await TestBed.configureTestingModule({
      declarations: [ HelpComponent],
      providers: [
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

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    styleManagement= TestBed.inject(StyleManagementService) as jasmine.SpyObj<StyleManagementService>
    styleManagement.corporateImageApplication.and.returnValue(false)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a linkList property', () => {
    expect(component.linkList).toBeDefined();
  });

  it('should set the linkList property based on the environment profile', () => {
    const expectedLinkList = socialNetwork[environment.profile];
    expect(component.linkList).toEqual(expectedLinkList);
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
