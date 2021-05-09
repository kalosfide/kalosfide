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
import { KfBBtnToolbar } from 'src/app/commun/kf-composants/kf-b-btn-toolbar/kf-b-btn-toolbar';
import { Site } from 'src/app/modeles/site/site';
import { KfBootstrap } from '../../../commun/kf-composants/kf-partages/kf-bootstrap';
import { GroupeAccès } from './groupe-acces';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfDivTableColonne } from 'src/app/commun/kf-composants/kf-groupe/kf-div-table';
import { EtatSite } from '../fabrique-etat-site';
import { IdEtatSite } from 'src/app/modeles/etat-site';

export interface IBtnGroupeDef {
    groupe: KfBBtnGroup;
    rafraichit?: (barre: BarreTitre) => void;
}

export class BarreTitre {
    pageDef: PageDef;
    site: Site;
    private toolbar: KfBBtnToolbar;
    private rafraichissements: ((barre: BarreTitre) => void)[];

    constructor(pageDef: PageDef) {
        this.pageDef = pageDef;
        this.toolbar = new KfBBtnToolbar(pageDef.urlSegment);
        this.toolbar.ajouteClasse('justify-content-between');
        this.rafraichissements = [];
    }

    get barre(): KfBBtnToolbar {
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
    boutonsPourBtnGroup?: (KfBBtnGroupElement[])[];
}

export class FabriqueTitrePage extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    barreTitre(barreDef: IBarreDef): BarreTitre {
        const barre = new BarreTitre(barreDef.pageDef);
        if (barreDef.contenuAidePage) {
            barre.ajoute(this.groupeDefAidePage(barre, barreDef.contenuAidePage));
        } else {
            barre.ajoute({ groupe: new KfBBtnGroup('') });
        }
        if (barreDef.boutonsPourBtnGroup) {
            barreDef.boutonsPourBtnGroup.forEach(boutons => {
                const groupe = this.bbtnGroup('');
                boutons.forEach(bouton => {
                    groupe.ajoute(bouton);
                });
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
            nomIcone: this.fabrique.icone.nomIcone.info,
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
        KfBootstrap.ajouteClasse(bouton, 'btn', 'light');
        return bouton;
    }

    contenuBoutonRafraichit(titre?: string): IContenuPhraseDef {
        const contenu: IContenuPhraseDef = {
            nomIcone: this.fabrique.icone.nomIcone.rafraichit,
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
        this.fabrique.bouton.fixePopover(bouton, titre, contenus, this.fabrique.icone.nomIcone.ouvert);
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
                nomIcone: this.fabrique.icone.nomIcone.verrou_fermé,
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
                groupe.nePasAfficher = barre.site.etat !== IdEtatSite.catalogue;
            }
        }
        return def;
    }

    titrePage(titre: string, niveau: number, créeBarreTitre?: () => BarreTitre): KfGroupe {
        const groupe = new KfGroupe('titre');
        groupe.créeDivLigne();
        groupe.divLigne.ajouteClasse('titre-page', 'row', 'align-items-center', 'couleur-fond-beige', 'px-1', 'py-1', 'mb-2');

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

        return groupe;
    }

}
