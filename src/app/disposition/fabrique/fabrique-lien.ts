import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfUlComposant } from 'src/app/commun/kf-composants/kf-ul/kf-ul-composant';
import { IContenuPhraseDef } from './fabrique-contenu-phrase';
import { IUrlDef } from './fabrique-url';
import { FabriqueMembre } from './fabrique-membre';
import { FabriqueClasse } from './fabrique';
import { BootstrapNom, BootstrapType, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';

export interface ILienDef {
    nom?: string;
    urlDef?: IUrlDef;
    contenu?: IContenuPhraseDef;
}

export class FabriqueLien extends FabriqueMembre {
    constructor(fabrique: FabriqueClasse) { super(fabrique); }

    fixeDef(lien: KfLien, def: ILienDef) {
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
        if (!def.contenu) {
            def.contenu = {};
        }
        if (!def.contenu.nomIcone && !def.contenu.icone && def.contenu.texte === undefined) {
            def.contenu.texte = def.urlDef.pageDef.lien ? def.urlDef.pageDef.lien : def.urlDef.pageDef.urlSegment;
        }
        this.fabrique.contenu.fixeDef(lien, def.contenu);
    }

    private _lien(nomOuDef: string | ILienDef): KfLien {
        if (typeof (nomOuDef) === 'string') {
            return new KfLien(nomOuDef);
        } else {
            const lien = new KfLien('');
            this.fixeDef(lien, nomOuDef);
            return lien;
        }
    }
    lien(nomOuDef: string | ILienDef): KfLien {
        const lien = this._lien(nomOuDef);
        lien.ajouteClasse('btn btn-link');
        return lien;
    }
    lienEnLigne(nomOuDef: string | ILienDef): KfLien {
        const lien = this._lien(nomOuDef);
        return lien;
    }
    lienBouton(nomOuDef: string | ILienDef, bootstrap: BootstrapType): KfLien {
        const lien = this._lien(nomOuDef);
        KfBootstrap.ajouteClasse(lien, 'btn', bootstrap);
        return lien;
    }

    petitBouton(nomOuDef: string | ILienDef): KfLien {
        const lien = this._lien(nomOuDef);
        lien.ajouteClasse('btn btn-link btn-sm');
        return lien;
    }

    retour(urlDef: IUrlDef, texte?: string): KfLien {
        if (texte === null || texte === undefined) {
            texte = urlDef.pageDef.lien ? urlDef.pageDef.lien : urlDef.pageDef.urlSegment;
        }
        const def: ILienDef = {
            nom: 'retour',
            urlDef,
            contenu: this.fabrique.contenu.retour(texte)
        };
        return this.petitBouton(def);
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
        return this.petitBouton(this.ajouteDef(urlDef, texte));
    }

    boutonAnnuler(urlDef: IUrlDef): KfLien {
        const def: ILienDef = {
            urlDef,
            contenu: {
                texte: 'Annuler'
            },
        };
        const lien = this._lien(def);
        KfBootstrap.ajouteClasse(lien, 'btn', 'dark');
        return lien;
    }

    lienVide(): KfLien {
        return this._lien('vide');
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
                lien = this._lien(nomOuLienDefOuLien);
            } else {
                lien = nomOuLienDefOuLien as KfLien;
                if (lien.type === undefined) {
                    lien = this._lien(nomOuLienDefOuLien as ILienDef);
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

    deBarre(urlDef: IUrlDef, nomIcone: FANomIcone, texte?: string): KfLien {
        return this.lienBouton({
            nom: urlDef.pageDef.urlSegment,
            urlDef,
            contenu: {
                nomIcone,
                texte: texte ? texte : urlDef.pageDef.lien,
                positionTexte: 'droite',
            }
        },
        BootstrapNom.light);
    }
}
