import {ComponentFixture, TestBed} from '@angular/core/testing';
import { T365HomeComponent } from './t365-home.component';


describe('T365HomeComponent', () => {
  let component: T365HomeComponent;
  let fixture: ComponentFixture<T365HomeComponent>;

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [ T365HomeComponent ],
      imports: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(T365HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
