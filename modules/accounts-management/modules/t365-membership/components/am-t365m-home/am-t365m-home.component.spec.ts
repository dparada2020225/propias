import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmT365mHomeComponent } from './am-t365m-home.component';

describe('AmT365mHomeComponent', () => {
  let component: AmT365mHomeComponent;
  let fixture: ComponentFixture<AmT365mHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmT365mHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmT365mHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
