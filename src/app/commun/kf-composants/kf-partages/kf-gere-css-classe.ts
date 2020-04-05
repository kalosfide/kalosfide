export class KfNgClasseDef {
    nom: string;
    active?: () => boolean;
}

export interface KfNgClasse { [noms: string]: boolean | (() => boolean); }

export class KfNgClasseDefDe<T> {
    nom: string;
    active?: (t: T) => boolean;
}
