import { IBtnGroupeDef, FabriqueTitrePage, BarreTitre } from './fabrique-titre-page';
import { KfBBtnGroup } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfBootstrap } from '../../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueClasse } from '../fabrique';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { IdEtatSite } from 'src/app/modeles/etat-site';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IContenuPhraseDef } from '../fabrique-contenu-phrase';
import { IUrlDef } from '../fabrique-url';
import { FournisseurRoutes } from 'src/app/fournisseur/fournisseur-pages';

export class GroupeAccès implements IBtnGroupeDef {
    private parent: FabriqueTitrePage;
    groupe: KfBBtnGroup;
    rafraichit: (barre: BarreTitre) => void;
    etiquetteTitreVerrou: KfEtiquette;
    boutonVerrou: KfBouton;

    constructor(parent: FabriqueTitrePage, estClient: boolean) {
        this.parent = parent;
        this.etiquetteTitreVerrou = new KfEtiquette('titre_verrou');
        this.boutonVerrou = this.parent.bouton('bouton_verrou');
        KfBootstrap.ajouteClasse(this.boutonVerrou, 'btn', 'light');
        this.groupe = this.parent.bbtnGroup('accès');
        this.groupe.ajoute(this.boutonVerrou);
        this.groupe.ajoute(this.aideAccès());
        this.rafraichit = (barre: BarreTitre) => this.rafraichitSelonRole(barre, estClient);
    }

    get fabrique(): FabriqueClasse {
        return this.parent.fabrique;
    }

    private aideAccès(): KfBouton {
        const bouton = this.parent.boutonAide('aide');
        let contenusAide: KfComposant[] = [];
        this.fabrique.etatSite.états.forEach(état => {
            const etiquette = new KfEtiquette('titre');
            this.fabrique.contenu.fixeDef(etiquette, {
                nomIcone: état.id === IdEtatSite.ouvert
                    ? this.fabrique.icone.nomIcone.verrou_ouvert
                    : this.fabrique.icone.nomIcone.verrou_fermé,
                texte: état.titre,
                positionTexte: 'droite'
            });
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            etiquette.ajouteClasse('bg-light');
            contenusAide.push(etiquette);
            contenusAide = contenusAide.concat(état.description());
        });
        this.parent.fixePopover(bouton, this.fabrique.etatSite.titre, contenusAide);
        return bouton;
    }

    rafraichitSelonRole(barre: BarreTitre, estClient: boolean) {
        const etat = this.fabrique.etatSite.état(barre.site.etat);
        const infos: KfComposant[] = [];
        let contenu: IContenuPhraseDef;

        let etiquette: KfEtiquette;

        if (etat.id === IdEtatSite.ouvert) {
            contenu = {
                nomIcone: this.fabrique.icone.nomIcone.verrou_ouvert,
            };
            this.etiquetteTitreVerrou.fixeTexte('Site ouvert');
            etiquette = this.fabrique.ajouteEtiquetteP(infos);
            if (estClient) {
                this.fabrique.ajouteTexte(etiquette,
                    `Vous avez plein accès au site.`
                );
            } else {
                KfBootstrap.ajouteClasse(this.boutonVerrou, 'btn', 'light');
                this.fabrique.ajouteTexte(etiquette,
                    `Vos clients ont plein accès à votre site.`
                );
            }
        } else {
            etiquette = this.fabrique.ajouteEtiquetteP(infos);
            this.fabrique.ajouteTexte(etiquette, etat.titre + ' en cours');
            contenu = {
                nomIcone: this.fabrique.icone.nomIcone.verrou_fermé,
            };
            this.etiquetteTitreVerrou.fixeTexte('Site fermé');
            etiquette = this.fabrique.ajouteEtiquetteP(infos);
            etiquette.ajouteClasse('alert-danger');
            if (estClient) {
                this.fabrique.ajouteTexte(etiquette,
                    `Votre accès au site est temporairement limité: vous ne pouvez pas commander.`
                );
            } else {
                KfBootstrap.ajouteClasse(this.boutonVerrou, 'btn', 'danger');
                this.fabrique.ajouteTexte(etiquette,
                    `Vos clients ont un accès limité à votre site.`
                );
                etiquette = this.fabrique.ajouteEtiquetteP(infos);
                this.fabrique.ajouteTexte(etiquette, `Cet état du site est géré sur la page `);
                if (etat.pageDef.urlSegment !== barre.pageDef.urlSegment) {
                    const url: IUrlDef = {
                        pageDef: etat.pageDef,
                        routes: FournisseurRoutes,
                        urlSite: barre.site.url,
                    };
                    const lien = this.fabrique.lien.lienEnLigne({
                        urlDef: url,
                        contenu: { texte: 'Changer' }
                    });
                    etiquette.contenuPhrase.ajoute(lien);
                }
            }
        }
        this.fabrique.contenu.fixeDef(this.boutonVerrou, contenu);
        this.parent.fixePopover(this.boutonVerrou, this.etiquetteTitreVerrou, infos);
    }
}
