import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byte-modal-msecurity',
  templateUrl: './modal-msecurity.component.html',
  styleUrls: ['./modal-msecurity.component.scss']
})
export class ModalMsecurityComponent implements OnInit {

  placeHolder: string = '';


  constructor(
    private activeModal: NgbActiveModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  this.placeHolder = this.translate.instant('stoken-method-secu');

  }

  close() {
    this.activeModal.close();
  }

}
