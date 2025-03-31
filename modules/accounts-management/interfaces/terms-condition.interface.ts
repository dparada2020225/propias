export interface IT365TermAndConditionResponse {
  result:           'S' | 'N';
  errorCode:        string;
  errorDescription: string;
}

export enum ET365TermCondition {
  YES = 'S',
  NOT = 'N',
}
