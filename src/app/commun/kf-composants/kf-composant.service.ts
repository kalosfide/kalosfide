import { Injectable } from '@angular/core';
import { KfComposant } from './kf-composant/kf-composant';

@Injectable()
export class KFComposantService {
    private composants: KfComposant[] = [];

    public ajoute(composant: KfComposant) {
        if (!composant) {
            console.log(this.composants);
            return;
        }
        if (composant.estRacine) {
            this.composants = [composant];
        } else {
            this.composants.push(composant);
        }
    }

}
