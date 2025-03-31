import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'byte-postpone-modal',
  templateUrl: './postpone-modal.component.html',
  styleUrls: ['./postpone-modal.component.scss']
})
export class PostponeModalComponent implements OnInit {
  loading: boolean = false;
  url!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private eRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.url = this.router.url;
  }

  goSecurityProfile() {
    this.spinner.show('main-spinner');
    this.loading = true;
    this.spinner.hide('main-spinner');
    if (this.url === '/security-option') {
      this.activeModal.close('Close click');
    } else {
      this.activeModal.close('Close click');
      this.router.navigate(['/security-option']);
    }
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (this.url !== '/security-option') {
        this.router.navigate(['/security-option']);
      }
    }
  }
}
