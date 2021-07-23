import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { CLFDoc } from './c-l-f-doc';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { ValeurEtObservable } from 'src/app/commun/outils/valeur-et-observable';
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
        const créeContenu = (docsClient: CLFDoc) => docsClient.client.nom;
        return {
            nom: this.utile.nom.client,
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Client' },
        };
    }

    code(titre: string): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (doc: CLFDoc) => doc.titreCode;
        return {
            nom: 'code',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: titre },
        };
    }

    date(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'date',
            créeContenu: (clfDoc: CLFDoc) => clfDoc.no === 0 ? '' : TexteOutils.date.en_chiffres(clfDoc.date),
            compare: Compare.date((clfDoc: CLFDoc) => clfDoc.date),
            classesItem: ['date'],
            enTeteDef: { titreDef: 'Date' },
        };
    }

    no(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'no',
            créeContenu: (clfDoc: CLFDoc) => `${clfDoc.no}`,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.no),
            enTeteDef: { titreDef: 'No' },
        };
    }

    préparés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'préparés',
            créeContenu: (doc: CLFDoc) => `${doc.nbPréparés} / ${doc.nbAPréparer}`,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.nbPréparés),
            enTeteDef: { titreDef: 'préparées', chapeauDef: 'Lignes', longueurChapeau: 2 },
        };
    }

    annulés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'annulés',
            créeContenu: (doc: CLFDoc) => `${doc.nbAnnulés} / ${doc.nbAPréparer}`,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.nbAnnulés),
            enTeteDef: { titreDef: 'annulées' },
        };
    }

    lignes(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'lignes',
            créeContenu: (clfDoc: CLFDoc) => '' + clfDoc.apiDoc.nbLignes,
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.apiDoc.nbLignes),
            enTeteDef: { titreDef: 'Nombre de lignes' },
        };
    }


    total(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'total',
            créeContenu: (clfDoc: CLFDoc) => Fabrique.texte.euros(clfDoc.apiDoc.total),
            compare: Compare.nombre((clfDoc: CLFDoc) => clfDoc.apiDoc.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }
    montant(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'montant',
            créeContenu: (clfDoc: CLFDoc) => Fabrique.texte.euros(clfDoc.coûtAgrégé),
            compare: Compare.enchaine(
                Compare.nombre((clfDoc: CLFDoc) => clfDoc.coûtAgrégé.valeur),
                Compare.booléenDesc((clfDoc: CLFDoc) => clfDoc.coûtAgrégé.complet)
            ),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

    /**
     * Boutons de la ligne d'en-tête
     * @param synthèse document de synthèse
     */
    private btnGroupSynthèse(synthèse: CLFDoc): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('actionSynthèse');
        let bouton: KfBBtnGroupElement;
        // pour aligner avec les boutons des lignes
        bouton = Fabrique.bouton.fauxTexteSousIcone();
        btnGroup.ajoute(bouton);
        //
        if (synthèse.àSynthétiser.filter(doc => doc.no !== 0).length === 0) {
            // il n' y a pas que le bon virtuel: pas de copie
        } else {
            bouton = this.utile.bouton.copieDocs(synthèse);
            /*
            bouton.inactivitéIO = KfInitialObservable.transforme(
                this.utile.service.clsBilanIO,
                () => synthèse.nbCopiablesPasPréparés === 0
            );
            */
            btnGroup.ajoute(bouton);
        }
        bouton = Fabrique.bouton.fauxTexteSousIcone();
        btnGroup.ajoute(bouton);
        return btnGroup;
    }

    private btnGroupDoc(clfDoc: CLFDoc): KfBBtnGroup {
        const btnGroup = new KfBBtnGroup('action');
        let bouton: KfBBtnGroupElement;
        bouton = this.utile.lien.bon(clfDoc);
        btnGroup.ajoute(bouton);
        if (clfDoc.no === 0) {
            if (clfDoc.synthèse.àSynthétiser.length > 1) {
                // il n' y a pas que le bon virtuel
                // pas de copie pour le bon virtuel mais on garde la place pour l'alignement
                bouton = Fabrique.bouton.fauxTexteSousIcone();
                btnGroup.ajoute(bouton);
            }
        } else {
            bouton = this.utile.bouton.copieDoc(clfDoc);
            /*
            bouton.inactivitéIO = KfInitialObservable.transforme(
                this.utile.service.clsBilanIO,
                () => clfDoc.nbCopiablesPasPréparés === 0
            );
            */
            btnGroup.ajoute(bouton);
        }
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
                titreDef: this.btnGroupSynthèse(synthèse),
                classeDefs: ['colonne-btn-group-3'],
            },
            créeContenu: (clfDoc: CLFDoc) => this.btnGroupDoc(clfDoc),
            classesItem: ['colonne-btn-group-3'],
            afficherSi: this.utile.conditionTable.edition,
        };
    }

    copier(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        const peutCopier = ValeurEtObservable.transforme(this.utile.service.clsBilanIO,
            () => {
                return synthèse.nbCopiables > 0;
            });
        const afficherSi = ValeurEtObservable.et(peutCopier, this.utile.conditionTable.edition);
        const enTête = this.utile.bouton.copieDocs(synthèse);
        enTête.inactivitéIO = ValeurEtObservable.transforme(
            this.utile.service.clsBilanIO,
            () => synthèse.nbCopiablesPasPréparés === 0
        );
        return {
            nom: 'copier',
            enTeteDef: { titreDef: enTête },
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.bouton.copieDoc(clfDoc);
                bouton.inactivitéIO = ValeurEtObservable.transforme(
                    this.utile.service.clsBilanIO,
                    () => clfDoc.nbCopiablesPasPréparés === 0
                );
                return bouton;
            },
            afficherSi,
        };
    }

    annuler(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        const peutAnnuler = ValeurEtObservable.transforme(this.utile.service.clsBilanIO,
            () => {
                return synthèse.àSynthétiser.length > 0;
            });
        const nePasAfficherSi = ValeurEtObservable.et(peutAnnuler, this.utile.conditionTable.edition);
        const enTête = this.utile.bouton.annuleDoc(synthèse);
        enTête.inactivitéIO = ValeurEtObservable.transforme(
            this.utile.service.clsBilanIO,
            () => synthèse.préparé
        );
        return {
            nom: 'annuler',
            enTeteDef: { titreDef: enTête },
            créeContenu: (clfDoc: CLFDoc) => {
                const bouton = this.utile.bouton.annuleDoc(clfDoc);
                bouton.inactivitéIO = ValeurEtObservable.transforme(
                    this.utile.service.clsBilanIO,
                    () => clfDoc.préparé
                );
                return bouton;
            },
            nePasAfficherSi,
        };
    }

    état(): IKfVueTableColonneDef<CLFDoc> {
        const créeContenu = (clfDoc: CLFDoc) => clfDoc.préparation.texte;
        return {
            nom: 'état',
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Prêt' },
        };
    }

    sélection(synthèse: CLFDoc): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'sélection',
            créeContenu: (bon: CLFDoc) => bon.éditeur.kfChoisi,
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
            créeContenu: (clfDoc: CLFDoc) => this.utile.lien.choixDocument(clfDoc),
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
