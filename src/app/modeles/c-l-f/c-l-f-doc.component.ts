import { OnInit, OnDestroy, Directive } from '@angular/core';

import { ActivatedRoute, Data } from '@angular/router';
import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { IBoutonDef } from 'src/app/disposition/fabrique/fabrique-bouton';
import { BootstrapNom, KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { PageTableComponent } from 'src/app/disposition/page-table/page-table.component';
import { CLFLigne } from 'src/app/modeles/c-l-f/c-l-f-ligne';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { GroupeBoutonsMessages } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { KfBouton } from 'src/app/commun/kf-composants/kf-elements/kf-bouton/kf-bouton';
import { ModeTable } from 'src/app/commun/data-par-key/condition-table';
import { ApiRequêteAction } from 'src/app/api/api-requete-action';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/api/api-results/api-result';
import { IGroupeTableDef, GroupeTable } from 'src/app/disposition/page-table/groupe-table';
import { IKfVueTableDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-def';
import { EtatTable } from 'src/app/disposition/fabrique/etat-table';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { KfTypeDeBaliseHTML } from 'src/app/commun/kf-composants/kf-composants-types';
import { KfLien } from 'src/app/commun/kf-composants/kf-elements/kf-lien/kf-lien';
import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { CLFService } from './c-l-f.service';
import { CLFUtile } from './c-l-f-utile';
import { IKfTableLigne, IKfTableCellule, KfTable } from 'src/app/commun/kf-composants/kf-table/kf-table-composant';
import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { ModeAction } from './condition-action';
import { BarreTitre } from 'src/app/disposition/fabrique/fabrique-titre-page/fabrique-titre-page';
import { JsPdfTs } from 'src/app/commun/outils/jspdf-ts';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { LigneDocumentCoût } from './cout';
import { AfficheResultat } from 'src/app/disposition/affiche-resultat/affiche-resultat';
import { IDataComponent } from 'src/app/commun/data-par-key/i-data-component';
import { CellDef } from 'jspdf-autotable';
import { Role } from '../role/role';
import { CLFDocs } from './c-l-f-docs';
import { IPageTableDef } from 'src/app/disposition/page-table/i-page-table-def';

@Directive()
export abstract class CLFDocComponent extends PageTableComponent<CLFLigne> implements OnInit, OnDestroy, IDataComponent {

    /**
     * clfDoc.clfDocs et clfDoc types
     */
    clfDoc: CLFDoc;

    get titre(): string {
        return `${this.pageDef.titre}${this.clfDoc ? ' n° ' + this.clfDoc.no : ''}`;
    }


    modeTableInitial: ModeTable;

    étiquetteEnvoyé: KfEtiquette;

    afficheResultat: AfficheResultat;

    constructor(
        protected route: ActivatedRoute,
        protected service: CLFService,
    ) {
        super(route, service);
    }

    get utile(): CLFUtile { return this.service.utile; }

    get texteUtileDoc() {
        return this.utile.texte.textes(this.clfDoc.clfDocs.type);
    }

    get texteUtileBon() {
        return this.utile.texte.textes(this.clfDoc.type);
    }

    private apiRequêteActionSupprime(): ApiRequêteAction {
        const apiRequêteAction: ApiRequêteAction = {
            formulaire: this.superGroupe,
            demandeApi: (): Observable<ApiResult> => {
                return this.service.supprimeOuRefuse$(this.clfDoc);
            },
            actionSiOk: (): void => {
                this.service.siSupprimeOuRefuseOk(this.clfDoc);
                const url = this.clfDoc.no === 0
                    ? this.utile.url.bons(this.clfDoc.client)
                    : this.utile.lien.url.bon();
                this.service.routeur.navigueUrlDef(url);

            },
            traiteErreur: this.service.traiteErreur
        };
        return apiRequêteAction;
    }

    private créeGroupeEnTête(): KfGroupe {
        const groupe = new KfGroupe('entete');
        const table = new KfTable('');
        table.ajouteClasse('kf-doc-avant-table');
        table.corps = [];
        let ligne: IKfTableLigne;
        let cellule: IKfTableCellule;

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasse('doc-titre-ligne');
        cellule = { texte: this.clfDoc.clfDocs.site.titre, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasse('doc-titre-site');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasse('doc-titre-ligne');
        let texte = this.texteUtileDoc.def.Doc;
        if (this.clfDoc.no) {
            texte = `${texte} n° ${this.clfDoc.no}`;
        }
        cellule = { texte, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasse('doc-titre-doc');
        ligne.cellules.push(cellule);
        cellule = {
            texte: this.clfDoc.date ? TexteOutils.Initiale(TexteOutils.date.en_lettresAvecJour(this.clfDoc.date)) : '',
            géreCss: new KfGéreCss()
        };
        cellule.géreCss.ajouteClasse('doc-titre-date');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        ligne = {
            cellules: [],
            géreCss: new KfGéreCss()
        };
        ligne.géreCss.ajouteClasse('doc-titre-ligne');
        cellule = { texte: this.clfDoc.type === 'commande' ? 'De ' : 'A ', géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasse('doc-titre-texte');
        ligne.cellules.push(cellule);
        const etiquette = new KfEtiquette('');
        let kftexte = new KfTexte('', this.clfDoc.client.nom);
        kftexte.suiviDeSaut = true;
        etiquette.contenuPhrase.ajoute(kftexte);
        kftexte = new KfTexte('', this.clfDoc.client.adresse);
        etiquette.contenuPhrase.ajoute(kftexte);
        cellule = { composant: etiquette, géreCss: new KfGéreCss() };
        cellule.géreCss.ajouteClasse('doc-titre-texte');
        ligne.cellules.push(cellule);
        table.corps.push(ligne);

        groupe.ajoute(table);
        return groupe;
    }

    private créeGroupePied() {
        const groupe = new KfGroupe('pied');
        const coût = LigneDocumentCoût.quantité().agrége(this.clfDoc.lignes);
        const etiquette = new KfEtiquette('',
            `${this.texteUtileDoc.Ce_doc} comporte ${TexteOutils.en_toutes_lettres(this.clfDoc.lignes.length, {
                unitéFéminin: true,
                unité: 'ligne',
                unités: 'lignes',
            })} pour un montant ${coût.complet
                ? 'total de '
                : 'supérieur à'} ${Fabrique.texte.eurosEnToutesLettres(coût.valeur)}.`
        );
        groupe.ajoute(etiquette);
        return groupe;
    }

    créeGroupeTableDef(): IGroupeTableDef<CLFLigne> {
        const vueTableDef: IKfVueTableDef<CLFLigne> = {
            colonnesDef: this.créeColonneDefs(),
        };
        const outils = Fabrique.vueTable.outils<CLFLigne>();
        outils.ajoute(this.utile.outils.catégorie());
        outils.ajoute(this.utile.outils.produit());
        if ((this.clfDoc.type === 'commande' && (this.clfDoc.no === 0 || !this.clfDoc.date)
            || (this.clfDoc.type === 'livraison' && this.clfDoc.no === 0))
        ) {
            const outilAjoute = Fabrique.vueTable.outilAjoute(this.utile.lien.ajoute());
            outilAjoute.bbtnGroup.afficherSi(this.utile.conditionTable.edition);
            outils.ajoute(outilAjoute);
        }
        outils.nePasAfficherSi(this.utile.conditionTable.aperçu);
        vueTableDef.outils = outils;
        vueTableDef.superGroupe = (ligne: CLFLigne) => {
            if (!ligne.éditeur) {
                ligne.créeEditeur(this);
                ligne.éditeur.créeSuperGroupe();
                if (ligne.éditeur.kfAFixer) {
                    Fabrique.input.prépareSuitValeurEtFocus(
                        ligne.éditeur.kfAFixer,
                        this.service.apiRequêtefixeAFixer(ligne, this.superGroupe),
                        this.service
                    );
                } else {
                    [ligne.éditeur.kfQuantité, ligne.éditeur.kfTypeCommande].forEach(kf => {
                        if (kf) {
                            const apiRequêteAction = this.service.apiRequêteEditeLigne(ligne, this.superGroupe);
                            Fabrique.input.prépareSuitValeurEtFocus(
                                kf,
                                apiRequêteAction,
                                this.service);
                        }
                    });
                }
            }
            return ligne.éditeur.superGroupe;
        };
        vueTableDef.id = (ligne: CLFLigne) => {
            return this.utile.url.id('' + ligne.produit.no);
        };
        vueTableDef.triInitial = { colonne: this.utile.nom.catégorie, direction: 'asc' };
        vueTableDef.pagination = Fabrique.vueTable.pagination<CLFLigne>();
        const etatTable = Fabrique.vueTable.etatTable({
            nePasAfficherSiPasVide: true,
            nbMessages: 1,
            avecSolution: true,
            charge: ((etat: EtatTable) => {
                etat.grBtnsMsgs.messages[0].fixeTexte(`Il n'y a pas de lignes de commande.`);
                Fabrique.lien.fixeDef(etat.grBtnsMsgs.boutons[0] as KfLien, this.utile.lien.defAjoute());
                etat.grBtnsMsgs.alerte('warning');
            }).bind(this)
        });

        const groupeTableDef: IGroupeTableDef<CLFLigne> = {
            vueTableDef,
            etatTable
        };
        if (this.modeActionInitial === ModeAction.envoi || this.modeActionInitial === ModeAction.aperçu) {
            groupeTableDef.avantTable = this.créeGroupeEnTête.bind(this);
            groupeTableDef.apresTable = this.créeGroupePied.bind(this);
        }
        return groupeTableDef;
    }

    private ajouteGroupeDétails() {
        const groupe = new KfGroupe('details');
        groupe.ajouteClasse('kf-doc');
        const groupeTableDef = this.créeGroupeTableDef();
        this.groupeTable = new GroupeTable<CLFLigne>(groupeTableDef);
        this.groupeTable.vueTable.ajouteClasse('kf-doc-table');
        this.groupeTable.ajouteA(groupe);
        this.groupeTable.etat.groupe.nePasAfficherSi(this.utile.conditionTable.aperçu);
        this.superGroupe.ajoute(groupe);
    }

    private télécharge(filename: string) {
        const pdf = new JsPdfTs();
        const marge = 20;
        let y = marge;
        pdf.fontSize = 18;
        pdf.text(this.clfDoc.clfDocs.site.titre, marge, y, 'center');
        y += 18; // * doc.getLineHeightFactor();
        pdf.fontSize = 14;
        let texte = this.texteUtileDoc.def.Doc;
        if (this.clfDoc.no) {
            texte = `${texte} n° ${this.clfDoc.no}`;
        }
        pdf.text(texte, marge, y);
        pdf.text(TexteOutils.Initiale(TexteOutils.date.en_lettresAvecJour(this.clfDoc.date)), marge, y, 'right');
        y += 14;
        const de: CellDef = {
            rowSpan: 5,
            content: this.clfDoc.type === 'commande' ? 'De ' : 'A ',
        };
        pdf.autoTable({
            body: [
                [
                    de,
                    this.clfDoc.client.nom,
                ],
                [
                    this.clfDoc.client.adresse,
                ]
            ],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y = pdf.previousAutoTableFinalY() + 20;
        pdf.text('1 304,50', marge, y);
        pdf.text('1 305,50', marge + 150, y);
        y += 14;
        pdf.autoTable({
            body: [['1 304,50', '1 305,50']],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y += 30;
        pdf.autoTable({
            body: [
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240',
                ],
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240',
                ],
                [
                    '1 304.50',
                    '1 304,500',
                    '1 304,240'
                ]
            ],
            startY: y,
            theme: 'plain',
            styles: {
                fontSize: 14
            }
        });
        y = pdf.previousAutoTableFinalY() + 20;
        const contentConfig = pdf.contentConfig(this.vueTable);
        pdf.autoTable({
            body: contentConfig.body,
            head: contentConfig.head,
            foot: contentConfig.foot,
            startY: y,
            margin: {
                left: marge,
                right: marge,
            }
        });
        if (this.clfDoc.type === 'facture') {
            y += pdf.previousAutoTableFinalY() + 30;
            const coût = LigneDocumentCoût.quantité().agrége(this.clfDoc.lignes);
            const arrêté = `Arrêtée la présente facture à la somme de ${Fabrique.texte.eurosEnToutesLettres(coût.valeur)}.`;
            pdf.text(arrêté, marge, y);
        }
        window.open(pdf.output('dataurlnewwindow'));
        pdf.save(filename);
    }


    private ajouteGroupeTélécharger() {
        const nom = 'download';
        const groupe = new KfGroupe(nom);
        KfBootstrap.ajouteClasse(groupe, 'alert', BootstrapNom.primary);
        const kfNom = Fabrique.input.texte('filename', 'Nom du fichier');
        KfBootstrap.prépare(kfNom, Fabrique.optionsBootstrap.formulaire);
        const identifiant = this.service.identification.litIdentifiant();
        const site = this.service.navigation.litSiteEnCours();
        const role = identifiant.roleParUrl(site.url);
        const estFournisseur = role.uid === site.uid && role.rno === site.rno;
        const nom2 = estFournisseur ? this.clfDoc.client.nom : site.nom;
        kfNom.valeur = Role.nomFichier(role, this.clfDoc.type, this.clfDoc.no, nom2);
        groupe.ajoute(kfNom);
        const def: IBoutonDef = {
            nom: 'btDownload',
            contenu: { texte: 'Télécharger le pdf' },
            action: (() => this.télécharge(kfNom.valeur)).bind(this),
            bootstrapType: BootstrapNom.primary
        };
        groupe.ajoute(Fabrique.bouton.bouton(def));
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeEtatDernierBon() {
        const groupe = new KfGroupe('');
        groupe.ajouteClasse('alert alert-success');
        let etiquette: KfEtiquette;
        if (this.clfDoc.no === 0) {
            // bon virtuel: le modèle est la dernière synthèse
            etiquette = Fabrique.ajouteEtiquetteP();
            Fabrique.ajouteTexte(etiquette,
                `${this.texteUtileDoc.Le_dernier_doc} à ${this.clfDoc.client} (${this.clfDoc.no_du_date}) comprenait les lignes ci-dessous.`
            );
            groupe.ajoute(etiquette);
        } else {
            etiquette = Fabrique.ajouteEtiquetteP();
            if (this.clfDoc.terminé) {
                Fabrique.ajouteTexte(etiquette, `La commande ${this.clfDoc.no_du_date} a été `);
                if (this.clfDoc.annulé) {
                    Fabrique.ajouteTexte(etiquette,
                        {
                            texte: 'refusée',
                            classe: 'text-danger'
                        });
                } else {
                    Fabrique.ajouteTexte(etiquette, 'traitée');
                }
                Fabrique.ajouteTexte(etiquette, ` dans le bon de livraison n° ${this.clfDoc.apiDoc.noGroupe}. `);
            } else {
                etiquette.fixeTexte(`Le bon de commande ${this.clfDoc.no_du_date} est en cours de préparation.`);
            }
            groupe.ajoute(etiquette);
            etiquette = Fabrique.ajouteEtiquetteP();
            Fabrique.ajouteTexte(etiquette, `Ce bon de commande comprenait les lignes ci-dessous.`);
            groupe.ajoute(etiquette);
        }
        this.superGroupe.ajoute(groupe);
    }

    // pas pour bon virtuel
    private ajouteGroupeCatalogueChangé() {
        const groupe = new KfGroupe('catalogueChangé');
        groupe.ajouteClasse('alert alert-warning');
        const etiquette = new KfEtiquette('');
        Fabrique.ajouteTexte(etiquette,
            {
                texte: `Le catalogue a changé depuis l'enregistrement de ${this.texteUtileBon.ce_doc} `
                    + `et les détails ci-dessus peuvent différer de l'original `
                    + `si des produits sont devenus indisponibles ou si des prix ont changé.`,
                suiviDeSaut: true
            },
            `Si vous créez un nouveau ${this.texteUtileBon.def.doc} par une copie, vérifiez le résultat avant de l'envoyer.`
        );
        etiquette.baliseHtml = KfTypeDeBaliseHTML.p;
        groupe.ajoute(etiquette);
        this.superGroupe.ajoute(groupe);
    }

    private ajouteGroupeCréer() {
        const messages: KfEtiquette[] = [];
        const boutons: (KfBouton | KfLien)[] = [];
        let texteOuvert: string;
        let texteACréer: string;
        let texteACopier: string;
        if (this.clfDoc.no === 0) {
            texteOuvert = `${this.texteUtileBon.def.doc} virtuel`;
            texteACréer = texteOuvert;
            texteACopier = `de ${this.texteUtileDoc.ce_dernier_doc}`;
            boutons.push(Fabrique.lien.boutonAnnuler(this.utile.url.bons(this.clfDoc.client)));
        } else {
            texteOuvert = 'bon de commande ouvert';
            texteACréer = 'nouveau bon de commande';
            texteACopier = `du bon de commande n°${this.clfDoc.no}`;
        }
        Fabrique.ajouteEtiquetteP(messages).fixeTexte(`Il n'y a pas de ${texteOuvert}.`);
        boutons.push(Fabrique.bouton.boutonAction('vide', 'Créer',
            this.service.apiRequêteCrée(this.clfDoc.clfDocs.keyClient), this.service));
        if (this.bonCopiable) {
            Fabrique.ajouteEtiquetteP(messages).fixeTexte(
                `Vous pouvez choisir que les lignes ${texteACopier} soient automatiquement copiées dans le ${texteACréer}`
                + ` en cliquant sur Créer et copier.`);
            const btCopier = Fabrique.bouton.boutonAction('copier', 'Créer et copier',
                this.service.apiRequêteCréeCopie(this.clfDoc.clfDocs.keyClient), this.service);
            boutons.push(btCopier);
        }
        const groupe = new GroupeBoutonsMessages('creer', { messages, boutons });
        groupe.alerte('primary');
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeSupprime() {
        const messages: KfEtiquette[] = [];
        let texteEtiquette: string;
        let texteBouton: string;
        if (this.clfDoc.no === 0) {
            texteEtiquette = `Le bon de commande virtuel de ${this.clfDoc.client.nom} va être supprimé.`;
            texteBouton = 'Supprimer la commande';
        } else {
            texteEtiquette = `Toutes les lignes de la commande vont être effacées.`;
            texteBouton = 'Effacer la commande';
        }
        Fabrique.ajouteEtiquetteP(messages, 'text-center').fixeTexte(texteEtiquette);
        Fabrique.ajouteEtiquetteP(messages, 'text-center').fixeTexte('Cette action ne pourra pas être annulée.');
        const def: IBoutonDef = {
            nom: '',
            contenu: { texte: 'Annuler' },
            bootstrapType: BootstrapNom.dark,
            action: () => {
                this.service.routeur.navigueUrlDef(this.utile.url.bon());
            }
        };
        const boutons = [
            Fabrique.bouton.bouton(def),
            Fabrique.bouton.boutonAction('supprime', texteBouton, this.apiRequêteActionSupprime(), this.service),
        ];
        const groupe = new GroupeBoutonsMessages('supprime', { messages, boutons });
        groupe.alerte('warning');
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeEnvoi() {
        const messages: KfEtiquette[] = [];
        let etiquette: KfEtiquette;

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Les lignes ne pourront plus être modifiées.');
        etiquette = Fabrique.ajouteEtiquetteP(messages);
        Fabrique.ajouteTexte(etiquette, 'Cette action ne pourra pas être annulée.');

        const boutons = [
            this.utile.bouton.annulerEnvoiBon(),
            this.utile.bouton.envoi(this.clfDoc, this.superGroupe, this.afficheResultat)
        ];
        const groupe = new GroupeBoutonsMessages('envoi', { messages, boutons });
        groupe.alerte('warning');
        groupe.groupe.afficherSi(this.utile.conditionAction.envoi);
        this.superGroupe.ajoute(groupe.groupe);
    }

    private ajouteGroupeEnvoyé() {
        const messages: KfEtiquette[] = [];
        let texteDocuments = '';
        if (this.clfDoc.clfDocs.type !== 'commande') {
            texteDocuments = ' et dans ceux du client';
        }
        let etiquette = Fabrique.ajouteEtiquetteP(messages);
        this.étiquetteEnvoyé = etiquette;

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.fixeTexte(
            `${this.texteUtileDoc.def.Il} figure maintenant dans vos documents${texteDocuments}. `
            + `Pour le consulter, le télécharger, l'imprimer, suivez le lien ci-dessous.`);

        etiquette = Fabrique.ajouteEtiquetteP(messages);
        etiquette.contenuPhrase.ajoute(this.utile.lien.document(this.clfDoc));

        if (this.clfDoc.type === 'commande') {
            etiquette = Fabrique.ajouteEtiquetteP(messages);
            etiquette.fixeTexte('Si vous avez terminé, pensez à vous ');
            etiquette.contenuPhrase.ajoute(this.utile.lien.déconnection());
        }

        const groupe = new GroupeBoutonsMessages('envoye', { messages });
        groupe.alerte('success');
        groupe.groupe.afficherSi(this.utile.conditionAction.envoyé);
        this.superGroupe.ajoute(groupe.groupe);
    }

    rafraichitEtiquetteEnvoyé() {
        let texteNo = '';
        if (this.clfDoc.clfDocs.type !== 'commande') {
            texteNo = ` avec le n° ${this.clfDoc.no}`;
        }
        const texteDate = `${TexteOutils.date.en_chiffresHMin(this.clfDoc.date)}`;
        this.étiquetteEnvoyé.fixeTexte(`${this.texteUtileDoc.Le_doc} a été enregistré${texteNo} et daté (${texteDate}).`);
    }

    get bonCopiable(): boolean {
        return this.clfDoc.lignes && !this.clfDoc.annulé && this.clfDoc.lignes.length > 0;
    }

    créeSuperGroupe() {
        this.superGroupe = new KfSuperGroupe(this.nom);
        this.superGroupe.créeGereValeur();
        this.superGroupe.comportementFormulaire = { sauveQuandChange: true };
        this.afficheResultat = Fabrique.formulaire.ajouteResultat(this.superGroupe);
        const mode = this.service.modeAction;

        if (mode === ModeAction.edite) {
            this.ajouteGroupeDétails();
        }

        if (mode === ModeAction.aperçu) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeTélécharger();
        }

        if (mode === ModeAction.doitCréer) {
            if (this.bonCopiable) {
                this.ajouteGroupeEtatDernierBon();
                this.ajouteGroupeDétails();
                if (this.clfDoc.no !== 0) {
                    const dateCatalogue = new Date(this.clfDoc.clfDocs.catalogue.date);
                    const date = new Date(this.clfDoc.date);
                    if (dateCatalogue > date) {
                        this.ajouteGroupeCatalogueChangé();
                    }
                }
            } else {
                this.ajouteGroupeDétails();
            }
            this.ajouteGroupeCréer();
        }

        if (mode === ModeAction.supprime) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeSupprime();
        }
        if (mode === ModeAction.envoi) {
            this.ajouteGroupeDétails();
            this.ajouteGroupeEnvoi();
            this.ajouteGroupeEnvoyé();
        }

        this.superGroupe.ajoute(this.afficheResultat.groupe);

        this.superGroupe.quandTousAjoutés();
    }

    chargeStock(clfDoc: CLFDoc) {
        this.clfDoc = clfDoc;
    }

    avantChargeData() {
    }

    chargeData(data: Data) {
        this.chargeStock(data.clfDoc);
    }

    protected abstract get modeActionInitial(): ModeAction;

    initialiseUtile() {
        this.service.initialiseModeAction(this.modeActionInitial);
        if (this.modeTableInitial) {
            this.service.changeModeTable(this.modeTableInitial);
        }
        this.service.utile.url.fixeRouteDoc(this.clfDoc);
    }

    private rafraichit() {
        this.clfDoc.clfDocs.site = this.service.navigation.litSiteEnCours();
        const mode = this.service.modeAction;
        if (mode === ModeAction.envoyé) {
            this.rafraichitEtiquetteEnvoyé();
        }
        if (this.barre) {
            this.barre.rafraichit();
        } else {
            console.log(this.pageDef);
        }
    }

    protected chargeGroupe() {
        if (this.groupeTable) {
        }
            this.groupeTable.etat.charge();
            if (this.clfDoc.lignes) {
                this.utile.outils.chargeCatégories(this.vueTable, this.clfDoc.clfDocs.catalogue.catégories);
                this._chargeVueTable(this.clfDoc.lignes);
            }
        this.rafraichit();
    }

    /**
     * Retourne la fonction à exécuter quand la ligne a été supprimé et le stock mis à jour
     * pour mettre à jour this.clfDoc et la vueTable
     * @param ligne ligne supprimée de la bdd et du stock
     */
    quandLigneSupprimée(ligne: CLFLigne): ((stock: CLFDocs) => void) {
        return (stock: CLFDocs) => {
            let index = this.vueTable.lignes.findIndex(l => l.item.no2 === ligne.no2);
            this.vueTable.supprimeItem(index);
            index = this.clfDoc.lignes.findIndex(l => l.no2 === ligne.no2);
            this.clfDoc.lignes.splice(index);
            this.clfDoc.clfDocs = stock;
        };
    }

    protected abstract créeColonneDefs(): IKfVueTableColonneDef<CLFLigne>[];

    protected aprèsChargeData() {
        this.subscriptions.push(
            this.service.modeActionIO.observable.subscribe(() => {
                this.rafraichit();
            }),
            this.service.clsBilanIO.observable.subscribe(() => {
                this.rafraichit();
            })
        );
    }

    créePageTableDef(): IPageTableDef {
        return {
            avantChargeData: () => this.avantChargeData(),
            chargeData: (data: Data) => this.chargeData(data),
            initialiseUtile: () => this.initialiseUtile(),
            créeSuperGroupe: () => this.créeSuperGroupe(),
            chargeGroupe: () => this.chargeGroupe(),
            aprèsChargeData: () => this.aprèsChargeData()
        };
    }
}
