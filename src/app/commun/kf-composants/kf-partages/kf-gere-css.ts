import { KfStringDef, ValeurStringDef } from './kf-string-def';
import { KfNgClasse, KfNgClasseDef } from './kf-gere-css-classe';
import { KfNgStyle, KfNgStyleDef } from './kf-gere-css-style';
import { Observable, Subscription } from 'rxjs';
import { ValeurEtObservable } from '../../outils/valeur-et-observable';

export class KfGéreCss {
    /**
     * valeur initiale et Observable définissant si l'objet est affiché.
     */
    private pNePasAfficher: boolean;
    private pSubscriptionAfficher: Subscription;

    private pNgInvisible: KfNgClasseDef;

    private pClasseDefs: KfStringDef[];

    private pNgClasseDefs: KfNgClasseDef[];

    private pStyleDefs: KfNgStyleDef[];

    private pSubscriptionInvisible: Subscription;

    private pSuitLaVisiblité: KfGéreCss;
    private pSuitLesClasses: KfGéreCss;
    private pSuitLeStyle: KfGéreCss;

    suitLaVisiblité(géreCss: KfGéreCss) {
        this.pSuitLaVisiblité = géreCss;
    }

    suitLesClasses(géreCss: KfGéreCss) {
        this.pSuitLesClasses = géreCss;
    }

    suitClassesEtStyle(géreCss: KfGéreCss) {
        this.pSuitLesClasses = géreCss;
        this.pSuitLeStyle = géreCss;
    }

    // NE PAS AFFICHER

    afficherSi(condition?: ValeurEtObservable<boolean>) {
        if (this.pSubscriptionAfficher) {
            this.pSubscriptionAfficher.unsubscribe();
        }
        if (condition) {
            this.pNePasAfficher = !condition.valeur;
            this.pSubscriptionAfficher = condition.observable.subscribe(c => this.pNePasAfficher = !c);
        }
    }

    nePasAfficherSi(condition: ValeurEtObservable<boolean>) {
        if (this.pSubscriptionAfficher) {
            this.pSubscriptionAfficher.unsubscribe();
        }
        if (condition) {
            this.pNePasAfficher = condition.valeur;
            this.pSubscriptionAfficher = condition.observable.subscribe(c => this.pNePasAfficher = c);
        }
    }

    get nePasAfficher(): boolean {
        return this.pNePasAfficher;
    }
    set nePasAfficher(nePasAfficher: boolean) {
        this.pNePasAfficher = nePasAfficher;
    }

    // VISIBILITE

    get ngInvisible(): KfNgClasseDef {
        return this.pSuitLaVisiblité
            ? this.pSuitLaVisiblité.pNgInvisible
            : this.pNgInvisible;
    }

    get _visible(): boolean {
        return !this.pNgInvisible || (this.pNgInvisible.active && !this.pNgInvisible.active());
    }

    get visible(): boolean {
        if (this.pSuitLaVisiblité) {
            return this.pSuitLaVisiblité.visible;
        } else {
            return !this.pNgInvisible || (this.pNgInvisible.active && !this.pNgInvisible.active());
        }
    }

    set visible(visible: boolean) {
        this.pNgInvisible = visible
            ? undefined
            : {
                nom: 'kf-invisible',
            };
    }

    set invisibilitéFnc(invisibilitéFnc: () => boolean) {
        this.pNgInvisible = {
            nom: 'kf-invisible',
            active: invisibilitéFnc
        };
    }

    set visibilitéFnc(visibilitéFnc: () => boolean) {
        this.pNgInvisible = {
            nom: 'kf-invisible',
            active: () => !visibilitéFnc()
        };
    }

    set visibilitéObs(visibilitéObs: Observable<boolean>) {
        if (this.pSubscriptionInvisible) {
            this.pSubscriptionInvisible.unsubscribe();
        }
        this.pSubscriptionInvisible = visibilitéObs.subscribe(visible => {
            console.log(2, visible);
            this.visible = visible;
        });
    }

    set invisibilitéObs(invisibilitéObs: Observable<boolean>) {
        if (this.pSubscriptionInvisible) {
            this.pSubscriptionInvisible.unsubscribe();
        }
        this.pSubscriptionInvisible = invisibilitéObs.subscribe(visible => this.visible = !visible);
    }

    set visibilitéIO(visibilitéIO: ValeurEtObservable<boolean>) {
        this.visible = visibilitéIO.valeur;
        this.visibilitéObs = visibilitéIO.observable;
    }

    set invisibilitéIO(invisibilitéIO: ValeurEtObservable<boolean>) {
        this.visible = !invisibilitéIO.valeur;
        this.invisibilitéObs = invisibilitéIO.observable;
    }

    // CLASSES

