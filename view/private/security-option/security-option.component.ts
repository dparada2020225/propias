import { AuthenticationService, StorageService } from '@adf/security';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordPeriod, PhoneCompanies, Profile } from 'src/app/models/security-option-modal';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { CheckProfileService } from 'src/app/service/general/check-profile.service';
import { PrivateMainFrameService } from 'src/app/service/private-main/private-main-frame.service';
import { SecurityOptionService } from 'src/app/service/private/security-option/security-option.service';
import { environment } from 'src/environments/environment';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { EProfile } from '../../../enums/profile.enum';
import { ISettingData } from '../../../models/setting-interface';
import { ParameterManagementService } from '../../../service/navegation-parameters/parameter-management.service';
import { IUserInfo } from '../../../models/user-info.interface';
import { FeatureManagerService } from 'src/app/service/common/feature-manager.service';
import { ModalTokenComponent } from '../token/modal-token/modal-token.component';
import { UtilService } from 'src/app/service/common/util.service';
import { ERequestTypeTransaction } from 'src/app/enums/transaction-header.enum';

@Component({
  selector: 'byte-security-option',
  templateUrl: './security-option.component.html',
  styleUrls: ['./security-option.component.scss']
})
export class SecurityOptionComponent implements OnInit {

  passwordPeriod!: Array<PasswordPeriod>;
  phoneCompanies!: Array<PhoneCompanies>;
  profile!: Profile;
  configurationType!: number;
  tab!: string;
  profileResponse;
  showUpdateData: boolean = false;

  isShowMainScreen: boolean = false;

  get validateIsShowMainScreen() {
    const isSvProfile: boolean = environment.profile === EProfile.SALVADOR;
    const userInfo: IUserInfo = this.parameterManager.getParameter('userInfo');
    const settings: ISettingData = JSON.parse(this.storageService.getItem('securityParameters'));
    const isFullUsers = (settings?.fullUsersByProfile ?? []).includes(userInfo.profile);
    const isTokenRequired = this.parameterManager.getParameter('isTokenRequired');


    return isSvProfile && isFullUsers && isTokenRequired;
  }

  constructor(
    protected route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private securityOptionService: SecurityOptionService,
    private privateMainframService: PrivateMainFrameService,
    private authenticationService: AuthenticationService,
    private checkProfileService: CheckProfileService,
    private styleManagement: StyleManagementService,
    private parameterManager: ParameterManagementService,
    private storageService: StorageService,
    private featureManagerService: FeatureManagerService,
    private util: UtilService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const infoUserProfile = JSON.parse(this.storageService.getItem('userInformation'));
    const clientType = this.parameterManager.getParameter('clientType');
    console.log(clientType);

    if ( clientType === "N" && this.featureManagerService.updateDataAllow() && infoUserProfile.profile === "BIF") {
      this.showUpdateData = true;
    }

    this.selectConfigurationType();
    this.asignacionSecurityOption();

    if (this.route.snapshot.data) {
      if (this.route.snapshot.data['securityOption']) {
        if(environment.profile === EProfile.SALVADOR){
          this.profile = this.route.snapshot.data['securityOption'][2];
        } else {
          this.profile = this.route.snapshot.data['securityOption'].body;
        }
        
      }

      if (this.route.snapshot.data['phoneCompanies']) {
        this.phoneCompanies = this.route.snapshot.data['phoneCompanies'];
      }

      if (this.route.snapshot.data['passwordPeriod']) {
        this.passwordPeriod = this.route.snapshot.data['passwordPeriod'];
      }
    }

    if (!this.profile) {
      this.profile = this.securityOptionService.getProfile;
    }
  }

  openModal() {
    const theme = environment['profile'] || 'byte-theme';
    this.modalService.open(VideoModalComponent, { centered: true, windowClass: theme, size: 'lg' });
  }

  selectConfigurationType() {

    if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data['type']) {
      const type : number = this.activatedRoute.snapshot.data['type'];

      switch (type) {
        case 1:
          // esta opcion mostrara el periodo contraseña y la informacion personal (sin mostrar menu ni encabezado).

          this.configurationType = 1;
          this.tab = 'passwordPeriod';
          this.privateMainframService.send(false);
          break;
        case 2:
          // esta opcion mostrara el cambio de contrseña (sin mostrar menu ni encabezado).

          this.configurationType = 2;
          this.tab = 'changePassword';
          this.privateMainframService.send(false);
          break;
        case 3:
          // esta opcion mostrara todas las opciones con el menu corespondiente del usuario.

          this.configurationType = 3;
          this.tab = 'changePassword';
          this.isShowMainScreen = this.validateIsShowMainScreen;
          break;
        default:

          this.privateMainframService.send(false);
          console.error('El tipo de comportamiento configurado en el routing del componente "SecurityOptionComponent" no es soportado altualmente');
          console.error('por defecto no se mostraran las opciones');
          break;
      }
    } else {

      this.privateMainframService.send(false);
      console.error('No se a configurado el tipo de comportamiento del componete "SecurityOptionComponent" en el rounting');
      console.error('por defecto no se mostraran las opciones');
    }
  }

  asignacionSecurityOption(){
    this.privateMainframService.loadSecOption$.subscribe({next: data =>{
      if(environment.profile === EProfile.SALVADOR && this.configurationType === 3){
        this.isShowMainScreen = true;
      }
    } })
  }
  changeTab(tab: string) {
    this.tab = tab;
  }

  corporateImageApplication(): boolean{
    return  this.styleManagement.corporateImageApplication();
  }

  getValueFromHomeMainScreen(value: boolean) {
    this.isShowMainScreen = value;
  }
  onDataUpdate(newData: { [key: string]: string }) {
    Object.keys(newData).forEach(key => {
      this.profile[key] = newData[key];
    })
  }

  goUpdateData() {

    const modal = this.modalService.open(ModalTokenComponent, {
      centered: true,
      windowClass: `${environment.profile || 'byte-theme'} sm-600`,
      size: 'lg',
    });

    modal.componentInstance.tokenType = this.util.getTokenType();
    modal.componentInstance.typeTransaction = ERequestTypeTransaction.AUTHENTICATION;

    modal.dismissed.subscribe((a) => {
      return;
    });

    modal.result.then(result => {
      if (!result) {
        modal.close()
        return
      }

      this.router.navigate(['/update-data']);
    }).catch(error => error);
  }


}
