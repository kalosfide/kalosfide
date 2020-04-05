import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { DataUtileBouton } from 'src/app/commun/data-par-key/data-utile-bouton';
import { CLFLigne } from './c-l-f-ligne';
import { CLFDoc } from './c-l-f-doc';
import { CLFService } from './c-l-f.service';
import { IContenuPhraseDef } from 'src/app/disposition/fabrique/fabrique-contenu-phrase';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/commun/api-results/api-result';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ApiRequêteAction } from 'src/app/services/api-requete-action';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { ModeAction } from './condition-action';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { BootstrapNom } from 'src/app/disposition/fabrique/fabrique-bootstrap';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { Couleur } from 'src/app/disposition/fabrique/fabrique-couleurs';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { IBtnGroupeDef, BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { ApiDocument } from './api-document';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';

export class CLFUtileBouton extends DataUtileBouton {
    constructor(utile: CLFUtile) {
        super(utile);
    }

    get utile(): CLFUtile {
        return this._dataUtile as CLFUtile;
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
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => {
                return this.service.copieSourceDansAFixer1(ligne);
            },
            actionSiOk: () => {
                this.service.siCopieSourceDansAFixer1Ok(ligne);
            }
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('copie1_' + ligne.no2,
            Fabrique.contenu.copier, apiRequêteAction, this.service);
        return bouton;
    }

    supprime(ligne: CLFLigne, rafraichitTable: (ligne: CLFLigne) => void, traiteErreur?: (apiResult: ApiResult) => boolean): KfBouton {
        const texteUtile = this.utile.texte.textes(ligne.parent.type);
        const titre = `Suppression d'une ligne`;
        const description = new KfEtiquette('');
        description.baliseHtml = KfTypeDeBaliseHTML.p;
        Fabrique.ajouteTexte(description,
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
                texte: Fabrique.texte.prixAvecUnité(ligne.produit.typeMesure, ligne.prix),
                balise: KfTypeDeBaliseHTML.b
            },
            ' va être supprimée.'
        );
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.supprimeLigne(ligne),
            actionSiOk: () => {
                this.service.siSupprimeLigneOk(ligne);
                rafraichitTable(ligne);
            },
            traiteErreur
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('supprime' + ligne.no2,
            Fabrique.contenu.supprime, apiRequêteAction, this.service,
            Fabrique.confirme(titre, [description])
        );
        return bouton;
    }

    copieDoc(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en copiant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.copieSourceDansAFixerDoc(doc),
            actionSiOk: () => {
                this.service.siCopieSourceDansAFixerDocOk(doc);
            },
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('copie_D', Fabrique.contenu.copier,
            apiRequêteAction, this.service, Fabrique.confirme(titre, description));
        return bouton;
    }

    copieDocs(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en copiant les quantités de tous les ${texteUtile.def.bons}`;
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.copieSourceDansAFixerDocs(doc),
            actionSiOk: () => {
                this.service.siCopieSourceDansAFixerDocsOk(doc);
            },
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('copie_T', Fabrique.contenu.copier,
            apiRequêteAction, this.service, Fabrique.confirme(titre, description));
        return bouton;
    }

    annuleLigne(ligne: CLFLigne): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.annuleLigne(ligne),
            actionSiOk: () => {
                this.service.siAnnuleLigneOk(ligne);
            },
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('annule1',
            Fabrique.contenu.annule, apiRequêteAction, this.service);
        return bouton;
    }

    annuleDoc(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.synthèse.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.annuleDoc(doc),
            actionSiOk: () => {
                this.service.siAnnuleDocOk(doc);
            },
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('annuleD',
            Fabrique.contenu.annule, apiRequêteAction, this.service,
            Fabrique.confirme(titre, description)
        );
        return bouton;
    }

    annuleDocs(doc: CLFDoc): KfBouton {
        const texteUtile = this.utile.texte.textes(doc.type);
        const titre = `Remplissage automatique`;
        const description = `${texteUtile.Le_doc} sera préparé en annulant les quantités du ${texteUtile.def.bon}`;
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: null,
            demandeApi: () => this.service.annuleDocs(doc),
            actionSiOk: () => {
                this.service.siAnnuleDocsOk(doc);
            },
        };
        const bouton = Fabrique.bouton.boutonAttenteDeColonne('annuleT',
            Fabrique.contenu.annule, apiRequêteAction, this.service,
            Fabrique.confirme(titre, description)
        );
        return bouton;
    }

    envoieBon(clfDoc: CLFDoc, superGroupe: KfSuperGroupe, afficheResultat: AfficheResultat): KfBouton {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.envoieBon(clfDoc);
            },
            actionSiOk: (créé: ApiDocument): void => {
                clfDoc.apiDoc.date = créé.date;
                if (clfDoc.type !== 'commande') {
                    clfDoc.apiDoc.no = créé.no;
                }
                this.service.quandEnvoyé();
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
            bootstrapType: BootstrapNom.dark,
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
                Fabrique.ajouteTexte(etiquette, texteUtile.bilanNbAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                Fabrique.ajouteTexte(etiquette, texteUtile.vérificationPossible());
                etiquette.ajouteClasseDef('alert-success');
                couleur = Couleur.green;
            } else {
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                Fabrique.ajouteTexte(etiquette, texteUtile.bilanRienAVérifier(clfDocs.clfBilan));
                etiquette = Fabrique.ajouteEtiquetteP(infos);
                Fabrique.ajouteTexte(etiquette, texteUtile.vérificationImpossible());
                etiquette.ajouteClasseDef('alert-warning');
                couleur = Couleur.warning;
            }
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: texteUtile.bouton.vérifier,
                },
                bootstrapType: 'secondary',
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.envoi(clfDocs));
                },
            });
            vérifier.inactivité = !(this.utile.conditionAction.edite && prêt);
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
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
            Fabrique.ajouteTexte(etiquette,
                `Le bouton `,
                { texte: texteUtile.bouton.terminer, balise: KfTypeDeBaliseHTML.b },
                ` est en bas de la page.`
            );
            Fabrique.bouton.fixeDef(vérifier, {
                nom: 'vérifier',
                contenu: {
                    texte: texteUtile.bouton.annulerVérifier,
                },
                bootstrapType: 'dark',
                action: () => {
                    this.service.routeur.navigueUrlDef(this.service.utile.url.retourDEnvoi(client));
                },
            });
            vérifier.inactivité = false;
            Fabrique.contenu.fixeDef(info, {
                nomIcone: Fabrique.icone.nomIcone.info,
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
        let rafraichit: (barre: BarreTitre) => void;
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