    private _créeArray(nomsDef: string | string[]): string[] {
        if (typeof (nomsDef) === 'string') {
            return nomsDef.trim().split(' ');
        } else {
            let noms: string[] = [];
            nomsDef.forEach(n => noms = noms.concat(this._créeArray(n)));
            return noms;
        }
    }
    private _ajouteNg(nomsDef: string | string[] | { nom: string | string[], active?: () => boolean }) {
        if (!this.pNgClasseDefs) {
            this.pNgClasseDefs = [];
        }
        let noms = [];
        let active: () => boolean;
        if (typeof (nomsDef) === 'string' || Array.isArray(nomsDef)) {
            noms = this._créeArray(nomsDef);
        } else {
            noms = this._créeArray(nomsDef.nom);
            active = nomsDef.active;
        }
        noms.forEach(n => {
            let ngc = this.pNgClasseDefs.find(ng => ng.nom === n);
            if (ngc) {
                ngc.active = active;
            } else {
                ngc = new KfNgClasseDef();
                ngc.nom = n;
                ngc.active = active;
                this.pNgClasseDefs.push(ngc);
            }
        });
    }

    /**
     * Remplace dans la liste chaque string par les mots qui la composent.
     * @param stringDefs liste de string ou de () => string
     */
    private motsOuFonctions(stringDefs: KfStringDef[]): KfStringDef[] {
        const motsOuFonctions: KfStringDef[] = [];
        stringDefs.forEach(
            stringDef => {
                if (typeof (stringDef) === 'string') {
                    const cs = stringDef.trim().split(' ');
                    if (cs.length > 0) {
                        cs.forEach(mot => motsOuFonctions.push(mot));
                    }
                } else {
                    motsOuFonctions.push(stringDef);
                }
            });
        return motsOuFonctions;
    }

    private _ajouteStringDef(classeDef: KfStringDef) {
        if (!this.pClasseDefs) {
            this.pClasseDefs = [];
        }
        this.motsOuFonctions([classeDef]).forEach(
            c => {
                if (!this.pClasseDefs.find(cd => c === cd)) {
                    this.pClasseDefs.push(c);
                }
            }
        );
    }

    private _ajouteClasseDef(classeDef: KfStringDef | KfNgClasseDef) {
        if (typeof (classeDef) === 'string' || typeof (classeDef) === 'function') {
            this._ajouteStringDef(classeDef as KfStringDef);
        } else {
            const ng = classeDef as KfNgClasseDef;
            this._ajouteNg(ng);
        }
    }

    ajouteClasse(...classeDefs: (KfStringDef | KfNgClasseDef)[]): void {
        classeDefs.forEach(classeDef => this._ajouteClasseDef(classeDef));
    }

    ajouteClasses(classes: string[], classeEnCours: () => string): void {
        this.ajouteClasse(...classes.map(classe => ({ nom: classe, active: () => classeEnCours() === classe })))
    }

    supprimeClasse(...classeDefs: KfStringDef[]): void {
        if (this.pClasseDefs) {
            const liste = this.motsOuFonctions(classeDefs);
            this.pClasseDefs = this.pClasseDefs.filter(c => !liste.find(c1 => c1 === c));
            if (this.pClasseDefs.length === 0) {
                this.pClasseDefs = undefined;
            }
        }
        if (this.pNgClasseDefs) {
            this.pNgClasseDefs = this.pNgClasseDefs.filter(ng => !classeDefs.find(c => {
                if (typeof (c) === 'string' || typeof (c) === 'function') {
                    return true;
                }
                return (c as KfNgClasseDef).nom === ng.nom;
            }));
            if (this.pNgClasseDefs.length === 0) {
                this.pNgClasseDefs = undefined;
            }
        }
    }

    ajouteClasseTemp(nomClasse: string, durée: number) {
        this.ajouteClasse(nomClasse);
        const idTimeOut = window.setTimeout(() => {
            this.supprimeClasse(nomClasse);
            clearTimeout(idTimeOut);
        }, durée);
    }

    /**
     * Si suffixes n'est pas défini, supprime toutes les classes dont le nom commence par le préfixe.
     * Si suffixes est défini, supprime toutes les classes dont le nom est constitué du préfixe suivi de '-' et de l'un des suffixes.
     */
    supprimeClasseAPréfixe(préfixe: string, suffixes?: string[]) {
        const nb = préfixe.length;
        const filtre: (texte: string) => boolean = suffixes
            ? (texte: string) => texte.length < nb || texte.slice(0, nb) !== préfixe
            : (texte: string) => {
                const avecTiret = préfixe + '-';
                if (texte.length < nb + 1 || texte.slice(0, nb + 1) !== avecTiret) {
                    return true;
                }
                const suffixe = texte.substring(nb + 1);
                return suffixes.find(s => s === suffixe) === undefined;
            }
        if (this.pClasseDefs) {
            this.pClasseDefs = this.pClasseDefs.filter(c => {
                const texte = ValeurStringDef(c);
                return texte.length < nb || texte.slice(0, nb) !== préfixe;
            });
        }
        if (this.pNgClasseDefs) {
            this.pNgClasseDefs = this.pNgClasseDefs.filter(ngc => {
                const texte = ValeurStringDef(ngc.nom);
                return texte.length < nb || texte.slice(0, nb) !== préfixe;
            });
        }
    }

