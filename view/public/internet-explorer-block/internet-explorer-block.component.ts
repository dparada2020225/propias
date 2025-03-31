import { StorageService } from '@adf/security';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { EVersionHandler } from '../../../enums/version-handler.enum';
import { browsersList } from './browsers';
import { ISettingData } from '../../../models/setting-interface';


@Component({
  selector: 'byte-internet-explorer-block',
  templateUrl: './internet-explorer-block.component.html',
  styleUrls: ['./internet-explorer-block.component.scss'],
})
export class InternetExplorerBlockComponent implements OnInit {
  browsers = browsersList;
  profile: string | undefined;
  settingsData!: ISettingData;

  helpText: string = '';
  description1: string | undefined;
  description2: string | undefined;
  versionAssets = EVersionHandler.ASSETS;

  constructor(private translate: TranslateService, private storage: StorageService) {}

  ngOnInit(): void {
    this.profile = environment['profile'] || 'byte';

    this.settingsData = JSON.parse(this.storage.getItem('securityParameters'));

    this.translate
      .get('ie-block.help')
      .pipe(first())
      .subscribe((x: string) => (this.helpText = x));

    this.translate
      .get('ie-block.description')
      .pipe(first())
      .subscribe((x: string) => (this.description1 = x));

    this.translate
      .get('ie-block.second-description')
      .pipe(first())
      .subscribe((x: string) => (this.description2 = x));
  }
}
