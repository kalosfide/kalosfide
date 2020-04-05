import { Alerte, TypeAlerte} from './alerte';
import { KfEtiquette } from 'src/app/commun/kf-composants/kf-elements/kf-etiquette/kf-etiquette';
import { Identifiant } from 'src/app/securite/identifiant';

export const ALERTE_CONNECTION_ID = 'connection';
export function AlerteConnection(identifiant: Identifiant): Alerte {
    const alerte = new Alerte();
    alerte.id = ALERTE_CONNECTION_ID;
    alerte.type = 'success';
    alerte.contenu = new KfEtiquette('', identifiant ? 'Bienvenue ' + identifiant.userName : 'Vous êtes bien déconnecté.');
    alerte.nbNavigationAvantFermeture = 2;
    alerte.fermable = true;
    alerte.fermetureAuto = 5000;
return alerte;
}
