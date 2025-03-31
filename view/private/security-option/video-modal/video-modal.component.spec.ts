import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { clickElement } from 'src/assets/testing';
import { VideoModalComponent } from './video-modal.component';

describe('VideoModalComponent', () => {
  let component: VideoModalComponent;
  let fixture: ComponentFixture<VideoModalComponent>;

  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {

    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss'])
    const hostElementSpy = jasmine.createSpyObj('ElementRef', ['nativeElement'])

    await TestBed.configureTestingModule({
      declarations: [VideoModalComponent, TranslatePipe],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: ElementRef, useValue: hostElementSpy },
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

    fixture = TestBed.createComponent(VideoModalComponent);
    component = fixture.componentInstance;

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click button dismiss modal', () => {
    clickElement(fixture, 'button.close')
    fixture.detectChanges();
    expect(activeModal.dismiss).toHaveBeenCalledWith('Cross click')
  })

});
