export interface IMenuOption {
    service: string,
    name: string,
    show: boolean,
    child?:  IMenuOption[]
}