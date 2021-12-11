import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Compare } from '../../commun/outils/tri';
import { CLFDocs } from './c-l-f-docs';
import { CLFDoc } from './c-l-f-doc';
import { ApiDoc } from './api-doc';

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
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.apiDocs.length,
            enTeteDef: { titreDef: titre },
            compare: Compare.nombre((clfDocs: CLFDocs) => clfDocs.apiDocs.length),
        };
    }

    nbPrêts(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: 'nbPrêts',
            créeContenu: (clfDocs: CLFDocs) => '' + clfDocs.apiDocs.filter(d => ApiDoc.prêt(d)).length,
            enTeteDef: { titreDef: 'Prêts' },
            compare: Compare.enchaine(
                Compare.nombre((clfDocs: CLFDocs) => clfDocs.apiDocs.length),
                Compare.nombre((clfDocs: CLFDocs) => clfDocs.apiDocs.filter(d => ApiDoc.prêt(d)).length),
            ),
        };
    }

    choixClient(): IKfVueTableColonneDef<CLFDocs> {
        return {
            nom: this.utile.nom.choisit,
            créeContenu: () => Fabrique.étiquetteLien(Fabrique.contenu.choisit()),
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

}
