import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Site } from 'src/app/modeles/site/site';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { ActivatedRoute, Data } from '@angular/router';
import { CLFService } from './c-l-f.service';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { RouteurService } from 'src/app/services/routeur.service';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { IBarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { KfComposant } from 'src/app/commun/kf-composants/kf-composant/kf-composant';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { CLFDoc } from './c-l-f-doc';
import { CLFUtile } from './c-l-f-utile';
import { CLFDocs } from './c-l-f-docs';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { ModeAction } from './condition-action';
import { ILienDef } from 'src/app/disposition/fabrique/fabrique-lien';
import { KfVueTableLigne } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-ligne';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';

/**
 * Route: ./client/:key/bons
 * Page de choix du bon à éditer et de sélection des bons à synthétiser du client.
 * Table des bons du client avec leur état de préparation, lien vers ./client/:key/doc/:no et case de sélection.
 * Bouton: Vérifier.
 */
@Component({ template: '' })
export abstract class CLFBonsComponent extends PageTableComponent<CLFDoc> implements OnInit, OnDestroy {

    site: Site;

    date: Date;

    clfDocs: CLFDocs;
    document: CLFDoc;

    étiquetteSélectionnez: KfEtiquette;
    étiquetteSélectionnés: KfEtiquette;
    étiquetteAnnulésSéléctionnés: KfEtiquette;
    étiquetteAnnulésNonSéléctionnés: KfEtiquette;

    boutonCréer: KfBouton;
    groupeCréer: KfGroupe;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get routeur(): RouteurService { return this.service.routeur; }
    get utile(): CLFUtile { return this.service.utile; }

    get texteUtile() {
        return this.utile.texte.textes(this.clfDocs.type);
    }

    créeBarreTitre = (): IBarreTitre => {
        const barre = Fabrique.titrePage.barreTitre({
            pageDef: this.pageDef,
            contenuAidePage: this.contenuAidePage(),
        });

        this.barre = barre;

        return barre;
    }

    protected contenuAidePage(): KfComposant[] {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Ceci est `,
            { texte: 'à faire', balise: KfTypeDeBaliseHTML.b },
            '.'
        );

        return infos;
    }

    private infosBonVirtuel(): KfBouton {
        const infos: KfComposant[] = [];

        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(
            `Indépendamment des ${this.texteUtile.def.bons} du client, vous pouvez ajouter des lignes à`
            + ` ${this.texteUtile.un_doc} en utilisant un ${this.texteUtile.def.bon} virtuel.`,
        );

        etiquette = Fabrique.ajouteEtiquetteP(infos);
        etiquette.ajouteTextes(this.texteUtile.descriptionBonVirtuel);

        const bouton = Fabrique.bouton.aide({
            nom: 'infos_bon_virtuel',
            infos
        });
        KfBootstrap.ajouteClasseBouton(bouton, 'light');
        return bouton;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFDoc> {
        const quandBonVirtuelSupprimé =  () => this.rafraichitCréer();
        const quandBonModifié = (bon: CLFDoc) => bon.vueTableLigne.quandItemModifié();
        const quandBonsModifiés = () => this.document.àSynthétiser.forEach(bon => bon.vueTableLigne.quandItemModifié());
        const vueTableDef: IKfVueTableDef<CLFDoc> = {
            colonnesDef: this.utile.colonne.docCLF.defsBons(this.document, quandBonVirtuelSupprimé, quandBonModifié, quandBonsModifiés),
            superGroupe: (doc: CLFDoc) => {
                if (!doc.éditeur) {
                    doc.créeEditeur(this);
                    doc.éditeur.créeSuperGroupe();
                }
                return doc.éditeur.superGroupe;
            },
            itemRéférenceLigne: (doc: CLFDoc, ligne: KfVueTableLigne<CLFDoc>) => {
                doc.vueTableLigne = ligne;
            },
            gereCssLigne: (doc: CLFDoc) => {
                const géreCss = new KfGéreCss();
                géreCss.ajouteClasse(
                    { nom: KfBootstrap.classeBordure({ côté: 'haut', couleur: 'danger' }), active: () => !doc.préparé },
                    { nom: KfBootstrap.classeBordure({ côté: 'bas', couleur: 'danger' }), active: () => !doc.préparé },
                );
                return géreCss;
            }
        };
        if (this.clfDocs.sansBonVirtuelOuvert) {
            const outils = Fabrique.vueTable.outils<CLFDoc>();
            const outilAjoute = Fabrique.vueTable.outilAjoute(this.utile.lien.bonVirtuel(this.clfDocs.client), this.infosBonVirtuel());
            outilAjoute.bbtnGroup.afficherSi(this.utile.conditionTable.edition);
            outils.ajoute(outilAjoute);
            vueTableDef.outils = outils;
        }
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 3,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                const texts = [
                    `Il n'y a pas de ${this.texteUtile.def.bon} envoyé par ${this.clfDocs.client.nom}`
                    + ` pour servir de base à ${this.texteUtile.un_doc}.`,
                    `Vous pouvez cependant créer ${this.texteUtile.un_doc} en utilisant`
                    + ` un ${this.texteUtile.def.bon} virtuel où vous pourrez ajouter les produits à ${this.texteUtile.def.faire}.`,
                    this.texteUtile.descriptionBonVirtuel
                ];
                for (let i = 0; i < 3; i++) {
                    (etat.grBtnsMsgs.messages[i] as KfEtiquette).fixeTexte(texts[i]);
                }
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.utile.lien.bonVirtuelDef(this.clfDocs));
                etat.grBtnsMsgs.alerte('info');
            }).bind(this)
        });
        (etatTable.grBtnsMsgs.messages[2] as KfEtiquette).ajouteTextes({ texte: '', balise: KfTypeDeBaliseHTML.small });
        const def: IGroupeTableDef<CLFDoc> = {
            vueTableDef,
            etatTable
        };
        return def;
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('documents');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFDoc>(groupeTableDef);
        this.groupeTable.ajouteA(groupe);
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeCréer() {
        const messages: KfEtiquette[] = [];
        let etiquette: KfEtiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteSélectionnés = etiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteAnnulésSéléctionnés = etiquette;
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteAnnulésNonSéléctionnés = etiquette;
        this.étiquetteAnnulésNonSéléctionnés.ajouteClasse(KfBootstrap.classeTexte({ color: 'muted' }));

        const boutons: (KfBouton | KfLien)[] = [];
        const def: IBoutonDef = {
            nom: 'creer',
            action: () => this.service.routeur.navigueUrlDef(this.utile.url.envoi(this.clfDocs)),
            contenu: { texte: 'Créer ' + this.texteUtile.le_doc },
            bootstrap: { type: 'primary' }
        };
        this.boutonCréer = Fabrique.bouton.bouton(def);
        boutons.push(this.boutonCréer);
        const groupe = new GroupeBoutonsMessages('creer', { messages, boutons });
        groupe.alerte('primary');
        this.groupeCréer = groupe.groupe;
        this.superGroupe.ajoute(groupe.groupe);
    }

    private rafraichitCréer() {
        if (this.document.àSynthétiser.length === 0) {
            this.groupeCréer.nePasAfficher = true;
            return;
        }
        const bonVirtuel = this.document.àSynthétiser.find(d => d.no === 0);
        if (bonVirtuel && bonVirtuel.estVide && this.document.àSynthétiser.length === 1) {
            // il y a un seul bon à synthétiser: le bon virtuel qui est vide
            this.étiquetteSélectionnés.fixeTexte(
                `Il est impossible de créer ${this.texteUtile.le_doc} à partir du seul ${this.texteUtile.def.bon} virtuel qui n'a pas de lignes.`
            );
            this.étiquetteAnnulésSéléctionnés.nePasAfficher = true;
            this.étiquetteAnnulésNonSéléctionnés.nePasAfficher = true;
            this.boutonCréer.inactivité = true;
            return;
        }
        const sélectionnés = this.document.àSynthétiser.filter(d => d.choisi && d.no !== 0);
        if (sélectionnés.length === 0 && (!bonVirtuel || !bonVirtuel.choisi)) {
            this.étiquetteSélectionnés.fixeTexte(
                `Aucun ${this.texteUtile.def.bon} n'est sélectionné pour ${this.texteUtile.le_doc}.`
            );
            this.boutonCréer.inactivité = true;
        } else {
            let texte: string;
            texte = `${this.texteUtile.Le_doc} sera créé à partir `;
            if (bonVirtuel && bonVirtuel.choisi) {
                texte += `du ${this.texteUtile.def.bon} virtuel`
                if (sélectionnés.length > 0) {
                    texte += ' et '
                }
            }
            if (sélectionnés.length > 0) {
                texte += (sélectionnés.length === 1
                    ? `du ${this.texteUtile.def.bon}`
                    : `des ${this.texteUtile.def.bons}`)
                + ` n° ${this.utile.texte.listeNos(sélectionnés)}`;
            }
            texte += '.';
            this.étiquetteSélectionnés.fixeTexte(texte);
            this.boutonCréer.inactivité = false;
            const annulésSéléctionnés = sélectionnés.filter(d => d.annulé);
            if (annulésSéléctionnés.length === 0) {
                this.étiquetteAnnulésSéléctionnés.nePasAfficher = true;
            } else {
                this.étiquetteAnnulésSéléctionnés.nePasAfficher = false;
                const t: { leBon: string, sera: string, annulé: string } = annulésSéléctionnés.length === 1
                    ? { leBon: `Le ${this.texteUtile.def.bon}`, sera: `sera`, annulé: `annulé` }
                    : { leBon: `Les ${this.texteUtile.def.bons}`, sera: `seront`, annulé: `annulés` };
                this.étiquetteAnnulésSéléctionnés.fixeTextes(`${t.leBon}  n° ${this.utile.texte.listeNos(annulésSéléctionnés)} `
                    + `${t.sera} définitivement ${t.annulé} quand ${this.texteUtile.le_doc} sera enregistré.`);
            }
        }
        const annulésNonSéléctionnés = this.document.àSynthétiser.filter(d => d.annulé && !d.choisi && d.no !== 0);
        if (annulésNonSéléctionnés.length === 0) {
            this.étiquetteAnnulésNonSéléctionnés.nePasAfficher = true;
        } else {
            this.étiquetteAnnulésNonSéléctionnés.nePasAfficher = false;
            const t: { leBon: string, est: string, annulé: string, son: string } = annulésNonSéléctionnés.length === 1
                ? { leBon: `le ${this.texteUtile.def.bon}`, est: `a été`, annulé: `annulé`, son: `son` }
                : { leBon: `les ${this.texteUtile.def.bons}`, est: `ont été`, annulé: `annulés`, son: 'leur' };
            this.étiquetteAnnulésNonSéléctionnés.fixeTextes(
                {
                    texte: `(Conseil) Sélectionnez ${t.leBon}  n° ${this.utile.texte.listeNos(annulésNonSéléctionnés)} qui ${t.est} ${t.annulé}`
                        + ` pour rendre définitive ${t.son} annulation.`,
                    suiviDeSaut: true
                },
                ` Sinon il réapparaitra parmi les ${this.texteUtile.def.bons} à traiter dans ${this.texteUtile.le_prochain_doc}.`
            );
        }
    }

    rafraichit() {
        this.barre.rafraichit();
        this.rafraichitCréer();
        this.document.rafraichitCaseToutSélectionner();
        this.étiquetteSélectionnez.nePasAfficher = this.document.àSynthétiser.length === 0;
    }

    avantChargeData() {
        this.site = this.service.litSiteEnCours();
    }

    chargeData(data: Data) {
        this.clfDocs = data.clfDocs;
        this.document = this.clfDocs.créeASyntétiser();
        this.date = new Date(Date.now());
    }

    initialiseUtile() {
        this.service.changeMode(ModeAction.edite);
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.comportementFormulaire = {
            sauveQuandChange: true,
            neSoumetPasSiPristine: true,
        };

        if (this.clfDocs.catalogue.produits.length === 0) {
            const message = `Il n'y a pas de produits dans le catalogue.`;
            const lienDef: ILienDef = {
                urlDef: {
                    routeur: Fabrique.url.appRouteur.catalogue
                }
            };
            this.superGroupe.ajoute(this.utile.groupeCréationImpossible(this.clfDocs.type, message, lienDef));
        } else {
            // il faut ajouter la case à cocher de l'en-tête de la colonne Inclure
            // pour que son formControl soit créé.
            const groupe = new KfGroupe('');
            groupe.ajoute(this.document.créeCaseToutSélectionner(this.service));
            groupe.nePasAfficher = true;
            this.superGroupe.ajoute(groupe);

            this.étiquetteSélectionnez = new KfEtiquette('');
            this.étiquetteSélectionnez.baliseHtml = KfTypeDeBaliseHTML.p;
            this.étiquetteSélectionnez.ajouteTextes(
                `Sélectionnez les ${this.texteUtile.def.bons} à inclure dans ${this.texteUtile.le_doc}. `,
                { texte: `(Un bon doit être prêt pour pouvoir être sélectionné.)`, balise: KfTypeDeBaliseHTML.small }
            );
            this.superGroupe.ajoute(this.étiquetteSélectionnez);
            this.ajouteGroupeDétails();
        }
        this.ajouteGroupeCréer();

        this.superGroupe.quandTousAjoutés();
    }

    chargeGroupe() {
        if (this.clfDocs.catalogue.produits.length > 0) {
            this._chargeVueTable(this.document.àSynthétiser);
            this.groupeTable.etat.charge();
        }
        this.rafraichit();
    }

    protected aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => {
                this.rafraichit();
            }),
            this.service.clfBilanIO.observable.subscribe(() => {
                this.rafraichit();
            })
        );
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            initialiseUtile: () => this.initialiseUtile(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
