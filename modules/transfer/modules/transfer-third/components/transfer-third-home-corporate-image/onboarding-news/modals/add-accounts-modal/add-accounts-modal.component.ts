import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilService} from "../../../../../../../../../service/common/util.service";
import {Base64Service} from "../../../../../../../../../service/common/base64.service";

@Component({
  selector: 'byte-add-accounts-modal',
  templateUrl: './add-accounts-modal.component.html',
  styleUrls: ['./add-accounts-modal.component.scss'],
})
export class AddAccountsModalComponent implements OnInit {
  imgMobile: string = 'assets/images/private/transfer-third/onboarding/BIES_AddAccount_MOB.gif';
  imgTablet: string = 'assets/images/private/transfer-third/onboarding/BIES_AddAccount_TBT.gif';
  imgDesktop: string = 'assets/images/private/transfer-third/onboarding/BIES_AddAccount_DSK.gif';

  usuarios: string[] = [];

  constructor(
    private modalService: NgbActiveModal,
    private util: UtilService,
    private base64: Base64Service
  ) {
  }

  ngOnInit() {
    const item = localStorage.getItem('isOpen');
    if (item !== null) {
      this.usuarios = JSON.parse(item);
    }
  }

  closeModal(): void {
    this.addUser(this.util.getUserName());
    this.modalService.close('Close click');
  }

  addUser(name: string): void {
    this.usuarios.push(this.base64.encryption(name));
    localStorage.setItem('isOpen', JSON.stringify(this.usuarios));
  }
}
