import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StyleManagementService } from 'src/app/service/common/style-management.service';

/**
 * @author Noe Fernandez
 *
 * Token-Modal Modal
 */

@Component({
  selector: 'byte-token-modal',
  templateUrl: './token-modal.component.html',
  styleUrls: ['./token-modal.component.scss'],
})
export class TokenModalComponent {
  constructor(public activeModal: NgbActiveModal, private styleManagement: StyleManagementService) {}

  corporateImageApplication(): boolean {
    return this.styleManagement.corporateImageApplication();
  }
}
