import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdfRadioButtonComponent} from './adf-radio-button.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MockTranslatePipe} from "../../../../../../assets/mocks/public/tranlatePipeMock";

describe('AdfRadioButtonComponent', () => {
  let component: AdfRadioButtonComponent;
  let fixture: ComponentFixture<AdfRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdfRadioButtonComponent, MockTranslatePipe ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdfRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should on model change', () => {
    spyOn(component.onChecked, 'emit');
    component.onModelChange();

    expect(component.onChecked.emit).toHaveBeenCalled()
  })

  it('should write new value', () => {
    const value:boolean = true
    component.writeValue(value);
    expect(component.isChecked).toBeTruthy();
  })

  it('should registerOnTouched', () => {
    component.registerOnTouched(true);
    expect(component.onTouch).toBeTruthy()
  })

  it('should registerOnChange', () => {
    component.registerOnChange(true);
    expect(component.onChange).toBeTruthy()
  })

});
