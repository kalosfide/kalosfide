import { KfGéreCss } from './kf-gere-css';
import { KfNgClasse, KfNgClasseDefDe } from './kf-gere-css-classe';

export class KfGéreCssDe<T> {

    private pClasseDefs: (string | ((t: T) => string))[];

    private pNgClasseDefs: KfNgClasseDefDe<T>[];

    // CLASSES

    private _ajouteClasseDef(classeDef: string | ((t: T) => string) | KfNgClasseDefDe<T>) {
        if ((classeDef as KfNgClasseDefDe<T>).nom) {
            const ng = classeDef as KfNgClasseDefDe<T>;
            if (!this.pNgClasseDefs) {
                this.pNgClasseDefs = [ng];
            } else {
                this.pNgClasseDefs.push(ng);
            }
        } else {
            if (!this.pClasseDefs) {
                this.pClasseDefs = [];
            }
            if (typeof (classeDef) === 'string') {
                this.pClasseDefs.push(classeDef);
            } else {
                this.pClasseDefs.push(classeDef as (t: T) => string);
            }
        }
    }

    ajouteClasseDef(...classeDefs: (string | ((t: T) => string) | KfNgClasseDefDe<T>)[]): void {
        classeDefs.forEach(classeDef => this._ajouteClasseDef(classeDef));
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
