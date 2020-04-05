import { KfIcone } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { Couleur } from './fabrique-couleurs';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { KfIconeTaille, KfIconePositionTexte } from 'src/app/commun/kf-composants/kf-elements/kf-icone/kf-icone-types';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';

export class FabriqueIcone extends FabriqueMembre {
    n: FANomIcone = 'plus';
    nomIcone: {
        attente: 'spinner',
        utilisateur: 'user',
        utilisateur_ouvert: 'user-circle-o',
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

        retour: 'arrow-circle-left',
        ajoute: 'plus',
        rafraichit: 'refresh',

        prix: 'euro',
        liste: 'list',
        case_vide: 'square-o',
        case_cochée: 'check-square-o',
    } = {
        attente: 'spinner',
        utilisateur: 'user',
        utilisateur_ouvert: 'user-circle-o',
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

        retour: 'arrow-circle-left',
        ajoute: 'plus',
        rafraichit: 'refresh',

        prix: 'euro',
        liste: 'list',
        case_vide: 'square-o',
        case_cochée: 'check-square-o',
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

    préparePourAttente(géreCss: KfGéreCss, apiAction: ApiRequêteAction): KfIcone {
        const icone = this.iconeAttente();
        icone.créegéreCssFond();
        icone.géreCssFond.ajouteClasseDef('survol-centre');
        icone.géreCssFond.fixeStyleDef('font-size', '1.25em');
        icone.fondVisible = false;

        apiAction.attente = {
            commence: () => {
                icone.fondVisible = true;
                géreCss.fixeStyleDef('opacity', '.33');
            },
            finit: () => {
                icone.fondVisible = false;
                géreCss.supprimeStyleDef('opacity');
            }
        };
        return icone;
    }

    retourEnHaut(): KfIcone {
        const icone = new KfIcone('retourEnHaut', this.nomIcone.en_arrière);
        icone.rotation(90);
        return icone;
    }

}
