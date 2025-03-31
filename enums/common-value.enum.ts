export const MIN_MAX_RANGE = {
  MAX: 99999999999.99,
  MIN: 0,
} as const;

export const HOUR_WIDGET_SPLIT_VALUES = {
  LENGTH_HOUR: 5,
  MIN_LENGTH_HOUR: 1,
  MAX_LENGTH_HOUR: 2,
} as const;

export enum CLIENT_TYPE  {
  NATURAL = 'N',
  LEGAL = 'J'
}


export const PROTECTED_PARAMETER_STATE = 'navigateStateParameters';
export const PROTECTED_PARAMETER_ROUTE = 'navigationProtectedParameter'
