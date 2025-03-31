import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { iFormFilterParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldFormFilterService } from './tpld-form-filter.service';
import { TpldTableManagerService } from './tpld-table-manager.service';
import { TpldTableOwnService } from './tpld-table-own.service';
import { TpldTableThirdService } from './tpld-table-third.service';

describe('TpldTableManagerService', () => {
  let service: TpldTableManagerService;
  let filterForm: jasmine.SpyObj<TpldFormFilterService>;
  let tableOwnLoan: jasmine.SpyObj<TpldTableOwnService>;
  let tableThirdLoan: jasmine.SpyObj<TpldTableThirdService>;
  let utilWorkflow: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(() => {
    const filterFormSpy = jasmine.createSpyObj('TpldFormFilterService', ['buildFilterLayout']);
    const tableOwnLoanSpy = jasmine.createSpyObj('TpldTableOwnService', ['buildOwnLoanTableLayout']);
    const tableThirdLoanSpy = jasmine.createSpyObj('TpldTableThirdService', ['buildThirdLoanTableLayout']);
    const utilWorkflowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildDeleteAchAlert']);

    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: TpldFormFilterService, useValue: filterFormSpy },
        { provide: TpldTableOwnService, useValue: tableOwnLoanSpy },
        { provide: TpldTableThirdService, useValue: tableThirdLoanSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkflowSpy },
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

    service = TestBed.inject(TpldTableManagerService);
    filterForm = TestBed.inject(TpldFormFilterService) as jasmine.SpyObj<TpldFormFilterService>;
    tableOwnLoan = TestBed.inject(TpldTableOwnService) as jasmine.SpyObj<TpldTableOwnService>;
    tableThirdLoan = TestBed.inject(TpldTableThirdService) as jasmine.SpyObj<TpldTableThirdService>;
    utilWorkflow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build Filter Form', () => {
    service.buildFilterForm(iFormFilterParametersMock);
    expect(filterForm.buildFilterLayout).toHaveBeenCalled();
  });

  it('should build Third Loan Table', () => {
    service.buildThirdLoanTable([]);
    expect(tableThirdLoan.buildThirdLoanTableLayout).toHaveBeenCalled();
  });

  it('should build Delete Third Table Alert', () => {
    service.buildDeleteThirdTableAlert();
    expect(utilWorkflow.buildDeleteAchAlert).toHaveBeenCalledWith('delete_message_third_modal');
  });

  it('should build Delete Alert', () => {
    service.buildDeleteAlert();
    expect(utilWorkflow.buildDeleteAchAlert).toHaveBeenCalledWith('delete_message_third_modal');
  });

  it('should build Own Third Loan Table', () => {
    service.buildOwnThirdLoanTable();
    expect(tableOwnLoan.buildOwnLoanTableLayout).toHaveBeenCalled();
  });
});
