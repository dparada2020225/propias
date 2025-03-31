import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'byte-tm365-footer',
  templateUrl: './tm365-footer.component.html',
  styleUrls: ['./tm365-footer.component.scss']
})
export class Tm365FooterComponent implements OnInit {
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
