import { IKeyUidRno } from '../commun/data-par-key/key-uid-rno/i-key-uid-rno';

export class FournisseurModel {
    nom: string;
    adresse: string;
    nomSite: string;
    titre: string;
    ville: string;

    copieData(data: any) {
        this.nom = data.nom;
        this.adresse = data.adresse;
        this.nomSite = data.nomSite;
        this.titre = data.titre;
    }
}
