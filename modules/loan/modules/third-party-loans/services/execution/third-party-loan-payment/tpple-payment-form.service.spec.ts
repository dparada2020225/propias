import { TestBed } from '@angular/core/testing';

import { AdfFormBuilderService } from '@adf/components';
import { UtilWorkFlowService } from 'src/app/service/common/util-work-flow.service';
import { UtilService } from 'src/app/service/common/util.service';
import { iTPLPEStartupParametersMock } from 'src/assets/mocks/modules/loan/loan.data.mock';
import { TpldPaymentManagerService } from '../../definition/payment/tpld-payment-manager.service';
import { TpplePaymentFormService } from './tpple-payment-form.service';

describe('TpplePaymentFormService', () => {
  let service: TpplePaymentFormService;
  let thirdPartyPaymentDefinitionManager: jasmine.SpyObj<TpldPaymentManagerService>;
  let adfFormBuilder: jasmine.SpyObj<AdfFormBuilderService>;
  let utils: jasmine.SpyObj<UtilService>;
  let utilWorkFlow: jasmine.SpyObj<UtilWorkFlowService>;

  beforeEach(() => {

    const thirdPartyPaymentDefinitionManagerSpy = jasmine.createSpyObj('TpldPaymentManagerService', ['buildFormLayout'])
    const adfFormBuilderSpy = jasmine.createSpyObj('AdfFormBuilderService', ['formDefinition'])
    const utilsSpy = jasmine.createSpyObj('UtilService', ['removeLayoutSelect'])
    const utilWorkFlowSpy = jasmine.createSpyObj('UtilWorkFlowService', ['buildAccountResumeAttributeForSelectAccounts'])

    TestBed.configureTestingModule({
      providers: [
        { provide: TpldPaymentManagerService, useValue: thirdPartyPaymentDefinitionManagerSpy },
        { provide: AdfFormBuilderService, useValue: adfFormBuilderSpy },
        { provide: UtilService, useValue: utilsSpy },
        { provide: UtilWorkFlowService, useValue: utilWorkFlowSpy },
      ]
    });
    service = TestBed.inject(TpplePaymentFormService);
    thirdPartyPaymentDefinitionManager = TestBed.inject(TpldPaymentManagerService) as jasmine.SpyObj<TpldPaymentManagerService>;
    adfFormBuilder = TestBed.inject(AdfFormBuilderService) as jasmine.SpyObj<AdfFormBuilderService>;
    utils = TestBed.inject(UtilService) as jasmine.SpyObj<UtilService>;
    utilWorkFlow = TestBed.inject(UtilWorkFlowService) as jasmine.SpyObj<UtilWorkFlowService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build form Screen Builder', () => {
    thirdPartyPaymentDefinitionManager.buildFormLayout.and.returnValue({
      attributes: [{}]
    } as any)

    service.formScreenBuilder(iTPLPEStartupParametersMock);

    expect(thirdPartyPaymentDefinitionManager.buildFormLayout).toHaveBeenCalled();
    expect(adfFormBuilder.formDefinition).toHaveBeenCalled();

    const res = service.changeAccountDebited('1576653')
    expect(res?.sourceAccount?.account).toEqual('1576653')
    expect(utils.removeLayoutSelect).not.toHaveBeenCalled();
    expect(utilWorkFlow.buildAccountResumeAttributeForSelectAccounts).not.toHaveBeenCalled();
  })

});
