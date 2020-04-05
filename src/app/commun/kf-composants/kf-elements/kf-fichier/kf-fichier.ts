import 'rxjs/add/observable/of';
import { KfTypeDeComposant } from '../../kf-composants-types';
import { KfElement } from '../../kf-composant/kf-element';
import { FormControl } from '@angular/forms';
import { KfParametres } from '../../kf-composants-parametres';
import { KfTexteDef } from '../../kf-partages/kf-texte-def';
import { KfContenuPhrase } from '../../kf-partages/kf-contenu-phrase/kf-contenu-phrase';


export function KfNomFichier(nom: string): string {
    return nom + '_file';
}

export const TypeDeFichier = {
    texte: 'texte',
    objet: 'objet',
};

export class KfFichier extends KfElement {

    typeDeFichier: string;

    files: File[];

    multiple: boolean;

    typesMime: string[];
    typesExtension: string[];
    _typesAcceptes: string;

    inputVisible: boolean;

    constructor(nom: string, texte?: KfTexteDef) {
        super(KfNomFichier(nom), KfTypeDeComposant.fichier);
        this.contenuPhrase = new KfContenuPhrase(this, texte);
        this.typesMime = [];
        this.typesExtension = [];
        this.ajouteClasseDef('kf-fichier', 'kf-bouton');
    }

    get idBouton(): string {
        return this.nom + '_b';
    }

    get typesAcceptes(): string {
        if (this._typesAcceptes) {
            return this._typesAcceptes;
        } else {
            return this.typesMime.concat(this.typesExtension).join(', ');
        }
    }
    set typesAcceptes(typesAcceptes: string) {
        this._typesAcceptes = typesAcceptes;
    }

    get formControl(): FormControl {
        return this.abstractControl as FormControl;
    }

    get nomsFichiers(): string {
        return this.files ? this.files.map(f => f.name).join(', ') : 'aucun';
    }

}
