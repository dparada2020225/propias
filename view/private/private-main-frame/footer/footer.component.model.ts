export class SocialNetwort {
    links!: Array<Element>;
    links_qa!: Array<Element>;
    downloads!: Array<Element>;
    about!: Array<Element>;
    socialNetworks!: Array<ElementIcon>;
}

export class Element {
    label!: string;
    link!: string;
}

export class ElementIcon {
    name!: string;
    icon!: string;
    link!: string;
}