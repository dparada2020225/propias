import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { StatementsService } from 'src/app/service/shared/statements.service';
import { iAccount } from 'src/assets/mocks/modules/signature-tracking/mocksDetailTransaction';
import { MockRouterStateSnapshot } from 'src/assets/mocks/modules/transfer/service/own-transfer/build.route-snapshot.mock';
import { mockObservable, mockObservableError } from 'src/assets/testing';
import { DebitLoansNumbers } from './debit-loans-numbers.resolver';

describe('TTDCreateFormService', () => {
    let resolver: DebitLoansNumbers;

    let statements: jasmine.SpyObj<StatementsService>;
    let spinner: jasmine.SpyObj<NgxSpinnerService>;
    let findService: jasmine.SpyObj<FindServiceCodeService>;
    let route: RouterStateSnapshot

    beforeEach(() => {
        const statementsSpy = jasmine.createSpyObj('StatementsService', ['getAccountsWithoutProduct'])
        const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show'])
        const findServiceSpy = jasmine.createSpyObj('FindServiceCodeService', ['getServiceCode'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: StatementsService, useValue: statementsSpy },
                { provide: NgxSpinnerService, useValue: spinnerSpy },
                { provide: FindServiceCodeService, useValue: findServiceSpy },
            ]
        });

        resolver = TestBed.inject(DebitLoansNumbers);
        statements = TestBed.inject(StatementsService) as jasmine.SpyObj<StatementsService>;
        spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
        findService = TestBed.inject(FindServiceCodeService) as jasmine.SpyObj<FindServiceCodeService>;

        route = new MockRouterStateSnapshot('transfer/resolver')
    });

    it('should be created', () => {
        expect(resolver).toBeTruthy();
    });

    it('should Debit Loans Numbers return succesfully', () => {
        statements.getAccountsWithoutProduct.and.returnValue(mockObservable([iAccount]))
        resolver.resolve(null, route).subscribe({
            next: (value) => {
                expect(value).toEqual([iAccount])
            },
            complete() {
                expect(spinner.show).toHaveBeenCalled();
                expect(findService.getServiceCode).toHaveBeenCalled();
            },
        })
    })

    it('should Debit Loans Numbers return error', () => {
        statements.getAccountsWithoutProduct.and.returnValue(mockObservableError({
            status: 404,
            error: {
                message: 'error test'
            }
        }))
        resolver.resolve(null, route).subscribe({
            error: (err) => {
                expect(err?.status).toEqual(404)
                expect(err?.message?.message).toEqual('error test')
            },
            complete() {
                expect(spinner.show).toHaveBeenCalled();
                expect(findService.getServiceCode).toHaveBeenCalled();
            },
        })
    })

});
