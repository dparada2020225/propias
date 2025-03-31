import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowFavoritesModalComponent } from './know-favorites-modal.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MockTranslatePipe} from "../../../../../../../../../../assets/mocks/public/tranlatePipeMock";

describe('KnowFavoritesModalComponent', () => {
  let component: KnowFavoritesModalComponent;
  let fixture: ComponentFixture<KnowFavoritesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowFavoritesModalComponent, MockTranslatePipe ],
      imports : [
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

    fixture = TestBed.createComponent(KnowFavoritesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
