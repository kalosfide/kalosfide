import { FabriqueMembre } from '../fabrique-membre';
import { FabriqueClasse } from '../fabrique';
import { PageDef } from 'src/app/commun/page-def';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { IBoutonDef } from '../fabrique-bouton';
import { IContenuPhraseDef } from '../fabrique-contenu-phrase';
import { Couleur } from '../fabrique-couleurs';
import { Site } from 'src/app/modeles/site/site';
import { KfBootstrap } from '../../../commun/kf-composants/kf-partages/kf-bootstrap';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfDivTableColonne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';

export interface IBtnGroupeDef {
    groupe: KfBBtnGroup;
    rafraichit?: (barre: BarreTitre) => void;
}

export class BarreTitre {
    pageDef: PageDef;
    site: Site;
    private toolbar: KfGroupe;
    private rafraichissements: ((barre: BarreTitre) => void)[];

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
        this.toolbar.ajoute(groupeDef.groupe);
        if (groupeDef.rafraichit) {
            this.rafraichissements.push(groupeDef.rafraichit);
        }
    }

    rafraichit() {
        this.rafraichissements.forEach(rafraichit => rafraichit(this));
    }
}

export interface IBarreDef {
    /**
     * pageDef doit avoir un titre
     */
    pageDef: PageDef;
    contenuAidePage?: KfComposant[];
    groupesDeBoutons?: KfBBtnGroup[];
}

export class FabriqueTitrePage extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    barreTitre(barreDef: IBarreDef): BarreTitre {
        const barre = new BarreTitre(barreDef.pageDef);
        if (barreDef.contenuAidePage) {
            barre.ajoute(this.groupeDefAidePage(barre, barreDef.contenuAidePage));
        }
        if (barreDef.groupesDeBoutons) {
            barreDef.groupesDeBoutons.forEach(groupe => {
                barre.ajoute({ groupe });
            });
        }
        return barre;
    }

    bbtnGroup(nom: string): KfBBtnGroup {
        const groupe = new KfBBtnGroup(nom);
        groupe.taille('sm');
        return groupe;
    }

    bouton(nom: string, contenu?: IContenuPhraseDef): KfBouton {
        if (contenu) {
            contenu.positionTexte = 'droite';
        }
        const boutonDef: IBoutonDef = {
            nom,
            contenu
        };
        return this.fabrique.bouton.bouton(boutonDef);
    }

    contenuBoutonInfo(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            iconeDef: this.fabrique.icone.def.info,
            couleurIcone: Couleur.blue,
            texte: titre,
            positionTexte: 'droite',
        };
        return contenu;
    }

    boutonInfo(nom: string, titre?: string): KfBouton {
        const bouton = this.bouton(nom, this.contenuBoutonInfo(titre));
        KfBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    boutonAide(nom: string, titre?: string): KfBouton {
        const bouton = this.bouton(nom, this.fabrique.contenu.aide(titre));
        KfBootstrap.ajouteClasse(bouton, 'btn', 'light', 'outline');
        return bouton;
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
        const bouton = this.bouton(nom, this.contenuBoutonRafraichit(titre));
        KfBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    boutonAction(nom: string, titre?: string): KfBouton {
        let contenu: IContenuPhraseDef;
        if (titre) {
            contenu = {
                texte: titre,
            };
        }
        const bouton = this.bouton(nom, contenu);
        KfBootstrap.ajouteClasse(bouton, 'btn', 'secondary');
        return bouton;
    }

    fixePopover(bouton: KfBouton, titre: string | KfEtiquette, contenus: KfComposant[]) {
        this.fabrique.bouton.fixePopover(bouton, titre, contenus, this.fabrique.icone.def.ouvert);
    }

    groupeDefAidePage(barre: BarreTitre, contenus: KfComposant[]): IBtnGroupeDef {
        const bouton = this.boutonAide('aide_page', barre.pageDef.titre);
        this.fixePopover(bouton, barre.pageDef.titre + ': Aide', contenus);
        const groupe = this.bbtnGroup('aide_page');
        groupe.ajoute(bouton);
        return { groupe };
    }

    groupeDefAccès(estClient?: 'client'): IBtnGroupeDef {
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
        this.fabrique.ajouteTexte(etiquette, etat.titre + ' en cours');
        etiquette = this.fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteClasse('alert-danger');
        if (estClient) {
            KfBootstrap.ajouteClasse(boutonVerrou, 'btn', 'light');
            this.fabrique.ajouteTexte(etiquette,
                `Votre accès au site est temporairement limité: vous ne pouvez pas commander.`
            );
        } else {
            KfBootstrap.ajouteClasse(boutonVerrou, 'btn', 'danger');
            this.fabrique.ajouteTexte(etiquette,
                `Vos clients ont un accès limité à votre site.`
            );
        }
        this.fabrique.bouton.fixePopover(boutonVerrou, etiquetteTitreVerrou, infos);
        const groupe = this.bbtnGroup('verrou');
        groupe.ajoute(boutonVerrou);
        const def: IBtnGroupeDef = {
            groupe,
            rafraichit: (barre: BarreTitre) => {
                boutonVerrou.ajouteClasse({
                    nom: 'invisible',
                    active: () => barre.site.etat !== IdEtatSite.catalogue
                });
//                groupe.nePasAfficher = barre.site.etat !== IdEtatSite.catalogue;
            }
        }
        return def;
    }

    titrePage(titre: string, niveau: number, créeBarreTitre?: () => BarreTitre): KfSuperGroupe {
        const groupe = new KfSuperGroupe('titre');
        groupe.créeDivLigne();
        groupe.divLigne.ajouteClasse('titre-page', 'row', 'align-items-center', 'bg-info', 'bg-gradient', 'px-1', 'py-1', 'mb-2');

        let col: KfDivTableColonne;

        let niveauH = 5 + (niveau ? niveau : 0);
        if (niveauH > 6) {
            niveauH = 6;
        }
        col = groupe.divLigne.ajoute(titre);
        col.ajouteClasse('col h' + niveauH);

        if (créeBarreTitre) {
            col = groupe.divLigne.ajoute([créeBarreTitre().barre]);
            col.ajouteClasse('col');
        }
        groupe.quandTousAjoutés();

        return groupe;
    }

}
