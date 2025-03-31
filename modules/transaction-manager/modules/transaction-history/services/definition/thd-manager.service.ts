import { Injectable } from '@angular/core';
import { ITransactionHistory } from '../../interfaces/transaction-history.interface';
import { ThdTableService } from './thd-table.service';
import { ThdConsultFormService } from './thd-consult-form.service';

@Injectable({
  providedIn: 'root'
})
export class ThdManagerService {
  constructor(
    private consultFormDefinition: ThdConsultFormService,
    private tableDefinition: ThdTableService,
  ) { }

  buildConsultFormLayout(isShowFullForm: boolean = false) {
    return this.consultFormDefinition.buildConsultForm(isShowFullForm);
  }

  buildTableLayout(listTransactions: ITransactionHistory[]) {
    return this.tableDefinition.buildTransactionsTableLayout(listTransactions);
  }

  parseTransactions(listTransactions: ITransactionHistory[]) {
    return this.tableDefinition.parseTransactions(listTransactions);
  }
}
