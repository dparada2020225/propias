import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'byte-tm-ach-uni-footer',
  templateUrl: './tm-ach-uni-footer.component.html',
  styleUrls: ['./tm-ach-uni-footer.component.scss']
})
export class TmAchUniFooterComponent implements OnInit {
  @Input() label1 = '';
  @Input() label2 = '';
  @Input() label3 = '';
  @Input() value1 = '';
  @Input() value2 = 0;
  @Input() currency = '';

  constructor() { }

  ngOnInit(): void {
  }

}
