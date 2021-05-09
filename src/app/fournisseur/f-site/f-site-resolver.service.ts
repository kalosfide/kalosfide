import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Site } from 'src/app/modeles/site/site';
import { NavigationService } from 'src/app/services/navigation.service';

@Injectable()
export class FSiteResolverService implements Resolve<Site> {
    constructor(private navigation: NavigationService) { }

    resolve(): Site {
        return this.navigation.litSiteEnCours();
    }
}
