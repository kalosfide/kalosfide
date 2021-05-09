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
import { BootstrapType, IKfBootstrapOptions, KfBootstrap } from '../../commun/kf-composants/kf-partages/kf-bootstrap';
import { FabriqueVueTable } from './fabrique-vue-table';
import { FabriqueCouleur, Couleur } from './fabrique-couleurs';
import { FabriqueTitrePage } from './fabrique-titre-page/fabrique-titre-page';
import { DefContenus, DefsTextes, FabriqueTexte, IDefTexte } from './fabrique-texte';
import { FabriqueEtatSite } from './fabrique-etat-site';
import { FabriqueFormulaire } from './fabrique-formulaire';
import { FabriqueInput, FabriqueListeDéroulante } from './fabrique-input';
import { IKfNgbModalDef, KfNgbModal } from 'src/app/commun/kf-composants/kf-ngb-modal/kf-ngb-modal';
import { KfTypeDEvenement } from 'src/app/commun/kf-composants/kf-partages/kf-evenements';
import { KfEntrée } from 'src/app/commun/kf-composants/kf-elements/kf-entree/kf-entree';
import { KfTypeContenuPhrasé } from 'src/app/commun/kf-composants/kf-partages/kf-contenu-phrase/kf-contenu-phrase';
import { ApiResultErreur } from 'src/app/api/api-results/api-result-erreur';
import { FANomIcone } from 'src/app/commun/kf-composants/kf-partages/kf-icone-def';

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
        KfBootstrap.ajouteClasse(groupe, 'alert', bootstrapDef);
        return groupe;
    }

    get optionsBootstrap(): {
        formulaire: IKfBootstrapOptions,
        dansVueTable: IKfBootstrapOptions,
    } {
        return {
            formulaire: {
                label: 'labelFlottant' // { breakpoint: 'sm', width: 2 }
            },
            dansVueTable: { label: 'nePasAfficherLabel' },
        };
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
        const nomIconeCochée = this.icone.nomIcone.case_cochée;
        const nomIconeVide = this.icone.nomIcone.case_vide;
        const icone = this.icone.icone({ nom: nomIconeVide, regular: true });
        let valeurSiIndéfiniEtClic: boolean;
        if (tristate) {
            caseACocher.ajouteClasse({
                nom: 'undefined',
                active: () => caseACocher.valeur === undefined
            });
            valeurSiIndéfiniEtClic = true;
        }
        const changeAspect: () => void = () => {
                icone.nomIcone = {
                    nom: caseACocher.valeur === true ? nomIconeCochée : nomIconeVide,
                    regular: true
                };
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
    caseACocher(nom: string, texte?: KfTexteDef, quandChange?: () => void): KfCaseACocher {
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
     * retourne une KfEtiquette dans une balise p au texte justifié si classe est défini
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
     * ajoute à une étiquette des KfTexte avec balise Html, retourne l'array des KfTexte créés
     * @param etiquette où ajouter le texte
     * @param texte string à ajouter
     * @param baliseHtml balise Html pour entourer le texte
     */
    ajouteTexte(etiquette: KfEtiquette, ...textes: DefsTextes[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.kfTextes(...textes);
        etiquette.contenuPhrase.contenus.push(...kfTextes);
        return kfTextes;
    }
    fixeTexte(etiquette: KfEtiquette, ...textes: DefsTextes[]): KfTexte[] {
        const kfTextes: KfTexte[] = this.kfTextes(...textes);
        etiquette.contenuPhrase.contenus = kfTextes;
        return kfTextes;
    }
    kfTextes(...textes: DefsTextes[]): KfTexte[] {
        const kfTextes: KfTexte[] = [];
        textes.forEach(t => {
            const kfTexte = new KfTexte('', '');
            if (typeof (t) === 'string') {
                kfTexte.fixeTexte(t);
            } else {
                if (Array.isArray(t)) {
                    t.forEach(t1 => kfTextes.push(...this.kfTextes(t1)));
                } else {
                    if (t.nom) {
                        kfTexte.nom = t.nom;
                    }
                    kfTexte.fixeTexte(t.texte);
                    if (t.balise) {
                        kfTexte.balisesAAjouter = [t.balise];
                    }
                    kfTexte.suiviDeSaut = t.suiviDeSaut;
                    if (t.classe) {
                        kfTexte.ajouteClasse(t.classe);
                    }
                }
            }
            kfTextes.push(kfTexte);
        });
        return kfTextes;
    }

    supprimeContenus(étiquette: KfEtiquette) {
        étiquette.contenuPhrase.contenus = [];
    }
    ajouteString(étiquette: KfEtiquette, texte: string) {
        const kfTexte = new KfTexte('', '');
        kfTexte.fixeTexte(texte);
        étiquette.contenuPhrase.contenus.push(kfTexte);
    }
    ajouteDefTexte(étiquette: KfEtiquette, t: IDefTexte) {
        const kfTexte = new KfTexte('', '');
        if (t.nom) {
            kfTexte.nom = t.nom;
        }
        kfTexte.fixeTexte(t.texte);
        if (t.balise) {
            kfTexte.balisesAAjouter = [t.balise];
        }
        kfTexte.suiviDeSaut = t.suiviDeSaut;
        if (t.classe) {
            kfTexte.ajouteClasse(t.classe);
        }
        étiquette.contenuPhrase.contenus.push(kfTexte);
    }
    ajouteContenu(étiquette: KfEtiquette, defContenu: DefContenus) {
        if (typeof (defContenu) === 'string') {
            this.ajouteString(étiquette, defContenu);
            return;
        }
        if (Array.isArray(defContenu)) {
            this.ajouteContenu(étiquette, defContenu);
            return;
        }
        if ((defContenu as KfTypeContenuPhrasé).type) {
            étiquette.contenuPhrase.contenus.push(defContenu as KfTypeContenuPhrasé);
        }
        this.ajouteDefTexte(étiquette, defContenu as IDefTexte);
    }

    confirmeModal(titre: string, contenus: string | KfComposant[], annulation?: string): KfNgbModal {
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

    erreurModal(apiErreur: ApiResultErreur): KfNgbModal {
        const corps = new KfGroupe('');
        corps.créeDivTable();
        corps.divTable.ajouteClasse('container-fluid');
        const ligne = corps.divTable.ajoute();
        ligne.ajouteClasse('row');
        const icone = this.pIcone.icone(this.pIcone.nomIcone.danger);
        icone.taille(5);
        let colonne = ligne.ajoute([icone]);
        colonne.ajouteClasse('col-md-4');
        const messages: KfEtiquette[] = [];
        apiErreur.messages.forEach(message => {
            const etiquette = this.ajouteEtiquetteP(messages);
            etiquette.fixeTexte(message);
        });
        colonne = ligne.ajoute(messages);
        colonne.ajouteClasse('col');
        const def: IKfNgbModalDef = {
            titre: apiErreur.titre,
            corps,
            boutonOk: this.bouton.bouton({ nom: 'Ok', contenu: { texte: 'Fermer' }, bootstrapType: 'primary' }),
        };
        const modal = new KfNgbModal(def);
        modal.ferméSiEchap = true;
        modal.windowClass = 'modal-info';
        modal.ajouteClasseEnTête(this.couleur.classeCouleurFond(Couleur.red), this.couleur.classeCouleur(Couleur.white));
        modal.ajouteClasseCroix('kf-invisible');
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
