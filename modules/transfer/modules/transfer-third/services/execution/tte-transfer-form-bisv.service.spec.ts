import {TestBed} from '@angular/core/testing';

import {TteTransferFormBisvService} from './tte-transfer-form-bisv.service';
import {UtilService} from "../../../../../../service/common/util.service";
import {TranslateService} from "@ngx-translate/core";
import {TtdTransferManagerService} from "../definition/transaction/manager/ttd-transfer-manager.service";
import {AdfFormBuilderService} from "@adf/components";
import {UtilWorkFlowService} from "../../../../../../service/common/util-work-flow.service";
import {
    iTTEInitStep1RequestMock
} from "../../../../../../../assets/mocks/modules/transfer/service/third-transfer/thisrd.data.mock";
import {AttributeThirdFormTransfer} from "../../enums/third-transfer-control-name.enum";

describe('TteTransferFormBisvService', () => {
    let service: TteTransferFormBisvService;
    let util: jasmine.SpyObj<UtilService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let thirdTransferManager: jasmine.SpyObj<TtdTransferManagerService>;
    let thirdFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
    let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

    beforeEach(() => {

        const utilSpy = jasmine.createSpyObj('UtilService', ['getAmountMask'])
        const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant'])
        const thirdTransferManagerSpy = jasmine.createSpyObj('TtdTransferManagerService', ['buildTransferFormStep1'])
        const thirdFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
        const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', [''])

        TestBed.configureTestingModule({
            providers: [
                {provide: UtilService, useValue: utilSpy},
                {provide: TranslateService, useValue: translateServiceSpy},
                {provide: TtdTransferManagerService, useValue: thirdTransferManagerSpy},
                {provide: AdfFormBuilderService, useValue: thirdFormBuilderSpy},
                {provide: UtilWorkFlowService, useValue: utilWorkFlowSpy},
            ]
        });

        service = TestBed.inject(TteTransferFormBisvService);
        util = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        thirdTransferManager = TestBed.inject(TtdTransferManagerService) as jasmine.SpyObj<TtdTransferManagerService>;
        thirdFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
        utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should formScreenBuilderBisv', () => {

        thirdTransferManager.buildTransferFormStep1.and.returnValue({
            attributes: [
                {controlName: AttributeThirdFormTransfer.AMOUNT}
            ]
        } as any)

        service.formScreenBuilderBisv(iTTEInitStep1RequestMock);

        expect(thirdTransferManager.buildTransferFormStep1).toHaveBeenCalled();
        expect(thirdFormBuilder.formDefinition).toHaveBeenCalled();
        expect(util.getAmountMask).toHaveBeenCalled();
    })

    it('should changeAccountDebited', () => {
        service.accountDebitedList = iTTEInitStep1RequestMock.accountDebitedList as any;

        const res = service.changeAccountDebited('1576653');

        expect(res.accountDebited?.account).toEqual('1576653');
        expect(res.thirdTransferLayout).toBeUndefined();
    })

    it('should changeAccountAccredit', () => {
        service.accountCreditList = iTTEInitStep1RequestMock.accountCreditList as any;

        const res = service.changeAccountAccredit('222990000048');

        expect(res.thirdTransferLayout).toBeUndefined();
        expect(res.accountAccredit?.account).toEqual('222990000048')
    })

});
