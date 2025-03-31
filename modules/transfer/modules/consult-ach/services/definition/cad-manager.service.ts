import { Injectable } from '@angular/core';
import {
  ICACHTableParameters,
  ICADDetailTransactionModalParameters,
  ICADDetailTransactionParameters,
  ICADDetailTransactionPDFParameters,
} from '../../interfaces/consult-ach-definition.interface';
import { ICOTransactionCreditDetail } from '../../interfaces/navigate-parameters.interface';
import { CadDetailTransactionService } from './cad-detail-transaction.service';
import { CadFormService } from './cad-form.service';
import { CadModalService } from './cad-modal.service';
import { CadPdfService } from './cad-pdf.service';
import { CadTableService } from './cad-table.service';

@Injectable({
  providedIn: 'root',
})
export class CadManagerService {
  constructor(
    private formDefinition: CadFormService,
    private tableDefinition: CadTableService,
    private pdfDefinition: CadPdfService,
    private modalDefinition: CadModalService,
    private detailTransactionDefinition: CadDetailTransactionService
  ) {}

  buildFormLayout() {
    return this.formDefinition.buildFormDefinition();
  }

  buildTableLayout(parameters: ICACHTableParameters) {
    return this.tableDefinition.buildTableDefinition(parameters);
  }
  buildPdfVoucherLayout(parameters: ICADDetailTransactionPDFParameters, transactionCreditDetail?: ICOTransactionCreditDetail) {
    return this.pdfDefinition.buildVoucherPdf(parameters, transactionCreditDetail);
  }

  buildModalLayout(parameters: ICADDetailTransactionModalParameters, transactionCreditDetail?: ICOTransactionCreditDetail) {
    return this.modalDefinition.builderLayoutModal(parameters, transactionCreditDetail);
  }

  buildDetailTransactionLayout(parameters: ICADDetailTransactionParameters, transactionCreditDetail?: ICOTransactionCreditDetail) {
    return this.detailTransactionDefinition.buildDetailTransactionLayout(parameters, transactionCreditDetail);
  }
}
