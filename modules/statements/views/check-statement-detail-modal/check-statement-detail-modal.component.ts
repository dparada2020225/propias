import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { environment } from 'src/environments/environment';
import { DepositStatementPrintService } from '../../services/deposit-statement-print.service';
import { ParameterManagementService } from '../../../../service/navegation-parameters/parameter-management.service';
import { UtilService } from '../../../../service/common/util.service';

/**
 * @author Sebastian Chicoma S.
 *
 * Componente utilizado para el modal dde detalle de transacciones de la pantalla Estado de cuentas (Cheques)
 */
@Component({
  selector: 'byte-check-statement-detail-modal',
  templateUrl: './check-statement-detail-modal.component.html',
  styleUrls: ['./check-statement-detail-modal.component.scss'],
})
export class CheckStatementDetailModalComponent implements OnInit {
  @Input() generalInformation: any;
  @Input() operation: any;
  @Input() authorization = '';
  @Input() information: any;

  issueUser!: string;
  issueDate!: string;
  assetsVersion = EVersionHandler.ASSETS;

  profile = environment.profile;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private pdf: DepositStatementPrintService,
    private parameterManagementService: ParameterManagementService,
    private utils: UtilService,
  ) {}

  ngOnInit(): void {
    const userInfo = this.parameterManagementService.getParameter('userInfo');
    this.issueUser = `${userInfo.firstName.toLowerCase()} ${userInfo.firstLastname.toLowerCase()}`;
    this.issueDate = moment().format('DD/MM/YYYY HH:mm:ss');
  }

  close() {
    this.ngbActiveModal.close();
  }

  download() {
    const info = {
      information: this.information,
      operation: this.operation,
      general: this.generalInformation
    };

    this.pdf.pdfGenerate(info, this.authorization, 'print', 248);
  }

  get documentNumber() {
    return this.utils.removeLeftPadZeros(this.information?.documentNumber);
  }
}
