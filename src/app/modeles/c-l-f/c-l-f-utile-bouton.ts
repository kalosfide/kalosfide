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
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBtnGroupeDef, IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiDocument } from './api-document';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { CLFDocs } from './c-l-f-docs';

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

    copieLigne(ligne: CLFLigne): KfBouton {
        const bouton = Fabrique.bouton.attenteDeColonne('copie1_' + ligne.no2,
            Fabrique.contenu.copier, this.service.apiRequêteCopieSourceDansAFixer1(ligne), this.service);
        return bouton;
    }

    supprime(ligne: CLFLigne, quandLigneSupprimée: (ligne: CLFLigne) => ((stock: CLFDocs) => void)): KfBouton {
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
                balise: KfTypeDeBaliseHTML.b
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
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteSupprimeLigne(ligne, quandLigneSupprimée(ligne));
        const bouton = Fabrique.bouton.attenteDeColonne('supprime' + ligne.no2,
            Fabrique.contenu.supprime, apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, [description])
        );
        return bouton;
    }

    copieDoc(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = texteUtile.copierBon;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteCopieSourceDansAFixerDoc(doc,
            () => doc.vueTableLigne.quandItemModifié());
        const bouton = Fabrique.bouton.attenteDeColonne('copie_D', Fabrique.contenu.copier,
            apiRequêteAction, this.service, Fabrique.confirmeModal(titre, description));
        bouton.titleHtml = description;
        return bouton;
    }

    copieDocs(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = texteUtile.copierBons;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteCopieSourceDansAFixerDocs(doc,
                () => doc.àSynthétiser.forEach(bon => bon.vueTableLigne.quandItemModifié()));
        const bouton = Fabrique.bouton.attenteDeColonne('copie_T', Fabrique.contenu.copier,
            apiRequêteAction, this.service, Fabrique.confirmeModal(titre, description));
        bouton.titleHtml = description;
        return bouton;
    }

    annuleLigne(ligne: CLFLigne): KfBouton {
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleLigne(ligne);
        const bouton = Fabrique.bouton.attenteDeColonne('annule1',
            Fabrique.contenu.annule, apiRequêteAction, this.service);
        return bouton;
    }

    annuleDoc(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleDoc(doc, () => doc.vueTableLigne.quandItemModifié());
        const bouton = Fabrique.bouton.attenteDeColonne('annuleD',
            Fabrique.contenu.annule, apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, description)
        );
        return bouton;
    }

    annuleDocs(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = this.service.apiRequêteAnnuleDocs(doc,
            () => doc.àSynthétiser.forEach(bon => bon.vueTableLigne.quandItemModifié())
        );
        const bouton = Fabrique.bouton.attenteDeColonne('annuleT',
            Fabrique.contenu.annule, apiRequêteAction, this.service,
            Fabrique.confirmeModal(titre, description)
        );
        return bouton;
    }

    envoi(clfDoc: CLFDoc, superGroupe: KfSuperGroupe, afficheResultat: AfficheResultat): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.envoi(clfDoc);
            },
            actionSiOk: (créé: ApiDocument): void => {
                clfDoc.apiDoc.date = créé.date;
                if (clfDoc.type !== 'commande') {
                    clfDoc.apiDoc.no = créé.no;
                }
                this.service.videStock();
                this.service.changeMode(ModeAction.envoyé);
            },
            afficheResultat,
        };
        const texte = this.utile.texte.textes(clfDoc.type).bouton.terminer;
        const bouton = Fabrique.bouton.boutonAction('envoi', texte, apiRequêteAction, this.service);
        return bouton;
    }

    annulerEnvoiBon(): KfBouton {
        const clfDocs = this.service.litStock();
        const client = clfDocs.type === 'commande' ? undefined : clfDocs.client;
        const def: IBoutonDef = {
            nom: 'annuler',
            contenu: { texte: this.utile.texte.textes(clfDocs.type).bouton.annulerVérifier },
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

            let couleur: Couleur;
            let etiquette: KfEtiquette;

            clfDocs.créeBilan();
            const prêt = type === 'commande'
                ? clfDocs.clfBilan.nbAPréparer > 0
                : clfDocs.clfBilan.nbSélectionnés > 0;
            if (prêt) {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.bilanNbAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.vérificationPossible());
                etiquette.ajouteClasse('alert-success');
                couleur = Couleur.green;
            } else {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.bilanRienAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                etiquette.ajouteTextes(texteUtile.vérificationImpossible());
                etiquette.ajouteClasse('alert-warning');
                couleur = Couleur.warning;
            }
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: texteUtile.bouton.vérifier,
                },
                bootstrap: { type: 'secondary' },
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.envoi(clfDocs));
                },
            });
            vérifier.inactivité = !(this.utile.conditionAction.edite && prêt);
            Fabrique.contenu.fixeDef(info, {
                iconeDef: Fabrique.icone.def.info,
                couleurIcone: couleur,
            });
            Fabrique.titrePage.fixePopover(info, '', infos);

        };
    }

    rafraichitAnnulerVérifier(info: KfBouton, vérifier: KfBouton): () => void {
        return () => {
            const clfDocs = this.service.litStock();
            if (!clfDocs) {
                return;
            }
            const texteUtile = this.utile.texte.textes(clfDocs.type);
            const client = clfDocs.type === 'commande' ? undefined : clfDocs.client;
            const infos: KfComposant[] = [];

            const etiquette = Fabrique.ajouteEtiquetteP(infos);
            etiquette.ajouteTextes(
                `Le bouton `,
                { texte: texteUtile.bouton.terminer, balise: KfTypeDeBaliseHTML.b },
                ` est en bas de la page.`
            );
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: texteUtile.bouton.annulerVérifier,
                },
                bootstrap: { type: 'dark' },
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.retourDEnvoi(client));
                },
            });
            vérifier.inactivité = false;
            Fabrique.contenu.fixeDef(info, {
                iconeDef: Fabrique.icone.def.info,
                couleurIcone: Couleur.green,
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
