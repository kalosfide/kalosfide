import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFDoc } from './c-l-f-doc';
import { Tri } from 'src/app/commun/outils/tri';
import { Compare } from '../compare';
import { LigneDocumentCoût, CoûtDef } from './cout';
import { CLFLigne } from './c-l-f-ligne';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfInitialObservable } from 'src/app/commun/kf-composants/kf-partages/kf-initial-observable';
import { KfBBtnGroup, KfBBtnGroupElement } from 'src/app/commun/kf-composants/kf-b-btn-group/kf-b-btn-group';

export class CLFUtileColonneDocCLF {
    protected utile: CLFUtile;

    constructor(utile: CLFUtile) {
        this.utile = utile;
    }

    get url(): CLFUtileUrl {
        return this.utile.url;
    }

    get lien(): CLFUtileLien {
        return this.utile.lien;
    }

    client(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'client',
            créeContenu: (docsClient: CLFDoc) => docsClient.client.nom,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<CLFDoc>('client',
                (doc1: CLFDoc, doc2: CLFDoc): number => Compare.AvecClient_nomClient(doc1, doc2)),
        };
    }

    code(titre: string): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'code',
            créeContenu: (doc: CLFDoc) => doc.titreCode,
            enTeteDef: { titreDef: titre },
        };
    }

    date(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'date',
            créeContenu: (clfDoc: CLFDoc) => clfDoc.no === 0 ? '' : TexteOutils.date.en_chiffres(clfDoc.date),
            enTeteDef: { titreDef: 'Date' },
        };
    }

    no(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'no',
            créeContenu: (clfDoc: CLFDoc) => `${clfDoc.no}`,
            enTeteDef: { titreDef: 'No' },
        };
    }

    préparés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'préparés',
            créeContenu: (doc: CLFDoc) => `${doc.nbPréparés} / ${doc.nbAPréparer}`,
            enTeteDef: { titreDef: 'préparées', chapeauDef: 'Lignes', longueurChapeau: 2 },
        };
    }

    annulés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'annulés',
            créeContenu: (doc: CLFDoc) => `${doc.nbAnnulés} / ${doc.nbAPréparer}`,
            enTeteDef: { titreDef: 'annulées' },
        };
    }

    lignes(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'lignes',
            créeContenu: (clfDoc: CLFDoc) => '' + clfDoc.apiDoc.nbLignes,
            enTeteDef: { titreDef: 'Nombre de lignes' },
        };
    }


    total(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'total',
            créeContenu: (clfDoc: CLFDoc) => Fabrique.texte.prix(clfDoc.apiDoc.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }
    montant(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'montant',
            créeContenu: (clfDoc: CLFDoc) => {
                const coûtDef: CoûtDef<CLFLigne> = LigneDocumentCoût.aFixer();
                return coûtDef.texteAgrégé(clfDoc.lignes);
            },
            enTeteDef: { titreDef: 'Montant' },
        };
    }

    edite(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'edite',
            créeContenu: (clfDoc: CLFDoc) => ({ composant: this.utile.lien.bon(clfDoc) }),
        };
    }

    private btnGroupSynthèse(synthèse: CLFDoc): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('action');
        let bouton: KfBBtnGroupElement;
        bouton = Fabrique.bouton.fauxTexteSousIcone();
        btnGroup.ajoute(bouton);
        bouton = this.utile.bouton.copieDocs(synthèse);
        /*
        bouton.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => synthèse.nbCopiablesPasPréparés === 0
        );
        */
        btnGroup.ajoute(bouton);
        bouton = Fabrique.bouton.fauxTexteSousIcone();
        btnGroup.ajoute(bouton);
        return btnGroup;
    }

    private btnGroupDoc(clfDoc: CLFDoc): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('action');
        let bouton: KfBBtnGroupElement;
        bouton = this.utile.lien.bon(clfDoc);
        btnGroup.ajoute(bouton);
        bouton = this.utile.bouton.copieDoc(clfDoc);
        /*
        bouton.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => clfDoc.nbCopiablesPasPréparés === 0
        );
        */
        btnGroup.ajoute(bouton);
        bouton = this.utile.bouton.annuleDoc(clfDoc);
        /*
        bouton.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => clfDoc.préparé
        );
        */
        btnGroup.ajoute(bouton);
        return btnGroup;
    }

    action(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'action',
            enTeteDef: {
                titreDef: { composant: this.btnGroupSynthèse(synthèse) },
                classeDefs: ['colonne-btn-group-3'],
            },
            créeContenu: (clfDoc: CLFDoc) => {
                return { composant: this.btnGroupDoc(clfDoc) };
            },
            classeDefs: ['colonne-btn-group-3'],
            nePasAfficherSi: this.utile.conditionTable.pasEdition,
        };
    }

    copier(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        const rienACopier = KfInitialObservable.transforme(this.utile.service.clsBilanIO,
            () => {
                return synthèse.nbCopiables === 0;
            });
        const nePasAfficherSi = KfInitialObservable.ou(rienACopier, this.utile.conditionTable.pasEdition);
        const enTête = this.utile.bouton.copieDocs(synthèse);
        enTête.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => synthèse.nbCopiablesPasPréparés === 0
        );
        return {
            nom: 'copier',
            enTeteDef: { titreDef: { composant: enTête } },
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.bouton.copieDoc(clfDoc);
                bouton.inactivitéIO = KfInitialObservable.transforme(
                    this.utile.service.clsBilanIO,
                    () => clfDoc.nbCopiablesPasPréparés === 0
                );
                return { composant: bouton };
            },
            nePasAfficherSi,
        };
    }

    annuler(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        const rienAAnnuler = KfInitialObservable.transforme(this.utile.service.clsBilanIO,
            () => {
                return synthèse.àSynthétiser.length === 0;
            });
        const nePasAfficherSi = KfInitialObservable.ou(rienAAnnuler, this.utile.conditionTable.pasEdition);
        const enTête = this.utile.bouton.annuleDoc(synthèse);
        enTête.inactivitéIO = KfInitialObservable.transforme(
            this.utile.service.clsBilanIO,
            () => synthèse.préparé
        );
        return {
            nom: 'annuler',
            enTeteDef: { titreDef: { composant: enTête } },
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.bouton.annuleDoc(clfDoc);
                bouton.inactivitéIO = KfInitialObservable.transforme(
                    this.utile.service.clsBilanIO,
                    () => clfDoc.préparé
                );
                return { composant: bouton };
            },
            nePasAfficherSi,
        };
    }

    état(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'état',
            créeContenu: (clfDoc: CLFDoc) => clfDoc.préparation.texte,
            enTeteDef: { titreDef: 'Prêt' },
        };
    }

    sélection(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'sélection',
            créeContenu: (bon: CLFDoc) => ({ composant: bon.éditeur.kfChoisi }),
            enTeteDef: { titreDef: synthèse.caseToutSélectionner, chapeauDef: 'Inclure', longueurChapeau: 1 },
        };
    }

    defsSélectionDocuments(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc>[] {
        return [
            this.no(),
            this.date(),
            this.préparés(),
            this.annulés(),
            this.montant(),
            this.action(synthèse),
            this.état(),
            this.sélection(synthèse)
        ];
    }

    choisitDocument(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'choisit',
            créeContenu: (clfDoc: CLFDoc) => ({ composant: this.utile.lien.choixDocument(clfDoc) }),
        };
    }

    defsDocuments(): IKfVueTableColonneDef<CLFDoc>[] {
        const defs = [
            this.code('Code'),
            this.date(),
            this.lignes(),
            this.total(),
            this.choisitDocument(),
        ];
        return this.utile.utilisateurEstLeClient ? defs : [this.client()].concat(defs);
    }

}
