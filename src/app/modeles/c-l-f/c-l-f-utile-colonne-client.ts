import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { Tri } from 'src/app/commun/outils/tri';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Compare } from '../compare';
import { CLFDocs } from './c-l-f-docs';
import { CLFDoc } from './c-l-f-doc';
import { ApiDocument } from './api-document';

export class CLFUtileColonneClient {
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

    client(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'client',
            créeContenu: (clfDocs: CLFDocs) => clfDocs.client.nom,
            enTeteDef: { titreDef: 'Client' },
            tri: new Tri<CLFDocs>('client',
                (docs1: CLFDocs, docs2: CLFDocs): number => Compare.AvecClient_nomClient(docs1, docs2)),
        };
    }

    nbDocuments(titre: string): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'nbDocuments',
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.documents.length,
            enTeteDef: { titreDef: titre },
            tri: new Tri<CLFDocs>('nbDocuments', CLFDocs.compareNbDocuments),
        };
    }

    nbPrêts(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'nbPrêts',
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.documents.filter(d => ApiDocument.prêt(d)).length,
            enTeteDef: { titreDef: 'Prêts' },
            tri: new Tri<CLFDocs>('nbPrêts', CLFDocs.compareNbPrêts)
        };
    }

    choixClient(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'choixClient',
            créeContenu: (clfDocs: CLFDocs) => ({ composant: this.lien.client(clfDocs) }),
        };
    }

    colonnesDocumentsClient(clfDocs: CLFDocs): IKfVueTableColonneDef<CLFDocs>[] {
        const titre = this.utile.texte.textes(clfDocs.type).def.Bons;
        return [
            this.client(),
            this.nbDocuments(titre),
            this.nbPrêts(),
            this.choixClient()
        ];
    }

    àPréparer(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'àPréparer',
            créeContenu: (doc: CLFDoc) => '' + doc.nbAPréparer,
            enTeteDef: { titreDef: 'à préparer', chapeauDef: 'Nombre de lignes', longueurChapeau: 3 },
        };
    }

    préparés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'préparés',
            créeContenu: (doc: CLFDoc) => '' + doc.nbPréparés,
            enTeteDef: { titreDef: 'préparées' },
        };
    }

    annulés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'annulés',
            créeContenu: (doc: CLFDoc) => '' + doc.nbAnnulés,
            enTeteDef: { titreDef: 'dont annulées' },
        };
    }

    montant(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'montant',
            créeContenu: (document: CLFDoc) => Fabrique.texte.prix(document.apiDoc.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

}
