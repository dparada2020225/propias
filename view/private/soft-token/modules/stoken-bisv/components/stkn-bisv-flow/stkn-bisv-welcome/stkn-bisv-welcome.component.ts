import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EProfile } from 'src/app/enums/profile.enum';
import { FindServiceCodeService } from 'src/app/service/common/find-service-code.service';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { environment } from 'src/environments/environment';
import { EStokenNavigationProtection, EStokenScreenNames, ESTokenSettingsProperty } from '../../../enums/stkn-bisv.enum';
import { StknBisvUtilsService } from '../../../services/utils/stkn-bisv-utils.service';

@Component({
  selector: 'byte-stkn-bisv-welcome',
  templateUrl: './stkn-bisv-welcome.component.html',
  styleUrls: ['./stkn-bisv-welcome.component.scss']
})
export class StknBisvWelcomeComponent implements OnInit {

  featureFlagStokenNewUser: boolean = true;
  logoBISV: string = 'assets/images/private/stkn-bisv/logo-banco-sv.png';
  iconTopMobile: string = 'assets/images/private/stkn-bisv/banco-bienvenida-top.png';
  iconTopTablet: string = 'assets/images/private/stkn-bisv/banco-bienvenida-top.png';
  iconBottomMobile: string = 'assets/images/private/stkn-bisv/banco-bienvenida-button.png';
  iconBottomTablet: string = 'assets/images/private/stkn-bisv/banco-bienvenida-button.png';

  constructor(
    private spinner: NgxSpinnerService,
    private parameterManager: ParameterManagementService,
    private findServiceCode: FindServiceCodeService,
    private stokenBisvUtils: StknBisvUtilsService,
  ) {
    let isBisv = environment.profile === EProfile.SALVADOR;
    this.featureFlagStokenNewUser = this.findServiceCode.validateCustomFeature(ESTokenSettingsProperty.STOKEN_NEW_USER, isBisv);
  }

  ngOnInit(): void {
    this.spinner.hide("main-spinner").catch(() => {});
  }
  
  next(){
    this.parameterManager.sendParameters({
      navigationProtectedParameter: EStokenNavigationProtection.INFORMATION,
    });

    this.stokenBisvUtils.stokenRoutes(true, 'expose', EStokenScreenNames.INFORMATION);
  }

}
