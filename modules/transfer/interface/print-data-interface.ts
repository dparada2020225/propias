export interface IPrintData {
  label: string;
  title: boolean;
  value: string;
  secondColumn: boolean;
}

export interface IPrintedData {
  data: IPrintData[];
  reference: number | string;
}

export interface IConsultPrintData extends IPrintData {
  delimiter?: string;
  customBottom?: number;
  maxWidth?: number;
}

export interface IPrint<TAccount = any> {
  account: TAccount,
  items: IPrintData[],
  fileName: string,
  title: string,
  reference: string
}

export class PrintDataBuilder {
  private readonly printData: IPrintData

  constructor() {
    this.printData = {
      label: '',
      title: false,
      value: '',
      secondColumn: false
    }
  }

  label(value: string): PrintDataBuilder {
    this.printData.label = value
    return this
  }

  title(isTitle: boolean): PrintDataBuilder {
    this.printData.title = isTitle
    return this
  }

  value(value: string): PrintDataBuilder {
    this.printData.value = value
    return this
  }

  secondColumn(secondColumn: boolean): PrintDataBuilder {
    this.printData.secondColumn = secondColumn
    return this
  }

  build(): IPrintData {
    return this.printData
  }
}

export class PrintBuilder {
  printData: IPrint

  constructor() {
    this.printData = {
      account: undefined,
      items: [],
      reference: 'undefined',
      fileName: 'test',
      title: 'test title'
    }
  }

  account(value: object): PrintBuilder {
    this.printData.account = value
    return this
  }

  items(itemList: IPrintData[]): PrintBuilder {
    this.printData.items = itemList
    return this
  }

  referenceNumber(value: string): PrintBuilder {
    this.printData.reference = value
    return this
  }

  fileName(value: string): PrintBuilder {
    this.printData.fileName = value;
    return this
  }

  title(value: string): PrintBuilder {
    this.printData.title = value
    return this
  }

  build(): IPrint {
    return this.printData
  }
}
