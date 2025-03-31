import { AdfAlertModalComponent } from '@adf/components';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { EProfile } from 'src/app/enums/profile.enum';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import BottomImages from '../../../data/confirmation-bottom-images.json';
import TopImages from '../../../data/confirmation-top-images.json';
import { ESTokenSettingsProperty, ETypeToken } from '../../../enums/stkn-bisv.enum';
import { IImagesData } from '../../../interfaces/stkn-bisv.interface';
import { StknBisvExitModalService } from '../../../services/definition/stkn-bisv-exit-modal.service';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';


@Component({
  selector: 'byte-stkn-bisv-confirmation',
  templateUrl: './stkn-bisv-confirmation.component.html',
  styleUrls: ['./stkn-bisv-confirmation.component.scss']
})
export class StknBisvConfirmationComponent implements OnInit {
  
  topImages: IImagesData[] = TopImages;
  bottomImages: IImagesData[] = BottomImages;
  timeOutkeepAlive;
  timeoutLogout: boolean = false;
  stokenPreLogin: boolean = false;
  typeToken = this.parameterManager.getParameter('typeToken');
  textButton:string=""
  featureFlagStokenNewUser: boolean = true;



  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private parameterManager: ParameterManagementService,
    private exitModalConfirmationService: StknBisvExitModalService,
    private stokenBisvUtils: StknBisvUtilsService,
    private findServiceCode: FindServiceCodeService
  ) {

    let isBisv = environment.profile === EProfile.PANAMA;
    this.featureFlagStokenNewUser = this.findServiceCode.validateCustomFeature(ESTokenSettingsProperty.STOKEN_NEW_USER, isBisv);
  }

  ngOnInit(): void {
    this.hideSpinner();
    this.button()
  }

  button(){
    this.typeToken = this.parameterManager.getParameter('typeToken');
    if (this.typeToken === ETypeToken.TYPE_NEW_USER_STOKEN && this.featureFlagStokenNewUser) {
      this.textButton = "agree";
    } else {
      this.textButton = "agree";
    }
  }

  goTo(){
    this.openExitModal()
  }



  openExitModal() {
    const modalRef = this.modalService.open(AdfAlertModalComponent, {
      backdrop : 'static',
      keyboard : false,
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} alert-modal stoken-exit-modal`,
      size: `lg`,
    });
    modalRef.componentInstance.data = this.exitModalConfirmationService.buildAlertToLogOut();

    modalRef.result.then(() => {
      this.logOut();
    })
    .catch((error) => console.error(error));
  }

  logOut() {
    this.stokenBisvUtils.logOut();
  }

  hideSpinner() {
    this.spinner.hide("main-spinner")
      .catch(() => {});
  }

  showSpinner() {
    this.spinner.show("main-spinner")
    .catch(() => {});

  }

}
