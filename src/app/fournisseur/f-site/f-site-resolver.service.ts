import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Site } from 'src/app/modeles/site/site';
import { IdentificationService } from 'src/app/securite/identification.service';

@Injectable()
export class FSiteResolverService implements Resolve<Site> {
    constructor(private identification: IdentificationService) { }

    resolve(): Site {
        return this.identification.siteEnCours;
    }
}
