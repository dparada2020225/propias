import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { IFlowError } from '../../../../../models/error.interface';
import { ThirdPartyLoansService } from '../services/transaction/third-party-loans.service';
import { ThirdPartyLoansAccountsResolver } from './loan-account-numbers.resolver';

describe('TTDCreateFormService', () => {
    let resolver: ThirdPartyLoansAccountsResolver;
    let spinner: jasmine.SpyObj<NgxSpinnerService>;
    let thirdPartyLoans: jasmine.SpyObj<ThirdPartyLoansService>;

    beforeEach(() => {

        const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
        const thirdPartyLoansSpy = jasmine.createSpyObj('ThirdPartyLoansService', ['getThirdPartyLoansAccount'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: NgxSpinnerService, useValue: spinnerSpy },
                { provide: ThirdPartyLoansService, useValue: thirdPartyLoansSpy },
            ]
        });

        resolver = TestBed.inject(ThirdPartyLoansAccountsResolver);
        spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
        thirdPartyLoans = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });

    it('should Third Party Loans Accounts Resolver response succesfully', () => {
        thirdPartyLoans.getThirdPartyLoansAccount.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]))
        resolver.resolve().subscribe({
            next: (value) => {
                expect(value).toEqual([iThirdPartyLoanAssociateMock])
            },
            complete(){
                expect(spinner.show).toHaveBeenCalled();
            }
        })
    })

    it('should Third Party Loans Accounts Resolver response failed', () => {
        thirdPartyLoans.getThirdPartyLoansAccount.and.returnValue(mockObservableError({
            status: 404,
            error: {
                message: 'Third Party error'
            }
        }))
        resolver.resolve().subscribe({
            next: (value) => {
            },
            error:(err:IFlowError) =>{
                expect(err?.status).toEqual(404)
                expect(err?.message).toEqual('Third Party error')
            },
            complete(){
                expect(spinner.show).toHaveBeenCalled();
            }
        })
    })

});
