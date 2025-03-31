import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmppProofModalComponent } from './pmpp-proof-modal.component';

describe('SppProofModalComponent', () => {
  let component: PmppProofModalComponent;
  let fixture: ComponentFixture<PmppProofModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmppProofModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmppProofModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
