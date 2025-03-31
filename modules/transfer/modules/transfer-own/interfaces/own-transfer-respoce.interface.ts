export interface IResponseOwnTransfers {
    rate: number | undefined;
    date: string;
    reference: string;
    description: string | undefined;
    targetAccount: IAccount | null;
    sourceAccount: IAccount | null;
}

interface IAccount {
    currency: string;
    type: string;
    account: string;
    alias: string;
    amount: number;
    balanceGeneralInformation: IBalanceGeneralInformation;
}

interface IBalanceGeneralInformation {
    countableBalance: string;
    authorizedOverdraft: string;
    locks: string;
    reservation: string;
    availableBalance: string;
}
