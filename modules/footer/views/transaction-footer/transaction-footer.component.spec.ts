import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TransactionFooterComponent } from './transaction-footer.component';

describe('TransactionFooterComponent', () => {
  let component: TransactionFooterComponent;
  let fixture: ComponentFixture<TransactionFooterComponent>;
  let businessNameService: jasmine.SpyObj<BusinessNameService>;

  beforeEach(async () => {
    const businessNameServiceSpy = jasmine.createSpyObj('BusinessNameService', ['getBusiness']);
    await TestBed.configureTestingModule({
      declarations: [TransactionFooterComponent],
      providers: [{ provide: BusinessNameService, useValue: businessNameServiceSpy }],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFooterComponent);
    component = fixture.componentInstance;
    businessNameService = TestBed.inject(BusinessNameService) as jasmine.SpyObj<BusinessNameService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(businessNameService.getBusiness).toHaveBeenCalled();
  });
});
