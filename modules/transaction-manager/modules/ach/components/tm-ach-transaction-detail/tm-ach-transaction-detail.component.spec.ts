import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchTransactionDetailComponent } from './tm-ach-transaction-detail.component';

describe('TmAchTransactionDetailComponent', () => {
  let component: TmAchTransactionDetailComponent;
  let fixture: ComponentFixture<TmAchTransactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchTransactionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
