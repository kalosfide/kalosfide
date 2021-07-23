import { FabriqueMembre } from '../fabrique-membre';
import { Fabrique, FabriqueClasse } from '../fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { IBoutonDef } from '../fabrique-bouton';
import { IContenuPhraseDef } from '../fabrique-contenu-phrase';
import { Couleur } from '../fabrique-couleurs';
import { Site } from 'src/app/modeles/site/site';
import { BootstrapTypeBouton, BootstrapTypeFond, BootstrapTypeTexte, KfBootstrap } from '../../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfDivTableColonne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IKfIconeDef } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';
import { IUrlDef } from '../fabrique-url';
import { KfTypeDeComposant } from 'src/app/commun/kf-composants/kf-composants-types';
import { DataService } from 'src/app/services/data.service';

export interface IBtnGroupeDef {
    groupe?: KfBBtnGroup;
    rafraichit?: (barre: IBarreTitre) => void;
    alignéADroite?: boolean;
}

export interface IBarreDef {
    /**
     * pageDef doit avoir un titre
     */
    pageDef: PageDef;
    contenuAidePage?: KfComposant[];
    groupesDeBoutons?: (KfBBtnGroup | IBtnGroupeDef)[];
}

/**
 * Objet gérant le contenu de la barre d'outils affichée avec le titre de la page
 */
 export interface IBarreTitre {
    pageDef: PageDef;
    site: Site;

    barre: KfGroupe;

    rafraichit(): void;
}

/**
 * Objet gérant le contenu de la barre d'outils affichée avec le titre de la page
 */
 export class classeBarreTitre implements IBarreTitre {
    pageDef: PageDef;
    site: Site;
    private toolbar: KfGroupe;
    private rafraichissements: ((barre: IBarreTitre) => void)[];

    constructor(pageDef: PageDef) {
        this.pageDef = pageDef;
        this.toolbar = new KfGroupe(pageDef.urlSegment);
        KfBootstrap.prépareToolbar(this.toolbar, 'titre');
        this.toolbar.ajouteClasse('justify-content-between');
        this.rafraichissements = [];
    }

    get barre(): KfGroupe {
        return this.toolbar;
    }

    ajoute(groupeDef: IBtnGroupeDef) {
        if (groupeDef.groupe) {
            this.toolbar.ajoute(groupeDef.groupe);
        }
        if (groupeDef.rafraichit) {
            this.rafraichissements.push(groupeDef.rafraichit);
        }
    }

    rafraichit() {
        this.rafraichissements.forEach(rafraichit => rafraichit(this));
    }
}

export class FabriqueTitrePage extends FabriqueMembre {
    private bsType: {
        barre: {
            fond: BootstrapTypeFond,
            texte: BootstrapTypeTexte
        }
        bouton: BootstrapTypeBouton,
        retour: {
            fond: BootstrapTypeFond,
            texte: BootstrapTypeTexte,
            bouton: BootstrapTypeBouton
        }
    }

    constructor(fabrique: FabriqueClasse) {
        super(fabrique);
        this.bsType = {
            barre: { fond: 'secondary', texte: 'white' },
            bouton: 'light',
            retour: {
                fond: 'white',
                texte: 'dark',
                bouton: 'light'
            }
        }
    }

