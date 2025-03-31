import { StorageService } from '@adf/security';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISettingData } from 'src/app/models/setting-interface';
import { SecurityPolitics } from 'src/app/models/text-modal.component.interface';
import { environment } from 'src/environments/environment';
import securityPolitics from '../../../../../assets/data/security-politics.json';

@Component({
  selector: 'byte-text-modal',
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.scss']
})
export class TextModalComponent implements OnInit {

  profile = environment.profile;
  labelList: SecurityPolitics = securityPolitics[this.profile];
  settingData!: ISettingData;

  constructor(
    public activeModal: NgbActiveModal,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.settingData = JSON.parse(this.storage.getItem('securityParameters'));
  }
}
