import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant, KfTypeDeValeur } from '../kf-composants-types';
import { AbstractControl, FormArray } from '@angular/forms';
import { Liste } from '../../outils/liste';
import { KfListeCommandes, KfCommandesDeListeInterface } from './kf-liste-commandes';
import { KfListeCreeItemsInterface, KfListeCreeItems } from './kf-liste-cree-items';
import { KfListeSelecteurs, KfListeSelecteursInterface } from './kf-liste-selecteurs';
import { KfGereTabIndex } from '../kf-composant/kf-composant-gere-tabindex';
import { KfListeEditions, KfListeEditionsInterface } from './kf-liste-editions';
import { KfComposantGereValeur } from '../kf-composant/kf-composant-gere-valeur';

/**
 * maintient une liste qui contient des KfComposants ou des objects associés à un KfComposant par un KfListeCreeItems
 * item: object; contenu: KfComposant associé (peut être item lui-même)
 * si chaque contenu a une valeur et un abstractControl, la KfListe a une valeur et un formArray
 */
export class KfListe extends KfComposant {

    /**
     * stocke les items
     * possède les méthodes habituelles mais aussi un index et des propriétés d'ordre, de tri automatique et d'interdiction des doublons
     */
    liste: Liste;

    // CONTENUS
    // pour éviter que ce fichier ne devienne trop gros, la gestion des items est déléguée à un gestionnaire séparé
    /**
     * rassemble les méthodes de la liste pour créer des items et leur associer leur KfComposant
     */
    creeItems: KfListeCreeItems;

    // EDITION
    editions: KfListeEditions;

    // COMMANDES
    /**
     * pour éviter que ce fichier ne devienne trop gros
     *  la gestion des actions (ajouter, supprimer, monter, descendre, ...) est déléguée à un gestionnaire séparé
     */
    commandes: KfListeCommandes;

    // DISPOSITION
    // pour éviter que ce fichier ne devienne trop gros, la gestion des  sélecteurs des items est déléguée à un gestionnaire séparé
    /**
     * rassemble les méthodes de la liste pour associer des sélecteurs aux items
     */
    selecteurs: KfListeSelecteurs;

    // QUANDINDEXChANGE


    // CONSTRUCTEUR
    /**
    * @param nom identifiant unique dans le groupe ou la liste parent
    * @param creeItemsInterface la liste a une valeur si défini;
    */
    constructor(nom: string,
        creeItemsInterface: KfListeCreeItemsInterface,
        editionsInterface: KfListeEditionsInterface,
        commandesInterface?: KfCommandesDeListeInterface,
        selecteursInterface?: KfListeSelecteursInterface
    ) {
        super(nom, KfTypeDeComposant.liste);
        this.liste = new Liste;

        this.creeItems = new KfListeCreeItems(this, creeItemsInterface);
        this.editions = new KfListeEditions(this, editionsInterface);
        this.commandes = new KfListeCommandes(this, commandesInterface);
        if (selecteursInterface) {
            this.selecteurs = new KfListeSelecteurs(this, selecteursInterface);
            this.gereVisible.avecUnSeulContenuVisible(
                // contenus
                () => this.contenus,
                // index du seul visible
                () => this.liste.index,
                // aucun contenu visible
                () => this.liste.index === -1
            );
        }
        this.ajouteClasseDef('kf-liste');
    }

    créeGereValeur() {
        this.gereValeur = new KfComposantGereValeur(this, KfTypeDeValeur.avecListe);
    }

    // INITIALISATION

    get valeurs(): any[] {
        return this.gereValeurs.map((c: KfComposantGereValeur) => c.valeur);
    }
    get controls(): AbstractControl[] {
        return this.gereValeurs.map((c: KfComposantGereValeur) => c.abstractControl);
    }

    // DONNEES
    get valeur(): any[] {
        return this.gereValeur.valeur;
    }
    set valeur(valeur: any[]) {
        this.gereValeur.valeur = valeur;
    }

    // INTERFACE
    get formArray(): FormArray {
        return this.gereValeur.abstractControl as FormArray;
    }

    get avecLiens(): boolean {
        return this.selecteurs && this.selecteurs.avecLiens;
    }

    // CHOISI
    fixeChoisi(item: object) {
        if (!item) {
            this.liste.index = -1;
            return;
        }
        const index = this.liste.IndexDe(item);
        if (index && this.editions.ajoutEnCours) {
            console.log('A faire: lancer avertissement');
            return;
        }
        console.log('fixeChoisi', this.liste.index, index, this);
        this.liste.index = index;
        if (this.editions.editeur) {
            this.editions.editeur.quandIndexChange();
        }
    }

    trouveItem(texteId: string): object {
        const id = Number.parseInt(texteId, 10);
        if (this.creeItems.avecIds) {
            const item = this.editions.itemNouveau;
            if (item && this.creeItems.id(item) === id) {
                return item;
            }
            return this.liste.Objets.find(o => this.creeItems.id(o) === id);
        }
    }

    /** retourne le segment de route conduisant à l'édition de l'item */
    get idEdition(): number {
        if (this.creeItems.avecIds) {
            let item = this.liste.ObjetEnCours;
            if (!item) {
                item = this.editions.itemNouveau;
            }
            if (item) {
                return this.creeItems.id(item);
            }
        }
    }

