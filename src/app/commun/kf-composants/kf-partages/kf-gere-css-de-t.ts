import { KfGéreCss } from './kf-gere-css';
import { KfNgClasse, KfNgClasseDefDe } from './kf-gere-css-classe';
import { KfStringDefDe } from './kf-string-def';

export class KfGéreCssDe<T> {

    private pClasseDefs: KfStringDefDe<T>[];

    private pNgClasseDefs: KfNgClasseDefDe<T>[];

    // CLASSES

    /**
     * Remplace dans la liste chaque string par les mots qui la composent.
     * @param stringDefs liste de string ou de () => string
     */
     private motsOuFonctions(stringDefs: KfStringDefDe<T>[]): KfStringDefDe<T>[] {
        const motsOuFonctions: KfStringDefDe<T>[] = [];
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

    private _créeArray(nomsDef: string | string[]): string[] {
        if (typeof (nomsDef) === 'string') {
            return nomsDef.trim().split(' ');
        } else {
            let noms: string[] = [];
            nomsDef.forEach(n => noms = noms.concat(this._créeArray(n)));
            return noms;
        }
    }
    private _ajouteNg(nomsDef: string | string[] | { nom: string | string[], active?: (t: T) => boolean }) {
        if (!this.pNgClasseDefs) {
            this.pNgClasseDefs = [];
        }
        let noms = [];
        let active: (t: T) => boolean;
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
                ngc = new KfNgClasseDefDe<T>();
                ngc.nom = n;
                ngc.active = active;
                this.pNgClasseDefs.push(ngc);
            }
        });
    }

    private _ajouteStringDef(classeDef: KfStringDefDe<T>) {
        if (!this.pClasseDefs) {
            this.pClasseDefs = [];
        }
        const stringDef: KfStringDefDe<T>[] = [classeDef]
        this.motsOuFonctions(stringDef).forEach(
            c => {
                if (!this.pClasseDefs.find(cd => c === cd)) {
                    this.pClasseDefs.push(c);
                }
            }
        );
    }

    private _ajouteClasseDef(classeDef: KfStringDefDe<T> | KfNgClasseDefDe<T>) {
        if (typeof (classeDef) === 'string' || typeof (classeDef) === 'function') {
            this._ajouteStringDef(classeDef as KfStringDefDe<T>);
        } else {
            const ng = classeDef as KfNgClasseDefDe<T>;
            this._ajouteNg(ng);
        }
    }

    ajouteClasse(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        classeDefs.forEach(classeDef => this._ajouteClasseDef(classeDef));
    }

    supprimeClasse(...classeDefs: KfStringDefDe<T>[]): void {
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
                return (c as KfNgClasseDefDe<T>).nom === ng.nom;
            }));
            if (this.pNgClasseDefs.length === 0) {
                this.pNgClasseDefs = undefined;
            }
        }
    }

    classe(t: T): KfNgClasse {
        let ngClasse: { [noms: string]: boolean | (() => boolean) };
        if (this.pClasseDefs && this.pClasseDefs.length > 0) {
            let classes = '';
            this.pClasseDefs.forEach(
                classeDef => {
                    const texteClasse = typeof (classeDef) === 'string' ? classeDef : classeDef(t);
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
                ngClasseDef => ngClasse[ngClasseDef.nom] = !ngClasseDef.active || ngClasseDef.active(t)
            );
        }
        return ngClasse;
    }

    ajouteAgéreCss(t: T, géreCss: KfGéreCss) {
        if (this.pClasseDefs && this.pClasseDefs.length > 0) {
            this.pClasseDefs.forEach(
                classeDef => {
                    géreCss.ajouteClasse(typeof (classeDef) === 'string' ? classeDef : classeDef(t));
                });
        }
        if (this.pNgClasseDefs && this.pNgClasseDefs.length > 0) {
            this.pNgClasseDefs.forEach(
                ngClasseDef => {
                    géreCss.ajouteClasse({ nom: ngClasseDef.nom, active: ngClasseDef.active ? () => ngClasseDef.active(t) : undefined });
                });
        }
        return géreCss;
    }

    créeGéreCss(t: T): KfGéreCss {
        const géreCss = new KfGéreCss();
        this.ajouteAgéreCss(t, géreCss);
        return géreCss;
    }
}
