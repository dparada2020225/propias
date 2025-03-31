import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TargetDebitAccountPreviewComponent} from './target-debit-account-preview.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('TargetDebitAccountPreviewComponent', () => {
  let component: TargetDebitAccountPreviewComponent;
  let fixture: ComponentFixture<TargetDebitAccountPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TargetDebitAccountPreviewComponent],
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

    fixture = TestBed.createComponent(TargetDebitAccountPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
