import { Identifiant, IdentifiantRole } from './identifiant';
import { Site } from '../modeles/site/site';

export enum TypeAutorisation {
    fournisseur = 'fournisseur',
    client = 'client',
    usager = 'fournisseurOuClient',
    visiteur = 'visiteur',
}

export class Autorisation {
    type: TypeAutorisation;
    constructor(type: TypeAutorisation) {
        this.type = type;
    }

    autorise(identifiant: Identifiant, site: Site): boolean {
        if (!identifiant) {
            return false;
        }
        switch (this.type) {
            case TypeAutorisation.client:
                return identifiant.estClient(site);
            case TypeAutorisation.fournisseur:
                return identifiant.estFournisseur(site);
            case TypeAutorisation.usager:
                return identifiant.estUsager(site);
            case TypeAutorisation.visiteur:
                return !identifiant.estUsager(site);
            default:
                break;
        }
        return true;
    }
}
