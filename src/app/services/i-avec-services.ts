import { KfNgbModalService } from '../commun/kf-composants/kf-ngb-modal/kf-ngb-modal.service';
import { IdentificationService } from '../securite/identification.service';
import { AttenteService } from './attente.service';
import { NavigationService } from './navigation.service';
import { RouteurService } from './routeur.service';

export interface IAvecServices {
    identification: IdentificationService;
    routeur: RouteurService;
    navigation: NavigationService;
    attenteService: AttenteService;
    modalService: KfNgbModalService;
}
