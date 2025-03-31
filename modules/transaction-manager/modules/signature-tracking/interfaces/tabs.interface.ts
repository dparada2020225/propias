export interface ITab {
  label: string
  className: string
  id: string
  icon: string
}


export class TabBuilder {
  private readonly _tab: ITab

  constructor() {
    this._tab = {
      label: '',
      className: '',
      id: '',
      icon: ''
    }
  }

  label(value: string): TabBuilder {
    this._tab.label = value
    return this
  }
  icon(value: string): TabBuilder {
    this._tab.icon = value
    return this
  }

  className(value: string): TabBuilder {
    this._tab.className = value
    return this
  }

  id(value: string): TabBuilder {
    this._tab.id = value
    return this
  }

  build(): ITab {
    return this._tab
  }

}
