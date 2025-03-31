export interface IUrlChildrenTree {
  path: string;
  parameter: string | null;
  children: IUrlChildrenTree[];
}

export interface IUrlTree {
  name: string;
  path: string;
  parameter: string | null;
  children: IUrlChildrenTree[];
}
