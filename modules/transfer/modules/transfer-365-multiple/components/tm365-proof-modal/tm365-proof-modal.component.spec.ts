import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365ProofModalComponent } from './tm365-proof-modal.component';

describe('Tm365ProofModalComponent', () => {
  let component: Tm365ProofModalComponent;
  let fixture: ComponentFixture<Tm365ProofModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365ProofModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365ProofModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
