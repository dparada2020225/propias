import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tm365FooterComponent } from './tm365-footer.component';

describe('Tm365FooterComponent', () => {
  let component: Tm365FooterComponent;
  let fixture: ComponentFixture<Tm365FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tm365FooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tm365FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
