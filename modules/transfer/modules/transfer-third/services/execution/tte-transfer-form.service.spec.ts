import {TestBed} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TteTransferFormService} from "./tte-transfer-form.service";
import {UtilService} from "../../../../../../service/common/util.service";
import {TtdTransferManagerService} from "../definition/transaction/manager/ttd-transfer-manager.service";
import {ThirdTransferDefinitionService} from "../definition/third-transfer-definition.service";
import {AdfFormBuilderService} from "@adf/components";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {
    iThirdTransfersAccountsMock,
    iTTEInitStep1RequestMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {ITTEInitStep1Request} from "../../interfaces/third-transfer-execution.interface";
import {AttributeThirdFormTransfer} from "../../enums/third-transfer-control-name.enum";
import {Currency} from "../../../../interface/transfer-data-interface";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AttributeFormTransferOwn} from "../../../transfer-own/enum/own-transfer-control-name.enum";

describe('TteTransferFormService', () => {
    let service: TteTransferFormService;

    let util: jasmine.SpyObj<UtilService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let thirdTransferManager: jasmine.SpyObj<TtdTransferManagerService>;
    let thirdTransferDefinition: jasmine.SpyObj<ThirdTransferDefinitionService>;
    let thirdFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getLabelCurrency', 'getAmountMask', 'getLabelProduct', 'removeLayoutSelect'])
        const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const thirdTransferManagerSpy = jasmine.createSpyObj('TtdTransferManagerService', ['buildTransferFormStep1'])
        const thirdTransferDefinitionSpy = jasmine.createSpyObj('ThirdTransferDefinitionService', [''])
        const thirdFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildAccountResumeAttributeForSelectAccounts'])

        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                {provide: UtilService, useValue: utilSpy},
                {provide: TranslateService, useValue: translateServiceSpy},
                {provide: TtdTransferManagerService, useValue: thirdTransferManagerSpy},
                {provide: ThirdTransferDefinitionService, useValue: thirdTransferDefinitionSpy},
                {provide: AdfFormBuilderService, useValue: thirdFormBuilderSpy},
                {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
            ],
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    },
                }),
                FormsModule,
                ReactiveFormsModule,
            ],
        });

        service = TestBed.inject(TteTransferFormService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        thirdTransferManager = TestBed.inject(TtdTransferManagerService) as jasmine.SpyObj<TtdTransferManagerService>;
        thirdTransferDefinition = TestBed.inject(ThirdTransferDefinitionService) as jasmine.SpyObj<ThirdTransferDefinitionService>;
        thirdFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
        formBuilder = TestBed.inject(FormBuilder);


        formGroup = formBuilder.group({
            [AttributeFormTransferOwn.ACCOUNT_DEBITED]: ['', [Validators.required]],
        });

        service.thirdTransferForm = formGroup;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should build formScreenBuilder', () => {
        thirdTransferManager.buildTransferFormStep1.and.returnValue({
            attributes: [
                {controlName: AttributeThirdFormTransfer.AMOUNT}
            ]
        } as any)
        util.getAmountMask.and.returnValue({} as any)

        service.formScreenBuilder(iTTEInitStep1RequestMock);

        expect(thirdTransferManager.buildTransferFormStep1).toHaveBeenCalled()
        expect(thirdFormBuilder.formDefinition).toHaveBeenCalled()
        expect(util.getAmountMask).toHaveBeenCalled();
    })

    it('should build formScreenBuilder with is Modify ', () => {
        thirdTransferManager.buildTransferFormStep1.and.returnValue({
            attributes: []
        } as any)
        util.getAmountMask.and.returnValue({} as any)

        const dto: ITTEInitStep1Request = {...iTTEInitStep1RequestMock};
        dto.isModifyMode = true;

        service.formScreenBuilder(dto);

        expect(thirdTransferManager.buildTransferFormStep1).toHaveBeenCalled()
        expect(thirdFormBuilder.formDefinition).toHaveBeenCalled()
        expect(util.getAmountMask).toHaveBeenCalled();
    })

    it('should changeAccountDebited', () => {

        utilWorkFlow.buildAccountResumeAttributeForSelectAccounts.and.returnValue([
            {
                label: 'test',
                value: 'test',
                class: 'test'
            }
        ])

        service.accountDebitedList = iTTEInitStep1RequestMock?.accountDebitedList as any;
        service.thirdTransferLayout = {
            attributes: [
                {controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED, layoutSelect: ''}
            ]
        } as any

        const res = service.changeAccountDebited('1576653');

        expect(res.thirdTransferLayout).toBeDefined();
        expect(res.accountDebited).toBeDefined();
        expect(res.accountDebited?.account).toEqual('1576653')

    })

    it('should handleChangeDebitOptions', () => {

        service.accountDebitedList = iTTEInitStep1RequestMock?.accountDebitedList as any;
        service.thirdTransferLayout = {
            attributes: [
                {controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED, layoutSelect: ''}
            ]
        } as any
        service.optionList = [
            {controlName: AttributeThirdFormTransfer.ACCOUNT_DEBITED}
        ] as any
        const dto = {...iThirdTransfersAccountsMock};
        dto.account = '8553698652';
        dto.currency = Currency.Usd;


        service.handleChangeDebitOptions(dto);

        expect(service.thirdTransferForm.get(AttributeThirdFormTransfer.ACCOUNT_DEBITED)?.markAllAsTouched).toBeTruthy()
    })

    it('should changeAccountAccredit', () => {

        service.accountCreditList = [iThirdTransfersAccountsMock];
        service.thirdTransferLayout = {
            attributes: [
                {controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_CURRENCY, placeholder: ''},
                {controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_TYPE, placeholder: ''},
                {controlName: AttributeThirdFormTransfer.ACCOUNT_ACCREDIT_ALIAS, placeholder: ''},
            ]
        } as any

        service.changeAccountAccredit('222990000048');

        expect(util.getLabelCurrency).toHaveBeenCalled();
        expect(util.getLabelProduct).toHaveBeenCalled();

    })

});
