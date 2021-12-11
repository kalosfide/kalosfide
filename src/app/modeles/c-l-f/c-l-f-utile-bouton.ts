import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { CLFLigne } from './c-l-f-ligne';
import { CLFDoc } from './c-l-f-doc';
import { CLFService } from './c-l-f.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ModeAction } from './condition-action';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBtnGroupeDef, IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiDoc } from './api-doc';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { CLFDocs } from './c-l-f-docs';
import { BootstrapType, KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { TypeCLF } from './c-l-f-type';

export class CLFUtileBouton extends DataUtileBouton {
    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this.dataUtile as CLFUtile;
    }

    get service(): CLFService {
        return this.utile.service;
    }

    get url(): CLFUtileUrl {
        return this.utile.url;
    }

    get lien(): CLFUtileLien {
        return this.utile.lien;
    }

    supprime(ligne: CLFLigne, quandLigneSupprimée: (stock: CLFDocs, index: number) => void): KfBouton {
        const texteUtile = this.utile.texte.textes(ligne.parent.type);
        const titre = `Suppression d'une ligne`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        description.ajouteTextes(
            `La ${texteUtile.def.action} de `,
            {
                texte: `${ligne.no === 0
                    ? Fabrique.texte.quantitéAvecUnité(ligne.produit, ligne.aFixer, ligne.typeCommande)
                    : Fabrique.texte.quantitéAvecUnité(ligne.produit, ligne.quantité, ligne.typeCommande)
                    }`,
                classe: KfBootstrap.classeTexte({ poids: 'bold' }),
            },
            ' de ',
            {
                texte: `${ligne.produit.nom}`,
                balise: KfTypeDeBaliseHTML.b
            },
            ' au prix de ',
            {
                texte: Fabrique.texte.eurosAvecTypeMesure(ligne.produit.typeMesure, ligne.prix),
                balise: KfTypeDeBaliseHTML.b
            },
            ' va être supprimée.'
        );
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteSupprimeLigne(ligne, quandLigneSupprimée);
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + ligne.no2,
            Fabrique.contenu.supprime(), apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, 'danger', [description])
        );
        return bouton;
    }

    copieLigne(ligne: CLFLigne): KfBouton {
        const bouton = Fabrique.bouton.attenteDeColonne('copie1_' + ligne.no2,
            Fabrique.contenu.copier(), this.service.apiRequêteCopieQuantitéDansAFixerLigne(ligne), this.service);
        return bouton;
    }

    annuleLigne(ligne: CLFLigne): KfBouton {
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleLigne(ligne);
        const bouton = Fabrique.bouton.attenteDeColonne('annule1',
            Fabrique.contenu.annule(), apiRequêteAction, this.service);
        return bouton;
    }

    copieDoc(doc: CLFDoc, quandBonModifié?: (bon: CLFDoc) => void): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = texteUtile.copierBon;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteCopieQuantitéDansAFixerDoc(doc, quandBonModifié);
        const bouton = Fabrique.bouton.attenteDeColonne('copie_D', Fabrique.contenu.copier(),
            apiRequêteAction, this.service, Fabrique.confirmeModal(titre, 'primary', description));
        bouton.titleHtml = description;
        return bouton;
    }

    annuleDoc(doc: CLFDoc, quandBonModifié?: (bon: CLFDoc) => void): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleDoc(doc, quandBonModifié);
        const bouton = Fabrique.bouton.attenteDeColonne('annuleD',
            Fabrique.contenu.annule(), apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, 'warning', description)
        );
        return bouton;
    }

    copieDocs(doc: CLFDoc, quandBonsModifiés: () => void): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = texteUtile.copierBons;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteCopieQuantitéDansAFixerDocs(doc, quandBonsModifiés);
        const bouton = Fabrique.bouton.attenteDeColonne('copie_T', Fabrique.contenu.copier(),
            apiRequêteAction, this.service, Fabrique.confirmeModal(titre, 'primary', description));
        bouton.titleHtml = description;
        return bouton;
    }

    annuleDocs(doc: CLFDoc, quandBonsModifiés: () => void): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleDocs(doc, quandBonsModifiés);
        const bouton = Fabrique.bouton.attenteDeColonne('annuleT',
            Fabrique.contenu.annule(), apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, 'warning', description)
        );
        return bouton;
    }

    supprimeBonVirtuel(doc: CLFDoc, quandBonVirtuelSupprimé?: () => void): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Suppression du bon virtuel`;
        const description = `Le ${texteUtile.def.bon} virtuel va être supprimé`;
        let rafraichitTable: () => void;
        if (quandBonVirtuelSupprimé) {
            rafraichitTable = () => {
                const ligne = doc.vueTableLigne;
                ligne.vueTable.supprimeItem(ligne.index);
                quandBonVirtuelSupprimé();
            };
        }
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteSupprimeBonVirtuel(doc, rafraichitTable);
        const bouton = Fabrique.bouton.attenteDeColonne('supprimeD',
            Fabrique.contenu.supprime(), apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, 'danger', description, { ok: `Supprimer le bon virtuel` })
        );
        return bouton;
    }

    texteVérifier(type: TypeCLF): string {
        return `Vérifier ${this.utile.texte.textes(type).le_doc}`;
    }
    texteAnnulerVérifier(): string {
        return 'Annuler la vérification';
    }
    texteTerminer(type: TypeCLF): string {
        return `Enregistrer ${this.utile.texte.textes(type).le_doc}`;
    }

    envoi(clfDoc: CLFDoc, superGroupe: KfSuperGroupe, afficheResultat: AfficheResultat): KfBouton {
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteEnvoi(clfDoc, superGroupe, afficheResultat);
        const texte = this.texteTerminer(clfDoc.type);
        const bouton = Fabrique.bouton.boutonAction('envoi', texte, apiRequêteAction, this.service);
        return bouton;
    }

    annulerEnvoiBon(): KfBouton {
        const clfDocs = this.service.litStock();
        const client = clfDocs.type === 'commande' ? undefined : clfDocs.client;
        const def: IBoutonDef = {
            nom: 'annuler',
            contenu: { texte: this.texteAnnulerVérifier() },
            bootstrap: { type: 'dark' },
            action: () => {
                this.service.routeur.navigueUrlDef(this.service.utile.url.retourDEnvoi(client));
            }
        };
        const bouton = Fabrique.bouton.bouton(def);
        return bouton;
    }

    rafraichitVérifier(info: KfBouton, vérifier: KfBouton): () => void {
        return () => {
            const clfDocs = this.service.litStock();
            const type = clfDocs.type;
            const texteUtile = this.utile.texte.textes(type);
            const infos: KfComposant[] = [];

            let couleur: BootstrapType;
            let etiquette: KfEtiquette;

            clfDocs.créeBilan();
            const prêt = type === 'commande'
                ? clfDocs.clfBilan.total > 0
                : clfDocs.clfBilan.sélectionnés > 0;
            if (prêt) {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.bilanNbAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.vérificationPossible());
                etiquette.ajouteClasse('alert-success');
                couleur = 'success';
            } else {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.bilanRienAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.vérificationImpossible());
                etiquette.ajouteClasse('alert-warning');
                couleur = 'warning';
            }
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: this.texteVérifier(type),
                },
                bootstrap: { type: 'secondary' },
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.envoi(clfDocs));
                },
            });
            vérifier.inactivité = !(this.utile.conditionAction.edite && prêt);
            Fabrique.contenu.fixeDef(info, {
                iconeDef: Fabrique.icone.def.info,
                classeIcone: KfBootstrap.classeTexte({ color: couleur }),
            });
            Fabrique.titrePage.fixePopover(info, '', infos);

        };
    }

    rafraichitAnnulerVérifier(info: KfBouton, vérifier: KfBouton): () => void {
        return () => {
            const clfDocs = this.service.litStockSiExistant();
            if (!clfDocs) {
                return;
            }
            const texteUtile = this.utile.texte.textes(clfDocs.type);
            const client = clfDocs.type === 'commande' ? undefined : clfDocs.client;
            const infos: KfComposant[] = [];

            const etiquette = Fabrique.ajouteEtiquetteP(infos);
            etiquette.ajouteTextes(
                `Le bouton `,
                { texte: this.texteTerminer(clfDocs.type), balise: KfTypeDeBaliseHTML.b },
                ` est en bas de la page.`
            );
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: this.texteAnnulerVérifier(),
                },
                bootstrap: { type: 'dark' },
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.retourDEnvoi(client));
                },
            });
            vérifier.inactivité = false;
            Fabrique.contenu.fixeDef(info, {
                iconeDef: Fabrique.icone.def.info,
                classeIcone: KfBootstrap.classeTexte({ color: 'success' }),
            });
            Fabrique.titrePage.fixePopover(info, '', infos);

        };
    }

    private _btnGroupeDefVérifier(action: 'annuler' | 'vérifier'): IBtnGroupeDef {
        const info = Fabrique.titrePage.boutonInfo('');
        const vérifier = Fabrique.titrePage.boutonAction(action);
        const groupe = Fabrique.titrePage.bbtnGroup('action');
        groupe.ajoute(info);
        groupe.ajoute(vérifier);
        let rafraichit: (barre: IBarreTitre) => void;
        if (action === 'annuler') {
            groupe.afficherSi(this.utile.conditionAction.envoi);
            rafraichit = this.rafraichitAnnulerVérifier(info, vérifier);
        } else {
            groupe.afficherSi(this.utile.conditionAction.edite);
            rafraichit = this.rafraichitVérifier(info, vérifier);
        }
        return {
            groupe,
            rafraichit
        };
    }


    btnGroupeDefVérifier(): IBtnGroupeDef {
        return this._btnGroupeDefVérifier('vérifier');
    }
    btnGroupeDefAnnulerVérifier() {
        return this._btnGroupeDefVérifier('annuler');
    }

}
