export interface IDonationExecute{
    sourceProduct: string;
    sourceSubProduct: string;
    sourceAccount: string;
    sourceCurrency: string;
    sourceAmount: number;
    targetProduct: string;
    targetSubProduct: string;
    targetAccount: string;
    targetCurrency: string;
    targetAmount: number;
    description  : string;
 }

export interface IDonationExecuteBySignatureTracking {
  sourceAccount: string;
  sourceCurrency: string;
  sourceAmount: number;
  reference: string;
  dateTime: string;
}

 export class DonationExecuteBuilder{
    private readonly  _donationExecution: IDonationExecute;

    constructor(){
        this._donationExecution = {
            sourceProduct: '',
            sourceSubProduct:'',
            sourceAccount:'',
            sourceCurrency:'',
            sourceAmount: 0,
            targetProduct:'',
            targetSubProduct:'',
            targetAccount:'',
            targetCurrency:'',
            targetAmount: 0,
            description:'',
        }
    }

    sourceProduct(value: string): DonationExecuteBuilder{
        this._donationExecution.sourceAccount = value;
        return this;
    }

    sourceSubProduct(value: string): DonationExecuteBuilder{
        this._donationExecution.sourceSubProduct = value;
        return this;
    }

    sourceAccount(value: string): DonationExecuteBuilder{
        this._donationExecution.sourceAccount = value;
        return this;
    }

    sourceCurrency(value: string): DonationExecuteBuilder{
        this._donationExecution.sourceCurrency = value;
        return this;
    }

    sourceAmount(value: number): DonationExecuteBuilder{
        this._donationExecution.sourceAmount = value;
        return this;
    }

    targetProduct(value: string): DonationExecuteBuilder{
        this._donationExecution.targetProduct = value;
        return this;
    }

    targetSubProduct(value: string): DonationExecuteBuilder{
        this._donationExecution.targetSubProduct = value;
        return this;
    }

    targetAccount(value: string): DonationExecuteBuilder{
        this._donationExecution.targetAccount = value;
        return this;
    }

    targetCurrency(value: string): DonationExecuteBuilder{
        this._donationExecution.targetCurrency = value;
        return this;
    }

    targetAmount(value: number): DonationExecuteBuilder{
        this._donationExecution.targetAmount = value;
        return this;
    }

    description(value: string): DonationExecuteBuilder{
        this._donationExecution.description = value;
        return this;
    }

    build(): IDonationExecute {
        return this._donationExecution;
    }
 }

export class DonationExecuteBySignatureTrackingBuilder{
  private readonly  donationExecution: IDonationExecuteBySignatureTracking;

  constructor(){
    this.donationExecution = {
      sourceAccount: '',
      sourceCurrency: '',
      sourceAmount: 0,
      dateTime: '',
      reference: '',
    };
  }

  sourceAccount(value: string): DonationExecuteBySignatureTrackingBuilder{
    this.donationExecution.sourceAccount = value;
    return this;
  }

  sourceCurrency(value: string): DonationExecuteBySignatureTrackingBuilder{
    this.donationExecution.sourceCurrency = value;
    return this;
  }

  sourceAmount(value: number): DonationExecuteBySignatureTrackingBuilder{
    this.donationExecution.sourceAmount = value;
    return this;
  }

  dateTime(value: string): DonationExecuteBySignatureTrackingBuilder{
    this.donationExecution.dateTime = value;
    return this;
  }

  reference(value: string): DonationExecuteBySignatureTrackingBuilder{
    this.donationExecution.reference = value;
    return this;
  }


  build(): IDonationExecuteBySignatureTracking {
    return this.donationExecution;
  }
}
