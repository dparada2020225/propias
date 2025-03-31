import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { iB2bPaymentParametersToExecuteTransactionMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { B2bdPaymentDefinitionService } from './b2bd-payment-definition.service';

describe('B2bdPaymentDefinitionService', () => {
  let service: B2bdPaymentDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });

    service = TestBed.inject(B2bdPaymentDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Payment Execution Data', () =>{
    const res = service.buildPaymentExecutionData(iB2bPaymentParametersToExecuteTransactionMock)
    expect(res).toBeDefined();
  })

});
