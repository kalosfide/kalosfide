import { KfComposant } from '../kf-composant/kf-composant';
import { Noeud } from '../../outils/arbre/noeud';
import { KfElement } from '../kf-composant/kf-element';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement, KfTraitementDEvenement } from '../kf-partages/kf-evenements';
import { KfSousMenu } from './kf-sous-menu';
import { KfGereTabIndex } from '../kf-composant/kf-composant-gere-tabindex';
import { KfMenuDirection, KfDefinitionDeMenu } from './kf-menu-types';
import { KfTypeDeComposant } from '../kf-composants-types';

export class KfMenu extends KfElement {

    /**
     * pour créer un id distinct pour chaque sous-menu
     */
    private compte = 0;

    /**
     * si avecOuvrirFermer est vrai, chaque sous-menu a un état ouvert et un état fermé qui correspondent aux
     * classes css kf-ouvert et kf-ferme appliquées au sous-menu
     * cliquer sur le sélecteur d'un sous-menu bascule entre ces états
     */
    private avecOuvrirFermer: boolean;
    /* niveau à partir duquel les sous-menus sont créés fermés */
    private commencerFerméAPartirDe: number;
    private unSeulOuvertParNiveau: boolean;

    /**
     * si navigation au clavier
     * en-tête du sous-menu descendant de sousMenuRacine qui représente le menu pour le focus
     */
    feuilleChoisie: KfSousMenu;

    direction: KfMenuDirection;

    /**
     * KfMenu
     * @param nom nom du menu
     */
    constructor(nom: string, direction?: KfMenuDirection) {
        super(nom, KfTypeDeComposant.menu);
        // traitement des clics
        this.gereHtml.ajouteTraiteur(KfTypeDEvenement.menuChange, this.traiteMenuChange);
        // classe css
        this.direction = direction ? direction : KfMenuDirection.vertical;
        this.ajouteClasseDef(this.direction);
    }

    // OUVRIR FERMER
    /**
     * si cette méthode est exécutée AVANT L'AJOUT DES ITEMS, chaque sous-menu a un état ouvert et un état fermé
     * qui correspondent aux classes css kf-ouvert et kf-ferme appliquées au sous-menu
     * cliquer sur le sélecteur d'un sous-menu bascule entre ces états
     * @param commencerFerméAPartirDe niveau à partir duquel les sous-menus sont créés fermés
     * @param unSeulOuvertParNiveau parmi les niveaux où les sous-menus ont été créés fermés
     */
    gereOuvrirFermer(commencerFerméAPartirDe?: number, unSeulOuvertParNiveau?: boolean) {
        this.avecOuvrirFermer = true;
        this.commencerFerméAPartirDe = commencerFerméAPartirDe ? commencerFerméAPartirDe : 2;
        this.unSeulOuvertParNiveau = unSeulOuvertParNiveau ? unSeulOuvertParNiveau : false;
    }

    // STRUCTURE
    get sousMenus(): KfSousMenu[] {
        return this.noeud.Enfants.map(e => e.objet as KfSousMenu);
    }

    sousMenu(id: any): KfSousMenu {
        const sousMenus = this.noeud.Trouve((composant: KfComposant): boolean => (composant as KfSousMenu).itemId === id);
        if (sousMenus.length > 0) {
            return sousMenus[0] as KfSousMenu;
        }
    }

    /**
     * pour créer un id distinct pour chaque sous-menu
     */
    créeId(): number { return ++this.compte; }

    get niveau(): number {
        return 0;
    }

    ajouteItem(idParent: any, definition: KfDefinitionDeMenu): KfSousMenu {
        let parent: KfMenu | KfSousMenu;
        // si idParent est null, c'est le sous-menu racine
        if (idParent === null || idParent === undefined) {
            parent = this;
        } else {
            parent = this.sousMenu(idParent);
        }
        return this.ajouteSousMenu(parent, definition);
    }

    ajouteSousMenu(parent: KfMenu | KfSousMenu, definition: KfDefinitionDeMenu): KfSousMenu {
        const niveau = parent.niveau + 1;
        const no = ++this.compte;
        const sousMenu = new KfSousMenu(no, definition);
        if (this.gereOuvrirFermer) {
            // le sous-menu a un en-tête cliquable
            if (niveau >= this.commencerFerméAPartirDe) {
                // les sous-menus sont ouverts par défaut
                // un sous-menu parent qui n'est pas la racine est ouvert si commencerFerméAPartirDe est false
                (parent as KfSousMenu).ouvert = false;
            }
        }
        parent.noeud.Ajoute(sousMenu.noeud);
        return sousMenu;
    }

