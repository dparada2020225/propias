import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewFunctionModalComponent} from './new-function-modal.component';
import {MockTranslatePipe} from "../../../../../../../../../../assets/mocks/public/tranlatePipeMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('NewFunctionModalComponent', () => {
  let component: NewFunctionModalComponent;
  let fixture: ComponentFixture<NewFunctionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFunctionModalComponent, MockTranslatePipe ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
