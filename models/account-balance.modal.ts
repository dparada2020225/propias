export class AccountBalance {
    accountDetailList!: Array<AccountDetail>;
    balanceList!: Array<Balance>;
}

export class AccountDetail {
    key!: string;
    value!: string;
}

export class Balance {
    key!: string;
    value!: string;
}

export class Limits {
    key!: string;
    value!: string;
}

export class Reservation {
    detail!: string;
    value!: number;
}

export class LockDetails {
    detail!: string;
    value!: number;
}
