import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfVueTable } from './kf-vue-table';
import { KfNgClasse } from '../kf-partages/kf-gere-css-classe';
import { KfVueTableLigne } from './kf-vue-table-ligne';
import { KfGéreCss } from '../kf-partages/kf-gere-css';
import { IKfVueTableOutilVue, IKfVueTableOutil } from './kf-vue-table-outil';
import { KfBBtnToolbar } from '../kf-b-btn-toolbar/kf-b-btn-toolbar';
import { KfNgStyle } from '../kf-partages/kf-gere-css-style';

export interface IKfVueTableOutils {
    nePasAfficher: boolean;
    outils: IKfVueTableOutilVue[];
    classe: KfNgClasse;
    style: KfNgStyle;
    btnToolbar: KfBBtnToolbar;
}

export class KfVueTableOutils<T> extends KfGéreCss implements IKfVueTableOutils {
    private vueTable: KfVueTable<T>;
    private pOutils: IKfVueTableOutil<T>[];
    /** remplace les lignes quand les filtres ne laissent rien passer */
    texteRienPasseFiltres: string;
    private pBtnToolbar: KfBBtnToolbar;

    constructor() {
        super();
        this.pOutils = [];
        // créer btnToolbar ici pour pouvoir lui ajouter des classes css
        this.pBtnToolbar = new KfBBtnToolbar('outils');
        this.texteRienPasseFiltres = `Il n'y aucune ligne correspondant aux critères de filtrage.`;
    }


    initialise(vueTable: KfVueTable<T>) {
        this.vueTable = vueTable;
        this.suitLaVisiblité(vueTable);
        this.pBtnToolbar.créeGereValeur();
        this.pBtnToolbar.estRacineV = true;
        this.pBtnToolbar.sauveQuandChange = true;
        this.pOutils.forEach(outil => {
            this.pBtnToolbar.ajoute(outil.composant);
            if (outil.initialise) {
                outil.initialise(this);
            }
        });
    }

    get filtreActif(): boolean {
        let actif = false;
        this.pOutils.forEach(o => actif = actif || o.filtreActif);
        return actif;
    }

    /**
     * définit des classes css à appliquer suivant l'état des filtres
     * @param siFiltreActif classe css du groupe des outils quand un filtre est actif
     * @param siFiltreInactif classe css du groupe des outils quand aucun filtre n'est actif
     */
    fixeClassesFiltre(siFiltreActif?: string, siFiltreInactif?: string) {
        if (siFiltreActif) {
            this.ajouteClasseDef({
                nom: siFiltreActif,
                active: () => this.filtreActif
            });
        }
        if (siFiltreInactif) {
            this.ajouteClasseDef({
                nom: siFiltreInactif,
                active: () => !this.filtreActif
            });
        }
    }

    get btnToolbar(): KfBBtnToolbar {
        return this.pBtnToolbar;
    }

    ajoute(outil: IKfVueTableOutil<T>) {
        this.pOutils.push(outil);
    }

    outil(nom: string): IKfVueTableOutil<T> {
        const outil = this.pOutils.find(f => f.nom === nom);
        return outil;
    }

    appliqueFiltres() {
        const valides: ((t: T) => boolean)[] = this.pOutils
            .filter(outil => outil.valide !== undefined)
            .map(filtre => filtre.valide);
        const lignes: KfVueTableLigne<T>[] = this.vueTable.lignes;
        lignes.forEach(l => {
            let passeFiltre = true;
            for (let index = 0; index < valides.length && passeFiltre; index++) {
                const valide = valides[index];
                passeFiltre = valide(l.item);
            }
            l.passeFiltres = passeFiltre;
        });
    }

    supprimeFiltres() {
        this.vueTable.lignes.forEach(l => l.passeFiltres = true);
    }

    get outils(): IKfVueTableOutil<T>[] {
        return this.pOutils;
    }
}
