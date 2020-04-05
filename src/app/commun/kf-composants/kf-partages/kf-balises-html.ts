export enum KfTypeBaliseConteneur {
    small = 'small',
    span = 'span',
    div = 'div',
    P = 'P',
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6',
}

export class KfBaliseConteneur {
    type: KfTypeBaliseConteneur;
    nom: string;
    DOMevents: {
        name: string, // exemple: onclick, onfocus
        action: string,
    };
}
