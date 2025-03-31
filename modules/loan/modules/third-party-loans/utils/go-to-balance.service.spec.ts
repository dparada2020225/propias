import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { BusinessNameService } from 'src/app/service/shared/business-name.service';
import { TokenizerAccountsService } from 'src/app/service/token/tokenizer-accounts.service';
import { mockPromise } from 'src/assets/testing';
import { GoToBalanceService } from './go-to-balance.service';

describe('GoToBalanceService', () => {
    let service: GoToBalanceService;
    let tokenizerEncrypt: jasmine.SpyObj<TokenizerAccountsService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        const businessNameSpy = jasmine.createSpyObj('BusinessNameService', ['accountNumber'])
        const tokenizerEncryptSpy = jasmine.createSpyObj('TokenizerAccountsService', ['tokenizer'])
        const routerSpy = jasmine.createSpyObj('Router', ['navigate'])
        const parameterManagementServiceSpy = jasmine.createSpyObj('ParameterManagementService', ['sendParameters'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: BusinessNameService, useValue: businessNameSpy },
                { provide: TokenizerAccountsService, useValue: tokenizerEncryptSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ParameterManagementService, useValue: parameterManagementServiceSpy },
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

        service = TestBed.inject(GoToBalanceService);
        tokenizerEncrypt = TestBed.inject(TokenizerAccountsService) as jasmine.SpyObj<TokenizerAccountsService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should go To Balance', () => {
        router.navigate.and.returnValue(mockPromise(true))
        service.goToBalance('2545504');
        expect(tokenizerEncrypt.tokenizer).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/con-sal'])
    })
});
