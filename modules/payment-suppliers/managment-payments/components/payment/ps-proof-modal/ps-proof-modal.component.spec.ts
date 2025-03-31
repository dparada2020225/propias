import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PSProofModalComponent } from './ps-proof-modal.component';

describe('SppProofModalComponent', () => {
  let component: PSProofModalComponent;
  let fixture: ComponentFixture<PSProofModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PSProofModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PSProofModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
