import { Component, Input } from '@angular/core';

@Component({
  selector: 'byte-stkn-bisv-step-horizontal',
  templateUrl: './stkn-bisv-step-horizontal.component.html',
  styleUrls: ['./stkn-bisv-step-horizontal.component.scss']
})
export class StknBisvStepHorizontalComponent  {

  @Input() secondStepOn: boolean = false;


  
}
