import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IKfComportementFormulaire, KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { AfficheResultat } from '../affiche-resultat/affiche-resultat';
import { BootstrapType, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { Fabrique, FabriqueClasse } from './fabrique';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';

export interface IFormulaireComponent {
    nom: string;
    /** retourne les composants à afficher avant l'éditeur */
    créeAvantFormulaire?: () => KfComposant[];
    /** retourne le groupe des composants à éditer */
    créeEdition: () => KfGroupe;

    sontEgaux?: (a1: any, a2: any) => boolean;

    créeBoutonsDeFormulaire?: (formulaire: KfGroupe) => (KfBouton | KfLien)[];

    /** créé si pas défini */
    groupeBoutonsMessages?: GroupeBoutonsMessages;

    aprèsBoutons?: () => KfComposant[];

    /** défini après création */
    avantFormulaire?: KfComposant[];
    formulaire?: KfGroupe;
    soumet: () => void;
    /** défini après création */
    afficheResultat?: AfficheResultat;
}

/**
 * Objet gérant un groupe contenant des messages et une ligne de boutons ou liens
 */
export class GroupeBoutonsMessages {
    private pGroupe: KfGroupe;
    private pBoutons: (KfBouton | KfLien)[];
    private pLigneDesBoutons: KfGroupe;
    private pMessages: KfComposant[];

    constructor(nom: string, def: {
        messages?: KfEtiquette[],
        boutons?: (KfBouton | KfLien)[]
    }) {
        this.pGroupe = new KfGroupe(nom);
        this.pGroupe.ajouteClasse('mb-2');
        let grCol: KfGroupe;
        let grRow: KfGroupe;
        if (def.messages) {
            this.pMessages = def.messages;
            grRow = new KfGroupe(nom + '_msg');
            grRow.ajouteClasse('row justify-content-center');
            this.pGroupe.ajoute(grRow);
            grCol = new KfGroupe('');
            grCol.ajouteClasse('col text-center');
            grRow.ajoute(grCol);
            def.messages.forEach(m => {
                grCol.ajoute(m);
            });
        }
        if (def.boutons) {
            this.pBoutons = def.boutons;
            grRow = new KfGroupe(nom + '_btn');
            this.pGroupe.ajoute(grRow);
            grRow.ajouteClasse('row justify-content-center');
            def.boutons.forEach(b => {
                grCol = new KfGroupe('');
                grCol.ajouteClasse('col-sm');
                grCol.ajoute(b);
                grRow.ajoute(grCol);
            });
            this.pLigneDesBoutons = grRow;
        }
    }

    get groupe(): KfGroupe { return this.pGroupe; }
    get boutons(): (KfBouton | KfLien)[] { return this.pBoutons; }
    get messages(): KfComposant[] { return this.pMessages; }

    /**
     * Si pas true, la ligne des boutons n'est pas affichée
     */
    set afficherBoutons(valeur: boolean) {
        if (this.pLigneDesBoutons) {
            this.pLigneDesBoutons.nePasAfficher = valeur !== true;
        }
    }

    alerte(alerte: BootstrapType) {
        KfBootstrap.ajouteClasse(this.groupe, 'alert', alerte);
    }

}

export class FabriqueFormulaire extends FabriqueMembre {
    static nomEdition = 'données';
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    superGroupe(def: IFormulaireComponent): KfSuperGroupe {
        const superGroupe = new KfSuperGroupe(def.nom);

        if (def.créeAvantFormulaire) {
            def.avantFormulaire = def.créeAvantFormulaire();
            def.avantFormulaire.forEach(c => superGroupe.ajoute(c));
        }
        def.formulaire = def.créeEdition();
        KfBootstrap.prépare(def.formulaire.contenus, this.fabrique.optionsBootstrap.formulaire);
        if (def.formulaire.gereValeur) {
        }
        superGroupe.ajoute(def.formulaire);

        if (def.groupeBoutonsMessages) {
            superGroupe.ajoute(def.groupeBoutonsMessages.groupe);
            if (def.groupeBoutonsMessages.boutons) {
                def.afficheResultat = this.ajouteResultat(def.formulaire);
                superGroupe.ajoute(def.afficheResultat.groupe);
            }
        } else {
            if (def.créeBoutonsDeFormulaire) {
                def.groupeBoutonsMessages = new GroupeBoutonsMessages(superGroupe.nom, {
                    boutons: def.créeBoutonsDeFormulaire(def.formulaire)
                });
                superGroupe.ajoute(def.groupeBoutonsMessages.groupe);
                def.afficheResultat = this.ajouteResultat(def.formulaire);
                superGroupe.ajoute(def.afficheResultat.groupe);
            }
        }

        if (def.aprèsBoutons) {
            def.aprèsBoutons().forEach(c => superGroupe.ajoute(c));
        }

        if (def.formulaire.gereValeur) {
//            formulaire.créeGereValeur();
            const comportementFormulaire: IKfComportementFormulaire = {
                sauveQuandChange: true,
                neSoumetPasSiPristine: true,
            };
            if (def.soumet) {
                comportementFormulaire.traiteSubmit = { traitement: def.soumet }
            }
            if (def.sontEgaux) {
                def.formulaire.ajouteValidateur(KfValidateurs.validateurAMarqueDeFormulaire(def.sontEgaux));
            }
            def.formulaire.comportementFormulaire = comportementFormulaire;
            def.formulaire.avecInvalidFeedback = true;
            superGroupe.quandTousAjoutés();
        }
        return superGroupe;
    }

    désactiveEtCacheBoutons(def: IFormulaireComponent) {
        if (def.formulaire) {
            def.formulaire.contenus.forEach(c => c.inactivité = true);
        }
        if (def.groupeBoutonsMessages) {
            def.groupeBoutonsMessages.boutons.forEach(b => b.visible = false);
        }
    }

    formulaire(nom?: string): KfGroupe {
        const groupe = new KfGroupe(nom ? nom : FabriqueFormulaire.nomEdition);
        groupe.créeGereValeur();
        groupe.estRacineV = true;
        return groupe;
    }

    ajouteResultat(formulaire: KfGroupe): AfficheResultat {
        const afficheResultat = new AfficheResultat(formulaire);
        return afficheResultat;
    }

}
