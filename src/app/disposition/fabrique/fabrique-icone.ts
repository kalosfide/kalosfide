import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { Couleur } from './fabrique-couleurs';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfIconeTaille, KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';

export class FabriqueIcone extends FabriqueMembre {
    n: FANomIcone = 'plus';
    nomIcone: {
        attente: 'spinner',
        utilisateur: 'user',
        utilisateur_ouvert: 'user-circle',
        cercle: 'circle',
        ouvert: 'angle-down',
        fermé: 'angle-up',
        question: 'question-circle',
        info: 'info-circle',
        danger: 'exclamation-triangle',
        danger_cercle: 'exclamation-circle',
        accepter: 'check',
        refuser: 'ban',
        modifier: 'edit',
        supprimer: 'trash',
        copier: 'magic', // 'arrow-right',
        filtre: 'filter',
        cherche: 'search',
        effacer: 'eraser',
        en_arrière: 'backward',
        verrou_ouvert: 'unlock',
        verrou_fermé: 'lock',
        carré: 'square',
        envelope: 'envelope',

        retour: 'arrow-circle-left',
        ajoute: 'plus',
        rafraichit: 'refresh',

        personnes: 'users',
        prix: 'euro',
        liste: 'list',
        case_vide: 'square',
        case_cochée: 'check-square',
        croix: 'times',

        début: 'angle-double-left',
        précédent: 'angle-left',
        suivant: 'angle-right',
        fin: 'angle-double-right',
    } = {
        attente: 'spinner',
        utilisateur: 'user',
        utilisateur_ouvert: 'user-circle',
        cercle: 'circle',
        ouvert: 'angle-down',
        fermé: 'angle-up',
        question: 'question-circle',
        info: 'info-circle',
        danger: 'exclamation-triangle',
        danger_cercle: 'exclamation-circle',
        accepter: 'check',
        refuser: 'ban',
        modifier: 'edit',
        supprimer: 'trash',
        copier: 'magic', // 'arrow-right',
        filtre: 'filter',
        cherche: 'search',
        effacer: 'eraser',
        en_arrière: 'backward',
        verrou_ouvert: 'unlock',
        verrou_fermé: 'lock',
        carré: 'square',
        envelope: 'envelope',

        retour: 'arrow-circle-left',
        ajoute: 'plus',
        rafraichit: 'refresh',

        personnes: 'users',
        prix: 'euro',
        liste: 'list',
        case_vide: 'square',
        case_cochée: 'check-square',
        croix: 'times',

        début: 'angle-double-left',
        précédent: 'angle-left',
        suivant: 'angle-right',
        fin: 'angle-double-right',
    };
    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
    }

    ajouteTexte(icone: KfIcone, texte: KfTexteDef, position: KfIconePositionTexte) {
        icone.ajouteTexte(texte, position);
    }

    icone(nomIcone: FANomIcone): KfIcone {
        const icone = new KfIcone('', nomIcone);
        return icone;
    }

    iconeConnection(): KfIcone {
        const icone = new KfIcone('');
        icone.taillePile('lg');
        icone.empile(this.nomIcone.utilisateur);
        return icone;
    }

    iconeConnecté(): KfIcone {
        const icone = new KfIcone('');
        icone.empile(this.nomIcone.cercle, 1, this.nomIcone.utilisateur_ouvert, 1);
        icone.taillePile('lg');
        this.fabrique.couleur.ajouteClasseCouleur(icone.couches[0].géreCss, Couleur.orange);
        return icone;
    }

    iconeVerrouOuvert(): KfIcone {
        const icone = new KfIcone('', this.nomIcone.verrou_ouvert);
        icone.taille(2);
        return icone;
    }

    iconeVerrouFermé(): KfIcone {
        const icone = new KfIcone('', this.nomIcone.verrou_fermé);
        icone.taille(2);
        return icone;
    }

    iconeAnnule(): KfIcone {
        const icone = new KfIcone('', this.nomIcone.attente);
        icone.empileTexte('0');
        return icone;
    }


    iconeAttente(taille?: KfIconeTaille): KfIcone {
        const icone = new KfIcone('attente', this.nomIcone.attente);
        icone.animation('pulse');
        if (taille) {
            icone.taille(taille);
        }
        return icone;
    }

    retourEnHaut(): KfIcone {
        const icone = new KfIcone('retourEnHaut', this.nomIcone.en_arrière);
        icone.rotation(90);
        return icone;
    }

    iconesPagination(): {
        début: FANomIcone,
        précédent: FANomIcone,
        suivant: FANomIcone,
        fin: FANomIcone,
    } {
        return {
            début: this.nomIcone.début,
            précédent: this.nomIcone.précédent,
            suivant: this.nomIcone.suivant,
            fin: this.nomIcone.fin,
        };
    }

}
