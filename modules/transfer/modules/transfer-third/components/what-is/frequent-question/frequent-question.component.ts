import {Router} from '@angular/router';
import {Component, EventEmitter, Input, Output} from '@angular/core';

interface BuildAccordion {
  title: string;
  content: string[] | string;
  numbered?: boolean;
}

@Component({
  selector: 'byte-frequent-question',
  templateUrl: './frequent-question.component.html',
  styleUrls: ['./frequent-question.component.scss'],
})
export class FrequentQuestionComponent {

  @Output() requestNavigation = new EventEmitter<void>();
  @Input() showButton!: boolean;


  mobileImage: string = 'assets/images/private/transfer-third/what-is/BIES_QUESTION_MOB.png'
  tabletImage: string = 'assets/images/private/transfer-third/what-is/BIES_QUESTION_TBT.png'
  desImage: string = 'assets/images/private/transfer-third/what-is/BIES_QUESTION_DSK.png'

  constructor(private router: Router) {
  }

  panels = [
    {
      title: 'how-add-ttr',
      content: ['access-ttr', 'select-ttr', 'add-ttr', 'get-into-token-ttr', 'account-added-sf-ttr'],
      numbered: true,
    },
    {
      title: 'what-account-ttr',
      content: 'account-add-ttr',
    },
    {
      title: 'what-is-limit-ttr',
      content: 'limit-ttr',
    },
    {
      title: 'where-to-do-ttr',
      content: ['to-do-ttr-1', 'to-do-ttr-2'],
    },
  ];

  navigateToTransferThird(): void {
    this.requestNavigation.emit();
  }
}
