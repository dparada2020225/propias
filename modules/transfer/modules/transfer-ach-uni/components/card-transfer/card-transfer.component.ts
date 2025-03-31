import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'byte-card-transfer',
  templateUrl: './card-transfer.component.html',
  styleUrls: ['./card-transfer.component.scss']
})
export class CardTransferComponent {

  @Input()
  imageName!: string;
  @Input()
  title!: string;
  @Input()
  description!: string;
  @Input()
  descriptionEnd!: string;
  @Input()
  typeTransferACH!: string;
  @Output() transferClick: EventEmitter<string> = new EventEmitter<string>();

  onCardClick(): void {
    this.transferClick.emit(this.typeTransferACH);
  }
}
