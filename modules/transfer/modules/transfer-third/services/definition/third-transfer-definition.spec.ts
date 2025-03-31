import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ThirdTransferDefinitionService} from './third-transfer-definition.service';
import {TokenizerAccountsService} from 'src/app/service/token/tokenizer-accounts.service';
import {iDataToTransactionExecuteMock} from 'src/assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock';

describe('ThirdTransferDefinitionService', () => {
    let service: ThirdTransferDefinitionService;
    let tokenEncrypt: jasmine.SpyObj<TokenizerAccountsService>;

    beforeEach(() => {

        const tokenEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: TokenizerAccountsService, useValue: tokenEncryptSpy },
            ],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
            ],
        });

        service = TestBed.inject(ThirdTransferDefinitionService);
        tokenEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should buildDataToExecuteTransaction', () => {
        tokenEncrypt.tokenizer.and.returnValue('test')
        const re = service.buildDataToExecuteTransaction(iDataToTransactionExecuteMock)

        expect(re).toEqual(
            {
                sourceAccount: 'test',
                sourceProduct: '12',
                sourceSubProduct: '10',
                sourceCurrency: 'USD',
                sourceAlias: iDataToTransactionExecuteMock.sourceAccount.alias,
                targetAccount: 'test',
                targetProduct: 'A',
                targetSubProduct: '1',
                targetCurrency: 'USD',
                targetAlias: 'Cuenta de ahorros',
                amount: 10,
                description: 'test',
                notify: true,
                email: 'test@TestBed.com'
            }
        )

    })

});
