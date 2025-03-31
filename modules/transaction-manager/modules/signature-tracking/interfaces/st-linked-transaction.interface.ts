import { ITMTransaction } from '../../../interfaces/tm-transaction.interface';

export interface StNodeInterface {
  value: ITMTransaction;
  next: StNodeInterface | null;
}
export class StNode {
  value!: ITMTransaction;
  next: StNode | null = null;

  constructor(value: ITMTransaction) {
    this.value = value;
  }
}
