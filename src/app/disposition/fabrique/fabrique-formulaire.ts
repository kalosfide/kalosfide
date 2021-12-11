import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { AfficheResultat } from '../affiche-resultat/affiche-resultat';
import { BootstrapType, IKfBootstrapOptions, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfValidateurs } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfDivTableColonne, KfDivTableLigne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';

/**
 * Interface implémenté par les components qui affichent un superGroupe dans une page (FormulaireComponent) 
 */
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

    /**
     * Si undefined, préparation Bootstrap avec les options par défaut.
     * Si null, pas de préparation Bootsrap.
     */
    optionsBootstrap?: IKfBootstrapOptions;

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
    private pLigneDesBoutons: KfDivTableLigne;
    private pMessages: KfComposant[];

    constructor(nom: string, def: {
        messages?: KfEtiquette[],
        boutons?: (KfBouton | KfLien)[]
    }) {
        this.pGroupe = new KfGroupe(nom);
        this.pGroupe.ajouteClasse(KfBootstrap.classeSpacing('margin', 'hautEtBas', 3));
        this.pGroupe.créeDivTable();
        let ligne: KfDivTableLigne;
        let col: KfDivTableColonne;

        if (def.messages) {
            this.pMessages = def.messages;
            ligne = this.pGroupe.divTable.ajoute();
            ligne.géreCss.ajouteClasse('row justify-content-center');
            col = ligne.ajoute(def.messages);
            col.ajouteClasse('col text-center');
        }
        if (def.boutons) {
            this.pBoutons = def.boutons;
            ligne = this.pGroupe.divTable.ajoute();
            ligne.géreCss.ajouteClasse('row justify-content-center');
            def.boutons.forEach(b => {
                col = ligne.ajoute([b]);
                col.ajouteClasse('col text-center');
            });
            this.pLigneDesBoutons = ligne;
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
            this.pLigneDesBoutons.géreCss.nePasAfficher = valeur !== true;
        }
    }

    alerte(alerte: BootstrapType) {
        KfBootstrap.ajouteClasseAlerte(this.groupe, alerte);
    }

}

export class FabriqueFormulaire extends FabriqueMembre {
    static nomEdition = 'données';
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    static optionsLabel: {
        flottant: IKfBootstrapOptions,
        colonne: (largeur: number) => IKfBootstrapOptions,
        ligne: IKfBootstrapOptions
    } = {
        flottant: {
            classeDiv: 'mb-3',
            label: 'labelFlottant'
        },
        colonne:  (largeur: number) => ({
            classeDiv: 'mb-3',
            label: { breakpoint: 'sm', width: largeur }
        }),
        ligne: {
            classeDiv: 'mb-3',
            label: { breakpoint: 'sm', width: 2 }
        }
    }
    
    prépareLabelFlottant(composants: KfComposant | KfComposant[]) {
        const optionsBootstrap: IKfBootstrapOptions = {
            classeDiv: 'mb-3',
            label: 'labelFlottant'
        };
        KfBootstrap.prépare(composants, optionsBootstrap);
    }

    prépareLabelColonne(composants: KfComposant | KfComposant[], largeur: number) {
        const optionsBootstrap: IKfBootstrapOptions = {
            classeDiv: 'mb-3',
            label: { breakpoint: 'sm', width: largeur }
        };
        KfBootstrap.prépare(composants, optionsBootstrap);
    }

    prépareLabelASaLigne(composants: KfComposant | KfComposant[]) {
        const optionsBootstrap: IKfBootstrapOptions = {
            classeDiv: 'mb-3',
            label: { breakpoint: 'sm', width: 2 }
        };
        KfBootstrap.prépare(composants, optionsBootstrap);
    }

    préparePourPage(composants: KfComposant | KfComposant[]) {
       this.prépareLabelColonne(composants, 2);
    }

    préparePourVueTable(composants: KfComposant | KfComposant[]) {
        const optionsBootstrap: IKfBootstrapOptions = { label: 'nePasAfficherLabel' };
        KfBootstrap.prépare(composants, optionsBootstrap);
    }

    superGroupe(def: IFormulaireComponent): KfSuperGroupe {
        const superGroupe = new KfSuperGroupe(def.nom);

        if (def.créeAvantFormulaire) {
            def.avantFormulaire = def.créeAvantFormulaire();
            def.avantFormulaire.forEach(c => superGroupe.ajoute(c));
        }
        def.formulaire = def.créeEdition();
        if (def.optionsBootstrap === undefined) {
            this.préparePourPage(def.formulaire.contenus);
        } else {
            if (def.optionsBootstrap !== null) {
                KfBootstrap.prépare(def.formulaire.contenus, def.optionsBootstrap);
            }
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

        if (def.soumet) {
            def.formulaire.comportementFormulaire.traiteSubmit = { traitement: def.soumet }
        }
        if (def.sontEgaux) {
            def.formulaire.ajouteValidateur(KfValidateurs.validateurAMarqueDeFormulaire(def.sontEgaux));
        }
        superGroupe.quandTousAjoutés();
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
        const formulaire = new KfGroupe(nom ? nom : FabriqueFormulaire.nomEdition);
        formulaire.créeGereValeur();
        formulaire.estRacineV = true;
        formulaire.comportementFormulaire = {
                sauveQuandChange: true,
                neSoumetPasSiPristine: true,
            };
        formulaire.avecInvalidFeedback = true;
        return formulaire;
    }

    ajouteResultat(formulaire: KfGroupe): AfficheResultat {
        const afficheResultat = new AfficheResultat(formulaire);
        return afficheResultat;
    }

}