    barreTitre(barreDef: IBarreDef): IBarreTitre {
        const barre = new classeBarreTitre(barreDef.pageDef);
        let groupesDeBoutons: IBtnGroupeDef[] = [];
        if (barreDef.contenuAidePage) {
            groupesDeBoutons.push(this.groupeDefAidePage(barre, barreDef.contenuAidePage));
        }
        if (barreDef.groupesDeBoutons) {
            groupesDeBoutons = groupesDeBoutons.concat(barreDef.groupesDeBoutons.map(groupeOuDef => {
                if ((groupeOuDef as KfBBtnGroup).type === KfTypeDeComposant.b_btn_group) {
                    return { groupe: (groupeOuDef as KfBBtnGroup)};
                } else {
                    return groupeOuDef as IBtnGroupeDef;
                }
            }));
        }
        let groupeVide: KfBBtnGroup;
        if (groupesDeBoutons.find(groupeOuDef => (groupeOuDef as IBtnGroupeDef).alignéADroite)) {
            // il y a un groupe qui s'il est seul devra être affiché à droite
            // il faut ajouter un groupe vide avant
            groupeVide = this.bbtnGroup('vide');
            barre.ajoute({ groupe: groupeVide });
        }
        groupesDeBoutons.forEach(def => barre.ajoute(def));
        if (groupeVide) {
            // il faut rafraichir le groupe vide après
            barre.ajoute({
                rafraichit: () => {
                    // il ne faut afficher le groupe vide que s'il n'y a qu'un groupe à afficher et que ce groupe est aligné à droite
                    const groupesAAfficher = groupesDeBoutons.filter(def => !def.groupe.nePasAfficher);
                    groupeVide.nePasAfficher = !(groupesAAfficher.length === 1 && groupesAAfficher[0].alignéADroite);
                }
    
            })
        }
        return barre;
    }

    bbtnGroup(nom: string): KfBBtnGroup {
        const groupe = new KfBBtnGroup(nom);
        groupe.taille('sm');
        return groupe;
    }

    boutonDef(nom: string, contenu?: IContenuPhraseDef): IBoutonDef {
        if (contenu && (contenu.icone || contenu.iconeDef)) {
            contenu.positionTexte = 'droite';
        }
        const boutonDef: IBoutonDef = {
            nom,
            contenu,
            bootstrap: { type: this.bsType.bouton }
        };
        return boutonDef;
    }

