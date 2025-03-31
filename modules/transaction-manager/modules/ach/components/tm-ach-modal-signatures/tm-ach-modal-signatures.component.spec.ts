import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchModalSignaturesComponent } from './tm-ach-modal-signatures.component';

describe('TmAchModalSignaturesComponent', () => {
  let component: TmAchModalSignaturesComponent;
  let fixture: ComponentFixture<TmAchModalSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchModalSignaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchModalSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
