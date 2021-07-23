import { CLFGardeService } from 'src/app/modeles/c-l-f/c-l-f-resolver/c-l-f-garde.service';
import { CLFDoc } from 'src/app/modeles/c-l-f/c-l-f-doc';
import { CLFService } from '../c-l-f.service';

/**
 * Redirige vers la page .nouveau si la commande éditable n'existe pas ou n'est pas ouverte.
 */
export class CLFBonExisteGardeService extends CLFGardeService {

    constructor(
        protected service: CLFService,
    ) {
        super(service);
        this.nom = 'BonExisteGardeService';
        this.nomResolver = 'BonResolverService';
        this.gardes = [
            {
                condition: ((clfDoc: CLFDoc) => {
                    return !this.bonEstVirtuelEtNExistePasOuEstEnvoyé(clfDoc);
                }).bind(this),
                redirection: this.service.utile.url.nouveau.bind(this.service.utile.url)
            }
        ];
    }
}
