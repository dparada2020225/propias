import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

export enum View {
  NewFunction = 'NewFunction',
  KnowFavorites = 'knowFavorites',
  AddAccount = 'AddAccount',
}

@Component({
  selector: 'byte-onboarding-news',
  templateUrl: './onboarding-news.component.html',
  styleUrls: ['./onboarding-news.component.scss'],
})
export class OnboardingNewsComponent {
  constructor(public activeModal: NgbActiveModal) {
  }

  view: string = View.NewFunction;
  buttonLeftDisabled: boolean = true;
  buttonRightDisabled: boolean = false;

  next(): void {
    switch (this.view) {
      case View.NewFunction:
        this.view = View.KnowFavorites;
        this.buttonLeftDisabled = false;
        break;
      case View.KnowFavorites:
        this.view = View.AddAccount;
        this.buttonRightDisabled = true;
        break;
    }
  }

  back(): void {
    switch (this.view) {
      case View.AddAccount:
        this.view = View.KnowFavorites;
        this.buttonRightDisabled = false;
        break;
      case View.KnowFavorites:
        this.view = View.NewFunction;
        this.buttonLeftDisabled = true;
        break;
    }
  }
}
