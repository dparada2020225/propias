import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { ModalTokenComponent } from '../../../../token/modal-token/modal-token.component';
import { Router } from '@angular/router';
import { UtilService } from '../../../../../../service/common/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ParameterManagementService
} from '../../../../../../service/navegation-parameters/parameter-management.service';
import { ERequestTypeTransaction } from '../../../../../../enums/transaction-header.enum';
import { ETSPLimitsNavParameter } from '../../interfaces/sp-limits.interface';

@Component({
  selector: 'byte-sp-home-dashboard',
  templateUrl: './sp-home-dashboard.component.html',
  styleUrls: ['./sp-home-dashboard.component.scss']
})
export class SpHomeDashboardComponent implements OnInit {
  typeAlert: string = '';
  messageAlert: string = '';

  @Output() hiddenMainScreen: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isAllowedShowLimits: boolean = false;

  constructor(
    private modalService: NgbModal,
    private utils: UtilService,
    private parameterManagementService: ParameterManagementService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const message = this.parameterManagementService.getParameter('errorLimitsMessage');

    if (message) {
      this.showAlert('error', message);
    }
  }

  goToSecurityProfileDefault() {
    this.hiddenAlert();
    this.parameterManagementService.sendParameters({
      errorLimitsMessage: null,
    });
    this.hiddenMainScreen.emit(false);
  }

  handleValidateOpenTokenModal() {
    this.hiddenAlert();
    this.parameterManagementService.sendParameters({
      errorLimitsMessage: null,
    });

    this.openTokenModal();
  }

  openTokenModal() {
    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.utils.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;

    modal.dismissed.subscribe((a) => {
      return;
    });

    modal.result.then(result => {
      if (!result) { return; }

      if (this.isAllowedShowLimits) {
        this.parameterManagementService.sendParameters({
          parameterStateNavigation: ETSPLimitsNavParameter.SECURITY_PARAMETER,
        })
      }


      this.router.navigate(['security-limits']);
    }).catch(error => error);
  }

  showAlert(type: string, message: string) {
    this.typeAlert = type;
    this.messageAlert = message;
  }

  hiddenAlert() {
    this.typeAlert = '';
    this.messageAlert = '';
  }

}
