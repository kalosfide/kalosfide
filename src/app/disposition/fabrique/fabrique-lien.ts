import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfUlComposant } from 'src/app/commun/kf-composants/kf-ul-ol/kf-ul-ol-composant';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { IUrlDef } from './fabrique-url';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { BootstrapTypeBouton, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';

export interface ILienDef {
    nom?: string;
    urlDef?: IUrlDef;
    contenu?: IContenuPhraseDef;
    /**
     * Ajoute la directive routerLinkActive au template
     * @param classe classe css à appliquer quand l'url du lien est préfixe de l'url de la page active du router.
     * @param exact Si présent et vrai, la classe routerLinkActive n'est appliquée que quand l'url du lien est l'url de la page active du router.
     */
    avecRouterLinkActive?: { classe?: string, exact?: boolean }
}

export class FabriqueLien extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeDef(lien: KfLien, def: ILienDef) {
        if (def.urlDef) {
            let queryParams: { [key: string]: string };
            if (def.urlDef.params) {
                queryParams = {};
                def.urlDef.params.forEach(p => queryParams[p.nom] = p.valeur);
            }
            if (!def.urlDef.local) {
                lien.fixeRoute(this.fabrique.url.url(def.urlDef), queryParams);
            }
            if (def.urlDef.fragment) {
                lien.fragment = def.urlDef.fragment;
            }
            if (def.avecRouterLinkActive) {
                lien.avecRouterLinkActive(def.avecRouterLinkActive.classe, def.avecRouterLinkActive.exact);
            }
        }
        if (!def.contenu) {
            def.contenu = {};
        }
        if (!def.contenu.iconeDef && !def.contenu.icone && def.contenu.texte === undefined) {
            def.contenu.texte = def.urlDef.pageDef.lien ? def.urlDef.pageDef.lien : def.urlDef.pageDef.urlSegment;
        }
        this.fabrique.contenu.fixeDef(lien, def.contenu);
    }

    /**
     * Crée un lien sans mise en forme
     * @param nomOuDef nom seul ou définition
     */
    enLigne(nomOuDef: string | ILienDef, dansAlerte?: 'dansAlerte'): KfLien {
        let lien: KfLien;
        if (typeof (nomOuDef) === 'string') {
            lien = new KfLien(nomOuDef);
        } else {
            lien = new KfLien('');
            this.fixeDef(lien, nomOuDef);
        }
        if (dansAlerte) {
            lien.ajouteClasse('alert-link')
        }
        return lien;
    }
    bouton(nomOuDef: string | ILienDef, bootstrap?: BootstrapTypeBouton): KfLien {
        const lien = this.enLigne(nomOuDef);
        KfBootstrap.ajouteClasseBouton(lien, bootstrap ? bootstrap : 'link');
        return lien;
    }

    petitBouton(nomOuDef: string | ILienDef): KfLien {
        const lien = this.enLigne(nomOuDef);
        lien.ajouteClasse('btn btn-link btn-sm');
        lien.fixeStyleDef('text-decoration', 'none');
        return lien;
    }

    retourDef(urlDef: IUrlDef, texte?: string): ILienDef {
        if (texte === null || texte === undefined) {
            texte = urlDef.pageDef.lien ? urlDef.pageDef.lien : urlDef.pageDef.urlSegment;
        }
        const def: ILienDef = {
            nom: 'retour',
            urlDef,
            contenu: this.fabrique.contenu.retour(texte)
        };
        return def;
    }

    retour(urlDef: IUrlDef, texte?: string): KfLien {
        const lien = this.enLigne(this.retourDef(urlDef, texte));
        return lien;
    }

    ajouteDef(urlDef: IUrlDef, texte?: string): ILienDef {
        if (texte === null || texte === undefined) {
            texte = urlDef.pageDef.lien ? urlDef.pageDef.lien : 'Ajoute';
        }
        const def: ILienDef = {
            urlDef,
            contenu: this.fabrique.contenu.ajoute(texte)
        };
        return def;
    }

    ajoute(urlDef: IUrlDef, texte?: string): KfLien {
        const lien = this.enLigne(this.ajouteDef(urlDef, texte));
        lien.ajouteClasse('btn btn-link btn-sm');
        lien.fixeStyleDef('text-decoration', 'none');
        return lien;
    }

    boutonAnnuler(urlDef: IUrlDef): KfLien {
        const def: ILienDef = {
            urlDef,
            contenu: {
                texte: 'Annuler'
            },
        };
        const lien = this.enLigne(def);
        KfBootstrap.ajouteClasseBouton(lien, 'dark');
        return lien;
    }

    lienVide(): KfLien {
        return this.enLigne('vide');
    }
    groupeDeLiens(...nomOuLienDefOuLiens: (string | ILienDef | KfLien)[]) {
        const groupe = new KfGroupe('');
        groupe.ajouteClasse('mb-2');
        const ul = new KfUlComposant('');
        ul.ajouteClasse('nav row');
        ul.gereCssLi.ajouteClasse('nav-item col');
        groupe.ajoute(ul);

        let lien: KfLien;
        nomOuLienDefOuLiens.forEach(nomOuLienDefOuLien => {
            if (typeof (nomOuLienDefOuLien) === 'string') {
                lien = this.enLigne(nomOuLienDefOuLien);
            } else {
                lien = nomOuLienDefOuLien as KfLien;
                if (lien.type === undefined) {
                    lien = this.enLigne(nomOuLienDefOuLien as ILienDef);
                    lien.ajouteClasse('nav-link');
                }
            }
            ul.ajoute(lien);
        });
        if (lien && nomOuLienDefOuLiens.length > 1) {
            lien.ajouteClasse('text-sm-right');
        }
        return groupe;
    }
}
