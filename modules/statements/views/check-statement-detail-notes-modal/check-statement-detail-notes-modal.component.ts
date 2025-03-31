import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { NoteStatementPrintService } from '../../services/note-statement-print.service';
import { ParameterManagementService } from '../../../../service/navegation-parameters/parameter-management.service';
import { EProfile } from 'src/app/enums/profile.enum';

/**
 * @author Sebastian Chicoma S.
 *
 * Componente utilizado para el modal dde detalle de transacciones de la pantalla Estado de cuentas (Cheques)
 */
@Component({
  selector: 'byte-check-statement-detail-notes-modal',
  templateUrl: './check-statement-detail-notes-modal.component.html',
  styleUrls: ['./check-statement-detail-notes-modal.component.scss'],
})
export class CheckStatementDetailNotesModalComponent implements OnInit {
  @Input() information: any;
  @Input() operation: any;
  @Input() authorization = '';

  issueUser!: string;
  issueDate!: string;
  currentLanguage!: string;
  assetsVersion = EVersionHandler.ASSETS;

  profile = environment.profile;
  typeProfile:EProfile = EProfile.HONDURAS
  constructor(
    private ngbActiveModal: NgbActiveModal,
    private pdf: NoteStatementPrintService,
    private translateService: TranslateService,
    private parameterManagementService: ParameterManagementService,
  ) {}

  ngOnInit(): void {
    const userInfo = this.parameterManagementService.getParameter('userInfo');
    this.issueUser = `${userInfo.firstName.toLowerCase()} ${userInfo.firstLastname.toLowerCase()}`;
    this.issueDate = moment().format('DD/MM/YYYY HH:mm:ss');
    this.currentLanguage = this.translateService.currentLang;

  }

  close() {
    this.ngbActiveModal.close();
  }

  download() {
    this.pdf.pdfGenerate(this.information, this.authorization, 'print', 248);
  }
}
