import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfStringDef } from 'src/app/commun/kf-composants/kf-partages/kf-string-def';
import { FabriqueIcone } from './fabrique-icone';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { FabriqueLien, ILienDef } from './fabrique-lien';
import { FabriqueUrl, IUrlDef } from './fabrique-url';
import { FabriqueContenuPhrasé, IContenuPhraséDef } from './fabrique-contenu-phrase';
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
import { KfContenuPhraséDef } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';

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
    private pContenu: FabriqueContenuPhrasé;
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
        this.pContenu = new FabriqueContenuPhrasé(this);
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
    get contenu(): FabriqueContenuPhrasé { return this.pContenu; }
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
    alerte(nom: string,
        type: BootstrapType,
        titre?: string,
        message?: KfContenuPhraséDef | KfContenuPhraséDef[][],
        solutionTexte?: string,
        solutionUrlDef?: IUrlDef,
        solutionLien?: string
    ): KfGroupe {
        const groupe = new KfGroupe(nom);
        KfBootstrap.ajouteClasseAlerte(groupe, type);
        let étiquette: KfEtiquette;
        if (titre) {
            étiquette = this.ajouteEtiquetteP();
            étiquette.fixeTexte(titre);
            étiquette.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
            groupe.ajoute(étiquette);
        }
        if (message) {
            const ajouteMessage = (m: KfContenuPhraséDef | KfContenuPhraséDef[]) => {
                étiquette = this.ajouteEtiquetteP();
                étiquette.fixeContenus(m);
                groupe.ajoute(étiquette);
            };
            if (Array.isArray(message)) {
                message.forEach(m => ajouteMessage(m));
            } else {
                ajouteMessage(message);
            }
        }
        if (solutionTexte) {
            étiquette = this.ajouteEtiquetteP();
            const lienDef: ILienDef = { urlDef: solutionUrlDef };
            if (solutionLien) {
                lienDef.contenu = { texte: solutionLien };
            }
            const lien = this.lien.dansAlerte(this.lien.enLigne(lienDef));
            étiquette.fixeContenus(
                solutionTexte,
                lien
            );
            groupe.ajoute(étiquette);
        }
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
        /*
        caseACocher.géreClasseDiv.ajouteClasse('form-group row');
        caseACocher.géreClasseDivVide.ajouteClasse('col-sm-2');
        caseACocher.géreClasseEntree.ajouteClasse('col-sm-10');
        */
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

    /**
     * Etiquette ayant l'aspect d'un lien de colonne de vueTable
     */
    étiquetteLien(contenuDef: IContenuPhraséDef): KfEtiquette {
        const étiquette = new KfEtiquette('');
        this.contenu.fixeDef(étiquette, contenuDef);
        étiquette.ajouteClasse(KfBootstrap.classeBouton({ type: 'link' }), KfBootstrap.classeSpacing('padding', 'tous', 0));
        return étiquette;
    };

    // modals

    confirmeModal(titre: string, typeTitre: BootstrapType, contenus: string | KfComposant[],
        texteBouton?: { ok?: string, annuler?: string }, focus?: 'surCroix' | 'surAnnuler' | 'surOk'): KfNgbModal {
        const corps = new KfGroupe('');
        let etiquette: KfEtiquette;
        if (typeof (contenus) === 'string') {
            etiquette = new KfEtiquette('', contenus);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            corps.ajoute(etiquette);
        } else {
            contenus.forEach(c => corps.ajoute(c));
        }
        const boutonAnnuler = this.bouton.bouton({
            nom: 'Annuler',
            contenu: { texte: texteBouton && texteBouton.annuler ? texteBouton.annuler : 'Annuler' },
            bootstrap: { type: 'secondary', outline: 'outline'}
        });
        boutonAnnuler.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        const boutonOk = this.bouton.bouton({
            nom: 'Ok',
            contenu: { texte: texteBouton && texteBouton.ok ? texteBouton.ok : 'Confirmer' },
            bootstrap: { type: 'danger', outline: 'outline' }
        });
        boutonOk.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
        let autoFocus: 'sans' | KfComposant;
        switch (focus) {
            case 'surCroix':
                break;
            case 'surAnnuler':
                autoFocus = boutonAnnuler;
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
            boutonsDontOk: [boutonAnnuler, boutonOk],
            autoFocus,
            déplaçable: true,
            curseurDéplacement: true
        };
        const modal = new KfNgbModal(def);
        modal.avecFond = 'static';
        modal.ferméSiEchap = true;
        modal.titre.ajouteClasse('h5');
        modal.enTete.ajouteClasse(KfBootstrap.classe('alert', typeTitre));
        return modal;
    }

    private _infoModal(titre: string, corps: KfGroupe): KfNgbModal {
        const boutonOk = this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Fermer' }, bootstrap: { type: 'dark', outline: 'outline' } });
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
        const icone = this.pIcone.icone(this.pIcone.def.danger);
        icone.taille(2);
        icone.ajouteClasse(KfBootstrap.classeSpacing('margin', 'droite', 2))

        let étiquette: KfEtiquette;
        if (apiErreur.action) {
            étiquette = this.ajouteEtiquetteP();
            étiquette.ajouteContenus(icone);
            const kfTexte = étiquette.ajouteTextes(apiErreur.action)[0];
            kfTexte.ajouteClasse(KfBootstrap.classeTexte({ poids: 'bold' }));
            corps.ajoute(étiquette);
        }
        apiErreur.messages.forEach(message => {
            étiquette = this.ajouteEtiquetteP();
            étiquette.fixeTexte(message);
            corps.ajoute(étiquette);
        });
        
        const modal = this._infoModal(apiErreur.titre, corps);
        modal.enTete.ajouteClasse(KfBootstrap.classe('alert', 'danger'), KfBootstrap.classeTexte({ poids: 'bold' }));
        return modal;
    }

    infoModal(titre: string, contenus: KfComposant[], type: BootstrapType): KfNgbModal {
        const corps = new KfGroupe('');
        contenus.forEach(c => corps.ajoute(c));
        const modal = this._infoModal(titre, corps);
        modal.enTete.ajouteClasse(KfBootstrap.classe('alert', type));
        return modal;
    }
}

export const Fabrique = new FabriqueClasse();
