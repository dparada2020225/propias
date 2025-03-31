import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface IS365FormValues {
  sourceAccount: string;
  targetAccount: string;
  amount: string;
  comment: string;
  isSchedule: boolean;
  reason: string;
}

export  interface IScheduleFormValues {
  date: NgbDate | string;
}

export class S365FormValueBuilder {
  private formValues: IS365FormValues = {
    sourceAccount: '',
    targetAccount: '',
    amount: '',
    isSchedule: false,
    reason: '',
    comment: '',
  }

  sourceAccount(value: string) {
    this.formValues.sourceAccount = value;
    return this;
  }

  targetAccount(value: string) {
    this.formValues.targetAccount = value;
    return this;
  }

  amount(value: string) {
    this.formValues.amount = value;
    return this;
  }

  reason(value: string) {
    this.formValues.reason = value;
    return this;
  }

  comment(value: string) {
    this.formValues.comment = value;
    return this;
  }

  isSchedule(value: boolean) {
    this.formValues.isSchedule = value;
    return this;
  }

  build() {
    return this.formValues;
  }
}

export class S365ScheduleFormValues {
  private formValues: IScheduleFormValues = {
    date: '',
  }

  date(value: NgbDate | string) {
    this.formValues.date = value;
    return this;
  }

  build() {
    return this.formValues;
  }
}
