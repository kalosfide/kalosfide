export class FiltreDeListe {
    nom: string;
    valeur: string;
    comparaison: string;
}
export class TriDeListe {
    desc: boolean;
    nom: string;
}
export class OptionsDeListe {
    filtres: FiltreDeListe[];
    tris: TriDeListe[];
}
