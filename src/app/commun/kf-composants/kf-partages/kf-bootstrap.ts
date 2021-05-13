import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfCaseACocher } from '../kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfInput } from '../kf-elements/kf-input/kf-input';
import { KfInputDateTemps } from '../kf-elements/kf-input/kf-input-date-temps';
import { KfTypeDInput } from '../kf-elements/kf-input/kf-type-d-input';
import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import { KfRadio } from '../kf-elements/kf-radios/kf-radio';
import { KfRadios } from '../kf-elements/kf-radios/kf-radios';
import { KfGroupe } from '../kf-groupe/kf-groupe';

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

export type KfBootstrapColOptions = {
    breakpoint?: 'sm' | 'md' | 'sg' | 'sm'
    width?: number
};

export type KfBootstrapLabelOptions = 'nePasAfficherLabel' | 'labelFlottant' | KfBootstrapColOptions;

export interface IKfBootstrapOptions {
    taille?: 'sm' | 'lg';
    /**
     * Si présent et égal à 'nePasAfficherLabel', le label n'est pas dans le template.
     * Si présent et égal à 'labelFlottant', le label est flottant.
     * Si présent et égal à un objet colonneLabel, le label (ou une div vide dans le cas KfCaseACocher)
     * et le KfInput, KfListeDéroulante, KfRadios, KfCaseACocher sont chacun dans une colonne.
     */
    label?: KfBootstrapLabelOptions;
    /**
     * Si présent et vrai, la valeur est affichée comme du texte brut quand l'entrée est en lecture seule.
     * Par défaut, une entrée en lecture seule est affichée comme si elle était inactive.
     * A un effet sur KfInput et KfListeDéroulante.
     */
    texteBrutSiLectureSeule?: boolean,
    /**
     * Si présent, la case à cocher ou le radio est affiché comme un bouton.
     * Si présent, l'option colonneLabel est ignorée.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    bouton?: {
        nom: BootstrapType,
        outline?: 'outline'
    },
    /**
     * Si présent, des cases à cocher ou des radios sont affichés en ligne.
     * Si présent, l'option colonneLabel est ignorée.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    inline?: boolean,
    /**
     * Si présent, la case à cocher ou le radio est affiché comme un interrupteur.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    interrupteur?: boolean,
}

export class KfBootstrap {
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

    private static _classe(préfixe: string, nom: string, outline?: 'outline'): string {
        return préfixe + '-' + (outline ? 'outline-' : '') + nom;
    }

    static classe(préfixe: string, nom: BootstrapType, outline?: 'outline'): string {
        return KfBootstrap._classe(préfixe, nom, outline);
    }

    static classes(préfixe: string): string[] {
        const classes: string[] = [];
        const noms = Object.keys(KfBootstrap.nom);
        noms.forEach(nom => {
            classes.push(this._classe(préfixe, nom), this._classe(préfixe, nom, 'outline'));
        });
        return classes;
    }

    static ajouteClasse(géreCss: KfGéreCss, préfixe: string, nom: BootstrapType, outline?: 'outline' | null) {
        géreCss.supprimeClasseAPréfixe(préfixe);
        géreCss.ajouteClasse(préfixe, KfBootstrap.classe(préfixe, nom, outline));
    }

    private static classesColonnes(colonneLabel: {
        breakpoint?: 'sm' | 'md' | 'sg' | 'sm'
        width?: number
    }): {
        label: string,
        entrée: string
    } {
        let classeCol = 'col';
        if (colonneLabel.breakpoint) {
            classeCol = classeCol + '-' + colonneLabel.breakpoint;
        }
        const classe: { label: string, entrée: string } = { label: classeCol, entrée: classeCol };
        if (colonneLabel.width) {
            if (!Number.isInteger(colonneLabel.width) || colonneLabel.width <= 0 || colonneLabel.width >= 12) {
                throw new Error('La largeur de la colonne du label doit être un nombre entier de 1 à 11')
            }
            classe.label += '-' + colonneLabel.width;
            classe.entrée += '-' + (12 - colonneLabel.width);
        }
        return classe;
    }

    private static prépareCaseACocherOuRadio(input: KfCaseACocher | KfRadio, options: IKfBootstrapOptions) {
        if (options.bouton) {
            input.ajouteClasse('btn-check');
            KfBootstrap.ajouteClasse(input.label, 'btn', options.bouton.nom, options.bouton.outline);
            return;
        }
        input.ajouteClasse('form-check-input');
        if (options.label === 'nePasAfficherLabel') {
            input.géreClasseEntree.ajouteClasse();
            input.label.nePasAfficher = true;
        } else {
            input.géreClasseEntree.ajouteClasse('form-check');
            if (options.inline) {
                input.géreClasseEntree.ajouteClasse('form-check-inline');
            } else {
                if (options.interrupteur) {
                    input.géreClasseEntree.ajouteClasse('form-switch');
                }
            }
            input.label.ajouteClasse('form-check-label');
        }
    }

    static prépareCaseACocher(caseACocher: KfCaseACocher, options: IKfBootstrapOptions) {
        KfBootstrap.prépareCaseACocherOuRadio(caseACocher, options);
        caseACocher.ajouteClasse(
            { nom: 'is-invalid', active: () => caseACocher.erreurs.length > 0 },
        );
        caseACocher.géreClasseEntree.ajouteClasse(
            { nom: 'is-invalid', active: () => caseACocher.erreurs.length > 0 },
        );
        const estDansVueTable = () => caseACocher.estDansVueTable;
        caseACocher.géreClasseEntree.ajouteClasse(
            { nom: 'form-group', active: estDansVueTable },
        );
        if (options.label && typeof (options.label) !== 'string') {
            const classe: { label: string, entrée: string } = KfBootstrap.classesColonnes(options.label);
            caseACocher.géreClasseDiv.ajouteClasse('form-group row');
            caseACocher.géreClasseDivVide.ajouteClasse(classe.label, 'col-form-label');
            caseACocher.géreClasseEntree.ajouteClasse(classe.entrée);
        } else {
            const estDansVueTable = () => caseACocher.estDansVueTable;
            caseACocher.géreClasseEntree.ajouteClasse(
                { nom: 'form-group', active: estDansVueTable },
            );
        }
    }

    static prépareRadio(radio: KfRadio, options: IKfBootstrapOptions) {
        KfBootstrap.prépareCaseACocherOuRadio(radio, options);
    }

    private static prépareAvecLabelAvant(entrée: KfInput | KfListeDeroulanteBase | KfRadios, colonneLabel: {
        breakpoint?: 'sm' | 'md' | 'sg' | 'sm'
        width?: number
    }) {
        const classe: { label: string, entrée: string } = KfBootstrap.classesColonnes(colonneLabel);
        entrée.géreClasseDiv.ajouteClasse('form-group row');
        entrée.label.ajouteClasse(classe.label, 'col-form-label');
        entrée.géreClasseEntree.ajouteClasse(classe.entrée);
    }

    private static prépareSansLabel(entrée: KfInput | KfListeDeroulanteBase | KfRadios) {
        entrée.label.nePasAfficher = true;
    }

    static prépareAvecLabelFlottant(input: KfInput) {
        if (!input.placeholder) {
            input.placeholder = '';
        }
        input.positionLabel = 'après';
        input.géreClasseDiv.ajouteClasse('form-floating');
    }

    /** */
    private static prépareInputSelectBase(entrée: KfInput | KfListeDeroulanteBase, options: IKfBootstrapOptions) {
        if (options.texteBrutSiLectureSeule) {
            entrée.ajouteClasse(
                { nom: 'form-control', active: () => !entrée.lectureSeule },
                { nom: 'form-control-plaintext', active: () => entrée.lectureSeule },
            )
        } else {
            entrée.ajouteClasse('form-control');
        }
    }

