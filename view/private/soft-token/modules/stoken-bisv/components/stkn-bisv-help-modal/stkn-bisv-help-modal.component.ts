import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import dataImages from '../../data/cellphone-images.json';
import { IImagesData } from '../../interfaces/stkn-bisv.interface';

@Component({
  selector: 'byte-stkn-bisv-help-modal',
  templateUrl: './stkn-bisv-help-modal.component.html',
  styleUrls: ['./stkn-bisv-help-modal.component.scss']
})
export class StknBisvHelpModalComponent implements OnInit {

  description1: string = '';
  modalImages!: IImagesData[];
  showDiv: boolean = true;

  constructor(
    private activeModal: NgbActiveModal
  ) { }


  ngOnInit(): void {
    this.modalImages = dataImages;

    if (this.modalImages.length > 0) {
      this.showDiv = false;
    }
  }

 
  close() {
    this.activeModal.close();
  }

  

}
