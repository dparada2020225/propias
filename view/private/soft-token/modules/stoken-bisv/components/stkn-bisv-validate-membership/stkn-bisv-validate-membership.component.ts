import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { UtilService } from 'src/app/service/common/util.service';
import { StknBisvDevelService } from '../../services/transaction/DEVEL/stkn-bisv-devel.service';
import { StknBisvUtilsService } from '../../services/utils/stkn-bisv-utils.service';

@Component({
  selector: 'byte-stkn-bisv-validate-membership',
  templateUrl: './stkn-bisv-validate-membership.component.html',
  styleUrls: ['./stkn-bisv-validate-membership.component.scss']
})
export class StknBisvValidateMembershipComponent {
  
  typeAlert!: string;
  messageAlert!: string;
  private tester = false;

  constructor(
    private activeModal: NgbActiveModal,
    private utils: UtilService,
    private utilsSTokenBISV: StknBisvUtilsService,
    private stokenBisvDevelServices: StknBisvDevelService,

  ) { }

  handlerRecoverStepMembership() {
    this.utils.showPulseLoader();

    const user = this.utilsSTokenBISV.getUserName();

    this.stokenBisvDevelServices.validateStatusQR(user)
      .pipe(
        finalize(() => this.utils.hidePulseLoader()),
      )
      .subscribe({
        next: res => { },
        error: (error: HttpErrorResponse) => this.handlerErrorfromValidateIfQrWasScanned(error)
      })

  }

  handlerErrorfromValidateIfQrWasScanned(error: HttpErrorResponse): void {

    this.tester = true;

  }

  close() {
    this.activeModal.close()
    this.handlerRecoverStepMembership();
  }

  next() {
    this.activeModal.close()

    this.handlerRecoverStepMembership()
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

}
