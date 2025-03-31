import { AdfFormBuilderService } from '@adf/components';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from 'src/app/service/common/util.service';
import creditAccounts from 'src/assets/mocks/modules/transfer/service/own-transfer/credit-accounts.json';
import { iOTEInitStep1RequestMock } from 'src/assets/mocks/modules/transfer/service/own-transfer/own.data.mock';
import { OteTransferFormService } from './ote-transfer-form.service';

describe('OteTransferFormService', () => {
  let service: OteTransferFormService;

  let utilService: jasmine.SpyObj<UtilService>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let formBuilderService: jasmine.SpyObj<AdfFormBuilderService>;

  beforeEach(() => {
    const utilServiceSpy = jasmine.createSpyObj('UtilService', ['getAmountMask', 'geCurrencSymbol', 'removeLayoutSelect']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    const formBuilderServiceSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition']);

    TestBed.configureTestingModule({
      providers: [
        OteTransferFormService,

        {
          provide: UtilService,
          useValue: utilServiceSpy,
        },
        {
          provide: TranslateService,
          useValue: translateServiceSpy,
        },
        {
          provide: AdfFormBuilderService,
          useValue: formBuilderServiceSpy,
        },
      ],
      imports: [ReactiveFormsModule, FormsModule],
    });

    service = TestBed.inject(OteTransferFormService);

  });

  it('should be create "OteTransferFormService"', () => {
    expect(service).toBeTruthy();
  });

  it('"changeAccountDebited" should return "accountDebitedSelected = undefined" if the number account dont exist', () => {
    service.accountDebitList = creditAccounts;
    const test1 = service.changeAccountDebited('0100100108200000000');
    expect(test1.accountDebitedSelected).toEqual(undefined as any);
  });

  it('"changeAccountDebited" should return "accountDebitedSelected " if the number account exist', () => {

    service.layoutOwnTransfer =
    {
      attributes: [

      ],
      class: 'layout',
      subtitle: 'layout',
      title: 'Layout'
    }
    service.accountDebitList = creditAccounts;
    service.accountCreditList = creditAccounts;
    const test1 = service.changeAccountDebited('010010010820');
    expect(test1.accountDebitedSelected).toEqual(service.accountDebitList[0]);
  });

  it('"changeAccountAccredit" should return "accountCreditSelected = undefined" if the number account dont exist', () => {
    service.accountCreditList = creditAccounts;
    const test1 = service.changeAccountAccredit('310010019305779797987798979');
    expect(test1.accountCreditSelected).toEqual(undefined as any);
  });

  it('"changeAccountAccredit" should return "accountCreditSelected " if the number account exist', () => {
    service.layoutOwnTransfer =
    {
      attributes: [

      ],
      class: 'layout',
      subtitle: 'layout',
      title: 'Layout'
    }
    service.accountCreditList = creditAccounts;
    const test1 = service.changeAccountAccredit('310010019305');
    expect(test1.accountCreditSelected).toEqual(service.accountCreditList[4]);
  });

  it('"changeAccountAccredit" should undefined', () => {
    service.layoutOwnTransfer =
    {
      attributes: [

      ],
      class: 'layout',
      subtitle: 'layout',
      title: 'Layout'
    }
    service.accountCreditList = creditAccounts;
    const test1 = service.changeAccountAccredit();
    expect(test1.accountCreditSelected).toBeUndefined();
  });

  it('formScreenBuilder', () => {
    service.formScreenBuilder(iOTEInitStep1RequestMock);
    expect(service.formScreenBuilder).toBeDefined();
  });

  it('formScreenBuilder with error', () => {

    const data = iOTEInitStep1RequestMock;
    data.accountDebitList = { error: 'Error message' } as any;

    service.formScreenBuilder(data);
    expect(service.catchErrorList).toEqual([data.accountDebitList] as any);
  });

})