    get debugIds(): any {
        if (this.creeItems.avecIds) {
            return this.creeItems.debugIds;
        }
    }

    // LISTE

    /**
     * array des items
     */
    get items(): object[] {
        return this.liste.Objets;
    }

    /**
     * array des gereValeurs des items
     */
    get gereValeurs(): KfComposantGereValeur[] {
        return this.items.map((item: object) => this.creeItems.gereValeur(item));
    }

    /**
     * retourne le contenu associé à un item s'il existe
     */
    contenuDeItem(item: object): KfComposant {
        return this.creeItems.composant(item);
    }

    /**
     * retourne l'item associé à un contenu s'il existe
     */
    itemDeContenu(contenu: KfComposant): object {
        return this.items.find((item: object) => this.creeItems.composant(item) === contenu);
    }

    /**
     * array des contenus des items
     */
    get contenus(): KfComposant[] {
        return this.items.map((item: object) => this.contenuDeItem(item));
    }

    /**
     * retourne l'item en cours s'il y en a un
     */
    get itemChoisi(): object {
        return this.liste.ObjetEnCours;
    }

    /**
     * retourne le contenu en cours de la liste s'il y en a un
     */
    get contenuChoisi(): KfComposant {
        if (this.liste.index !== -1) {
            return this.contenuDeItem(this.liste.ObjetEnCours);
        }
    }

    /**
     * s'il y des sélecteurs, retourne le sélecteur en cours
     */
    get selecteurChoisi(): KfComposant {
        if (this.selecteurs) {
            if (this.liste.index !== -1) {
                return this.selecteurs.selecteur(this.liste.ObjetEnCours);
            }
        }
    }

    /**
     * ajoute(composant: )
     */
    préparePourAjout(item: object) {
        this.editions.préparePourAjout(item);
        const contenu = this.contenuDeItem(item);
        contenu.visibilitéFnc = () => contenu === this.contenuChoisi;
        contenu.listeParent = this;
    }
    ajoute(item: object) {
        this.préparePourAjout(item);
        this.liste.Ajoute(item);
        if (this.formArray) {
            this.formArray.insert(this.liste.index, this.creeItems.gereValeur(item).abstractControl);
        }
        if (this.selecteurs) {
            this.selecteurs.ajoute(item);
        }
        console.log('ajoute', this.debugIds);
    }
    supprime(index?: number) {
        index = index ? index : this.liste.index;
        const item: object = this.liste.Objet(index);
        this.liste.Supprime(index);
        if (this.formArray) {
            this.formArray.removeAt(index);
        }
        if (this.selecteurs) {
            this.selecteurs.supprime(item);
        }
        console.log('supprime', this.debugIds);
    }
    effaceTout() {
        this.liste.Vide();
        while (this.formArray.controls.length > 0) {
            this.formArray.removeAt(0);
        }
        if (this.selecteurs) {
            this.selecteurs.effaceTout();
        }
        console.log('effaceTout', this.debugIds);
    }
    remplit(items: object[]) {
        while (this.formArray.controls.length > 0) {
            this.formArray.removeAt(0);
        }
        items.forEach(i => this.ajoute(i));
        this.liste.Remplit(items);
        if (this.selecteurs) {
            this.selecteurs.remplit();
        }
        console.log('remplit', this.debugIds);
    }
    monte() {
        if (this.formArray) {
            const index = this.liste.index;
            const encours = this.formArray.controls[index];
            this.formArray.removeAt(index);
            this.formArray.insert(index - 1, encours);
        }
        this.liste.Monte();
        console.log('monte', this.debugIds);
    }
    descend() {
        if (this.formArray) {
            const index = this.liste.index;
            const encours = this.formArray.controls[index];
            this.formArray.removeAt(index);
            this.formArray.insert(index + 1, encours);
        }
        this.liste.Descend();
        console.log('descend', this.debugIds);
    }

    // COMMANDES
    get positionCommandes(): number {
        if (!this.commandes) {
            return -1;
        }
        return this.commandes.position;
    }
    quandListeChange() {
        if (this.formArray) {
            this.formArray.markAsDirty();
        }
        if (this.gereTabIndex) {
            this.gereTabIndex.rafraichit();
        }
        this.prendLeFocus();
    }

    // HTML
    get divListe(): HTMLDivElement {
        return this.gereHtml.htmlElement as HTMLDivElement;
    }

    // NAVIGATION AU CLAVIER

    navigueAuClavier() {
        if (this.selecteurs) {
            this.gereTabIndex = new KfGereTabIndex(this, {
                contenus: (): KfComposant[] => this.liste.Objets.map(o => this.selecteurs.selecteur(o)),
                liéAChoisi: (): KfComposant => this.selecteurChoisi
            });
        }
    }

    get composantAFocus(): KfComposant {
        let composantAFocus: KfComposant;
        if (this.itemChoisi) {
            if (this.selecteurs) {
                composantAFocus = this.selecteurChoisi;
            } else {
                composantAFocus = this.contenuChoisi;
            }
        } else {
            composantAFocus = this.commandes.boutonNouveau;
        }
        return composantAFocus;
    }

    _prendLeFocus(): boolean {
        const composantAFocus = this.composantAFocus;
        //        console.log('composantAFocus', composantAFocus);
        if (composantAFocus) {
            composantAFocus.prendLeFocus();
            return true;
        }
    }

}
