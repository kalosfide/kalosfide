import { KfSuperGroupe } from 'src/app/commun/kf-composants/kf-groupe/kf-super-groupe';
import { KfValidateur } from 'src/app/commun/kf-composants/kf-partages/kf-validateur';
import { FabriqueFormulaire } from 'src/app/disposition/fabrique/fabrique-formulaire';
import { ApiErreur400 } from './api-erreur-400';
import { ApiResultErreur } from './api-result-erreur';

export class ApiResult400BadRequest extends ApiResultErreur {
    static code = 400;

    apiErreurs: ApiErreur400[];

    constructor(
        validationErrors: { [keys: string]: string[] }
    ) {
        super(400);
        this. titre = 'Données invalides';
        this.apiErreurs = validationErrors
        ? Object.keys(validationErrors).map(key => {
            const v = validationErrors[key];
            return {
                champ: key,
                code: validationErrors[key][0]
            };
        })
        : [{
            champ: '2',
            code: '400 bad Request'
        }];
    }

    créeMessages(
        formulaire: KfSuperGroupe
    ) {
        let validateurs: KfValidateur[];
        let validateur: KfValidateur;
        let details: string[] = [];
        let traitées: ApiErreur400[];
        let apiErreurs = this.apiErreurs;
        if (formulaire) {
            if (formulaire.gereValeur) {
                const édition = formulaire.contenus.find(c => c.nom === FabriqueFormulaire.nomEdition);
                const champs = édition.gereValeur.contenus;
                champs.forEach(c => {
                    validateurs = c.gereValeur.Validateurs;
                    if (!validateurs) {
                        return;
                    }
                    traitées = [];
                    apiErreurs.filter(e => e.champ.toLowerCase() === c.nom.toLowerCase()).forEach(e => {
                        validateur = validateurs.find(v => v.nom.toLowerCase() === e.code.toLowerCase());
                        if (validateur && validateur.marqueErreur) {
                            validateur.marqueErreur(c.abstractControl);
                            traitées.push(e);
                            details.push(validateur.message);
                        }
                    });
                    apiErreurs = apiErreurs.filter(e => !traitées.find(t => t.champ === e.champ && t.code === e.code));
                });
                // erreurs du formulaire
                const erreursDuFormulaire = apiErreurs.filter(e => e.champ === '2');
                if (erreursDuFormulaire.length > 0) {
                    validateurs = formulaire.gereValeur.Validateurs;
                    if (validateurs) {
                        validateur = validateurs.find(v => v.marqueErreur);
                        if (validateur) {
                            validateur.marqueErreur(formulaire.abstractControl);
                        }
                    }
                }
                details = details.concat(erreursDuFormulaire.map(e => e.code));
                apiErreurs = apiErreurs.filter(e => e.champ !== '2');
            }
            // erreurs qui ne devraient pas exister
            details = details.concat(apiErreurs.map(e => {
                return `Erreur: { champ: ${e.champ}, code: ${e.code}}`;
            }));
        }
    }
}
