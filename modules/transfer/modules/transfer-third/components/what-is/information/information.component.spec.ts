import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationComponent} from './information.component';
import {Router} from "@angular/router";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {clickElement, mockPromise, query} from "../../../../../../../../assets/testing";
import {By} from "@angular/platform-browser";

describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [InformationComponent],
      providers: [
        {provide: Router, useValue: routerSpy},
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

    fixture = TestBed.createComponent(InformationComponent);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set correct image for different dimensions', () => {
    const pictureElement = query(fixture, 'picture');
    const sourceElements = pictureElement.queryAll(By.css('source'));
    const imgElement = pictureElement.query(By.css('img'));


    expect(sourceElements[0].nativeElement.getAttribute('srcset')).toEqual(component.imgDesktop);
    expect(sourceElements[1].nativeElement.getAttribute('srcset')).toEqual(component.imgTablet);
    expect(imgElement.nativeElement.getAttribute('src')).toEqual(component.imgMobile);
  });

  xit('should navigate to transfer third', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'button.information_image_btn');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/home'])
  })

});
