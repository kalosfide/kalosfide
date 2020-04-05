import { Tri } from '../../outils/tri';
import { KfVueTable } from './kf-vue-table';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfVueTableCelluleEnTete } from './kf-vue-table-en-tete';
import { KfIcone } from '../kf-elements/kf-icone/kf-icone';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from '../kf-partages/kf-evenements';
import { ApiDocument } from 'src/app/modeles/c-l-f/api-document';

export interface IKfVueTableTrieurOptions<T> {
    inits?: { nomTri: string, desc?: boolean }[];
    créeDéclencheur(enTête: KfVueTableCelluleEnTete<T>): KfGéreCss;
    rafraichitDéclencheur(déclencheur: KfGéreCss, desc: boolean, estDernierTri: boolean): void;
}

class Trieur<T> { tri: Tri<T>; déclencheur: KfGéreCss; }

export class KfVueTableTrieurs<T> {
    private trieurs: Trieur<T>[] = [];
    private vueTable: KfVueTable<T>;

    private options: IKfVueTableTrieurOptions<T>;

    constructor(vueTable: KfVueTable<T>, options: IKfVueTableTrieurOptions<T>) {
        this.vueTable = vueTable;
        this.options = options;
    }

    private debugInfo(trieurs: Trieur<T>[]): any[] {
        return trieurs.map(t => {
            const déclencheur = t.déclencheur as KfIcone;
            return {
                nom: t.tri.nom,
                desc: t.tri.desc,
                déclencheur: déclencheur.nom,
                faClasse: déclencheur.faClasse,
                classe: déclencheur.classe
            };
        });
    }

    get propriété(): (ligne: KfVueTableLigne<T>) => T {
        return (ligne: KfVueTableLigne<T>) => ligne.item;
    }

    ajouteTri(enTête: KfVueTableCelluleEnTete<T>) {
        if (!this.trieurs) {
            this.trieurs = [];
        }
        const déclencheur = this.options.créeDéclencheur(enTête);
        déclencheur.ajouteClasseDef('kf-vue-table-tri');
        enTête.composant.gereHtml.ajouteTraiteur(KfTypeDEvenement.clic,
            ((evenement: KfEvenement) => {
                if (evenement.emetteur === déclencheur) {
                    this.trie(enTête.colonne.tri);
                    evenement.statut = KfStatutDEvenement.fini;
                }
            }).bind(this)
        );
        déclencheur.nePasAfficherSi(enTête.colonne.nePasAfficherTriSi);
        déclencheur.afficherSi(enTête.colonne.afficherTriSi);

        this.trieurs.push({
            tri: enTête.colonne.tri,
            déclencheur
        });
    }

    rafraichit(dernierTrieurQuiATrié: Trieur<T>) {
        for (const trieur of this.trieurs) {
            const estLeDernier = trieur === dernierTrieurQuiATrié;
            const déclencheur = trieur.déclencheur;
            this.options.rafraichitDéclencheur(déclencheur, trieur.tri.desc, estLeDernier);
            if (trieur.tri.desc !== true) {
                déclencheur.supprimeClasseDef('kf-vue-table-tri-desc');
                déclencheur.ajouteClasseDef('kf-vue-table-tri-asc');
            } else {
                déclencheur.supprimeClasseDef('kf-vue-table-tri-asc');
                déclencheur.ajouteClasseDef('kf-vue-table-tri-desc');
            }
            if (estLeDernier) {
                déclencheur.ajouteClasseDef('kf-vue-table-tri-dernier');
            } else {
                déclencheur.supprimeClasseDef('kf-vue-table-tri-dernier');
            }
        }
    }

    trie(tri: Tri<T>) {
        const dernierTrieur = this.trieurs.find(t => t.tri === tri);
        if (dernierTrieur) {
            this.vueTable.lignes = dernierTrieur.tri.trieObjets(this.vueTable.lignes, this.propriété);
            dernierTrieur.tri.desc = dernierTrieur.tri.desc !== true;
            this.rafraichit(dernierTrieur);
        }
    }

    initialise() {
        let dernierTrieurQuiATrié: Trieur<T>;
        if (this.options.inits && this.options.inits.length > 0) {
            const trieurs = this.options.inits.map(init => {
                const trieur = this.trieurs.find(t => t.tri.nom === init.nomTri);
                trieur.tri.desc = init.desc === true;
                return trieur;
            });
            for (const trieur of trieurs) {
                this.vueTable.lignes = trieur.tri.trieObjets(this.vueTable.lignes, this.propriété);
                trieur.tri.desc = trieur.tri.desc !== true;
            }
            dernierTrieurQuiATrié = trieurs[trieurs.length - 1];
        }
        this.rafraichit(dernierTrieurQuiATrié);
    }
}
