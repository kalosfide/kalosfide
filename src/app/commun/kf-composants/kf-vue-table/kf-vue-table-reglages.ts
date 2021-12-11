import { DirectionDeTri, Tri } from "../../outils/tri";

export class KfVueTableRéglages {
    filtres: { [key: string]: any };
    pagination: {
        nbParPages: number;
        pageActive: number;
    };
    tri: {
        colonne: string,
        direction: DirectionDeTri
    };
    idLigneActive: any;
}
