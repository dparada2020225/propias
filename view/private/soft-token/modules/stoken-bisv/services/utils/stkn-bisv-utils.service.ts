import { AuthenticationService, StorageService } from '@adf/security';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { TypeTokenEnum } from 'src/app/enums/token.enum';
import { ParameterManagementService } from 'src/app/service/navegation-parameters/parameter-management.service';
import { StknBisvValidateMembershipComponent } from '../../components/stkn-bisv-validate-membership/stkn-bisv-validate-membership.component';
import { Router } from '@angular/router';
import { EStokenBISVRequiredToken, EStokenRoutesChangeDevice, EStokenRoutesMigration, EStokenRoutesNewUser, EStokenScreenNames } from '../../enums/stkn-bisv.enum';
import { UtilService } from 'src/app/service/common/util.service';

@Injectable({
  providedIn: 'root'
})
export class StknBisvUtilsService {

  private PREFIX_BASE64: string = 'data:image/png;base64,';
  timeOutkeepAlive;
  timeoutLogout: boolean = false;

  constructor(
    private parameterManager: ParameterManagementService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private storage: StorageService,
    private utils: UtilService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  getTypeToken(): string{
    return this.parameterManager?.getParameter('typeToken') ?? 'token_not_found';
  }

  getUserName(): string{
    return this.storage.getItem('currentUser')
  }
  getTokenControl(): string{
    return this.parameterManager?.getParameter('tokenControl') ?? false;
  }

  allowUseStokenBISV(): boolean{
    const typeToken = this.getTypeToken();
    const tokenControl = this.getTokenControl();
    return typeToken !== TypeTokenEnum.SOFT_TOKEN_DEVEL &&  typeToken !== TypeTokenEnum.SMS && (typeToken !== TypeTokenEnum.NEW_USER && tokenControl !== EStokenBISVRequiredToken.NOT_REQUIRED_TOKEN)

  }

  getClientType(): string{
    return this.parameterManager?.getParameter('clientType') ?? 'error_getting_clientType'
  }

  generateSRCfromBase64(base64: string): string | null{
    return base64 ? this.PREFIX_BASE64 + base64 : null;
  }

  logOut() {
    clearTimeout(this.timeOutkeepAlive);
    delete this.timeOutkeepAlive;
    this.spinner.show('main-spinner-logout')
      .catch(() => { });
    const authService = this.authenticationService.logout('login');
    lastValueFrom(authService).finally(() => {
      setTimeout(() => {
        this.spinner.hide('main-spinner-logout')
          .catch(() => { });
      }, 5000);
    });
    this.timeoutLogout = true;
  }


  openValidationMembershipModal(){
    this.modalService.open(StknBisvValidateMembershipComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: `${this.utils.getProfile() || 'byte-theme'} stoken-bisv-membership-modal alert-modal`,
      size: `lg`,
    });
  }

  validateIfUserIsInGracePeriod(){
   const userIsInGracePeriodStokenBisv = this.parameterManager.getParameter('userIsInGracePeriodStokenBisv');
   return userIsInGracePeriodStokenBisv?.hasGracePeriod ?? true
  }

  stokenRoutes(preLogin: boolean, flow: string, nameScreen: string){

    if(preLogin){
      const route = this.newUserRoutes(nameScreen);
      if(!route) return;
      this.router.navigate([route]).catch((error)=> console.log(error));
      return;
    };

    if(!preLogin && flow === 'migration'){
      const route = this.migrationRoutes(nameScreen);
      if(!route) return;
      this.router.navigate([route]).catch(()=> {});
      return;
    }

    if(!preLogin && flow === 'change-device'){
      const route = this.changeDeviceRoutes(nameScreen);
      if(!route) return;
      this.router.navigate([route]).catch(()=> {});
    }

  }

  private migrationRoutes(nameScreen: string): string | undefined{

    const routes = {
      [EStokenScreenNames.INFORMATION]: EStokenRoutesMigration.INFORMATION_SCREEN,
      [EStokenScreenNames.QR]: EStokenRoutesMigration.QR_SCREEN,
      [EStokenScreenNames.TOKEN_APPROVE]: EStokenRoutesMigration.TOKEN_APPROVE_SCREEN,
      [EStokenScreenNames.CONFIRMATION]: EStokenRoutesMigration.CONFIRMATION_SCREEN
    };

    return routes[nameScreen];

  };

  private changeDeviceRoutes(nameScreen: string): string | undefined{

    const routes = {
      [EStokenScreenNames.INFORMATION]: EStokenRoutesChangeDevice.INFORMATION_SCREEN,
      [EStokenScreenNames.QR]: EStokenRoutesChangeDevice.QR_SCREEN,
      [EStokenScreenNames.TOKEN_APPROVE]: EStokenRoutesChangeDevice.TOKEN_APPROVE_SCREEN,
      [EStokenScreenNames.CONFIRMATION]: EStokenRoutesChangeDevice.CONFIRMATION_SCREEN
    };

    return routes[nameScreen];

  }

  private newUserRoutes(nameScreen: string): string | undefined{

    const routes = {
      [EStokenScreenNames.WELCOME]: EStokenRoutesNewUser.WELCOME_SCREEN,
      [EStokenScreenNames.INFORMATION]: EStokenRoutesNewUser.INFORMATION_SCREEN,
      [EStokenScreenNames.QR]: EStokenRoutesNewUser.QR_SCREEN,
      [EStokenScreenNames.TOKEN_APPROVE]: EStokenRoutesNewUser.TOKEN_APPROVE_SCREEN,
      [EStokenScreenNames.CONFIRMATION]: EStokenRoutesNewUser.CONFIRMATION_SCREEN
    };

    return routes[nameScreen];

  }
}
