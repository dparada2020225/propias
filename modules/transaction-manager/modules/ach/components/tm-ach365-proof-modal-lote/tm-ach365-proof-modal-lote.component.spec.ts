import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAch365ProofModalLoteComponent } from './tm-ach365-proof-modal-lote.component';

describe('TmAch365ProofModalLoteComponent', () => {
  let component: TmAch365ProofModalLoteComponent;
  let fixture: ComponentFixture<TmAch365ProofModalLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAch365ProofModalLoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAch365ProofModalLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
