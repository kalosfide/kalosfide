import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfTexteDef } from 'src/app/commun/kf-composants/kf-partages/kf-texte-def';
import { FabriqueIcone } from './fabrique-icone';
import { KfCaseACocher } from 'src/app/commun/kf-composants/kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { FabriqueLien } from './fabrique-lien';
import { FabriqueUrl } from './fabrique-url';
import { FabriqueContenuPhrase } from './fabrique-contenu-phrase';
import { FabriqueBouton } from './fabrique-bouton';
import { BootstrapType, FabriqueBootstrap } from './fabrique-bootstrap';
import { FabriqueVueTable } from './fabrique-vue-table';
import { FabriqueCouleur, Couleur } from './fabrique-couleurs';
import { FabriqueTitrePage } from './fabrique-titre-page/fabrique-titre-page';
import { FabriqueTexte } from './fabrique-texte';
import { FabriqueEtatSite } from './fabrique-etat-site';
import { FabriqueFormulaire } from './fabrique-formulaire';
import { FabriqueInput, FabriqueListeDéroulante } from './fabrique-input';
import { IKfNgbModalDef, KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';

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
        FabriqueBootstrap.ajouteClasse(groupe, 'alert', bootstrapDef);
        return groupe;
    }

    // case à cocher
    caseACocher(nom: string, texte?: KfTexteDef, quandChange?: () => void): KfCaseACocher {
        const caseACocher = new KfCaseACocher(nom, texte);
        caseACocher.géreClasseDiv.ajouteClasseDef('form-group row');
        caseACocher.géreClasseDivVide.ajouteClasseDef('col-sm-2');
        caseACocher.géreClasseEntree.ajouteClasseDef('col-sm-10');
        const nomIcone = (valeur: boolean) => valeur
            ? Fabrique.icone.nomIcone.case_cochée
            : Fabrique.icone.nomIcone.case_vide;
        const icone = Fabrique.icone.icone(nomIcone(false));
        const fixe = (valeur: boolean) => icone.nomIcone = nomIcone(valeur);

        caseACocher.fixeAspect(icone, fixe);

        if (quandChange) {
            caseACocher.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, quandChange);
        }
        return caseACocher;
    }

    // case à cocher
    caseACocherSansAspect(nom: string, texte?: KfTexteDef, quandChange?: () => void): KfCaseACocher {
        const caseACocher = new KfCaseACocher(nom, texte);
        caseACocher.géreClasseDiv.ajouteClasseDef('form-group row');
        caseACocher.géreClasseDivVide.ajouteClasseDef('col-sm-2');
        caseACocher.géreClasseEntree.ajouteClasseDef('col-sm-10');

        if (quandChange) {
            caseACocher.gereHtml.ajouteTraiteur(KfTypeDEvenement.valeurChange, quandChange);
        }
        return caseACocher;
    }

    // texte aide des formulaires
    texteAide(nom: string, texte: string): KfEtiquette {
        const etiquette = new KfEtiquette(nom + '_aide', texte);
        etiquette.ajouteClasseDef('form-text text-muted');
        etiquette.baliseHtml = KfTypeDeBaliseHTML.small;
        return etiquette;
    }

    animeAttenteGlobal(): KfGroupe {
        const groupe = new KfGroupe('animeAttente');
        groupe.visible = false;
        groupe.ajouteClasseDef('plein-ecran');
        groupe.fixeStyleDef('opacity', '.33');
        groupe.fixeStyleDef('background-color', 'antiquewhite');
        const icone = this.icone.iconeAttente(4);
        groupe.ajoute(icone);
        return groupe;
    }

    // etiquettes et texte

    /**
     * retourne une KfEtiquette dans une balise p au texte justifié si classe est défini
     * et l'ajoute à l'array si composants est défini
     */
    ajouteEtiquetteP(composants?: KfComposant[], classe?: string): KfEtiquette {
        const e = new KfEtiquette('');
        e.baliseHtml = KfTypeDeBaliseHTML.p;
        e.ajouteClasseDef(classe ? classe : 'text-justify');
        if (composants) {
            composants.push(e);
        }
        return e;
    }

    /**
     * ajoute à une étiquette des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param etiquette où ajouter le texte
     * @param texte string à ajouter
     * @param baliseHtml balise Html pour entourer le texte
     */
    ajouteTexte(etiquette: KfEtiquette, ...textes: (string | {
        texte: string,
        balise?: KfTypeDeBaliseHTML,
        suiviDeSaut?: boolean
    })[]): KfTexte[] {
        const kfTextes: KfTexte[] = textes.map(t => {
            let texte: string;
            let baliseHtml: KfTypeDeBaliseHTML;
            let suiviDeSaut: boolean;
            if (typeof (t) === 'string') {
                texte = t;
            } else {
                texte = t.texte;
                baliseHtml = t.balise;
                suiviDeSaut = t.suiviDeSaut;
            }
            const kfTexte = new KfTexte('', texte);
            if (baliseHtml) {
                kfTexte.balisesAAjouter = [baliseHtml];
            }
            kfTexte.suiviDeSaut = suiviDeSaut;
            etiquette.contenuPhrase.ajoute(kfTexte);
            return kfTexte;
        });
        return kfTextes;
    }

    confirme(titre: string, contenus: string | KfComposant[], annulation?: string): KfNgbModal {
        const corps = new KfGroupe('');
        let etiquette: KfEtiquette;
        if (typeof (contenus) === 'string') {
            etiquette = new KfEtiquette('', contenus);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            corps.ajoute(etiquette);
        } else {
            contenus.forEach(c => corps.ajoute(c));
        }
        if (annulation) {
            etiquette = new KfEtiquette('', annulation);
            etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
            corps.ajoute(etiquette);
        }
        const boutonAvant = this.bouton.bouton({ nom: 'Annuler', contenu: { texte: 'Annuler' }, bootstrapType: 'secondary' });
        const boutonOk = this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Confirmer' }, bootstrapType: 'primary' });
        const def: IKfNgbModalDef = {
            titre,
            corps,
            boutonOk,
            boutonsDontOk: [boutonAvant, boutonOk]
        };
        const modal = new KfNgbModal(def);
        modal.avecFond = 'static';
        modal.ferméSiEchap = true;
        modal.windowClass = 'modal-confirme';
        return modal;
    }

    infoModal(titre: string, contenus: KfComposant[]): KfNgbModal {
        const corps = new KfGroupe('');
        contenus.forEach(c => corps.ajoute(c));
        const def: IKfNgbModalDef = {
            titre,
            corps,
            boutonOk: this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Fermer' }, bootstrapType: 'primary' }),
        };
        const modal = new KfNgbModal(def);
        modal.ferméSiEchap = true;
        modal.windowClass = 'modal-info';
        return modal;
    }
}

export const Fabrique = new FabriqueClasse();
