import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import featuresFixesJson from '../../../../assets/data/features-fixes.json';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'byte-list-features-fixes-modal',
  templateUrl: './list-features-fixes-modal.component.html',
  styleUrls: ['./list-features-fixes-modal.component.scss']
})
export class ListFeaturesFixesModalComponent {
  profile: string = environment.profile; 
  fixAndFeatureList: {features: string, fixes:any}[] = featuresFixesJson[this.profile];
  version: string = ''+environment.appVersion;

  constructor(public activeModal: NgbActiveModal) { }
}
