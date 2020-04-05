import { KfGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-groupe';

export class Temporisateur {
    enCours: boolean;

    // identifiant du window.Timeout utilisé
    private IdTimeOut: number;

    // durée de vie du TimeOut en ms
    private délai: number;

    // fixé à vrai quand le délai est écoulé
    // puis faux quand l'animation finit
    private visible: boolean;

    private _groupe: KfGroupe;

    constructor() {
        this.délai = 2;
        this.visible = false;
    }

    // le timeOut sert à ce que l'affichage ne commence pas si l'action est de courte durée
    private créeTimeOut() {
        if (this.IdTimeOut) {
            // il y a déjà un timeOut
            return;
        }

        // specify window.setTimeout to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
        this.IdTimeOut = window.setTimeout(() => this.quandDélaiTerminé(), this.délai);
    }

    private quandDélaiTerminé() {
        this.visible = true;
        this.détruitTimeOut();
    }

    private détruitTimeOut() {
        clearTimeout(this.IdTimeOut);
        this.IdTimeOut = undefined;
    }

    /**
     * appelée par un composant qui va lancer une action pour que le temporisateur soit visible si l'action dure trop
     */
    commence() {
        if (!this.enCours) {
            this.enCours = true;
            this.créeTimeOut();
        }
    }

    /**
     * appelée par ce composant quand l'action est terminée pour que le temporisateur ne soit plus visible
     */
    finit() {
        if (this.enCours) {
            this.enCours = false;
            if (this.visible) {
                // le TimeOut est déjà détruit
                this.visible = false;
            } else {
                this.détruitTimeOut();
            }
        }
    }

}

