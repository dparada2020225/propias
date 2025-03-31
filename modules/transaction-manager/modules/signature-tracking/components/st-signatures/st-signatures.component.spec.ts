import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Location} from '@angular/common';

import {StSignaturesComponent} from './st-signatures.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {SignatureTrackingDefinitionService} from "../../services/definition/signature-tracking-definition.service";
import {ParameterManagementService} from "../../../../../../service/navegation-parameters/parameter-management.service";
import {MockTranslatePipe} from "../../../../../../../assets/mocks/public/tranlatePipeMock";
import {ISTTransactionState} from "../../interfaces/signature-tracking.interface";
import {iTMTransactionMock} from "../../../../../../../assets/mocks/modules/loan/loan.data.mock";

describe('StSignaturesComponent', () => {
  let component: StSignaturesComponent;
  let fixture: ComponentFixture<StSignaturesComponent>;

  let signatoryTrackingDefinition: jasmine.SpyObj<SignatureTrackingDefinitionService>;
  let parameterManager: jasmine.SpyObj<ParameterManagementService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {

    const signatoryTrackingDefinitionSpy = jasmine.createSpyObj('SignatureTrackingDefinitionService', ['buildSignatoryUsersTable'])
    const parameterManagerSpy = jasmine.createSpyObj('ParameterManagementService', ['getParameter', 'sendParameters'])
    const locationSpy = jasmine.createSpyObj('Location', ['back'])

    await TestBed.configureTestingModule({
      declarations: [ StSignaturesComponent, MockTranslatePipe ],
      providers: [
        { provide: SignatureTrackingDefinitionService, useValue: signatoryTrackingDefinitionSpy },
        { provide: ParameterManagementService, useValue: parameterManagerSpy },
        { provide: Location, useValue: locationSpy },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StSignaturesComponent);
    component = fixture.componentInstance;

    signatoryTrackingDefinition = TestBed.inject(SignatureTrackingDefinitionService) as jasmine.SpyObj<SignatureTrackingDefinitionService>;
    parameterManager = TestBed.inject(ParameterManagementService) as jasmine.SpyObj<ParameterManagementService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

    const data:ISTTransactionState = {
      position: 2,
      transactionSelected: iTMTransactionMock
    }

    parameterManager.getParameter.and.returnValue(data)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
