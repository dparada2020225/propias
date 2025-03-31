import { Component, OnInit } from '@angular/core';
import { StyleManagementService } from 'src/app/service/common/style-management.service';
import { environment } from 'src/environments/environment';
import socialNetwork from "../../../../assets/fake-data/social-network.json";
import { ISettingData } from 'src/app/models/setting-interface';
import { StorageService } from '@adf/security';


/**
 * @author Noe Fernandez
 *
 * Provide a way to identify the browser
 */

@Component({
  selector: 'byte-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  help: string | undefined;
  linkList: any;
  linkedin = 'https://www.linkedin.com/company/bindustrialsv/';
  settingsData: ISettingData;


  getVideUrl() {
    return this.settingsData?.urlVideoTutorials || ''
  }

  constructor(
    private styleManagement: StyleManagementService,
    private storage: StorageService
  ) {
    this.help = environment['profile'] || 'byte-theme';
    this.settingsData = JSON.parse(this.storage.getItem('securityParameters'));
   }

  ngOnInit(): void {
    this.linkList = socialNetwork[environment.profile];
  }

  corporateImageApplication(): boolean{
    return  this.styleManagement.corporateImageApplication();
  }

}
