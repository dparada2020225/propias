import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ITableStructure } from '@adf/components';
import { SignatureTrackingDefinitionService } from '../../services/definition/signature-tracking-definition.service';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ISTTransactionState } from '../../interfaces/signature-tracking.interface';
import { UtilService } from '../../../../../../service/common/util.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { EProfile } from '../../../../../../enums/profile.enum';
import { Router } from '@angular/router';
import { ESignatureTrackingUrlFlow } from '../../enum/st-navigate-enum';

@Component({
  selector: 'byte-st-signatures',
  templateUrl: './st-signatures.component.html',
  styleUrls: ['./st-signatures.component.scss']
})
export class StSignaturesComponent implements OnInit, AfterViewInit {

  tableLayout!: ITableStructure;
  currentState!: ISTTransactionState;

  constructor(
    private signatoryTrackingDefinition: SignatureTrackingDefinitionService,
    private parameterManager: ParameterManagementService,
    private utils: UtilService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentState = this.parameterManager.getParameter('navigateStateParameters');
    const { transactionSelected } = this.currentState;


    const users = transactionSelected?.signatory;
    this.tableLayout = this.signatoryTrackingDefinition.buildSignatoryUsersTable(users);
  }

  setLabelBISValue() {
    if (environment.profile !== EProfile.SALVADOR) return;

    const $table = document.querySelector('.table-content__mobile ')
    if (!$table) return;

    const $tableHeader = $table.querySelector('span.user') as HTMLElement;
    $tableHeader.textContent = `${this.translate.instant('label_signature_tracing_not_available')}`.toUpperCase();
  }

  ngAfterViewInit() {
    this.setLabelBISValue();
  }

  nextStep() {
    this.utils.showLoader();
    this.resetStorage();
    /*
    * NOTE: Incidence 377069 22/02/2024
    *  Change use location to router, problem to back signature tracking home on
    *  embbede transactions
    * */
    this.router.navigate([ESignatureTrackingUrlFlow.HOME]).finally(() => {})
  }

  resetStorage() {
    this.parameterManager.sendParameters({
      navigateStateParameters: this.currentState,
      navigationProtectedParameter: null,
    });
  }
}
