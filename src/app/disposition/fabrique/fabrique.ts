import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { FabriqueIcone } from './fabrique-icone';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { FabriqueLien } from './fabrique-lien';
import { FabriqueUrl } from './fabrique-url';
import { FabriqueContenuPhrase } from './fabrique-contenu-phrase';
import { FabriqueBouton } from './fabrique-bouton';
import { BootstrapType, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueVueTable } from './fabrique-vue-table';
import { FabriqueCouleur } from './fabrique-couleurs';
import { FabriqueTitrePage } from './fabrique-titre-page/fabrique-titre-page';
import { FabriqueTexte } from './fabrique-texte';
import { FabriqueEtatSite } from './fabrique-etat-site';
import { FabriqueFormulaire } from './fabrique-formulaire';
import { FabriqueInput, FabriqueListeDéroulante } from './fabrique-input';
import { IKfNgbModalDef, KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfTypeDEvenement, KfTypeDHTMLEvents } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-elements/kf-entree/kf-entree';
import { ApiResultErreur } from 'src/app/api/api-results/api-result-erreur';

export interface IFormulaireGroupeDesBoutons {
    avantBoutons?: KfComposant[];
    boutons: KfBouton[];
    aprèsBoutons?: KfComposant[];
    bootstrapType?: BootstrapType;
    /** défini après création */
    afficheResultat?: AfficheResultat;
}

export interface IMessageMasquable {
    groupe: KfGroupe;
    masquable: KfGroupe;
}

export class FabriqueClasse {
    private pCouleur: FabriqueCouleur;
    private pIcone: FabriqueIcone;
    private pContenu: FabriqueContenuPhrase;
    private pUrl: FabriqueUrl;
    private pLien: FabriqueLien;
    private pBouton: FabriqueBouton;
    private pInput: FabriqueInput;
    private pListeDéroulante: FabriqueListeDéroulante;
    private pVueTable: FabriqueVueTable;
    private pFormulaire: FabriqueFormulaire;
    private pTitrePage: FabriqueTitrePage;
    private pTexte: FabriqueTexte;
    private pEtatSite: FabriqueEtatSite;

    constructor() {
        this.pCouleur = new FabriqueCouleur();
        this.pIcone = new FabriqueIcone(this);
        this.pContenu = new FabriqueContenuPhrase(this);
        this.pUrl = new FabriqueUrl();
        this.pLien = new FabriqueLien(this);
        this.pBouton = new FabriqueBouton(this);
        this.pInput = new FabriqueInput(this);
        this.pListeDéroulante = new FabriqueListeDéroulante(this);
        this.pVueTable = new FabriqueVueTable(this);
        this.pFormulaire = new FabriqueFormulaire(this);
        this.pTitrePage = new FabriqueTitrePage(this);
        this.pTexte = new FabriqueTexte();
        this.pEtatSite = new FabriqueEtatSite(this);
    }

    get couleur(): FabriqueCouleur { return this.pCouleur; }
    get icone(): FabriqueIcone { return this.pIcone; }
    get contenu(): FabriqueContenuPhrase { return this.pContenu; }
    get url(): FabriqueUrl { return this.pUrl; }
    get lien(): FabriqueLien { return this.pLien; }
    get bouton(): FabriqueBouton { return this.pBouton; }
    get input(): FabriqueInput { return this.pInput; }
    get listeDéroulante(): FabriqueListeDéroulante { return this.pListeDéroulante; }
    get vueTable(): FabriqueVueTable { return this.pVueTable; }
    get formulaire(): FabriqueFormulaire { return this.pFormulaire; }
    get titrePage(): FabriqueTitrePage { return this.pTitrePage; }
    get texte(): FabriqueTexte { return this.pTexte; }
    get etatSite(): FabriqueEtatSite { return this.pEtatSite; }

    // alertes
    alerte(nom: string, bootstrapDef: BootstrapType): KfGroupe {
        const groupe = new KfGroupe(nom);
        KfBootstrap.ajouteClasseAlerte(groupe, bootstrapDef);
        return groupe;
    }

    /**
     * Crée une case à cocher avec aspect
     * @param nom nom de la case à cocher
     * @param texte définition du texte du label
     * @param quandChange traitement de l'évènement valuechange de la case à cocher
     * @param tristate si présent et vrai, la case à trois états: undefined, true, false
     */
    caseACocherAspect(caseACocher: KfCaseACocher, tristate?: boolean): KfCaseACocher {
        caseACocher.ajouteClasse({ nom: 'disabled', active: () => caseACocher.inactif });
        const nomIconeCochée = this.icone.def.case_cochée;
        const nomIconeVide = this.icone.def.case_vide;
        const icone = this.icone.icone(nomIconeVide);
        let valeurSiIndéfiniEtClic: boolean;
        if (tristate) {
            caseACocher.ajouteClasse({
                nom: 'undefined',
                active: () => caseACocher.valeur === undefined
            });
            valeurSiIndéfiniEtClic = true;
        }
        const changeAspect: () => void = () => {
            icone.iconeDef = caseACocher.valeur === true ? nomIconeCochée : nomIconeVide;
        };
        caseACocher.fixeAspect(icone, changeAspect, valeurSiIndéfiniEtClic);
        return caseACocher;
    }

