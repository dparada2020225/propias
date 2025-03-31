export interface IUpdateAch {
    clientType: string;
    name: string;
    currency: string;
    email: string;
    type: string;
    clientId: string;
    alias: string;
    useAnyCurrency: boolean;
    bankName?: string;
    favorite?: boolean;
    documentType?: string;
    documentNumber?: string;
    accountStatus: string;
}

export class UpdateAchBuilder {
    private readonly _associateAch: IUpdateAch;

    constructor() {
        this._associateAch = {
            name: '',
            alias: '',
            currency: '',
            type: '',
            clientType: '',
            email: '',
            clientId: '',
            // documentNumber: '',
            accountStatus: '',
            useAnyCurrency: false,
        };
    }

    name(name: string): UpdateAchBuilder {
        this._associateAch.name = name;
        return this;
    }

    alias(alias: string): UpdateAchBuilder {
        this._associateAch.alias = alias;
        return this;
    }

    currency(currency: string): UpdateAchBuilder {
        this._associateAch.currency = currency;
        return this;
    }

    bankName(bankName: string): UpdateAchBuilder {
        this._associateAch.bankName = bankName;
        return this;
    }

    type(type: string): UpdateAchBuilder {
        this._associateAch.type = type;
        return this;
    }

    clientType(clientType: string): UpdateAchBuilder {
        this._associateAch.clientType = clientType;
        return this;
    }

    email(email: string): UpdateAchBuilder {
        this._associateAch.email = email;
        return this;
    }

    clientId(clientId: string): UpdateAchBuilder {
        this._associateAch.clientId = clientId;
        return this;
    }

    favorite(favorite: boolean): UpdateAchBuilder {
        this._associateAch.favorite = favorite;
        return this;
    }

    useAnyCurrency(useAnyCurrency: boolean): UpdateAchBuilder {
        this._associateAch.useAnyCurrency = useAnyCurrency;
        return this;
    }

    documentType(documentType: string): UpdateAchBuilder {
        this._associateAch.documentType = documentType;
        return this;
    }

    accountStatus(value: string) {
      this._associateAch.accountStatus = value;
      return this;
    }

    documentNumber(documentNumber: string): UpdateAchBuilder {
        this._associateAch.documentNumber = documentNumber;
        return this;
    }

    build(): IUpdateAch {
        return this._associateAch;
    }
}
