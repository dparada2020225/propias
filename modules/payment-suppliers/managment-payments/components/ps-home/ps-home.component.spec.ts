import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsHomeComponent } from './ps-home.component';

describe('PsHomeComponent', () => {
  let component: PsHomeComponent;
  let fixture: ComponentFixture<PsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
