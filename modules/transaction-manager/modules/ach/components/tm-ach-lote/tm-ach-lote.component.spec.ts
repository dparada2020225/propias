import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmAchLoteComponent } from './tm-ach-lote.component';

describe('TmAchLoteComponent', () => {
  let component: TmAchLoteComponent;
  let fixture: ComponentFixture<TmAchLoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmAchLoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmAchLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
