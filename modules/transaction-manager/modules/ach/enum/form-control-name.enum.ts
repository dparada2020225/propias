import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export enum ETMACHFormControl {
  SERVICE = 'service',
  TYPE_SERVICE = 'typeService',
  TYPE_TRANSACTION = 'typeTransaction',
  INITIAL_DATE = 'initialDate',
  FINAL_DATE = 'finalDate',
}

export interface ITMConsultACHFormValues {
  service: string;
  typeService: string;
  typeTransaction: string;
  initialDate: NgbDate;
  finalDate: NgbDate;
}

export enum ETMACHService {
  ATOMIC = 'I',
  MULTIPLE_365 = 'M365',
  MULTIPLE_UNI = 'MUNI',
}

export enum ETMACHTypeService {
  SENT = 'SEND',
  RECEIVE = 'RECEIVE'
}

export enum ETMACHTypeTransaction {
  UNI = 'UNI',
  NORMAL_365 = 'SPM',
  MOVIL_365 = 'TRM',
  SIPA = 'LBTR',
  TRANSFER_SIPA = 'SIP'
}
