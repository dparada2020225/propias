export interface ICreateAch {
    clientId: string;
    bank: number;
    account: string;
    name: string;
    currency: string;
    email: string;
    type: string;
    alias: string;
    clientType: string;
    useAnyCurrency: boolean;
    bankName?: string;
    favorite?: boolean;
    documentType?: string;
    documentNumber?: string;
}

export class CreateAchBuilder {
    private readonly _createAch: ICreateAch;

    constructor() {
        this._createAch = {
            clientId: '',
            bank: 0,
            account: '',
            name: '',
            currency: '',
            email: '',
            type: '',
            alias: '',
            clientType: '',
            useAnyCurrency: false,
            // documentNumber: ''
            // favorite: false,
            // documentType: '',
        };
    }

    account(account: string): CreateAchBuilder {
        this._createAch.account = account;
        return this;
    }

    bank(bank: number): CreateAchBuilder {
        this._createAch.bank = bank;
        return this;
    }

    name(name: string): CreateAchBuilder {
        this._createAch.name = name;
        return this;
    }

    alias(alias: string): CreateAchBuilder {
        this._createAch.alias = alias;
        return this;
    }

    currency(currency: string): CreateAchBuilder {
        this._createAch.currency = currency;
        return this;
    }

    bankName(bankName: string): CreateAchBuilder {
        this._createAch.bankName = bankName;
        return this;
    }

    type(type: string): CreateAchBuilder {
        this._createAch.type = type;
        return this;
    }

    clientType(clientType: string): CreateAchBuilder {
        this._createAch.clientType = clientType;
        return this;
    }

    email(email: string): CreateAchBuilder {
        this._createAch.email = email;
        return this;
    }

    clientId(clientId: string): CreateAchBuilder {
        this._createAch.clientId = clientId;
        return this;
    }

    favorite(favorite: boolean): CreateAchBuilder {
        this._createAch.favorite = favorite;
        return this;
    }

    useAnyCurrency(useAnyCurrency: boolean): CreateAchBuilder {
        this._createAch.useAnyCurrency = useAnyCurrency;
        return this;
    }

    documentType(documentType: string): CreateAchBuilder {
        this._createAch.documentType = documentType;
        return this;
    }

    documentNumber(documentNumber: string): CreateAchBuilder {
        this._createAch.documentNumber = documentNumber;
        return this;
    }

    build(): ICreateAch {
        return this._createAch;
    }
}
