import { IKfVueTableColonneDef } from 'src/app/commun/kf-composants/kf-vue-table/i-kf-vue-table-colonne-def';
import { CLFUtileUrl } from './c-l-f-utile-url';
import { CLFUtileLien } from './c-l-f-utile-lien';
import { CLFUtile } from './c-l-f-utile';
import { Fabrique } from 'src/app/disposition/fabrique/fabrique';
import { Compare } from '../../commun/outils/tri';
import { TexteOutils } from 'src/app/commun/outils/texte-outils';
import { KfBootstrap } from 'src/app/commun/kf-composants/kf-partages/kf-bootstrap';
import { LargeurColonne } from 'src/app/disposition/largeur-colonne';
import { KfVueTableCellule } from 'src/app/commun/kf-composants/kf-vue-table/kf-vue-table-cellule';
import { KfTexte } from 'src/app/commun/kf-composants/kf-elements/kf-texte/kf-texte';
import { CLFBilanDocs, CLFClientBilanDocs } from './c-l-f-bilan-docs';
import { CoûtDef } from './cout';

export class CLFUtileColonneClientBilanDocs {
    protected utile: CLFUtile;

    private coût: CoûtDef<CLFBilanDocs>
    private compte(bilans: CLFBilanDocs[]): string {
        let compte = 0;
        bilans.forEach(b => compte += b.nb);
        return '' + compte;
    }

    constructor(utile: CLFUtile) {
        this.utile = utile;
        this.coût = new CoûtDef<CLFBilanDocs>((bilan: CLFBilanDocs) => ({ valeur: bilan.total, complet: !bilan.incomplet }))
    }

    get url(): CLFUtileUrl {
        return this.utile.url;
    }

    get lien(): CLFUtileLien {
        return this.utile.lien;
    }

    client(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        const créeContenu = (docsClient: CLFClientBilanDocs) => docsClient.client.nom;
        return {
            nom: this.utile.nom.client,
            créeContenu,
            compare: Compare.texte(créeContenu),
            enTeteDef: { titreDef: 'Client' },
            bilanDef: {
                titreDef: 'Total',
                titreBilanDesVisibles: 'Affichés',
                texteAgrégé: (bilans: CLFClientBilanDocs[]) => '' + bilans.length,
            }
        };
    }

    commandes(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'commandes',
            créeContenu: (bilan: CLFClientBilanDocs) => `${bilan.commande.nb}`,
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.commande.nb),
            enTeteDef: { titreDef: 'Nombre', chapeauDef: 'Bons de commande', longueurChapeau: 2 },
            bilanDef: { texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.compte(bilans.map(b => b.commande)) }
        };
    }

    commandes_total(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'commandes_total',
            créeContenu: (bilan: CLFClientBilanDocs) => this.coût.texte(bilan.commande),
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.commande.total),
            enTeteDef: { titreDef: 'Montant' },
            bilanDef: {
                texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.coût.texteAgrégé(bilans.map(b => b.commande)),
            }
        };
    }

    livraisons(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'livraisons',
            créeContenu: (bilan: CLFClientBilanDocs) => `${bilan.livraison.nb}`,
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.livraison.nb),
            enTeteDef: { titreDef: 'Nombre', chapeauDef: 'Bons de livraison', longueurChapeau: 2 },
            bilanDef: { texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.compte(bilans.map(b => b.livraison)) }
        };
    }

    livraisons_total(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'livraisons_total',
            créeContenu: (bilan: CLFClientBilanDocs) => this.coût.texte(bilan.livraison),
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.livraison.total),
            enTeteDef: { titreDef: 'Montant' },
            bilanDef: {
                texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.coût.texteAgrégé(bilans.map(b => b.livraison)),
            }
        };
    }

    factures(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'factures',
            créeContenu: (bilan: CLFClientBilanDocs) => `${bilan.facture.nb}`,
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.facture.nb),
            enTeteDef: { titreDef: 'Nombre', chapeauDef: 'Factures', longueurChapeau: 2 },
            bilanDef: { texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.compte(bilans.map(b => b.facture)) }
        };
    }

    factures_total(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: 'factures_total',
            créeContenu: (bilan: CLFClientBilanDocs) => this.coût.texte(bilan.facture),
            compare: Compare.nombre((bilan: CLFClientBilanDocs) => bilan.facture.total),
            enTeteDef: { titreDef: 'Montant' },
            bilanDef: {
                texteAgrégé: (bilans: CLFClientBilanDocs[]) => this.coût.texteAgrégé(bilans.map(b => b.facture)),
            }
        };
    }

    choixClient(): IKfVueTableColonneDef<CLFClientBilanDocs> {
        return {
            nom: this.utile.nom.choisit,
            créeContenu: () => Fabrique.étiquetteLien(Fabrique.contenu.choisit()),
        };
    }

    defsClientsBilansDocs(): IKfVueTableColonneDef<CLFClientBilanDocs>[] {
        return [
            this.client(),
            this.commandes(),
            this.commandes_total(),
            this.livraisons(),
            this.livraisons_total(),
            this.factures(),
            this.factures_total(),
            this.choixClient()
        ];
    }

}
