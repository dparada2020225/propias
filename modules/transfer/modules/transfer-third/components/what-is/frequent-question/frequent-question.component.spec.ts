import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FrequentQuestionComponent} from './frequent-question.component';
import {Router} from "@angular/router";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement, mockPromise} from "../../../../../../../../assets/testing";

describe('FrequentQuestionComponent', () => {
  let component: FrequentQuestionComponent;
  let fixture: ComponentFixture<FrequentQuestionComponent>;

  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      declarations: [FrequentQuestionComponent],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FrequentQuestionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should go to the navigate transfer third', () => {
    router.navigate.and.returnValue(mockPromise(true))
    clickElement(fixture, 'button.image_btn');
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/transfer/third/home'])

  })

});
