import { KfGéreCss } from 'src/app/commun/kf-composants/kf-partages/kf-gere-css';
import { KfAvecLabel } from '../kf-composant/kf-avecLabel';
import { KfComposant } from '../kf-composant/kf-composant';
import { KfTypeDeComposant } from '../kf-composants-types';
import { KfCaseACocher } from '../kf-elements/kf-case-a-cocher/kf-case-a-cocher';
import { KfInput } from '../kf-elements/kf-input/kf-input';
import { KfInputDateTemps } from '../kf-elements/kf-input/kf-input-date-temps';
import { KfInputTexte } from '../kf-elements/kf-input/kf-input-texte';
import { KfTypeDInput } from '../kf-elements/kf-input/kf-type-d-input';
import { KfListeDeroulanteBase } from '../kf-elements/kf-liste-deroulante/kf-liste-deroulante-base';
import { KfRadio } from '../kf-elements/kf-radios/kf-radio';
import { KfRadios } from '../kf-elements/kf-radios/kf-radios';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { IKfVueTable } from '../kf-vue-table/kf-vue-table';
import { KfTypeDHTMLEvents, KfTypeDEvenement, KfEvenement, KfStatutDEvenement } from './kf-evenements';

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
     * et son KfInput, KfListeDéroulante, KfRadios, KfCaseACocher sont chacun dans une colonne.
     */
    label?: KfBootstrapLabelOptions;
    /**
     * Si présent et vrai, la valeur est affichée comme du texte brut quand l'entrée est en lecture seule.
     * Par défaut, une entrée en lecture seule est affichée comme si elle était inactive.
     * A un effet sur KfInput, KfListeDéroulante.
     */
    texteBrutSiLectureSeule?: boolean,
    /**
     * Si présent, la case à cocher ou le radio est affiché comme un bouton.
     * Si présent, l'option label est ignorée.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    bouton?: {
        nom: BootstrapType,
        outline?: 'outline',
        nomChecked?: BootstrapType,
        outlineChecked?: 'outline',
    },
    /**
     * Si présent et vrai, la case à cocher ou le radio et son label seront entourés d'une div quand ils sont dans une vueTable.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    dansVueTable?: boolean,
    /**
     * Si présent et vrai, des cases à cocher ou des radios sont affichés en ligne.
     * Si présent et vrai, l'option label est ignorée.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    inline?: boolean,
    /**
     * Si présent et vrai, la case à cocher ou le radio est affiché comme un interrupteur.
     * A un effet sur KfRadio, KfCaseACocher.
     */
    interrupteur?: boolean,
    /**
     * Si présent et vrai, le composant et son composant avant sont adaptés pour
     * être affichés dans un InputGroup de Bootstrap.
     * Si présent et vrai, l'option label est ignorée.
     * A un effet sur KfInput, KfListeDéroulante, KfRadio, KfCaseACocher.
     */
    dansInputGroup?: boolean;
    /**
     * Si présent et si le composant peut avoir une div globale dans son template, applique cette classe à la div.
     */
    classeDiv?: string;
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

    private static prépareValidation(composant: KfComposant, àPréparer?: KfGéreCss) {
        if (composant.estValidable) {
            if (!àPréparer) {
                àPréparer = composant;
            }
            àPréparer.ajouteClasse(
                { nom: 'is-invalid', active: () => composant.estInvalide },
            )
        }
    }

    private static prépareClasseDiv(avecLabel: KfAvecLabel, options: IKfBootstrapOptions) {
        if (options.classeDiv) {
            avecLabel.géreClasseDiv.ajouteClasse(options.classeDiv);
        }
    }

    private static prépareCaseACocherOuRadio(input: KfCaseACocher | KfRadio, options: IKfBootstrapOptions) {
        KfBootstrap.prépareClasseDiv(input, options);
        if (options.bouton) {
            input.ajouteClasse('btn-check');
            input.label.ajouteClasse('btn');
            input.label.gereHtml.ajouteEvenementASuivre(KfTypeDHTMLEvents.click);
            input.label.gereHtml.ajouteTraiteur(KfTypeDEvenement.click,
                (évenement: KfEvenement) => {
                    évenement.statut = KfStatutDEvenement.fini;
                    input.gereHtml.htmlElement.click();
                });
                const classe = KfBootstrap.classe('btn', options.bouton.nom, options.bouton.outline);
            if (options.bouton.nomChecked) {
                let coché: () => boolean;
                if (input.type === KfTypeDeComposant.caseacocher) {
                    const caseACocher = input as KfCaseACocher;
                    coché = () => caseACocher.valeur;
                } else {
                    coché = () => input.gereHtml.attribut('checked') !== undefined
                }
                input.label.ajouteClasse({
                    nom: classe,
                    active: () => !coché()
                }, {
                    nom: KfBootstrap.classe('btn', options.bouton.nomChecked, options.bouton.outlineChecked),
                    active: () => coché()
                })
            } else {
                input.label.ajouteClasse(classe);
            }
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
        KfBootstrap.prépareValidation(caseACocher);
        KfBootstrap.prépareValidation(caseACocher, caseACocher.géreClasseEntree);
        if (options.label && typeof (options.label) !== 'string') {
            const classe: { label: string, entrée: string } = KfBootstrap.classesColonnes(options.label);
            caseACocher.géreClasseDiv.ajouteClasse('form-group row');
            caseACocher.géreClasseDivVide.ajouteClasse(classe.label, 'col-form-label');
            caseACocher.géreClasseEntree.ajouteClasse(classe.entrée);
            return;
        }
        if (options.dansVueTable) {
            const estDansVueTable = () => caseACocher.estDansVueTable;
            caseACocher.géreClasseEntree.ajouteClasse(
                { nom: 'form-group', active: estDansVueTable },
            );
        }
    }

    static prépareRadio(radio: KfRadio, options: IKfBootstrapOptions) {
        KfBootstrap.prépareCaseACocherOuRadio(radio, options);
    }

    private static prépareLabel(entrée: KfInput | KfListeDeroulanteBase | KfRadios, options: IKfBootstrapOptions) {
        if ((options.label && options.label === 'nePasAfficherLabel') || options.dansInputGroup) {
            entrée.label.nePasAfficher = true;
            return;
        }
        if (!options.label) {
            entrée.label.ajouteClasse('form-label');
            return;
        }
        if (typeof (options.label) !== 'string') {
            const classe: { label: string, entrée: string } = KfBootstrap.classesColonnes(options.label);
            entrée.géreClasseDiv.ajouteClasse('row');
            entrée.label.ajouteClasse(classe.label, 'col-form-label');
            entrée.géreClasseEntree.ajouteClasse(classe.entrée);
            return;
        }
        if (options.label === 'labelFlottant') {
            if (entrée.type === KfTypeDeComposant.input || entrée.type === KfTypeDeComposant.listederoulante) {
                const input = entrée as KfInput;
                if (!input.placeholder) {
                    input.placeholder = '';
                }
                input.positionLabel = 'après';
                input.géreClasseDiv.ajouteClasse('form-floating');
                return;
            }
        }
        entrée.label.ajouteClasse('form-label');
    }

    private static prépareInputGroup(entrée: KfInput | KfListeDeroulanteBase, options: IKfBootstrapOptions) {
        entrée.label.nePasAfficher = true;
        if (entrée.composantAvant) {
            entrée.composantAvant.ajouteClasse('input-group-text');
        }
        entrée.géreClasseEntree.ajouteClasse('input-group ');
        if (options.taille) {
            entrée.géreClasseEntree.ajouteClasse('input-group-' + options.taille);
        }
    }

    static prépareListe(liste: KfListeDeroulanteBase, options: IKfBootstrapOptions) {
        liste.ajouteClasse('form-select');
        if (options.dansInputGroup) {
            KfBootstrap.prépareInputGroup(liste, options);
            return;
        }
        if (options.taille) {
            liste.ajouteClasse('form-select-' + options.taille);
        }
        KfBootstrap.prépareClasseDiv(liste, options);
        KfBootstrap.prépareValidation(liste);
        KfBootstrap.prépareLabel(liste, options);
    }

    static prépareInput(input: KfInput, options: IKfBootstrapOptions) {
        if (input.typeDInput === KfTypeDInput.datetemps) {
            input.ajouteClasse('input-group form-inline')
            const dateTemps = input as KfInputDateTemps;
            dateTemps.inputDate.ajouteClasse('form-control');
            dateTemps.inputDate.label.nePasAfficher = true;
            dateTemps.inputTemps.ajouteClasse('form-control');
            dateTemps.inputTemps.label.nePasAfficher = true;
            KfBootstrap.prépareValidation(input);
            return;
        }
        KfBootstrap.prépareClasseDiv(input, options);
        if (options.texteBrutSiLectureSeule) {
            input.ajouteClasse(
                { nom: 'form-control', active: () => !input.lectureSeule },
                { nom: 'form-control-plaintext', active: () => input.lectureSeule },
            )
        } else {
            input.ajouteClasse('form-control');
        }
        let texte: KfInputTexte
        if ((input as KfInputTexte).iconesBoutons) {
            texte = input as KfInputTexte;
            let classe = 'kf-input-icone';
            if (options.taille) {
                classe += '-' + options.taille;
            }
            texte.iconesBoutons.forEach(ib => ib.icone.ajouteClasse(classe));
        }
        if (options.dansInputGroup) {
            if (texte) {
                texte.ajouteCssDivBouton('form-control');
                texte.cssDivBouton.fixeStyleDef('padding', '0');
                texte.cssDivBouton.fixeStyleDef('border', '0');
            }
            if (options.taille) {
                input.ajouteClasse('form-control-' + options.taille)
            }
            KfBootstrap.prépareInputGroup(input, options);
            return;
        }
        if (options.taille) {
            input.ajouteClasse('form-control-' + options.taille)
        }
        KfBootstrap.prépareValidation(input);
        KfBootstrap.prépareLabel(input, options);
    }

    static prépareRadios(radios: KfRadios, options: IKfBootstrapOptions) {
        KfBootstrap.prépareValidation(radios);
        KfBootstrap.prépareLabel(radios, options);
    }

    static prépareToolbar(groupe: KfGroupe, ariaLabel?: string) {
        groupe.ajouteClasse('btn-toolbar');
        groupe.gereHtml.fixeAttribut('role', 'toolbar');
        groupe.gereHtml.fixeAttribut('aria-label', ariaLabel);
    }

    static prépareVueTable(vueTable: IKfVueTable, options: IKfBootstrapOptions) {
        if (vueTable.outils) {
            KfBootstrap.prépareToolbar(vueTable.outils.groupe, 'outils');
        }
        if (vueTable.pagination) {
            KfBootstrap.prépareToolbar(vueTable.pagination.groupe, 'pagination');
        }
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
                case KfTypeDeComposant.groupe:
                    if (options.dansInputGroup) {
                        composant.ajouteClasse('input-group');
                        if (options.taille) {
                            composant.ajouteClasse('input-group-' + options.taille);
                            // les contenus ne doivent pas fixer leur taille
                            options.taille = undefined;
                        }
                        composant.contenus.forEach(c => prépare(c));
                    }
                    break;
                default:
                    if (options.dansInputGroup) {
                        composant.ajouteClasse('input-group-text');
                    }
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
