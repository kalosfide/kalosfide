import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Compare } from '../../commun/outils/tri';
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
        const créeContenu = (clfDocs: CLFDocs) => clfDocs.client.nom;
        return {
            nom: 'client',
            créeContenu,
            enTeteDef: { titreDef: 'Client' },
            compare: Compare.texte(créeContenu),
        };
    }

    nbDocuments(titre: string): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'nbDocuments',
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.documents.length,
            enTeteDef: { titreDef: titre },
            compare: Compare.nombre((clfDocs: CLFDocs) => clfDocs.documents.length),
        };
    }

    nbPrêts(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'nbPrêts',
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.documents.filter(d => ApiDocument.prêt(d)).length,
            enTeteDef: { titreDef: 'Prêts' },
            compare: Compare.enchaine(
                Compare.nombre((clfDocs: CLFDocs) => clfDocs.documents.length),
                Compare.nombre((clfDocs: CLFDocs) => clfDocs.documents.filter(d => ApiDocument.prêt(d)).length),
            ),
        };
    }

    choixClient(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: this.utile.nom.choisit,
            créeContenu: (clfDocs: CLFDocs) => this.lien.client(clfDocs),
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
            compare: Compare.nombre((doc: CLFDoc) => doc.nbAPréparer),
            enTeteDef: { titreDef: 'à préparer', chapeauDef: 'Nombre de lignes', longueurChapeau: 3 },
        };
    }

    préparés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'préparés',
            créeContenu: (doc: CLFDoc) => '' + doc.nbPréparés,
            compare: Compare.nombre((doc: CLFDoc) => doc.nbPréparés),
            enTeteDef: { titreDef: 'préparées' },
        };
    }

    annulés(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'annulés',
            créeContenu: (doc: CLFDoc) => '' + doc.nbAnnulés,
            compare: Compare.nombre((doc: CLFDoc) => doc.nbAnnulés),
            enTeteDef: { titreDef: 'dont annulées' },
        };
    }

    montant(): IKfVueTableColonneDef<CLFDoc> {
        return {
            nom: 'montant',
            créeContenu: (document: CLFDoc) => Fabrique.texte.euros(document.apiDoc.total),
            compare: Compare.nombre((doc: CLFDoc) => doc.apiDoc.total),
            enTeteDef: { titreDef: 'Montant' },
        };
    }

}
