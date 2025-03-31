import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EVersionHandler } from 'src/app/enums/version-handler.enum';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'byte-version-information-modal',
  templateUrl: './version-information-modal.component.html',
  styleUrls: ['./version-information-modal.component.scss']
})
export class VersionInformationModal {

  profile = environment.profile;
  versionAssets = EVersionHandler.ASSETS;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }
}