    private static prépareLabel(entrée: KfInput | KfListeDeroulanteBase | KfRadios, options: IKfBootstrapOptions) {
        if (options.label === 'nePasAfficherLabel') {
            KfBootstrap.prépareSansLabel(entrée);
        } else {
            if (options.label && typeof (options.label) !== 'string') {
                KfBootstrap.prépareAvecLabelAvant(entrée, options.label);
            } else {
                if (!options.label || options.label !== 'labelFlottant') {
                    entrée.label.ajouteClasse('form-label');
                }
            }
        }
    }

    private static prépareInputSelect(entrée: KfInput | KfListeDeroulanteBase, options: IKfBootstrapOptions) {
        KfBootstrap.prépareInputSelectBase(entrée, options);
        entrée.ajouteClasse({ nom: 'is-invalid', active: () => entrée.erreurs.length > 0 });
        KfBootstrap.prépareLabel(entrée, options);
    }

    static prépareListe(liste: KfListeDeroulanteBase, options: IKfBootstrapOptions) {
        KfBootstrap.prépareInputSelect(liste, options);
    }

    static prépareInput(input: KfInput, options: IKfBootstrapOptions) {
        if (input.typeDInput === KfTypeDInput.datetemps) {
            input.ajouteClasse('input-group form-inline')
            const dateTemps = input as KfInputDateTemps;
            KfBootstrap.prépareInputSelectBase(dateTemps.inputDate, options);
            KfBootstrap.prépareSansLabel(dateTemps.inputDate);
            KfBootstrap.prépareInputSelectBase(dateTemps.inputTemps, options);
            KfBootstrap.prépareSansLabel(dateTemps.inputTemps);
            input.ajouteClasse(
                { nom: 'is-invalid', active: () => input.erreurs.length > 0 },
            );
        } else {
            KfBootstrap.prépareInputSelect(input, options);
            if (options.label === 'labelFlottant') {
                KfBootstrap.prépareAvecLabelFlottant(input);
            }
        }
    }

    static prépareRadios(radios: KfRadios, options: IKfBootstrapOptions) {
        radios.ajouteClasse({ nom: 'is-invalid', active: () => radios.erreurs.length > 0 });
        KfBootstrap.prépareLabel(radios, options);
    }

    static prépare(àPréparer: KfComposant | KfComposant[], options: IKfBootstrapOptions) {
        const prépare = (composant: KfComposant) => {
            switch (composant.type) {
                case KfTypeDeComposant.input:
                    KfBootstrap.prépareInput(composant as KfInput, options);
                    break;
                case KfTypeDeComposant.listederoulante:
                    KfBootstrap.prépareListe(composant as KfListeDeroulanteBase, options);
                    break;
                case KfTypeDeComposant.caseacocher:
                    KfBootstrap.prépareCaseACocher(composant as KfCaseACocher, options);
                    break;
                case KfTypeDeComposant.radios:
                    KfBootstrap.prépareRadios(composant as KfRadios, options);
                    break;
                case KfTypeDeComposant.radio:
                    KfBootstrap.prépareRadio(composant as KfRadio, options);
                    break;
                default:
                    break;
            }
        }
        if (Array.isArray(àPréparer)) {
            àPréparer.forEach(composant => prépare(composant));
        } else {
            prépare(àPréparer);
        }
    }
}
