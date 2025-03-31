import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'adf-radio-button',
  templateUrl: './adf-radio-button.component.html',
  styleUrls: ['./adf-radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdfRadioButtonComponent),
      multi: true,
    },
  ],
})
export class AdfRadioButtonComponent {
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  @Input() id!: string;
  @Input() label = 'radio button'
  @Input() isChecked = false;
  @Input() name!: string;
  @Input() value = 'radio';
  @Output() onChecked: EventEmitter<any> = new EventEmitter();
  @Input() control: FormControl | undefined;

  onChange: any = () => {};

  onTouch: any = () => {};

  get isCheckedValue() {
    if (!this.control) return false;
    return this.control.value === this.value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(value: boolean) {
    this.isChecked = value;
  }

  onModelChange() {
    const checkValue = this.checkbox.nativeElement?.value;
    this.onChange(checkValue);
    this.onChecked.emit(checkValue);
  }
}