    boutonInfo(nom: string, titre?: string): KfBouton {
        const contenu: IContenuPhraseDef = {
            iconeDef: this.fabrique.icone.def.info,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return this.fabrique.bouton.bouton(this.boutonDef(nom, contenu));
    }

    boutonAide(nom: string, titre?: string): KfBouton {
        return this.fabrique.bouton.bouton(this.boutonDef(nom, this.fabrique.contenu.aide(titre)));
    }

    contenuBoutonRafraichit(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            iconeDef: this.fabrique.icone.def.rafraichit,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return contenu;
    }

    boutonRafraichit(nom: string, titre?: string): KfBouton {
        return this.fabrique.bouton.bouton(this.boutonDef(nom, this.contenuBoutonRafraichit(titre)));
    }

    boutonAction(nom: string, texte?: string): KfBouton {
        let contenu: IContenuPhraseDef;
        if (texte) {
            contenu = {
                texte: texte,
            };
        }
        const boutonDef = this.boutonDef(nom, contenu);
        boutonDef.bootstrap = { type: 'secondary' };
        return this.fabrique.bouton.bouton(boutonDef);
    }

    boutonBascule(def: IBoutonDef, active: () => boolean, service?: DataService): KfBouton {
        const bouton = this.fabrique.bouton.bouton(def, service);
        bouton.contenuPhrase.contenus[0].ajouteClasse({
            nom: KfBootstrap.classeTexte({ color: 'success', poids: 'bold' }),
            active
        })
        return bouton;
    }

    /**
     * Si urlDef ne contient pas de pageDef, nom et texte doivent être définis.
     * @returns 
     */
    lien(urlDef: IUrlDef, iconeDef: IKfIconeDef, nom?: string, texte?: string): KfLien {
        if (!urlDef.pageDef && (!nom || !texte)) {
            throw new Error('Fabrique.titrePage.lien: Si urlDef ne contient pas de pageDef, nom et texte doivent être définis.')
        }
        return this.fabrique.lien.bouton({
            nom: nom ? nom : urlDef.pageDef.urlSegment,
            urlDef,
            contenu: {
                iconeDef,
                texte: texte ? texte : urlDef.pageDef.lien,
                positionTexte: 'droite',
            },
            avecRouterLinkActive: {}
        },
        this.bsType.bouton);
    }

    fixePopover(bouton: KfBouton, titre: string | KfEtiquette, contenus: KfComposant[]) {
        this.fabrique.bouton.fixePopover(bouton, titre, contenus, this.fabrique.icone.def.ouvert);
    }

    groupeDefAidePage(barre: IBarreTitre, contenus: KfComposant[]): IBtnGroupeDef {
        const bouton = this.boutonAide('aide_page', barre.pageDef.titre);
        this.fixePopover(bouton, barre.pageDef.titre + ': Aide', contenus);
        const groupe = this.bbtnGroup('aide_page');
        groupe.ajoute(bouton);
        return { groupe };
    }

    groupeDefAccès(estClient?: 'client', invisibleOuPasAffiché?: 'invisible' | 'pasAffiché'): IBtnGroupeDef {
        const boutonVerrou = this.fabrique.bouton.bouton({
            nom: 'bouton_verrou',
            contenu: {
                iconeDef: this.fabrique.icone.def.verrou_fermé,
            }
        });
        const etiquetteTitreVerrou = new KfEtiquette('titre_verrou', 'Site fermé');
        const etat = this.fabrique.etatSite.état(IdEtatSite.catalogue);
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = this.fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes( etat.titre + ' en cours');
        etiquette = this.fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteClasse('alert-danger');
        if (estClient) {
            KfBootstrap.ajouteClasseBouton(boutonVerrou, 'light');
            etiquette.ajouteTextes(
                `Votre accès au site est temporairement limité: vous ne pouvez pas commander.`
            );
        } else {
            KfBootstrap.ajouteClasseBouton(boutonVerrou, 'danger');
            etiquette.ajouteTextes(
                `Vos clients ont un accès limité à votre site.`
            );
            etiquette = this.fabrique.ajouteEtiquetteP(infos);
            etiquette.ajouteTextes(`Pour réouvrir votre site, quittez les pages du catalogue ou déconnectez-vous.`);
        }
        this.fabrique.bouton.fixePopover(boutonVerrou, etiquetteTitreVerrou, infos);
        const groupe = this.bbtnGroup('verrou');
        groupe.ajoute(boutonVerrou);
        const rafraichit = invisibleOuPasAffiché === 'invisible'
        ? (barre: IBarreTitre) => {
                groupe.ajouteClasse({
                    nom: 'invisible',
                    active: () => barre.site.etat !== IdEtatSite.catalogue
                });
            }
        : (barre: IBarreTitre) => {
                groupe.nePasAfficher = barre.site.etat !== IdEtatSite.catalogue;
            };
        const def: IBtnGroupeDef = {
            groupe,
            rafraichit,
            alignéADroite: true
        }
        return def;
    }

    groupeRetour(lien: KfLien): IBtnGroupeDef {
        const groupe = this.bbtnGroup('retour');
        groupe.ajoute(lien);
        KfBootstrap.ajouteClasseBouton(lien, this.bsType.retour.bouton, 'outline')
        return { groupe , alignéADroite: true };
    }

    titrePage(titre: string, niveau: number, créeBarreTitre?: () => IBarreTitre): KfSuperGroupe {
        const groupe = new KfSuperGroupe('titre');
        groupe.créeDivLigne();
        groupe.ajouteClasse('titre-page', 'row', 'align-items-center',
            KfBootstrap.classeFond(this.bsType.barre.fond), KfBootstrap.classeFond('gradient'),
            KfBootstrap.classeTexte({ color: this.bsType.barre.texte }),
            'px-1', 'py-1', 'mb-2');

        let col: KfDivTableColonne;

        let niveauH = 5 + (niveau ? niveau : 0);
        if (niveauH > 6) {
            niveauH = 6;
        }
        col = groupe.divLigne.ajoute(titre);
        col.ajouteClasse('col', KfBootstrap.classeTexte({ taille: niveauH }));

        if (créeBarreTitre) {
            col = groupe.divLigne.ajoute([créeBarreTitre().barre]);
            col.ajouteClasse('col');
        }
        groupe.quandTousAjoutés();

        return groupe;
    }

}
