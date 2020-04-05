import { ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl, Validators } from '@angular/forms';
import { KfComposant } from '../kf-composant/kf-composant';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { KfGroupe } from '../kf-groupe/kf-groupe';
import { KfInputNombre } from '../kf-elements/kf-input/kf-input-nombre';

export class KfValidateur {
    nom: string;
    validatorFn: ValidatorFn;
    asyncValidatorFn: AsyncValidatorFn;
    message: string;

    marqueErreur: (a: AbstractControl) => void;
}

class KfValidateurDoublon extends KfValidateur {
    doublon: any;

    constructor(nom: string, message: string) {
        super();
        this.nom = nom;
        this.validatorFn = (a: AbstractControl): ValidationErrors => this._validatorFn(a);
        this.marqueErreur = (a: AbstractControl) => {
            this.doublon = a.value;
        };
        this.message = message;
    }

    private _validatorFn(a: AbstractControl): ValidationErrors {
        const errors: ValidationErrors = {};
        if (a.value === this.doublon) {
            errors[this.nom] = {
                value: a.value
            };
            return errors;
        }
        return null;
    }
}

export class KfValidateurs {

    static chiffres = '0123456789';

    static minuscules = 'abcdefghijklmnopqrstuvwxyz';

    static contientUnDans(texte: string, liste: string): boolean {
        for (const c of liste) {
            if (texte.includes(c)) {
                return true;
            }
        }
        return false;
    }

    static contientUnHorsDe(texte: string, liste: string): boolean {
        if (!texte) {
            return false;
        }
        for (const c of texte) {
            if (!liste.includes(c)) {
                return true;
            }
        }
        return false;
    }

