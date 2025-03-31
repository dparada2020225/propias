import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfButtonComponent} from '@adf/components';
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {clickElement, getText, mockPromise} from 'src/assets/testing';
import {PostponeModalComponent} from './postpone-modal.component';

describe('PostponeModalComponent', () => {
  let component: PostponeModalComponent;
  let fixture: ComponentFixture<PostponeModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;
  let router: Router;
  let eRef: jasmine.SpyObj<ElementRef>

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide'])
    const eRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElement'])

    await TestBed.configureTestingModule({
      declarations: [PostponeModalComponent, TranslatePipe, AdfButtonComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ElementRef, useValue: eRefSpy }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostponeModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    router = TestBed.inject(Router);
    eRef = TestBed.inject(ElementRef) as jasmine.SpyObj<ElementRef>
    spyOnProperty(router, 'url', 'get').and.returnValue('home')

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to security profile', () => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    activeModal.close.and.callFake(() => { })
    clickElement(fixture, 'button.close')
    fixture.detectChanges();
    expect(spinner.show).toHaveBeenCalledWith('main-spinner');
    expect(component.loading).toBeTruthy()
    expect(spinner.hide).toHaveBeenCalledWith('main-spinner');
    expect(router.navigate).toHaveBeenCalledWith(['/security-option'])
  })

  it('should navigate to security option if event target is not within the component', () => {
    spyOn(router, 'navigate').and.returnValue(mockPromise(true))
    eRef.nativeElement.and.returnValue(false)
    component.clickout(new Event('click'));
    expect(router.navigate).toHaveBeenCalledWith(['/security-option']);
  })

  xit('should <h1>so_title_postpone-modal</h1>', () => {
    const test = getText(fixture, 'title')
    fixture.detectChanges()
    expect(test).toEqual('so_title_postpone-modal')
  })

});
