import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TargetAccountPreviewComponent} from './target-account-preview.component';
import {UtilService} from "../../../../../../../../service/common/util.service";
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";

describe('TargetAccountPreviewComponent', () => {
  let component: TargetAccountPreviewComponent;
  let fixture: ComponentFixture<TargetAccountPreviewComponent>;
  let util: jasmine.SpyObj<UtilService>;

  beforeEach(async () => {

    const utilSpy = jasmine.createSpyObj('UtilService', ['getProductKeyTranslation', 'getLabelCurrency', 'getLabelStatus'])

    await TestBed.configureTestingModule({
      declarations: [TargetAccountPreviewComponent],
      providers: [
        {provide: UtilService, useValue: utilSpy},
      ],
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

    fixture = TestBed.createComponent(TargetAccountPreviewComponent);
    component = fixture.componentInstance;
    util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
