import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { Couleur } from './fabrique-couleurs';
import { BootstrapIcones, FontAwesomeIcones, FontAwesomeRegularIcones, IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfIconeTaille, KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { IKfSurvole } from 'src/app/commun/kf-composants/kf-partages/kf-survol/i-kf-survole';
import { KfBootstrapSpinner } from 'src/app/commun/kf-composants/kf-elements/kf-bootstrap-spinner/kf-bootstrap-spinner';

export interface IFabriqueIconeDefs {
    utilisateur: IKfIconeDef;
    utilisateur_ouvert: IKfIconeDef;
    cercle: IKfIconeDef;
    ouvert: IKfIconeDef;
    fermé: IKfIconeDef;
    question: IKfIconeDef;
    info: IKfIconeDef;
    danger: IKfIconeDef;
    danger_cercle: IKfIconeDef;
    accepter: IKfIconeDef;
    refuser: IKfIconeDef;
    modifier: IKfIconeDef;
    supprimer: IKfIconeDef;
    copier: IKfIconeDef;
    effacer: IKfIconeDef;
    filtre: IKfIconeDef,
    cherche: IKfIconeDef,
    verrou_ouvert: IKfIconeDef;
    verrou_fermé: IKfIconeDef;
    envelope: IKfIconeDef;
    envelope_pleine: IKfIconeDef;
    retour: IKfIconeDef;
    ajoute: IKfIconeDef;
    rafraichit: IKfIconeDef;
    personnes: IKfIconeDef;
    prix: IKfIconeDef;
    case_vide: IKfIconeDef;
    case_cochée: IKfIconeDef;
    croix: IKfIconeDef;

    début: IKfIconeDef;
    précédent: IKfIconeDef;
    suivant: IKfIconeDef;
    fin: IKfIconeDef;

    attente: IKfIconeDef;
    oeil: IKfIconeDef;
    oeil_barré: IKfIconeDef;

    retour_en_haut: IKfIconeDef;
    liste: IKfIconeDef;
}

export class FabriqueIcone extends FabriqueMembre {
    private pDefsFontawesome: IFabriqueIconeDefs;
    private pDefsBootstrap: IFabriqueIconeDefs;
    private pAvecFontawsome: boolean;
    private créeDefFontawsome() {
        const def: (nom: string, style?: 'regular') => IKfIconeDef = (nom: string, style?: 'regular') => {
            const collection = style ? FontAwesomeRegularIcones : FontAwesomeIcones;
            return { collection, nom };
        }
        this.pDefsFontawesome = {
            utilisateur: def('user'),
            utilisateur_ouvert: def('user-circle'),
            cercle: def('circle'),
            ouvert: def('angle-down'),
            fermé: def('angle-up'),
            question: def('question-circle'),
            info: def('info-circle'),
            danger: def('exclamation-triangle'),
            danger_cercle: def('exclamation-circle'),
            accepter: def('check'),
            refuser: def('ban'),
            modifier: def('edit'),
            supprimer: def('trash'),
            copier: def('magic'),
            effacer: def('eraser'),
            filtre: def('filter'),
            cherche: def('search'),
            verrou_ouvert: def('unlock'),
            verrou_fermé: def('lock'),
            envelope: def('envelope', 'regular'),
            envelope_pleine: def('envelope'),
            retour: def('arrow-circle-left'),
            ajoute: def('plus'),
            rafraichit: def('sync-alt'),
            personnes: def('users'),
            prix: def('euro'),
            case_vide: def('square', 'regular'),
            case_cochée: def('check-square'),
            croix: def('times'),

            début: def('angle-double-left'),
            précédent: def('angle-left'),
            suivant: def('angle-right'),
            fin: def('angle-double-right'),
            attente: def('spinner'),
            oeil: def('eye'),
            oeil_barré: def('eye-slash'),
            retour_en_haut: def('angle-double-up'),
            liste: def('list'),
        }
    }
    private créeDefBootstrap() {
        const def: (nom: string) => IKfIconeDef = (nom: string) => {
            return { collection: BootstrapIcones, nom };
        }
        this.pDefsBootstrap = {
            utilisateur: def('person'),
            utilisateur_ouvert: def('person-check-fill'),
            cercle: def('circle-fill'),
            ouvert: def('caret-down-fill'),
            fermé: def('caret-up-fill'),
            question: def('question-circle-fill'),
            info: def('info-circle-fill'),
            danger: def('exclamation-triangle-fill'),
            danger_cercle: def('exclamation-circle-fill'),
            accepter: def('check-lg'),
            refuser: def('dash-circle-fill'), // ?
            modifier: def('pencil-square'),
            supprimer: def('trash'),
            copier: def('lightning-fill'),// ?
            effacer: def('eraser-fill'),
            filtre: def('funnel-fill'),
            cherche: def('search'),
            verrou_ouvert: def('unlock-fill'),
            verrou_fermé: def('lock-fill'),
            envelope: def('envelope'),
            envelope_pleine: def('envelope-fill'),
            retour: def('arrow-left-circle'),
            ajoute: def('plus-lg'),
            rafraichit: def('cloud-arrow-down-fill'),
            personnes: def('people-fill'),
            prix: def('currency-euro'),
            case_vide: def('square'),//
            case_cochée: def('check-square'),//
            croix: def('times'),//

            début: def('chevron-double-left'),
            précédent: def('chevron-left'),
            suivant: def('chevron-right'),
            fin: def('chevron-double-right'),
            attente: def('gear'),////////
            oeil: def('eye'),
            oeil_barré: def('eye-slash'),
            retour_en_haut: def('chevron-double-up'),
            liste: def('list-ol'),
        }
    }

    public get def(): IFabriqueIconeDefs {
        return this.pAvecFontawsome ? this.pDefsFontawesome : this.pDefsBootstrap;
    }
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
        this.créeDefFontawsome();
        this.créeDefBootstrap();
        this.pAvecFontawsome = false;
    }

    ajouteTexte(icone: KfIcone, texte: KfStringDef, position: KfIconePositionTexte) {
        icone.ajouteTexte(texte, position);
    }

    icone(iconeDef: IKfIconeDef): KfIcone {
        const icone = new KfIcone('', iconeDef);
        return icone;
    }

    iconeConnection(): KfIcone {
        const icone = new KfIcone('');
        icone.taillePile('lg');
        icone.empile(this.def.utilisateur);
        return icone;
    }

    iconeConnecté(): KfIcone {
        const icone = new KfIcone('');
        icone.empile(this.def.cercle, 1, this.def.utilisateur_ouvert, 1);
        icone.taillePile('lg');
        this.fabrique.couleur.ajouteClasseCouleur(icone.couches[0].géreCss, Couleur.orange);
        return icone;
    }

    iconeVerrouOuvert(): KfIcone {
        const icone = new KfIcone('verrou_ouvert', this.def.verrou_ouvert);
//        icone.taille(2);
        return icone;
    }

    iconeVerrouFermé(): KfIcone {
        const icone = new KfIcone('verrou_ferme', this.def.verrou_fermé);
//        icone.taille(2);
        return icone;
    }

    iconeAttente(taille?: KfIconeTaille): IKfSurvole {
        if (this.pAvecFontawsome) {
            const icone = new KfIcone('attente', this.def.attente);
            icone.animation('pulse');
            if (taille) {
                icone.taille(taille);
            }
            return icone;
        }
        const survole = new KfBootstrapSpinner('attente', 'border');
        survole.taille(taille ? taille : 'sm');
        return survole;
    }

    retourEnHaut(): KfIcone {
        const icone = new KfIcone('retourEnHaut', this.def.retour_en_haut);
        return icone;
    }

    iconesPagination(): {
        début: IKfIconeDef,
        précédent: IKfIconeDef,
        suivant: IKfIconeDef,
        fin: IKfIconeDef,
    } {
        return {
            début: this.def.début,
            précédent: this.def.précédent,
            suivant: this.def.suivant,
            fin: this.def.fin,
        };
    }

}
