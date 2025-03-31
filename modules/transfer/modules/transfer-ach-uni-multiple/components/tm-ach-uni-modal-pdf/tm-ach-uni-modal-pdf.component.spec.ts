import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchUniModalPdfComponent } from './tm-ach-uni-modal-pdf.component';

describe('TmAchUniModalPdfComponent', () => {
  let component: TmAchUniModalPdfComponent;
  let fixture: ComponentFixture<TmAchUniModalPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchUniModalPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchUniModalPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