    static validateurDeFn(nom: string, invalideFn: (value: any) => boolean, message: string | (() => string)): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.validatorFn = (a: AbstractControl): ValidationErrors => {
            const errors: ValidationErrors = {};
            if (invalideFn(a.value)) {
                errors[nom] = {
                    value: message
                };
                return errors;
            }
            return null;
        };
        if (typeof(message) === 'string') {
            validateur.message = message;
        } else {
            validateur.message = message();
        }
        return validateur;
    }

    static validateurDoublon(nom: string, message: string): KfValidateur {
        return new KfValidateurDoublon(nom, message);
    }

    static validateur(nom: string, validatorFn: ValidatorFn, message: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.validatorFn = validatorFn;
        validateur.message = message;
        return validateur;
    }

    static validateurAsync(nom: string, invalideFn: (value: any) => Observable<boolean>, message: string): KfValidateur {
        const validateur = new KfValidateur();
        validateur.nom = nom;
        validateur.asyncValidatorFn = (a: AbstractControl): Observable<ValidationErrors> => {
            return invalideFn(a.value).pipe(
                map(invalide => {
                    if (invalide) {
                        const errors: ValidationErrors = {};
                        errors[nom] = { value: a.value };
                        return errors;
                    }
                    return null;
                }),
                catchError(() => null)
            );
        };
        validateur.message = message;
        return validateur;
    }

    static get required(): KfValidateur {
        return KfValidateurs.validateur('required', Validators.required, 'Ce champ est requis.');
    }

    static get requiredTrue(): KfValidateur {
        return KfValidateurs.validateur('requiredTrue', Validators.requiredTrue, 'Ce champ doit être coché.');
    }

    static min(valeur: number): KfValidateur {
        return KfValidateurs.validateur(
            'min',
            Validators.min(valeur),
            `Le nombre doit être supérieur ou égal à ${valeur}`
        );
    }

    static max(valeur: number): KfValidateur {
        return KfValidateurs.validateur(
            'max',
            Validators.max(valeur),
            `Le nombre doit être inférieur ou égal à ${valeur}`
        );
    }

    static longueurMin(valeur: number): KfValidateur {
        return KfValidateurs.validateur(
            'minLength',
            Validators.minLength(valeur),
            `Il doit y avoir au moins ${valeur} caractères`
        );
    }

    static longueurMax(valeur: number): KfValidateur {
        return KfValidateurs.validateur(
            'maxLength',
            Validators.maxLength(valeur),
            `Il doit y avoir au plus ${valeur} caractères`
        );
    }

    static get email(): KfValidateur {
        return KfValidateurs.validateur('email', Validators.email, `L'adresse mail est invalide.`);
    }

    static get noSpaces(): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'NoSpaces',
            (texte: string) => {
                return !!texte && texte.includes(' ');
            },
            `Il ne doit pas y avoir d'espaces`);
    }

    static requiredLength(valeur: number): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'requiredLength',
            (texte: string) => {
                return !!texte && texte.length < valeur;
            },
            `Il doit y avoir au moins ${valeur} caractères`);
    }

    static get requireDigit(): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'requireDigit',
            (texte: string) => !!texte && !KfValidateurs.contientUnDans(texte, KfValidateurs.chiffres),
            'Il doit y avoir au moins un chiffre.');
    }

    static get requireLowercase(): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'requireLowercase',
            (texte: string) => !!texte && !KfValidateurs.contientUnDans(texte, KfValidateurs.minuscules),
            'Il doit y avoir au moins une lettre minuscule.');
    }

    static get requireUppercase(): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'requireUppercase',
            (texte: string) => !!texte && !KfValidateurs.contientUnDans(texte, KfValidateurs.minuscules.toUpperCase()),
            'Il doit y avoir au moins une lettre majuscule.');
    }

    static get requireNonAlphanumeric(): KfValidateur {
        const valides = KfValidateurs.chiffres.concat(KfValidateurs.minuscules, KfValidateurs.minuscules.toUpperCase());
        return KfValidateurs.validateurDeFn(
            'requireNonAlphanumeric',
            (texte: string) =>
                !!texte && !KfValidateurs.contientUnHorsDe(texte, valides),
            'Il doit y avoir au moins un caractère non alphanumèrique.');
    }

    static aLaValeurDe(valeur: any): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'aLaValeurDe',
            (value: any) => {
                return value !== valeur;
            },
            `La valeur n'est pas celle de ${valeur.toString()}`);
    }

    static nAPasLaValeurDe(valeur: any): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'nAPasLaValeurDe',
            (value: any) => {
                return value === valeur;
            },
            `La valeur doit être différente de ${valeur.toString()}`);
    }

    static aLaValeurDeComposant(composant: KfComposant): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'aLaValeurDeComposant',
            (value: any) => {
                return value !== composant.abstractControl.value;
            },
            `La valeur n'est pas celle de ${composant.texte}`);
    }

    static contenuDans(liste: any[]): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'contenuDans',
            (value: any) => {
                return liste.find(a => a === value) === undefined;
            },
            `La valeur n'est pas contenue dans ${liste.toString()}`);
    }

    static nonContenuDans(liste: any[]): KfValidateur {
        return KfValidateurs.validateurDeFn(
            'contenuDans',
            (value: any) => {
                return liste.find(a => a === value) !== undefined;
            },
            `La valeur doit être dans la liste ${liste.toString()}`);
    }

    static get nombreNonNul(): KfValidateur {
        return KfValidateurs.validateurDeFn('nonNul', valeur => {
            return '' + valeur === '0';
        }, 'Le nombre ne peut pas être nul.');
    }

    static auMoinsUnRequis(...champs: { nom: string, texte: string }[]) {
        const invalideFn = (value: any) => {
            const champ = champs.find(c => {
                const v = value[c.nom];
                return v !== null && v !== undefined && v !== '';
            });
            return champ === undefined;
        };
        const liste = champs.map(c => c.texte).join(', ');
        return KfValidateurs.validateurDeFn('auMoinsUnRequis', invalideFn, `L'un au moins de ces champs est requis: ${liste}`);
    }

    static auMoinsUn(message: string, ...champs: { nom: string, texte: string, valideFnc: (valeur: any) => boolean }[]) {
        const invalideFn = (value: any) => {
            const champ = champs.find(c => {
                const v = value[c.nom];
                return c.valideFnc(v);
            });
            return champ === undefined;
        };
        const liste = champs.map(c => c.texte).join(', ');
        return KfValidateurs.validateurDeFn('auMoinsUn', invalideFn, `L'un au moins de ces champs ${message}: ${liste}`);
    }

    static minMax(input: KfInputNombre): KfValidateur {
        return KfValidateurs.validateurDeFn('minMax', (valeur: any) => {
            return valeur < input.min || valeur > input.max;
        }, `Le nombre doit être compris entre ${input.min} et ${input.max}`);
    }

    static fixeMessage(validateurs: KfValidateur[], errorKey: string, errorValue?: any): string {
        let validateur: KfValidateur;
        if (validateurs) {
            const nom = errorKey.toLowerCase();
            const requireds: KfValidateur[] = [KfValidateurs.required, KfValidateurs.requiredTrue];
            if (nom === KfValidateurs.required.nom.toLowerCase()) {
                validateur = validateurs.find(v => v.nom === KfValidateurs.requiredTrue.nom);
                if (!validateur) {
                    validateur = validateurs.find(v => v.nom === KfValidateurs.required.nom);
                }
            } else {
                validateur = validateurs.find(v => v.nom.toLowerCase() === nom);
            }
        }
        const message = validateur ? validateur.message : `Erreur ${errorKey}: ${errorValue}`;
        return message;
    }

    static nombreVirgule(
        nbChiffresAvantFnc: number | (() => number), nbChiffresAprèsFnc: number | (() => number),
        avecSigne?: '<' | '<=' | '>' | '>='): KfValidateur {
        const invalideFn = (valeur: any): boolean => {
            let nbChiffresAvant: number;
            if (typeof(nbChiffresAvantFnc) === 'number') {
                nbChiffresAvant = nbChiffresAvantFnc;
            } else {
                nbChiffresAvant = nbChiffresAvantFnc();
            }
            let nbChiffresAprès: number;
            if (typeof(nbChiffresAprèsFnc) === 'number') {
                nbChiffresAprèsFnc = nbChiffresAprèsFnc;
            } else {
                nbChiffresAprès = nbChiffresAprèsFnc();
            }
            const nombre = KfValidateurs.vérifieEtFormateNombre(valeur, nbChiffresAvant, nbChiffresAprès, avecSigne);
            return Number.isNaN(nombre);
        };
        const messageFn = (): string => {
            let nbChiffresAvant: number;
            if (typeof(nbChiffresAvantFnc) === 'number') {
                nbChiffresAvant = nbChiffresAvantFnc;
            } else {
                nbChiffresAvant = nbChiffresAvantFnc();
            }
            let nbChiffresAprès: number;
            if (typeof(nbChiffresAprèsFnc) === 'number') {
                nbChiffresAprèsFnc = nbChiffresAprèsFnc;
            } else {
                nbChiffresAprès = nbChiffresAprèsFnc();
            }
            let message = 'Le nombre ';
            if (avecSigne) {
                message = message + `doit être ${avecSigne === '<'
                    ? 'strictement négatif'
                    : avecSigne === '<='
                        ? 'négatif ou null'
                        : avecSigne === '>'
                            ? 'strictement positif'
                            : 'positif'
                    } et `;
            }
            message = message + `doit avoir au plus ${nbChiffresAvant} chiffres avant la virgule et ${nbChiffresAprès === 0
                ? 'aucun chiffre'
                : 'au plus ' + (nbChiffresAprès === 1
                    ? 'un chiffre'
                    : '' + nbChiffresAprès + ' chiffres')} après la virgule.`;
            return message;
        };
        return KfValidateurs.validateurDeFn('virgule', invalideFn, messageFn);
    }
    static vérifieEtFormateNombre(valeur: any,
                                  nbChiffresAvant: number,
                                  nbChiffresAprès: number,
                                  avecSigne?: '<' | '<=' | '>' | '>='
    ): number {
        if (valeur === undefined || valeur === null) {
            return valeur;
        }
        const nombre = parseFloat(valeur);
        if (Number.isNaN(nombre)) {
            return NaN;
        }
        if (nombre === 0) {
            return avecSigne === '<' || avecSigne === '>' ? NaN : 0;
        }
        let texte1 = nombre.toString();
        let négatif: boolean;
        if (texte1.charAt(0) === '-') {
            négatif = true;
            texte1 = texte1.slice(1);
        }
        const textes = texte1.split('.');
        if (négatif) {
            if (avecSigne === '>' || avecSigne === '>=') {
                return NaN;
            }
        } else {
            if (avecSigne === '<' || avecSigne === '<=') {
                return NaN;
            }
        }
        const entière = textes[0].length;
        if (entière > nbChiffresAvant) {
            return NaN;
        }
        if (textes.length === 1) {
            return nombre;
        }
        // il y a des chiffres après
        if (nbChiffresAprès === 0) {
            return NaN;
        }
        if (textes[1].length > nbChiffresAprès) {
            return NaN;
        }
        return nombre;
    }
}
