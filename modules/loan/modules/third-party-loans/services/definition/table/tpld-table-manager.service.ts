import { Injectable } from '@angular/core';
import { UtilWorkFlowService } from '../../../../../../../service/common/util-work-flow.service';
import { IFormFilterParameters } from '../../../interfaces/tpld-table-definition.interface';
import { TpldFormFilterService } from './tpld-form-filter.service';
import { TpldTableOwnService } from './tpld-table-own.service';
import { TpldTableThirdService } from './tpld-table-third.service';

@Injectable({
  providedIn: 'root'
})
export class TpldTableManagerService {

  constructor(
    private filterForm: TpldFormFilterService,
    private tableOwnLoan: TpldTableOwnService,
    private tableThirdLoan: TpldTableThirdService,
    private utilWorkflow: UtilWorkFlowService,
  ) { }

  buildFilterForm(parameters: IFormFilterParameters) {
    return this.filterForm.buildFilterLayout(parameters);
  }

  buildThirdLoanTable(menuOptionsLicenses: string[]) {
    return this.tableThirdLoan.buildThirdLoanTableLayout(menuOptionsLicenses);
  }

  buildOwnThirdLoanTable() {
    return this.tableOwnLoan.buildOwnLoanTableLayout();
  }

  buildDeleteThirdTableAlert() {
    return this.utilWorkflow.buildDeleteAchAlert('delete_message_third_modal');
  }

  buildDeleteAlert() {
    return this.utilWorkflow.buildDeleteAchAlert('delete_message_third_modal');
  }
}
