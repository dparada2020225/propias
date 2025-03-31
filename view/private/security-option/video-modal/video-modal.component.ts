import { Component, ElementRef, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'byte-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModalComponent implements OnInit {

  profile = environment.profile;
  videoUrl = '';

  constructor(public activeModal: NgbActiveModal, private hostElement: ElementRef) {}

  ngOnInit(): void {
    this.videoUrl = `assets/videos/help/security_help_${environment['profile']}.mp4`;

    const iframe = this.hostElement.nativeElement.querySelector('iframe');
    iframe.src = this.videoUrl;
  }
}
