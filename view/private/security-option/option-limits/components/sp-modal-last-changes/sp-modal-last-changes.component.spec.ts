import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdfButtonComponent } from '@adf/components';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { clickElement } from 'src/assets/testing';
import { SpModalLastChangesComponent } from './sp-modal-last-changes.component';

describe('SpModalLastChangesComponent', () => {
  let component: SpModalLastChangesComponent;
  let fixture: ComponentFixture<SpModalLastChangesComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close'])

    await TestBed.configureTestingModule({
      declarations: [SpModalLastChangesComponent, AdfButtonComponent, TranslatePipe],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
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

    fixture = TestBed.createComponent(SpModalLastChangesComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    clickElement(fixture, 'button')
    fixture.detectChanges();
    expect(activeModal.close).toHaveBeenCalled();
  })

  it('should pass back', () => {
    clickElement(fixture, 'adf-button')
    fixture.detectChanges();
    expect(component.result).toBeTruthy();
    expect(activeModal.close).toHaveBeenCalled();
  })

});
