import { PageDef } from '../page-def';

export interface IDataPage {
    nom: string;
    pageDef: PageDef;
    action: string;
}
export interface IDataPages {
    index?: PageDef;
    ajoute?: PageDef;
    edite?: PageDef;
    supprime?: PageDef;
    details?: PageDef;
}

export enum IdDataPages {
    index = 'index',
    ajoute = 'ajoute',
    edite = 'edite',
    supprime = 'supprime',
    details = 'details',
}

export function DataTexteSoumettre(action: string): string {
    switch (action) {
        case IdDataPages.ajoute:
            return 'Créer';
        case IdDataPages.edite:
            return 'Mettre à jour';
        case IdDataPages.supprime:
            return 'Supprimer';
        default:
            break;
    }
}

