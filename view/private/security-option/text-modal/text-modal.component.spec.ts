import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from '@adf/security';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { LocalStorageServiceMock } from 'src/assets/mocks/public/mockLocalStorageServiceMock';
import { clickElement, getText } from 'src/assets/testing';
import { TextModalComponent } from './text-modal.component';

describe('TextModalComponent', () => {
  let component: TextModalComponent;
  let fixture: ComponentFixture<TextModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss'])

    await TestBed.configureTestingModule({
      declarations: [TextModalComponent, TranslatePipe],
      providers: [
        LocalStorageServiceMock,
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: StorageService, useClass: LocalStorageServiceMock },
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

    fixture = TestBed.createComponent(TextModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click the button dismiss modal', () => {
    clickElement(fixture, 'button.close')
    fixture.detectChanges();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Cross click')
  })

  it('should have title <h5>sp.policies</h5>', () => {
    const text = getText(fixture, 'h5')
    fixture.detectChanges();
    expect(text).toEqual('sp.policies ')
  })

  it('should have subtitle <div>sp.passwords</div>', () => {
    const text = getText(fixture, 'div.subtitle-password')
    fixture.detectChanges();
    expect(text).toEqual(' sp.passwords ')
  })

});