    get premiereFeuille(): KfSousMenu {
        let f = this.sousMenus[0];
        while (f.contenus) {
            f = f.contenus[0] as KfSousMenu;
        }
        return f;
    }

    // EVENEMENT

    traiteMenuChange: KfTraitementDEvenement = (evenement: KfEvenement) => {
        const sousMenu = evenement.emetteur as KfSousMenu;
        evenement.emetteur = this;
        if (this.avecOuvrirFermer) {
            if (sousMenu.sansSousMenus) {
                // c'est le nouveau choisi
                this.feuilleChoisie = sousMenu;
                evenement.statut = KfStatutDEvenement.enCours; // pour transmettre hors des KfComposants
            } else {
                if (this.unSeulOuvertParNiveau) {
                    if (!sousMenu.ouvert) {
                        // on ne peut pas fermer le seul ouvert
                        (sousMenu.parent as KfMenu | KfSousMenu).sousMenus.forEach(
                            sm => sm.ouvert = sm === sousMenu
                        );
                    }
                } else {
                    sousMenu.ouvert = !sousMenu.ouvert;
                }
                // un clic sur un sous-menu parent n'est pas transmis
                evenement.statut = KfStatutDEvenement.fini;
            }
        }
    }

    // NAVIGATION AU CLAVIER

    navigueAuClavier() {
        this.gereTabIndex = new KfGereTabIndex(this, {
            contenus: () => this.selecteurs,
            haut: (contenu: KfComposant) => this.haut(contenu),
            bas: (contenu: KfComposant) => this.bas(contenu),
            gauche: (contenu: KfComposant) => this.gauche(contenu),
            droite: (contenu: KfComposant) => this.droite(contenu),
        });
    }

    /**
     * retourne l'array de tous les en-têtes du menu
     */
    get selecteurs(): KfComposant[] {
        const selecteurs: KfComposant[] = [];
        // méthode à appliquer à tous les descendants du noeud du sous-menu racine
        // les noeuds des en-têtes n'ont pas d'enfants
        // ceux des sous-menus ont pour enfant le noeud de leur en-tête
        const ajouteSelecteur = (noeud: Noeud) => {
            if (!noeud.enfant) {
                selecteurs.push(noeud.objet as KfComposant);
            }
        };
        // l'enfant du noeud du menu est celui de son sous-menu racine
        this.noeud.enfant.Applique(ajouteSelecteur);
        return selecteurs;
    }

    /**
     * retourne s'il existe le sélecteur du parent du sous-menu de selecteur
     * @param selecteur le sélecteur d'un sous-menu
     */
    gauche(selecteur: KfComposant): KfComposant {
        // noeud parent du noeud du sous menu de selecteur qui est le parent de celui de selecteur
        const noeud = selecteur.noeud.parent.parent;
        if (noeud !== this.noeud) {
            // on n'est pas à la racine, noeud.objet est un sous-menu
            return (noeud.objet as KfSousMenu).selecteur;
        }
    }

    /**
     * retourne le sélecteur du premier sous-menu du sous-menu de selecteur
     * @param selecteur le sélecteur d'un sous-menu
     */
    droite(selecteur: KfComposant): KfComposant {
        // s'il existe, le premier sous-menu du sous menu de selecteur est l'enfant suivant selecteur dans ce sous-menu
        const noeud = selecteur.noeud.suivant;
        if (noeud) {
            return (noeud.objet as KfSousMenu).selecteur;
        }
    }

    /**
     * déplacement parmi les enfants du sous-menu parent du sous-menu de selecteur
     * retourne le sélecteur du sous-menu précédent ou le dernier sous-menu du parent
     * @param selecteur le sélecteur d'un sous-menu
     */
    haut(selecteur: KfComposant): KfComposant {
        // noeud du sous menu de selecteur
        let noeud = selecteur.noeud.parent;
        // noeud précédent ou dernier noeud enfant du noeud parent de ce noeud
        noeud = noeud.haut;
        if (noeud) {
            return (noeud.objet as KfSousMenu).selecteur;
        }
    }

    /**
     * déplacement parmi les enfants du sous-menu parent du sous-menu de selecteur
     * retourne le sélecteur du sous-menu suivant ou le premier sous-menu du parent
     * @param selecteur le sélecteur d'un sous-menu
     */
    bas(selecteur: KfComposant): KfComposant {
        // noeud du sous menu de selecteur
        let noeud = selecteur.noeud.parent;
        // noeud suivant ou premier noeud enfant du noeud parent de ce noeud
        noeud = noeud.bas;
        if (noeud) {
            return (noeud.objet as KfSousMenu).selecteur;
        }
    }

}
