import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OnboardingNewsComponent, View} from './onboarding-news.component';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {clickElement} from "../../../../../../../../assets/testing";

describe('OnboardingNewsComponent', () => {
  let component: OnboardingNewsComponent;
  let fixture: ComponentFixture<OnboardingNewsComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', [''])

    await TestBed.configureTestingModule({
      declarations: [OnboardingNewsComponent],
      providers: [
        {provide: NgbActiveModal, useValue: activeModalSpy},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OnboardingNewsComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to next modal', () => {
    /*=First modal=*/
    fixture.detectChanges()
    expect(component.view).toEqual(View.NewFunction);

    clickElement(fixture, 'i.banca-regional-flecha-derecha');
    fixture.detectChanges()
    /*=Second modal=*/
    expect(component.view).toEqual(View.KnowFavorites);
    expect(component.buttonLeftDisabled).toBeFalsy();

    fixture.detectChanges()
    /*=Last modal=*/
    clickElement(fixture, 'i.banca-regional-flecha-derecha');
    fixture.detectChanges()

    expect(component.view).toEqual(View.AddAccount);
    expect(component.buttonRightDisabled).toBeTruthy();
  })

  it('should go to the back modal ', () => {

    /*=Init in the last modal=*/
    component.view = View.AddAccount;
    fixture.detectChanges();
    expect(component.buttonRightDisabled).toBeFalsy();
    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-flecha-izquierda');
    fixture.detectChanges();

    expect(component.view).toEqual(View.KnowFavorites);
    expect(component.buttonRightDisabled).toBeFalsy();

    fixture.detectChanges();

    clickElement(fixture, 'i.banca-regional-flecha-izquierda');
    fixture.detectChanges();

    expect(component.view).toEqual(View.NewFunction);
    expect(component.buttonLeftDisabled).toBeTruthy();

  });


});