    /**
     * Crée une case à cocher
     * @param nom nom de la case à cocher
     * @param texte définition du texte du label
     * @param quandChange traitement de l'évènement valuechange de la case à cocher
     */
    caseACocher(nom: string, texte?: KfStringDef, quandChange?: () => void): KfCaseACocher {
        const caseACocher = new KfCaseACocher(nom, texte);
        caseACocher.géreClasseDiv.ajouteClasse('form-group row');
        caseACocher.géreClasseDivVide.ajouteClasse('col-sm-2');
        caseACocher.géreClasseEntree.ajouteClasse('col-sm-10');

        if (quandChange) {
            caseACocher.gereHtml.suitLaValeur();
            caseACocher.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, quandChange);
        }
        return caseACocher;
    }

    ajouteAide(entrée: KfEntrée, texte?: string): KfEtiquette {
        const etiquette = new KfEtiquette(entrée.nom + '_aide', texte);
        etiquette.ajouteClasse('form-text text-muted');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.small;
        entrée.texteAide = etiquette;
        return etiquette;
    }
    // texte aide des formulaires
    étiquetteAide(nom: string, texte: string): KfEtiquette {
        const etiquette = new KfEtiquette(nom + '_aide', texte);
        etiquette.ajouteClasse('form-text text-muted');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.small;
        return etiquette;
    }

    animeAttenteGlobal(): KfGroupe {
        const groupe = new KfGroupe('animeAttente');
        groupe.visible = false;
        groupe.ajouteClasse('cache-tout');
        const icone = this.icone.iconeAttente(4);
        groupe.ajoute(icone);
        return groupe;
    }

    // etiquettes et texte

    /**
     * Retourne une KfEtiquette dans une balise p au texte justifié si classe n'est pas défini
     * et l'ajoute à l'array si composants est défini
     */
    ajouteEtiquetteP(composants?: KfComposant[], classe?: string): KfEtiquette {
        const e = new KfEtiquette('');
        e.baliseHtml = KfTypeDeBaliseHTML.p;
        e.ajouteClasse(classe ? classe : 'text-justify');
        if (composants) {
            composants.push(e);
        }
        return e;
    }

    confirmeModal(titre: string, contenus: string | KfComposant[], focus?: 'surCroix' | 'surAnnuler' | 'surOk'): KfNgbModal {
        const corps = new KfGroupe('');
        let etiquette: KfEtiquette;
        if (typeof (contenus) === 'string') {
            etiquette = new KfEtiquette('', contenus);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            corps.ajoute(etiquette);
        } else {
            contenus.forEach(c => corps.ajoute(c));
        }
        const boutonAvant = this.bouton.bouton({ nom: 'Annuler', contenu: { texte: 'Annuler' }, bootstrap: { type: 'secondary' } });
        boutonAvant.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        const boutonOk = this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Confirmer' }, bootstrap: { type: 'primary' } });
        boutonOk.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        let autoFocus: 'sans' | KfComposant;
        switch (focus) {
            case 'surCroix':
                break;
            case 'surAnnuler':
                autoFocus = boutonAvant;
                break;
            case 'surOk':
                autoFocus = boutonOk;
                break;
            default:
                autoFocus = 'sans';
                break;
        }
        const def: IKfNgbModalDef = {
            titre,
            corps,
            boutonOk,
            boutonsDontOk: [boutonAvant, boutonOk],
            autoFocus
        };
        const modal = new KfNgbModal(def);
        modal.avecFond = 'static';
        modal.ferméSiEchap = true;
        modal.ajouteClasseTitre('h5');
        return modal;
    }

    private _infoModal(titre: string, corps: KfGroupe): KfNgbModal {
        const boutonOk = this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Fermer' }, bootstrap: { type: 'secondary' } });
        boutonOk.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        const def: IKfNgbModalDef = {
            titre,
            corps,
            boutonOk,
            autoFocus: boutonOk
        };
        const modal = new KfNgbModal(def);
        modal.ferméSiEchap = true;
        modal.windowClass = 'modal-info';
        return modal;
    }

    erreurModal(apiErreur: ApiResultErreur): KfNgbModal {
        const corps = new KfGroupe('');
        corps.créeDivTable();
        corps.ajouteClasse('container-fluid');
        const ligne = corps.divTable.ajoute();
        ligne.géreCss.ajouteClasse('row');
        const icone = this.pIcone.icone(this.pIcone.def.danger);
        icone.taille(2);
        let colonne = ligne.ajoute([icone]);
        colonne.ajouteClasse('col-4');
        const messages: KfEtiquette[] = [];
        let étiquette: KfEtiquette;
        if (apiErreur.action) {
            étiquette = this.ajouteEtiquetteP(messages);
            étiquette.ajouteTextes(apiErreur.action);
            étiquette.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
        }
        apiErreur.messages.forEach(message => {
            étiquette = this.ajouteEtiquetteP(messages);
            étiquette.fixeTexte(message);
        });
        colonne = ligne.ajoute(messages);
        colonne.ajouteClasse('col');
        const modal = this._infoModal(apiErreur.titre, corps);
        modal.ajouteClasseEnTête(KfBootstrap.classeFond('danger'), KfBootstrap.classeTexte({ color: 'white' }));
        return modal;
    }

    infoModal(titre: string, contenus: KfComposant[]): KfNgbModal {
        const corps = new KfGroupe('');
        contenus.forEach(c => corps.ajoute(c));
        return this._infoModal(titre, corps);
    }
}

export const Fabrique = new FabriqueClasse();
