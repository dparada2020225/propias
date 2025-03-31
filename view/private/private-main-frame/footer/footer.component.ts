import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import socialNetwork from '../../../../../assets/data/social-network.json';
import { SocialNetwort } from './footer.component.model';

@Component({
  selector: 'byte-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {

  @Input()
  settings;

  isFooterCollapsed = {
    links: true,
    downloads: true,
    support: true,
    about: true
  };

  profile = environment.profile;
  isProd = environment.isAProdBuild;
  links: any = [];
  linkList: SocialNetwort = socialNetwork[this.profile]

  constructor() {
    if (this.isProd) {
      this.links = this.linkList.links
    } else {
      this.links = this.linkList.links_qa
    }
  }
}
