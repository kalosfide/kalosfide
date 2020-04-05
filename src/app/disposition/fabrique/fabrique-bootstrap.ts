import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';

export type BootstrapType = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark' | 'link';
export enum BootstrapNom {
    success = 'success',
    info = 'info',
    warning = 'warning',
    danger = 'danger',
    primary = 'primary',
    secondary = 'secondary',
    light = 'light',
    dark = 'dark',
    link = 'link',
}

export class FabriqueBootstrap {
    static nom = {
        success: 'success',
        info: 'info',
        warning: 'warning',
        danger: 'danger',
        primary: 'primary',
        secondary: 'secondary',
        light: 'light',
        dark: 'dark',
        link: 'link',
    };

    static classe(préfixe: string, nom: string, outline?: 'outline'): string {
        return préfixe + '-' + (outline ? 'outline-' : '') + nom;
    }

    static classes(préfixe: string): string[] {
        const classes: string[] = [];
        const noms = Object.keys(FabriqueBootstrap.nom);
        noms.forEach(nom => {
            classes.push(this.classe(préfixe, nom), this.classe(préfixe, nom, 'outline'));
        });
        return classes;
    }

    static ajouteClasse(géreCss: KfGéreCss, préfixe: string, nom: BootstrapType, outline?: 'outline' | null) {
        géreCss.ajouteClasseDef(préfixe);
        géreCss.supprimeClasseDefArray(FabriqueBootstrap.classes(préfixe));
        géreCss.ajouteClasseDef(FabriqueBootstrap.classe(préfixe, nom, outline));
    }
}
