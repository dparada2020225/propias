import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { iThirdPartyLoanAssociateMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { IFlowError } from '../../../../../models/error.interface';
import { ThirdPartyLoansService } from '../services/transaction/third-party-loans.service';
import { ThirdPartyLoansConfirmationResolver } from './tpl-confirmation.resolver';

describe('TTDCreateFormService', () => {
    let resolver: ThirdPartyLoansConfirmationResolver;
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
            ],
        });

        resolver = TestBed.inject(ThirdPartyLoansConfirmationResolver);
        spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
        thirdPartyLoans = TestBed.inject(ThirdPartyLoansService) as jasmine.SpyObj<ThirdPartyLoansService>;
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });

    it('should Third Party Loans Confirmation Resolver return ok', () => {
        thirdPartyLoans.getThirdPartyLoansAccount.and.returnValue(mockObservable([iThirdPartyLoanAssociateMock]))
        resolver.resolve().subscribe({
            next: (value) => {
                expect(value).toEqual([iThirdPartyLoanAssociateMock])
            },
            complete() {
                expect(spinner.show).toHaveBeenCalled();
            },
        })
    })

    it('should Third Party Loans Confirmation Resolver return error', () => {
        thirdPartyLoans.getThirdPartyLoansAccount.and.returnValue(mockObservableError({
            status: 400,
            error: {
                message: 'Bad Request'
            }
        }))
        resolver.resolve().subscribe({
            error: (err: IFlowError) => {
                expect(err.status).toEqual(400);
                expect(err.message).toEqual('Bad Request');
            },
            complete() {
                expect(spinner.show).toHaveBeenCalled();
            },
        })
    })



});