    private ngClasseSansInvisible(): KfNgClasse {
        let ngClasse: { [noms: string]: boolean | (() => boolean) };
        if (this.pClasseDefs && this.pClasseDefs.length > 0) {
            let classes = '';
            this.pClasseDefs.forEach(
                classeDef => {
                    const texteClasse = typeof (classeDef) === 'string' ? classeDef : classeDef();
                    const cs = texteClasse.split(' ');
                    if (cs.length > 0) {
                        cs.forEach(classe => classes = classes + ' ' + classe);
                    }
                });
            ngClasse = {};
            ngClasse[classes] = true;
        }
        if (this.pNgClasseDefs && this.pNgClasseDefs.length > 0) {
            if (!ngClasse) {
                ngClasse = {};
            }
            this.pNgClasseDefs.forEach(
                ngClasseDef => ngClasse[ngClasseDef.nom] = !ngClasseDef.active || ngClasseDef.active()
            );
        }
        return ngClasse;
    }

    get classe(): KfNgClasse {
        let ngClasse: { [noms: string]: boolean | (() => boolean) };
        ngClasse = this.pSuitLesClasses ? this.pSuitLesClasses.ngClasseSansInvisible() : this.ngClasseSansInvisible();
        if (this.ngInvisible) {
            if (!ngClasse) {
                ngClasse = {};
            }
            ngClasse[this.ngInvisible.nom] = this.ngInvisible.active ? this.ngInvisible.active() : true;
        }
        return ngClasse;
    }

    fixeStyleDef(nom: string, valeur: KfStringDef, active?: () => boolean) {
        let def: KfNgStyleDef;
        if (this.pStyleDefs) {
            def = this.pStyleDefs.find(d => d.nom === nom);
        }
        if (!def) {
            def = new KfNgStyleDef();
            def.nom = nom;
            if (!this.pStyleDefs) {
                this.pStyleDefs = [];
            }
            this.pStyleDefs.push(def);
        }
        def.valeur = valeur;
        def.active = active;
    }
    supprimeStyleDef(nom: string) {
        const index = this.pStyleDefs.findIndex(d => d.nom === nom);
        if (index !== -1) {
            this.pStyleDefs.splice(index, 1);
            if (this.pStyleDefs.length === 0) {
                this.pStyleDefs = undefined;
            }
        }
    }
    effaceStyles() {
        this.pStyleDefs = undefined;
    }

    get style(): KfNgStyle {
        if (this.pSuitLeStyle) {
            return this.pSuitLeStyle.style;
        }
        if (this.pStyleDefs) {
            const defs = this.pStyleDefs.filter(d => !d.active || d.active());
            if (defs.length > 0) {
                const style: KfNgStyle = {};
                this.pStyleDefs.forEach(d => style[d.nom] = ValeurStringDef(d.valeur));
                return style;
            }
        }
    }


    get avecClassesOuStyle(): boolean {
        return !!this.pClasseDefs || !!this.pNgClasseDefs || !!this.pStyleDefs;
    }

    /**
     * Copie les classes et les styles du gereCss passé en paramétre.
     */
    copieClassesEtStyle(gereCss: KfGéreCss) {
        if (gereCss.pClasseDefs) {
            this.pClasseDefs = gereCss.pClasseDefs.map(def => def);
        }
        if (gereCss.pNgClasseDefs) {
            this.pNgClasseDefs = gereCss.pNgClasseDefs.map(def => def);
        }
        if (gereCss.pStyleDefs) {
            this.pStyleDefs = gereCss.pStyleDefs.map(def => def.clone());
        }
    }

    /**
     * Ajoute les classes et les styles du gereCss passé en paramétre.
     */
    ajouteClassesEtStyle(gereCss: KfGéreCss) {
        if (gereCss.pClasseDefs) {
            if (!this.pClasseDefs) {
                this.pClasseDefs = [];
            }
            this.pClasseDefs = this.pClasseDefs.concat(gereCss.pClasseDefs);
        }
        if (gereCss.pNgClasseDefs) {
            if (!this.pNgClasseDefs) {
                this.pNgClasseDefs = [];
            }
            this.pNgClasseDefs = this.pNgClasseDefs.concat(gereCss.pNgClasseDefs);
        }
        if (gereCss.pStyleDefs) {
            if (!this.pStyleDefs) {
                this.pStyleDefs = [];
            }
            this.pStyleDefs = this.pStyleDefs.concat(gereCss.pStyleDefs);
        }
    }
}
